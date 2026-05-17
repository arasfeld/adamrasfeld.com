'use client';

import { NowPlayingBar } from '@/components/music/now-playing-bar';
import { useCurrentlyPlaying } from '@/lib/spotify-hooks';

export function NowPlaying() {
  const { playing } = useCurrentlyPlaying();
  if (!playing?.item) return null;
  return <NowPlayingBar track={playing.item} />;
}
