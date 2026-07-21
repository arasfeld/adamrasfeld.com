'use client';

import Image from 'next/image';
import { useState } from 'react';

import { ArtFill, ArtThumb } from '@/components/art-image';

/** Steam capsule/header art is addressable by appid on the public CDN. */
function steamArtUrl(appid: number, art: 'capsule' | 'header') {
  const file = art === 'header' ? 'header.jpg' : 'capsule_231x87.jpg';
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${file}`;
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
  /** Eager-load + preload for above-the-fold LCP images. */
  priority?: boolean;
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
  priority,
}: GameArtProps) {
  const url = src ?? (appid != null ? steamArtUrl(appid, art) : undefined);
  return (
    <ArtThumb
      name={name}
      src={url}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}

/** Fill-style header banner (showcase cards). Parent must be relative + sized. */
export function GameBanner({
  name,
  appid,
  className,
  priority,
}: {
  name: string;
  appid: number;
  className?: string;
  /** Eager-load + preload for above-the-fold LCP images. */
  priority?: boolean;
}) {
  return (
    <ArtFill
      name={name}
      src={steamArtUrl(appid, 'header')}
      priority={priority}
      className={className}
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
