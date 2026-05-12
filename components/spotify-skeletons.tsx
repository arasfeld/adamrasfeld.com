/**
 * Minimal mono-styled placeholders for the music page while Spotify data
 * loads. Matches the Atom One code-editor aesthetic — hairline borders,
 * neutral muted blocks, no shadows.
 */
import { Skeleton } from '@/components/ui/skeleton';
import { Comment, DisplayHeading } from '@/components/ui/typography';

function RowSkeleton() {
  return (
    <div className="-mx-2 flex items-center gap-3.5 border-b border-border px-2 py-2.5">
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

function ColumnSkeleton({ label }: { label: string }) {
  return (
    <section>
      <div className="mb-4">
        <Comment color="green" className="mb-2">
          {label}
        </Comment>
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="mb-5 flex gap-1">
        {['4 wks', '6 mos', 'all time'].map(label => (
          <span
            key={label}
            className="rounded-sm px-2.5 py-1 font-mono text-[10px] text-muted-foreground/40"
          >
            {label}
          </span>
        ))}
      </div>
      {Array.from({ length: 10 }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </section>
  );
}

export function MusicPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-6 pt-20 pb-10 md:px-12">
        <Comment className="mb-2.5">music</Comment>
        <DisplayHeading className="[font-size:clamp(2.25rem,5vw,2.75rem)]">
          Listening Habits
        </DisplayHeading>
      </div>
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-x-16 gap-y-12 px-6 py-12 md:grid-cols-2 md:px-12">
        <ColumnSkeleton label="top tracks" />
        <ColumnSkeleton label="top artists" />
      </div>
    </div>
  );
}
