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
    image: {
      light: '/sprout-home-light.webp',
      dark: '/sprout-home-dark.webp',
    },
  },
  {
    id: 'joyce-art-studio',
    title: 'Joyce Art Studio',
    year: '2025',
    type: 'web',
    status: 'live',
    tagline:
      'Artist portfolio + custom-order e-commerce shop with Stripe checkout.',
    description:
      'Full-stack artist site for Joyce Rasfeld with a filterable gallery, customer photo uploads per order item, multi-item cart, Stripe checkout backed by a webhook-driven order state machine (DRAFT → PENDING_PAYMENT → PAID), and Resend confirmation emails.',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'Stripe',
      'Cloudinary',
      'Resend',
      'Tailwind CSS',
      'shadcn/ui',
    ],
    github: 'https://github.com/JoyRasfeld/joyce-website',
    live: 'https://joyceartstudio.com',
    hasDetail: true,
    image: {
      light: '/joyce-app-main.webp',
    },
  },
  {
    id: 'razzify',
    title: 'Razzify',
    year: '2025',
    type: 'desktop',
    status: 'active',
    tagline:
      'Native Spotify desktop client built on Tauri with playback, OAuth, and listening stats.',
    description:
      'A cross-platform Spotify client packaged with Tauri 2 (Rust backend, tiny binary) that combines the Spotify Web API for library and discovery with the Web Playback SDK for in-app device playback. Includes a singleton token-refresh layer so concurrent 401s collapse into one in-flight refresh.',
    stack: [
      'Tauri 2',
      'Rust',
      'React 19',
      'TypeScript',
      'Redux Toolkit',
      'RTK Query',
      'Mantine',
      'Spotify Web API',
      'Web Playback SDK',
      'Vite',
    ],
    github: 'https://github.com/arasfeld/razzify',
    live: null,
    hasDetail: true,
    image: {
      light: '/razzify-light.webp',
      dark: '/razzify-dark.webp',
    },
  },
  {
    id: 'freebox',
    title: 'Freebox',
    year: '2025',
    type: 'web',
    status: 'active',
    tagline:
      'Community giveaway marketplace with interest-based claims and fairness controls.',
    description:
      'A Next.js 16 marketplace where users post free items and others claim them by expressing interest. Built with Prisma + PostgreSQL, NextAuth Google OAuth, Cloudinary uploads, and RTK Query caching — the poster picks among interested parties to keep distribution fair.',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'NextAuth.js',
      'RTK Query',
      'Cloudinary',
      'Tailwind CSS',
      'shadcn/ui',
    ],
    github: 'https://github.com/arasfeld/freebox',
    live: null,
    hasDetail: true,
    image: {
      light: '/freebox-light.webp',
      dark: '/freebox-dark.webp',
    },
  },
  {
    id: 'flux',
    title: 'Flux',
    year: '2025',
    type: 'mobile',
    status: 'active',
    tagline:
      'Sobriety tracker with streaks, badges, mood logging, and calendar heatmap.',
    description:
      "Cross-platform Expo app for tracking sobriety from multiple vices. Streak counter, mood-tagged check-ins, off-day logging that doesn't reset progress, achievement badges with rarity tiers, and a calendar heatmap — all persisted locally via AsyncStorage with Redux Toolkit thunks for I/O.",
    stack: [
      'Expo',
      'React Native',
      'TypeScript',
      'Redux Toolkit',
      'AsyncStorage',
      'HeroUI Native',
      'Uniwind',
      'date-fns',
    ],
    github: 'https://github.com/arasfeld/flux',
    live: null,
    hasDetail: true,
    image: {
      light: '/flux-home-light.webp',
      dark: '/flux-home-dark.webp',
    },
  },
  {
    id: 'map-game',
    title: 'Map Game',
    year: '2025',
    type: 'web',
    status: 'wip',
    tagline:
      'Geography quiz across six regions with attempt-tracked, color-coded SVG maps.',
    description:
      'Interactive geography game with six modes — US states, Europe, Africa, Asia, North America, and South America. Pure-SVG region paths with zoom and pan, a randomized region queue, and color-graded feedback (green → yellow → orange → red) based on attempts per region.',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'shadcn/ui',
      'react-zoom-pan-pinch',
    ],
    github: 'https://github.com/arasfeld/map-game',
    live: null,
    hasDetail: true,
    image: {
      light: '/map-game-light.webp',
      dark: '/map-game-dark.webp',
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find(p => p.id === slug);
}

export function getDetailSlugs(): string[] {
  return PROJECTS.filter(p => p.hasDetail).map(p => p.id);
}
