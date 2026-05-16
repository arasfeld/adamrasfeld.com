import { cn } from '@/lib/utils';

type Aspect = 'video' | 'phone' | 'wide';

interface ScreenshotPlaceholderProps {
  /** Caption rendered inside the frame as a `// comment` style label. */
  label: string;
  /** Aspect ratio — `video` (16:9) for web/desktop UI, `phone` (9:19) for mobile, `wide` (21:9) for diagrams. */
  aspect?: Aspect;
  className?: string;
}

const BODY_ASPECT: Record<Aspect, string> = {
  video: 'aspect-video',
  phone: 'aspect-[9/19]',
  wide: 'aspect-[21/9]',
};

const FRAME_MAX_WIDTH: Record<Aspect, string> = {
  video: 'w-full',
  phone: 'mx-auto w-full max-w-[260px]',
  wide: 'w-full',
};

/**
 * Code-editor-window framed empty slot for case-study screenshots. Swap the
 * inner body for an `<Image>` once a real capture is available, keeping the
 * traffic-light header intact.
 */
export function ScreenshotPlaceholder({
  label,
  aspect = 'video',
  className,
}: ScreenshotPlaceholderProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border bg-card shadow-md',
        FRAME_MAX_WIDTH[aspect],
        className
      )}
    >
      <div className="flex items-center gap-1 border-border border-b bg-background/60 px-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/35" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
      </div>
      <div
        className={cn(
          'relative flex items-center justify-center bg-background/40',
          BODY_ASPECT[aspect]
        )}
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, var(--muted-foreground) 18%, transparent) 0.8px, transparent 0.8px)',
          backgroundSize: '14px 14px',
        }}
      >
        <div className="m-3 rounded-sm border border-border border-dashed bg-card/60 px-3 py-2">
          <span
            aria-hidden="true"
            className="mr-1.5 font-mono text-[10px] text-syntax-green tracking-wider"
          >
            {'//'}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground tracking-wide">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
