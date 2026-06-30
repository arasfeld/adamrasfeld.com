'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

function firstLetter(name: string) {
  return name.trim()[0]?.toUpperCase() ?? '?';
}

/** Deterministic gradient from a name — the fallback when art is missing. */
export function gradient(name: string) {
  const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 34%, 40%), hsl(${(hue + 40) % 360}, 30%, 26%))`;
}

interface MusicArtProps {
  name: string;
  src?: string;
  size: number;
  round?: boolean;
  showLetter?: boolean;
  priority?: boolean;
  className?: string;
}

/** Fixed-size album/artist thumbnail with a deterministic gradient fallback. */
export function MusicArt({
  name,
  src,
  size,
  round,
  showLetter,
  priority,
  className,
}: MusicArtProps) {
  const [failed, setFailed] = useState(false);
  const shape = round ? 'rounded-full' : 'rounded-sm';

  if (!src || failed) {
    return (
      <div
        className={cn(
          'grid flex-shrink-0 place-items-center overflow-hidden border border-border',
          shape,
          className
        )}
        style={{ width: size, height: size, background: gradient(name) }}
      >
        {showLetter && (
          <span
            className="font-bold text-white/85"
            style={{ fontSize: Math.round(size * 0.42) }}
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
      width={size}
      height={size}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn(
        'flex-shrink-0 border border-border object-cover',
        shape,
        className
      )}
    />
  );
}

/** Fill-style art (hero banner, recent cards). Parent must be relative + sized. */
export function MusicArtFill({
  name,
  src,
  priority,
  className,
}: {
  name: string;
  src?: string;
  priority?: boolean;
  className?: string;
}) {
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
