import Image from 'next/image';

import type { Track as SpotifyTrack } from '@/types';

function fmtDuration(ms?: number) {
  if (!ms) return '';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

interface NowPlayingBarProps {
  track: SpotifyTrack;
}

/**
 * The strip that appears below the page header showing the currently
 * playing Spotify track. Animated 5-bar equalizer on the left.
 */
export function NowPlayingBar({ track }: NowPlayingBarProps) {
  const image = track.album.images[1] || track.album.images[0];
  const artistNames = track.artists.map(a => a.name).join(', ');
  const heights = [1, 0.5, 0.8, 0.3, 0.9];

  return (
    <div className="border-y border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-6 py-3.5 md:px-12">
        <div className="flex h-4 flex-shrink-0 items-end gap-0.5">
          {heights.map((h, i) => (
            <div
              key={i}
              className="ar-eq-bar w-[3px] rounded-sm bg-syntax-green"
              style={{
                height: `${h * 100}%`,
                animationDuration: `${0.8 + i * 0.15}s`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        <span className="hidden flex-shrink-0 font-mono text-[10px] whitespace-nowrap text-muted-foreground sm:inline">
          now playing
        </span>
        {image && (
          <Image
            src={image.url}
            alt={track.album.name}
            width={32}
            height={32}
            className="flex-shrink-0 rounded-sm border border-border object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-xs font-semibold text-foreground-bright">
            {track.name}
          </div>
          <div className="truncate font-mono text-[10px] text-muted-foreground">
            {artistNames}
          </div>
        </div>
        <span className="flex-shrink-0 font-mono text-[10px] text-muted-foreground">
          {fmtDuration(track.duration_ms)}
        </span>
      </div>
    </div>
  );
}
