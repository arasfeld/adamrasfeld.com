'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { THEME_COLORS } from '@/lib/brand';

export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const color =
      resolvedTheme === 'dark' ? THEME_COLORS.dark : THEME_COLORS.light;
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  }, [resolvedTheme]);

  return null;
}
