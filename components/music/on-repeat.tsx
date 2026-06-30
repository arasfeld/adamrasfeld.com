import { fmtNum } from '@/components/music/format';
import { MusicArt, MusicArtFill } from '@/components/music/music-art';
import { cn } from '@/lib/utils';
import type { LastfmArtist, LastfmTrack } from '@/types';

export type HeroArtist = LastfmArtist & { resolvedImage?: string };

function Metric({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div>
      <div className={cn('font-bold text-xl tabular-nums leading-none', color)}>
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[9px] text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

/**
 * Hero card for the all-time #1 artist: artist art banner, headline play
 * metrics, their top track, and an "also heavy rotation" mini-list.
 */
export function OnRepeat({
  artist,
  others,
  topTrack,
  share,
}: {
  artist: HeroArtist;
  others: HeroArtist[];
  topTrack: LastfmTrack | null;
  share: number;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border-soft bg-card">
      <div className="relative h-[150px] w-full overflow-hidden">
        <MusicArtFill name={artist.name} src={artist.resolvedImage} priority />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-syntax-green" />
          <span className="font-mono text-[10px] text-white">#1 artist</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 font-mono text-[10px] text-syntax-green">
          {'// on repeat'}
        </div>
        <div className="font-bold text-[19px] text-foreground-bright leading-tight tracking-tight">
          {artist.name}
        </div>

        <div className="mt-4 flex gap-6">
          <Metric
            value={fmtNum(artist.playcount)}
            label="plays"
            color="text-syntax-green"
          />
          <Metric
            value={`${share}%`}
            label="of library"
            color="text-foreground-bright"
          />
          <Metric value="#1" label="all time" color="text-primary" />
        </div>

        {topTrack && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-3">
            <MusicArt name={topTrack.name} src={topTrack.image} size={34} />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wide">
                their #1 track
              </div>
              <div className="mt-0.5 truncate font-semibold text-[12px] text-foreground-bright">
                {topTrack.name}
              </div>
            </div>
            <span className="flex-shrink-0 font-mono text-[10px] text-syntax-green tabular-nums">
              {fmtNum(topTrack.playcount)}×
            </span>
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-auto pt-5">
            <div className="mb-2.5 font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
              also heavy rotation
            </div>
            <div className="flex flex-col gap-2">
              {others.map(other => (
                <div key={other.name} className="flex items-center gap-2.5">
                  <MusicArt
                    name={other.name}
                    src={other.resolvedImage}
                    size={24}
                    round
                    showLetter
                  />
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground">
                    {other.name}
                  </span>
                  <span className="font-mono text-[10px] text-syntax-green tabular-nums">
                    {fmtNum(other.playcount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
