import { searchArtistImage } from '@/lib/spotify';

/**
 * Resolve an artist image: prefer the Last.fm image when present (rare for
 * artists), otherwise enrich via Spotify search. Returns undefined when neither
 * resolves — callers fall back to a gradient. Spotify lookups are deduped by
 * Next's fetch cache (identical search URLs share a cache entry).
 */
export async function resolveArtistImage(
  name: string,
  lastfmImage?: string
): Promise<string | undefined> {
  if (lastfmImage) return lastfmImage;
  return await searchArtistImage(name);
}
