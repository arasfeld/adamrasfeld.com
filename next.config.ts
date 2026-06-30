import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'i.scdn.co',
        pathname: '/image/*',
        protocol: 'https',
      },
      {
        hostname: '**.steamstatic.com',
        protocol: 'https',
      },
      {
        hostname: 'media.steampowered.com',
        protocol: 'https',
      },
      {
        hostname: 'steamcdn-a.akamaihd.net',
        protocol: 'https',
      },
      {
        hostname: 'lastfm.freetls.fastly.net',
        protocol: 'https',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Steam art (by appid) and Spotify/avatar URLs (content-hashed) are
    // immutable per-URL, so floor the optimized-image cache at 30 days.
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
