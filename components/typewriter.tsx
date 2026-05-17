import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

interface TypewriterProps {
  text: string;
  speed?: number;
  delayMs?: number;
  className?: string;
  caretClassName?: string;
}

/**
 * CSS-only typewriter used on the home hero ("Full Stack Developer").
 * The text exists in the DOM from the start (no JS state) — only the
 * visible width is animated via steps(). Caret blink kicks in once the
 * typing animation finishes.
 */
export function Typewriter({
  text,
  speed = 58,
  delayMs = 900,
  className,
  caretClassName,
}: TypewriterProps) {
  const chars = text.length;
  const durationMs = chars * speed;

  return (
    <span className={cn('inline-flex items-center', className)}>
      <span
        className="ar-typewriter overflow-hidden whitespace-nowrap"
        style={
          {
            animationDelay: `${delayMs}ms`,
            animationDuration: `${durationMs}ms`,
            animationTimingFunction: `steps(${chars}, end)`,
            '--typewriter-chars': chars,
          } as CSSProperties
        }
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'ar-blink ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.05em] bg-current',
          caretClassName
        )}
        style={{ animationDelay: `${delayMs + durationMs}ms` }}
      />
    </span>
  );
}
