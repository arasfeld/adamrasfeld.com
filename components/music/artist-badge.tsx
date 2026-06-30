import { fmtNum } from '@/components/music/format';
import { MusicArt } from '@/components/music/music-art';
import type { LastfmArtist } from '@/types';

export type ResolvedArtist = LastfmArtist & { resolvedImage?: string };

/** A ranked top-artist badge: round art with a rank pip + playcount bar. */
export function ArtistBadge({
  artist,
  rank,
  max,
}: {
  artist: ResolvedArtist;
  rank: number;
  max: number;
}) {
  const pct = max > 0 ? Math.max(8, (artist.playcount / max) * 100) : 0;

  return (
    <div className="group flex items-center gap-3.5 rounded-lg border border-border bg-card px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-primary">
      <div className="relative flex-shrink-0">
        <MusicArt
          name={artist.name}
          src={artist.resolvedImage}
          size={46}
          round
          showLetter
        />
        <div
          className="absolute -right-1 -bottom-1 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-card bg-primary px-1 font-bold text-[10px] text-primary-foreground"
          aria-hidden="true"
        >
          {rank}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-[13px] text-foreground-bright">
          {artist.name}
        </div>
        <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
          {fmtNum(artist.playcount)} plays
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary opacity-80 transition-opacity group-hover:opacity-100"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
