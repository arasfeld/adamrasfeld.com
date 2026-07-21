import { MusicArt } from '@/components/music/music-art';
import { fmtNum } from '@/lib/format';
import type { LastfmTrack } from '@/types';

/** A single ranked row in the Top Tracks playcount bar chart. */
export function TrackBar({
  track,
  rank,
  max,
}: {
  track: LastfmTrack;
  rank: number;
  max: number;
}) {
  const pct = max > 0 ? Math.max(2, (track.playcount / max) * 100) : 0;

  return (
    <div className="group grid grid-cols-[18px_34px_1fr_64px] items-center gap-3 py-1.5 sm:grid-cols-[18px_34px_200px_1fr_64px]">
      <span className="text-right font-mono text-[10px] text-muted-foreground tabular-nums">
        {String(rank).padStart(2, '0')}
      </span>
      <MusicArt name={track.name} src={track.image} size={30} />
      <div className="min-w-0">
        <div className="truncate font-mono text-[11.5px] text-foreground-bright">
          {track.name}
        </div>
        <div className="truncate font-mono text-[9.5px] text-muted-foreground">
          {track.artist}
        </div>
      </div>
      <div className="hidden h-2.5 overflow-hidden rounded-full bg-border sm:block">
        <div
          className="h-full rounded-full bg-syntax-green opacity-80 transition-all group-hover:opacity-100"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-right font-bold font-mono text-[11px] text-syntax-green tabular-nums">
        {fmtNum(track.playcount)}×
      </span>
    </div>
  );
}
