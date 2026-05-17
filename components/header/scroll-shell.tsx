'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 24;

export function ScrollShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > SCROLL_THRESHOLD;
      setScrolled(prev => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors',
        scrolled
          ? 'border-border-soft border-b bg-background/85 backdrop-blur'
          : 'border-transparent border-b'
      )}
    >
      {children}
    </header>
  );
}
