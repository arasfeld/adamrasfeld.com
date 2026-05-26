import type { MetadataRoute } from 'next';
import { THEME_COLORS } from '@/lib/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Adam Rasfeld - Full Stack Developer',
    short_name: 'Adam Rasfeld',
    description:
      'Full Stack Developer with 11+ years of experience building scalable web applications, mobile apps, and system architectures.',
    start_url: '/',
    display: 'standalone',
    background_color: THEME_COLORS.light,
    theme_color: THEME_COLORS.light,
    categories: ['portfolio', 'developer', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        type: 'image/png',
        sizes: '180x180',
        purpose: 'any',
      },
    ],
  };
}
