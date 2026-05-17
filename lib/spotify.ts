import type { Artist, Track } from '@/types';
import { TimeRange } from '@/types';

const SPOTIFY_API = 'https://api.spotify.com/v1';

export async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Missing Spotify environment variables');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    // cache access token for 1 hour before revalidating
    next: { revalidate: 3600 },
  }).then(res => res.json());

  return response;
}

async function spotifyFetch(path: string, revalidate: number) {
  const { access_token } = await getAccessToken();
  return fetch(`${SPOTIFY_API}${path}`, {
    headers: { Authorization: `Bearer ${access_token}` },
    next: { revalidate },
  });
}

export async function getTopTracks(
  limit = 10,
  timeRange: TimeRange = TimeRange.LongTerm
): Promise<Track[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    time_range: timeRange,
  });
  const res = await spotifyFetch(`/me/top/tracks?${params}`, 300);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

export async function getTopArtists(
  limit = 10,
  timeRange: TimeRange = TimeRange.LongTerm
): Promise<Artist[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    time_range: timeRange,
  });
  const res = await spotifyFetch(`/me/top/artists?${params}`, 300);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

export async function getRecentlyPlayed(
  limit = 10
): Promise<(Track & { played_at: string })[]> {
  const res = await spotifyFetch(
    `/me/player/recently-played?limit=${limit}`,
    300
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (
    data.items?.map((item: { track: Track; played_at: string }) => ({
      ...item.track,
      played_at: item.played_at,
    })) ?? []
  );
}
