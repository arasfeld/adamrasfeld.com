/**
 * Minimal mono-styled placeholders for the music page while Spotify data
 * loads. Matches the Atom One code-editor aesthetic — hairline borders,
 * neutral muted blocks, no shadows.
 */
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_ROW_KEYS = Array.from(
  { length: 10 },
  (_, i) => `skeleton-row-${i}`
);

export function RowSkeleton() {
  return (
    <div className="-mx-2 flex items-center gap-3.5 border-border border-b px-2 py-2.5">
      <Skeleton className="h-3 w-4 rounded-sm" />
      <Skeleton className="h-8 w-8 rounded-sm" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-2.5 w-2/5" />
      </div>
      <Skeleton className="h-2.5 w-8" />
    </div>
  );
}

export function RowListSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {SKELETON_ROW_KEYS.slice(0, rows).map(key => (
        <RowSkeleton key={key} />
      ))}
    </>
  );
}
