import type * as React from 'react';

import { cn } from '@/lib/utils';

export function TypographyA({
  className,
  ...props
}: React.ComponentProps<'a'>) {
  return (
    <a
      className={cn(
        'font-medium text-primary underline-offset-2 hover:underline',
        className
      )}
      {...props}
    />
  );
}

export function TypographyBlockquote({
  className,
  ...props
}: React.ComponentProps<'blockquote'>) {
  return (
    <blockquote
      className={cn('mt-6 border-border border-l-2 pl-6 italic', className)}
      {...props}
    />
  );
}

export function TypographyH1({
  className,
  ...props
}: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-balance font-bold text-4xl text-foreground-bright tracking-tight md:text-5xl',
        className
      )}
      {...props}
    />
  );
}

export function TypographyH2({
  className,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'scroll-m-20 font-bold text-2xl text-foreground-bright tracking-tight first:mt-0',
        className
      )}
      {...props}
    />
  );
}

export function TypographyH3({
  className,
  ...props
}: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'scroll-m-20 font-semibold text-foreground-bright text-xl tracking-tight',
        className
      )}
      {...props}
    />
  );
}

export function TypographyH4({
  className,
  ...props
}: React.ComponentProps<'h4'>) {
  return (
    <h4
      className={cn(
        'scroll-m-20 font-semibold text-base text-foreground-bright tracking-tight',
        className
      )}
      {...props}
    />
  );
}

export function TypographyInlineCode({
  className,
  ...props
}: React.ComponentProps<'code'>) {
  return (
    <code
      className={cn(
        'relative rounded-sm border border-border bg-card px-[0.3rem] py-[0.1rem] font-mono text-xs',
        className
      )}
      {...props}
    />
  );
}

export function TypographyLarge({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('font-semibold text-lg', className)} {...props} />;
}

export function TypographyLead({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'text-base text-muted-foreground leading-relaxed',
        className
      )}
      {...props}
    />
  );
}

export function TypographyList({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    />
  );
}

export function TypographyMuted({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-muted-foreground text-xs', className)} {...props} />
  );
}

export function TypographyP({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'text-foreground text-sm leading-relaxed [&:not(:first-child)]:mt-4',
        className
      )}
      {...props}
    />
  );
}

export function TypographySmall({
  className,
  ...props
}: React.ComponentProps<'small'>) {
  return (
    <small
      className={cn('font-medium text-xs leading-none', className)}
      {...props}
    />
  );
}

// ─── Code-editor primitives ─────────────────────────────────────────────────

type SyntaxColor =
  | 'green'
  | 'red'
  | 'yellow'
  | 'purple'
  | 'cyan'
  | 'orange'
  | 'accent'
  | 'muted';

const syntaxColorClass: Record<SyntaxColor, string> = {
  green: 'text-syntax-green',
  red: 'text-syntax-red',
  yellow: 'text-syntax-yellow',
  purple: 'text-syntax-purple',
  cyan: 'text-syntax-cyan',
  orange: 'text-syntax-orange',
  accent: 'text-primary',
  muted: 'text-muted-foreground',
};

/**
 * `// foo` style label rendered in syntax-comment color.
 * Used as the small kicker above section headings on every page.
 */
export function Comment({
  className,
  color = 'green',
  children,
  prefix = '//',
  ...props
}: React.ComponentProps<'div'> & {
  color?: SyntaxColor;
  prefix?: string;
}) {
  return (
    <div
      className={cn(
        'font-mono text-[10px] tracking-wider',
        syntaxColorClass[color],
        className
      )}
      {...props}
    >
      <span aria-hidden="true">{prefix} </span>
      {children}
    </div>
  );
}

/**
 * Comment kicker + section heading. The most-repeated pattern in the design.
 */
export function SectionLabel({
  comment,
  heading,
  color = 'green',
  className,
  headingClassName,
  level = 2,
}: {
  comment: string;
  heading: React.ReactNode;
  color?: SyntaxColor;
  className?: string;
  headingClassName?: string;
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? TypographyH1 : TypographyH2;
  return (
    <div className={cn('mb-6', className)}>
      <Comment color={color} className="mb-2">
        {comment}
      </Comment>
      <Heading className={cn('text-xl md:text-2xl', headingClassName)}>
        {heading}
      </Heading>
    </div>
  );
}

/**
 * Massive mono display heading used for page H1s (clamp-scaled).
 * Letter-spacing pulled tight, weight 700.
 */
export function DisplayHeading({
  className,
  ...props
}: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'font-bold font-mono text-foreground-bright leading-none tracking-tight',
        '[font-size:clamp(2.5rem,7vw,4.5rem)] [letter-spacing:-0.05em]',
        className
      )}
      {...props}
    />
  );
}

/**
 * Small bordered chip — `8+ yrs experience`, `iOS`, `open to opportunities`, etc.
 */
export function MonoTag({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground tracking-wide',
        className
      )}
      {...props}
    />
  );
}
