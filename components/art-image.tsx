'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

function firstLetter(name: string) {
  return name.trim()[0]?.toUpperCase() ?? '?';
}

/** Deterministic gradient from a name — the fallback when art is missing. */
function gradient(name: string) {
  const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 34%, 40%), hsl(${(hue + 40) % 360}, 30%, 26%))`;
}

interface ArtThumbProps {
  name: string;
  src?: string;
  width: number;
  height: number;
  /** Render the first letter of `name` on the gradient fallback. */
  showLetter?: boolean;
  /** Eager-load + preload for above-the-fold LCP images. */
  priority?: boolean;
  /** Applied to both the image and the fallback (shape, borders). */
  className?: string;
}

/**
 * Fixed-size thumbnail with a deterministic gradient fallback, used for
 * game capsules, avatars, and album/artist art via the wrappers in
 * components/games/game-art.tsx and components/music/music-art.tsx.
 */
export function ArtThumb({
  name,
  src,
  width,
  height,
  showLetter = true,
  priority,
  className,
}: ArtThumbProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          'grid flex-shrink-0 place-items-center overflow-hidden',
          className
        )}
        style={{ width, height, background: gradient(name) }}
      >
        {showLetter && (
          <span
            className="font-bold text-white/80"
            style={{ fontSize: Math.round(Math.min(width, height) * 0.42) }}
          >
            {firstLetter(name)}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={width}
      height={height}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn('flex-shrink-0 object-cover', className)}
    />
  );
}

interface ArtFillProps {
  name: string;
  src?: string;
  /** Eager-load + preload for above-the-fold LCP images. */
  priority?: boolean;
  className?: string;
}

/** Fill-style art (hero banners, cards). Parent must be relative + sized. */
export function ArtFill({ name, src, priority, className }: ArtFillProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
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
      src={src}
      alt={name}
      fill
      sizes="(max-width: 768px) 50vw, 240px"
      priority={priority}
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}
