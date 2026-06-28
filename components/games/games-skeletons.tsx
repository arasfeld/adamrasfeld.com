/**
 * Mono-styled placeholders for the games page while Steam data loads.
 * Mirrors components/spotify-skeletons.tsx — hairline borders, neutral blocks.
 */
import { Skeleton } from '@/components/ui/skeleton';

const ROW_KEYS = Array.from({ length: 8 }, (_, i) => `bar-row-${i}`);
const CARD_KEYS = Array.from({ length: 4 }, (_, i) => `showcase-card-${i}`);
const ACH_KEYS = Array.from({ length: 8 }, (_, i) => `ach-badge-${i}`);
const ROTATION_KEYS = Array.from({ length: 3 }, (_, i) => `rotation-${i}`);

export function CurrentlyIntoSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-soft bg-card">
      <Skeleton className="h-[150px] w-full rounded-none" />
      <div className="space-y-4 p-5">
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-6">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-14" />
        </div>
        <Skeleton className="h-1.5 w-full" />
        <div className="space-y-2 pt-4">
          {ROTATION_KEYS.map(key => (
            <Skeleton key={key} className="h-6 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AchievementsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {ACH_KEYS.map(key => (
        <div
          key={key}
          className="flex items-center gap-3.5 rounded-lg border border-border bg-card px-4 py-3.5"
        >
          <Skeleton className="h-11 w-11 rounded-lg" />
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

export function BarChartSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-1">
      {ROW_KEYS.slice(0, rows).map(key => (
        <div
          key={key}
          className="grid grid-cols-[18px_150px_1fr_52px] items-center gap-3 py-1.5"
        >
          <Skeleton className="h-2.5 w-4" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-8" />
        </div>
      ))}
    </div>
  );
}

export function ShowcaseSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
      {CARD_KEYS.map(key => (
        <div
          key={key}
          className="overflow-hidden rounded-md border border-border"
        >
          <Skeleton className="h-28 w-full rounded-none" />
          <div className="space-y-2 px-3.5 py-3">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-2.5 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
