import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BoxProps {
  label: string;
  sub?: string;
  /** Color CSS variable name, e.g. `var(--primary)` or `var(--syntax-green)`. */
  color: string;
  /** Override the default min-width (130px). */
  minWidth?: number;
  className?: string;
}

/**
 * Architecture-diagram node: a small bordered card with a colored label and an
 * optional muted subline. Border + tint are derived from `color` via
 * `color-mix` so the box adapts to the syntax palette.
 */
export function Box({
  label,
  sub,
  color,
  minWidth = 130,
  className,
}: BoxProps) {
  return (
    <div
      className={cn('rounded-sm border px-3.5 py-2.5', className)}
      style={{
        borderColor: `color-mix(in srgb, ${color} 33%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 5%, transparent)`,
        minWidth,
      }}
    >
      <div
        className="font-bold font-mono text-[11px]"
        style={{ color, marginBottom: sub ? 3 : 0 }}
      >
        {label}
      </div>
      {sub && (
        <div className="whitespace-pre-line font-mono text-[9px] text-muted-foreground leading-relaxed">
          {sub}
        </div>
      )}
    </div>
  );
}

interface ArrowProps {
  children?: ReactNode;
  vertical?: boolean;
  className?: string;
}

/** Glyph-based connector between Boxes (defaults to `→`, set `vertical` for `↓`). */
export function Arrow({ children, vertical = false, className }: ArrowProps) {
  return (
    <div
      className={cn(
        'flex flex-shrink-0 items-center justify-center text-base text-muted-foreground',
        vertical ? 'py-1' : 'px-1',
        className
      )}
    >
      {children ?? (vertical ? '↓' : '→')}
    </div>
  );
}

interface DiagramProps {
  /** Comment-style label at the top of the diagram (rendered as `// <comment>`). */
  comment: string;
  children: ReactNode;
  className?: string;
}

/** Outer frame for an architecture diagram. */
export function Diagram({ comment, children, className }: DiagramProps) {
  return (
    <div className={cn('border border-border bg-card p-6', className)}>
      <div className="mb-5 font-mono text-[9px] text-muted-foreground tracking-[0.15em]">
        {`// ${comment}`}
      </div>
      {children}
    </div>
  );
}

interface GroupProps {
  /** Group label, drawn over the top-left of the dashed border. */
  label: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Dashed-border container that visually clusters related Boxes. */
export function Group({ label, children, className, style }: GroupProps) {
  return (
    <div
      className={cn(
        'relative border border-border border-dashed p-5 pb-4',
        className
      )}
      style={style}
    >
      <span className="absolute -top-2 left-3.5 bg-card px-1.5 font-mono text-[9px] text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}
