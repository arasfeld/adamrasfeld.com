'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

/** Steam capsule/header art is addressable by appid on the public CDN. */
function steamArtUrl(appid: number, art: 'capsule' | 'header') {
  const file = art === 'header' ? 'header.jpg' : 'capsule_231x87.jpg';
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${file}`;
}

function firstLetter(name: string) {
  return name.trim()[0]?.toUpperCase() ?? '?';
}

/** Deterministic gradient from the game name — the fallback when art is missing. */
function gradient(name: string) {
  const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 32%, 42%), hsl(${(hue + 40) % 360}, 28%, 30%))`;
}

interface GameArtProps {
  name: string;
  /** Explicit image url (e.g. a profile avatar). Takes precedence over appid. */
  src?: string;
  appid?: number;
  art?: 'capsule' | 'header';
  width: number;
  height: number;
  className?: string;
}

/** Fixed-size game/avatar thumbnail with a deterministic gradient fallback. */
export function GameArt({
  name,
  src,
  appid,
  art = 'capsule',
  width,
  height,
  className,
}: GameArtProps) {
  const [failed, setFailed] = useState(false);
  const url = src ?? (appid != null ? steamArtUrl(appid, art) : undefined);

  if (!url || failed) {
    return (
      <div
        className={cn(
          'grid flex-shrink-0 place-items-center overflow-hidden',
          className
        )}
        style={{ width, height, background: gradient(name) }}
      >
        <span
          className="font-bold text-white/80"
          style={{ fontSize: Math.round(Math.min(width, height) * 0.42) }}
        >
          {firstLetter(name)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={name}
      width={width}
      height={height}
      onError={() => setFailed(true)}
      className={cn('flex-shrink-0 object-cover', className)}
    />
  );
}

/** Fill-style header banner (showcase cards). Parent must be relative + sized. */
export function GameBanner({
  name,
  appid,
  className,
}: {
  name: string;
  appid: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn('grid h-full w-full place-items-center', className)}
        style={{ background: gradient(name) }}
      >
        <span className="font-bold text-7xl text-white/20">
          {firstLetter(name)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={steamArtUrl(appid, 'header')}
      alt={name}
      fill
      sizes="(max-width: 768px) 50vw, 240px"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}

/** Achievement icon that fills its container, falling back to a ★ glyph. */
export function AchievementIcon({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <span aria-hidden="true">★</span>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={44}
      height={44}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}
