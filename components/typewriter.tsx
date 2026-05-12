'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface TypewriterProps {
  text: string;
  speed?: number;
  delayMs?: number;
  className?: string;
  caretClassName?: string;
}

/**
 * Types out `text` one character at a time, leaving a blinking caret behind.
 * Used on the home hero ("Full Stack Developer").
 */
export function Typewriter({
  text,
  speed = 58,
  delayMs = 900,
  className,
  caretClassName,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startId = setTimeout(() => {
      if (cancelled) return;
      setDisplayed('');
      setDone(false);
      let i = 0;
      intervalId = setInterval(() => {
        if (cancelled) return;
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (intervalId) clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, delayMs);

    return () => {
      cancelled = true;
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delayMs]);

  return (
    <span className={cn('inline-flex items-center', className)}>
      <span>{displayed}</span>
      <span
        aria-hidden="true"
        className={cn(
          'ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.05em] bg-current',
          done && 'ar-blink',
          caretClassName
        )}
      />
    </span>
  );
}
