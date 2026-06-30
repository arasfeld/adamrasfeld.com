import type {
  GenreSlice,
  LastfmPeriod,
  LastfmRecentTrack,
  LastfmUserInfo,
  MusicRange,
  TopArtistsResult,
  TopTracksResult,
} from '@/types';

const API = 'https://ws.audioscrobbler.com/2.0/';

/** Last.fm's placeholder "star" image hash — treat any URL containing it as blank. */
const BLANK_IMAGE = '2a96cbd8b46e442fc41c2b86b821562f';

export const RANGE_TO_PERIOD: Record<MusicRange, LastfmPeriod> = {
  short: '1month',
  medium: '6month',
  long: 'overall',
};

interface RawImage {
  '#text': string;
  size: string;
}

/** Largest non-blank image URL, or undefined. */
function pickImage(images?: RawImage[]): string | undefined {
  if (!images) return undefined;
  for (const size of ['extralarge', 'large', 'medium', 'small']) {
    const img = images.find(i => i.size === size);
    const url = img?.['#text'];
    if (url && !url.includes(BLANK_IMAGE)) return url;
  }
  return undefined;
}

/**
 * Server-side Last.fm REST call. Fails soft to null so an outage degrades the
 * page rather than throwing. Mirrors lib/spotify.ts caching via next.revalidate.
 */
async function lastfmFetch(
  method: string,
  params: Record<string, string>,
  revalidate: number
): Promise<any | null> {
  const { LASTFM_API_KEY, LASTFM_USERNAME } = process.env;
  if (!LASTFM_API_KEY || !LASTFM_USERNAME) return null;

  const search = new URLSearchParams({
    method,
    user: LASTFM_USERNAME,
    api_key: LASTFM_API_KEY,
    format: 'json',
    ...params,
  });

  try {
    const res = await fetch(`${API}?${search}`, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getUserInfo(): Promise<LastfmUserInfo | null> {
  const data = await lastfmFetch('user.getInfo', {}, 3600);
  const u = data?.user;
  if (!u) return null;
  return {
    scrobbles: Number(u.playcount) || 0,
    memberSince: Number(u.registered?.unixtime) || 0,
  };
}

export async function getTopArtists(
  period: LastfmPeriod,
  limit = 10
): Promise<TopArtistsResult> {
  const data = await lastfmFetch(
    'user.getTopArtists',
    { period, limit: String(limit) },
    300
  );
  const raw = data?.topartists;
  if (!raw?.artist) return { artists: [], total: 0 };
  return {
    artists: raw.artist.map((a: any) => ({
      name: a.name,
      playcount: Number(a.playcount) || 0,
      rank: Number(a['@attr']?.rank) || 0,
      url: a.url,
      image: pickImage(a.image),
    })),
    total: Number(raw['@attr']?.total) || 0,
  };
}

export async function getTopTracks(
  period: LastfmPeriod,
  limit = 10
): Promise<TopTracksResult> {
  const data = await lastfmFetch(
    'user.getTopTracks',
    { period, limit: String(limit) },
    300
  );
  const raw = data?.toptracks;
  if (!raw?.track) return { tracks: [], total: 0 };
  return {
    tracks: raw.track.map((t: any) => ({
      name: t.name,
      artist: t.artist?.name ?? '',
      playcount: Number(t.playcount) || 0,
      rank: Number(t['@attr']?.rank) || 0,
      url: t.url,
      image: pickImage(t.image),
    })),
    total: Number(raw['@attr']?.total) || 0,
  };
}

export async function getRecentTracks(
  limit = 10
): Promise<LastfmRecentTrack[]> {
  const data = await lastfmFetch(
    'user.getRecentTracks',
    { limit: String(limit) },
    120
  );
  const raw = data?.recenttracks?.track;
  if (!raw) return [];
  return raw.map((t: any) => ({
    name: t.name,
    artist: t.artist?.['#text'] ?? '',
    album: t.album?.['#text'] || undefined,
    image: pickImage(t.image),
    nowPlaying: t['@attr']?.nowplaying === 'true',
    playedAt: t.date?.uts ? Number(t.date.uts) : undefined,
  }));
}

/** Approximate scrobbles in the last 7 days = sum of 7-day top-track playcounts. */
export async function getWeeklyScrobbles(): Promise<number> {
  const { tracks } = await getTopTracks('7day', 1000);
  return tracks.reduce((sum, t) => sum + t.playcount, 0);
}

/**
 * Genre breakdown for the sound profile: take the top artists for the window,
 * pull each artist's top community tag, and weight by the user's playcount for
 * that artist. Normalized to the top 6 slices (with an "everything else"
 * remainder). Artist-tag lookups are cached 24h.
 */
export async function getGenreBreakdown(
  period: LastfmPeriod,
  topN = 8
): Promise<GenreSlice[]> {
  const { artists } = await getTopArtists(period, topN);
  if (artists.length === 0) return [];

  const weights = new Map<string, number>();
  await Promise.all(
    artists.map(async artist => {
      const data = await lastfmFetch(
        'artist.getTopTags',
        { artist: artist.name },
        86_400
      );
      const tag = data?.toptags?.tag?.[0]?.name;
      if (!tag) return;
      const key = tag.toLowerCase();
      weights.set(key, (weights.get(key) ?? 0) + artist.playcount);
    })
  );

  const total = [...weights.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  const sorted = [...weights.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 6);
  const slices: GenreSlice[] = top.map(([name, w]) => ({
    name,
    pct: Math.round((w / total) * 100),
  }));
  const accounted = slices.reduce((a, s) => a + s.pct, 0);
  if (accounted < 100 && sorted.length > 6) {
    slices.push({ name: 'everything else', pct: 100 - accounted });
  }
  return slices;
}
