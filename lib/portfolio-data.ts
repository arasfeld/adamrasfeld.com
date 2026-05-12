import type { Project } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'sprout',
    title: 'Sprout',
    year: '2025',
    type: 'mobile',
    status: 'active',
    tagline:
      'Cross-platform childcare tracking for parents, caregivers, and daycares.',
    description:
      'Cross-platform childcare tracking app built around the principle that a child has one continuous timeline regardless of which caregiver is logging events. Offline-first with a custom sync engine, backed by Supabase + Postgres RLS.',
    stack: [
      'Expo',
      'React Native',
      'TypeScript',
      'Supabase',
      'SQLite',
      'Drizzle',
      'TanStack Query',
      'Turborepo',
    ],
    github: 'https://github.com/arasfeld/sprout',
    live: null,
    hasDetail: true,
  },
  {
    id: 'freebox',
    title: 'Freebox',
    year: '2025',
    type: 'web',
    status: 'active',
    tagline:
      'Marketplace for giving away free items with a fairness-first design.',
    description:
      'A marketplace application for giving away free items, built with fairness features to ensure equitable distribution and prevent hoarding.',
    stack: [
      'Next.js',
      'TypeScript',
      'NextAuth.js',
      'Prisma',
      'PostgreSQL',
      'Cloudinary',
      'shadcn/ui',
      'Tailwind CSS',
    ],
    github: 'https://github.com/arasfeld/freebox',
    live: null,
    hasDetail: false,
    image: '/freebox-app-main.png',
  },
  {
    id: 'razzify',
    title: 'Razzify',
    year: '2024',
    type: 'desktop',
    status: 'active',
    tagline:
      'Native Spotify desktop client with analytics and playlist management.',
    description:
      'A comprehensive desktop music client built with Electron that provides a native Spotify experience with personalized analytics, playlist management, and music discovery.',
    stack: [
      'Electron',
      'React',
      'TypeScript',
      'Redux Toolkit',
      'RTK Query',
      'Mantine',
      'Spotify Web API',
      'Vite',
    ],
    github: 'https://github.com/arasfeld/electron-spotify-app',
    live: null,
    hasDetail: false,
  },
  {
    id: 'joyce-art-studio',
    title: 'Joyce Art Studio',
    year: '2025',
    type: 'web',
    status: 'live',
    tagline:
      'Full-stack portfolio and e-commerce site for a professional artist.',
    description:
      'Full-stack portfolio and e-commerce website for Joyce Rasfeld with dynamic gallery, shopping cart, and a Resend-powered contact system.',
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'PostgreSQL',
      'Prisma',
      'Resend',
      'Docker',
    ],
    github: 'https://github.com/JoyRasfeld/joyce-website',
    live: 'https://joyceartstudio.com',
    hasDetail: false,
    image: '/joyce-app-main.png',
  },
  {
    id: 'vice',
    title: 'Vice',
    year: '2024',
    type: 'mobile',
    status: 'wip',
    tagline:
      'Habit and vice tracker with streaks, goals, and daily reflection prompts.',
    stack: ['React Native', 'Expo', 'TypeScript'],
    github: null,
    live: null,
    hasDetail: false,
  },
  {
    id: 'map-game',
    title: 'Map Game',
    year: '2024',
    type: 'web',
    status: 'wip',
    tagline: 'Interactive geography quiz game powered by real-world map data.',
    stack: ['React', 'TypeScript', 'Mapbox', 'D3.js'],
    github: null,
    live: null,
    hasDetail: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find(p => p.id === slug);
}

export function getDetailSlugs(): string[] {
  return PROJECTS.filter(p => p.hasDetail).map(p => p.id);
}
