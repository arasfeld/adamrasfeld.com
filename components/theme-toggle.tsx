'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer to a microtask so the post-hydration flip happens *after* React
    // finishes the initial commit — avoids the `set-state-in-effect` lint and
    // still flips the icon as soon as the client takes over.
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline font-mono text-[10px] tracking-wide text-muted-foreground">
        Atom One
      </span>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
      >
        <span aria-hidden="true" className="text-base leading-none">
          {mounted ? (isDark ? '◐' : '◑') : '◐'}
        </span>
      </Button>
    </div>
  );
}
