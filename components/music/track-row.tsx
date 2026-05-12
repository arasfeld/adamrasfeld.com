import Image from 'next/image';

import type { Track as SpotifyTrack } from '@/types';

function fmtDuration(ms?: number) {
  if (!ms) return '';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

interface TrackRowProps {
  track: SpotifyTrack;
  rank?: number;
}

export function TrackRow({ track, rank }: TrackRowProps) {
  const image = track.album.images[1] || track.album.images[0];
  const artistNames = track.artists.map(a => a.name).join(', ');

  return (
    <div className="-mx-2 flex items-center gap-3.5 rounded-sm border-b border-border px-2 py-2.5 transition-colors hover:bg-surface-hover">
      {rank !== undefined && (
        <span className="w-5 flex-shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground">
          {String(rank).padStart(2, '0')}
        </span>
      )}
      {image && (
        <Image
          src={image.url}
          alt={track.album.name}
          width={34}
          height={34}
          className="flex-shrink-0 rounded-sm border border-border object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-xs font-semibold text-foreground-bright">
          {track.name}
        </div>
        <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
          {artistNames}
        </div>
      </div>
      <span className="flex-shrink-0 font-mono text-[10px] text-muted-foreground">
        {fmtDuration(track.duration_ms)}
      </span>
    </div>
  );
}
