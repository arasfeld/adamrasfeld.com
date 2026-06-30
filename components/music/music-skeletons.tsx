/** Mono placeholders for the music dashboard while Last.fm data loads. */
import { Skeleton } from '@/components/ui/skeleton';

const BADGE_KEYS = Array.from({ length: 6 }, (_, i) => `artist-badge-${i}`);
const BAR_KEYS = Array.from({ length: 8 }, (_, i) => `track-bar-${i}`);
const CARD_KEYS = Array.from({ length: 8 }, (_, i) => `recent-card-${i}`);
const ROTATION_KEYS = Array.from({ length: 3 }, (_, i) => `rotation-${i}`);
const LEGEND_KEYS = Array.from({ length: 6 }, (_, i) => `legend-${i}`);

export function OnRepeatSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-soft bg-card">
      <Skeleton className="h-[150px] w-full rounded-none" />
      <div className="space-y-4 p-5">
        <Skeleton className="h-5 w-2/3" />
        <div className="flex gap-6">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-10" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2 pt-2">
          {ROTATION_KEYS.map(key => (
            <Skeleton key={key} className="h-6 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArtistBadgesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {BADGE_KEYS.map(key => (
        <div
          key={key}
          className="flex items-center gap-3.5 rounded-lg border border-border bg-card px-4 py-3.5"
        >
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-2.5 w-1/3" />
            <Skeleton className="h-1 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrackBarsSkeleton() {
  return (
    <div className="space-y-1">
      {BAR_KEYS.map(key => (
        <div
          key={key}
          className="grid grid-cols-[18px_34px_1fr_64px] items-center gap-3 py-1.5"
        >
          <Skeleton className="h-2.5 w-4" />
          <Skeleton className="h-[30px] w-[30px] rounded-sm" />
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-10" />
        </div>
      ))}
    </div>
  );
}

export function SoundProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3.5 w-full rounded-full" />
      <div className="space-y-2.5">
        {LEGEND_KEYS.map(key => (
          <Skeleton key={key} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

export function RecentCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
      {CARD_KEYS.map(key => (
        <div
          key={key}
          className="overflow-hidden rounded-md border border-border"
        >
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2 px-3 py-3">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-2.5 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
