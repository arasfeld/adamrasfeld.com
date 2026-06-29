/**
 * Normalized shapes for the Steam Web API responses consumed by the games page.
 * The raw API uses snake_case and unix timestamps; these are the trimmed-down
 * shapes the `lib/steam.ts` data functions return to the UI.
 */

export interface SteamProfile {
  steamId: string;
  persona: string;
  realName?: string;
  avatar?: string;
  /** Account creation time (unix seconds), when public. */
  memberSince?: number;
  country?: string;
}

export interface SteamGame {
  appid: number;
  name: string;
  /** Total playtime in minutes. */
  playtimeForever: number;
  /** Playtime over the last 2 weeks in minutes. */
  playtime2Weeks: number;
}

export interface SteamAchievement {
  apiname: string;
  name: string;
  achieved: boolean;
  /** Unlock time in unix seconds (0 when locked). */
  unlockTime: number;
  /** Global unlock percentage, when rarity data is available. */
  rarity?: number;
}

export interface ShowcaseGame {
  appid: number;
  name: string;
  /** Number of unlocked achievements. */
  achieved: number;
  /** Total achievements in the game. */
  total: number;
  /** Most recent unlock time (unix seconds), used as the "completed" date. */
  completedAt?: number;
}

export interface RecentAchievement {
  appid: number;
  game: string;
  name: string;
  unlockTime: number;
  rarity?: number;
  /** Unlocked-achievement icon URL from the game schema, when available. */
  icon?: string;
}
