import { COMPLETIONIST_SHOWCASE } from '@/lib/games-data';
import type {
  RecentAchievement,
  ShowcaseGame,
  SteamAchievement,
  SteamGame,
  SteamProfile,
  SteamState,
} from '@/types';

const STEAM_API = 'https://api.steampowered.com';

function steamConfig() {
  const { STEAM_API_KEY, STEAM_ID } = process.env;
  if (!STEAM_API_KEY || !STEAM_ID) return null;
  return { key: STEAM_API_KEY, steamId: STEAM_ID };
}

/**
 * Calls a Steam Web API endpoint with the API key appended and a per-call
 * revalidate window. Returns `null` when env is unset or the request fails so
 * every data function can degrade to a safe empty state.
 */
async function steamFetch(
  path: string,
  params: Record<string, string>,
  revalidate: number
): Promise<unknown | null> {
  const config = steamConfig();
  if (!config) return null;
  const query = new URLSearchParams({ key: config.key, ...params });
  const res = await fetch(`${STEAM_API}${path}?${query}`, {
    next: { revalidate },
  });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Resolves `STEAM_ID` to a numeric SteamID64. Accepts either a raw 17-digit
 * SteamID64 (used as-is) or a vanity URL name (e.g. "arazzy"), which is resolved
 * via ResolveVanityURL and cached for a week. Returns `null` when env is unset
 * or the vanity name can't be resolved.
 */
async function resolveSteamId(): Promise<string | null> {
  const config = steamConfig();
  if (!config) return null;
  if (/^\d{17}$/.test(config.steamId)) return config.steamId;
  const data = (await steamFetch(
    '/ISteamUser/ResolveVanityURL/v1/',
    { vanityurl: config.steamId },
    604800
  )) as { response?: { success?: number; steamid?: string } } | null;
  return data?.response?.success === 1 ? (data.response.steamid ?? null) : null;
}

// ─── Raw response shapes (trimmed to the fields we read) ─────────────────────

interface RawPlayer {
  steamid: string;
  personaname: string;
  realname?: string;
  avatarfull?: string;
  personastate?: number;
  gameextrainfo?: string;
  timecreated?: number;
  loccountrycode?: string;
}

interface RawGame {
  appid: number;
  name?: string;
  playtime_forever?: number;
  playtime_2weeks?: number;
}

interface RawAchievement {
  apiname: string;
  name?: string;
  achieved: number;
  unlocktime?: number;
}

// ─── Profile + level ─────────────────────────────────────────────────────────

export async function getProfile(): Promise<SteamProfile | null> {
  const steamId = await resolveSteamId();
  if (!steamId) return null;
  const data = (await steamFetch(
    '/ISteamUser/GetPlayerSummaries/v2/',
    { steamids: steamId },
    300
  )) as { response?: { players?: RawPlayer[] } } | null;

  const player = data?.response?.players?.[0];
  if (!player) return null;

  const state: SteamState = player.gameextrainfo
    ? 'in-game'
    : (player.personastate ?? 0) > 0
      ? 'online'
      : 'offline';

  return {
    steamId: player.steamid,
    persona: player.personaname,
    realName: player.realname,
    avatar: player.avatarfull,
    state,
    playing: player.gameextrainfo,
    memberSince: player.timecreated,
    country: player.loccountrycode,
  };
}

export async function getLevel(): Promise<number> {
  const steamId = await resolveSteamId();
  if (!steamId) return 0;
  const data = (await steamFetch(
    '/IPlayerService/GetSteamLevel/v1/',
    { steamid: steamId },
    86400
  )) as { response?: { player_level?: number } } | null;
  return data?.response?.player_level ?? 0;
}

// ─── Library + recently played ───────────────────────────────────────────────

function mapGame(raw: RawGame): SteamGame {
  return {
    appid: raw.appid,
    name: raw.name ?? `App ${raw.appid}`,
    playtimeForever: raw.playtime_forever ?? 0,
    playtime2Weeks: raw.playtime_2weeks ?? 0,
  };
}

export async function getOwnedGames(): Promise<SteamGame[]> {
  const steamId = await resolveSteamId();
  if (!steamId) return [];
  const data = (await steamFetch(
    '/IPlayerService/GetOwnedGames/v1/',
    {
      steamid: steamId,
      include_appinfo: 'true',
      include_played_free_games: 'true',
    },
    21600
  )) as { response?: { games?: RawGame[] } } | null;
  return (data?.response?.games ?? []).map(mapGame);
}

export async function getRecentlyPlayed(): Promise<SteamGame[]> {
  const steamId = await resolveSteamId();
  if (!steamId) return [];
  const data = (await steamFetch(
    '/IPlayerService/GetRecentlyPlayedGames/v1/',
    { steamid: steamId },
    3600
  )) as { response?: { games?: RawGame[] } } | null;
  return (data?.response?.games ?? []).map(mapGame);
}

// ─── Achievements (curated showcase only — bounded cost) ─────────────────────

interface GameAchievementData {
  appid: number;
  name: string;
  achievements: SteamAchievement[];
}

async function fetchGameAchievements(
  appid: number
): Promise<GameAchievementData | null> {
  const steamId = await resolveSteamId();
  if (!steamId) return null;
  const data = (await steamFetch(
    '/ISteamUserStats/GetPlayerAchievements/v1/',
    { steamid: steamId, appid: String(appid), l: 'en' },
    21600
  )) as {
    playerstats?: {
      success?: boolean;
      gameName?: string;
      achievements?: RawAchievement[];
    };
  } | null;

  const stats = data?.playerstats;
  if (!stats?.success || !stats.achievements) return null;

  const achievements: SteamAchievement[] = stats.achievements.map(a => ({
    apiname: a.apiname,
    name: a.name || a.apiname,
    achieved: a.achieved === 1,
    unlockTime: a.unlocktime ?? 0,
  }));

  return { appid, name: stats.gameName || `App ${appid}`, achievements };
}

async function getGlobalPercentages(
  appid: number
): Promise<Map<string, number> | null> {
  const data = (await steamFetch(
    '/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/',
    { gameid: String(appid) },
    86400
  )) as {
    achievementpercentages?: {
      // Steam returns `percent` as a string (e.g. "75.2").
      achievements?: { name: string; percent: string | number }[];
    };
  } | null;
  const list = data?.achievementpercentages?.achievements;
  if (!list) return null;
  return new Map(list.map(a => [a.name, Number(a.percent)]));
}

/** Maps each achievement apiname → its unlocked icon URL from the game schema. */
async function getGameSchema(
  appid: number
): Promise<Map<string, string> | null> {
  const data = (await steamFetch(
    '/ISteamUserStats/GetSchemaForGame/v2/',
    { appid: String(appid), l: 'en' },
    604800
  )) as {
    game?: {
      availableGameStats?: { achievements?: { name: string; icon?: string }[] };
    };
  } | null;
  const list = data?.game?.availableGameStats?.achievements;
  if (!list) return null;
  return new Map(list.map(a => [a.name, a.icon ?? '']));
}

/**
 * Achievement completion for a single game (the "currently into" hero metric).
 * One bounded GetPlayerAchievements call; returns `null` when the game has no
 * achievements or its stats are private.
 */
export async function getGameCompletion(
  appid: number
): Promise<{ achieved: number; total: number; percent: number } | null> {
  const data = await fetchGameAchievements(appid);
  if (!data || data.achievements.length === 0) return null;
  const achieved = data.achievements.filter(a => a.achieved).length;
  const total = data.achievements.length;
  return { achieved, total, percent: Math.round((achieved / total) * 100) };
}

export async function getShowcaseAchievements(): Promise<ShowcaseGame[]> {
  const games = (
    await Promise.all(COMPLETIONIST_SHOWCASE.map(fetchGameAchievements))
  ).filter((g): g is GameAchievementData => g !== null);

  return games.map(game => {
    const unlocked = game.achievements.filter(a => a.achieved);
    const completedAt = unlocked.reduce(
      (max, a) => Math.max(max, a.unlockTime),
      0
    );
    return {
      appid: game.appid,
      name: game.name,
      achieved: unlocked.length,
      total: game.achievements.length,
      completedAt: completedAt || undefined,
    };
  });
}

export async function getRecentAchievements(
  limit = 6
): Promise<RecentAchievement[]> {
  const games = (
    await Promise.all(COMPLETIONIST_SHOWCASE.map(fetchGameAchievements))
  ).filter((g): g is GameAchievementData => g !== null);

  const unlocked = games
    .flatMap(game =>
      game.achievements
        .filter(a => a.achieved && a.unlockTime > 0)
        .map(a => ({
          appid: game.appid,
          game: game.name,
          name: a.name,
          apiname: a.apiname,
          unlockTime: a.unlockTime,
        }))
    )
    .sort((a, b) => b.unlockTime - a.unlockTime)
    .slice(0, limit);

  // Attach rarity + icons, fetched only for the represented games.
  const appids = [...new Set(unlocked.map(a => a.appid))];
  const rarity = new Map<number, Map<string, number>>();
  const icons = new Map<number, Map<string, string>>();
  await Promise.all(
    appids.map(async appid => {
      const [percentages, schema] = await Promise.all([
        getGlobalPercentages(appid),
        getGameSchema(appid),
      ]);
      if (percentages) rarity.set(appid, percentages);
      if (schema) icons.set(appid, schema);
    })
  );

  return unlocked.map(a => ({
    appid: a.appid,
    game: a.game,
    name: a.name,
    unlockTime: a.unlockTime,
    rarity: rarity.get(a.appid)?.get(a.apiname),
    icon: icons.get(a.appid)?.get(a.apiname) || undefined,
  }));
}
