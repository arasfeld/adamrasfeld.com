import { MusicArtFill } from '@/components/music/music-art';
import type { LastfmRecentTrack } from '@/types';

/** Album-art card for a recently-played scrobble. */
export function RecentCard({ track }: { track: LastfmRecentTrack }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-border-soft">
      <div className="relative aspect-square w-full overflow-hidden">
        <MusicArtFill name={track.name} src={track.image} />
        {track.nowPlaying && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-syntax-green" />
            <span className="font-mono text-[9px] text-white">now</span>
          </div>
        )}
      </div>
      <div className="px-3 py-3">
        <div className="truncate font-semibold text-[12px] text-foreground-bright">
          {track.name}
        </div>
        <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
          {track.artist}
        </div>
      </div>
    </div>
  );
}
