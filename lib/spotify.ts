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

/**
 * Best-effort artist image via Spotify search — used to enrich Last.fm artists
 * (which return blank images). Requires an exact name match to avoid mismatched
 * art. Cached 24h since artist art is effectively immutable.
 */
export async function searchArtistImage(
  name: string
): Promise<string | undefined> {
  const params = new URLSearchParams({ q: name, type: 'artist', limit: '1' });
  const res = await spotifyFetch(`/search?${params}`, 86_400);
  if (!res.ok) return undefined;
  const data = await res.json();
  const artist = data.artists?.items?.[0];
  if (!artist || artist.name?.toLowerCase() !== name.toLowerCase()) {
    return undefined;
  }
  const image = artist.images?.[1] || artist.images?.[0];
  return image?.url;
}
