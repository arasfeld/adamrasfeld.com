# Music Page Last.fm Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current two-column music page with a Last.fm-powered listening dashboard (stats strip, On-Repeat hero, top-artist badges, top-track bar chart, genre sound profile, recently-played cards), keeping Spotify only for the live now-playing bar.

**Architecture:** Server components fetch live Last.fm data (real playcounts/periods/totals/tags) through a new `lib/lastfm.ts`, mirroring `lib/spotify.ts`. An `lib/album-art.ts` resolver enriches artist art via Spotify search, falling back to a deterministic gradient. The page mirrors the existing games dashboard (`app/games/page.tsx`) module-for-module, wrapping each section in `<Suspense>`.

**Tech Stack:** Next.js 16 App Router (RSC + Suspense), React 19, TypeScript strict, Tailwind v4 (token-driven), Biome, SWR (existing now-playing only), `next/image`.

## Global Constraints

- **No test runner exists.** Verification gate per task = `pnpm tsc --noEmit` and `pnpm check` both pass; final task adds `pnpm build` + manual `/music` load. No unit-test steps.
- **Design-system conformance (hard requirement):**
  - Tokens only — **no hard-coded hex/hsl in components** except the deterministic art gradient (allowed; mirrors `components/games/game-art.tsx`).
  - Color map: prototype `accent` → `--primary` (`text-primary`/`bg-primary`); prototype `green` → `syntax-green`. Sound-profile cycles `syntax-green, primary, syntax-purple, syntax-yellow, syntax-cyan, syntax-orange`.
  - Reuse typography primitives: `Comment`, `SectionLabel`, `DisplayHeading`, `MonoTag` from `components/ui/typography.tsx`.
  - Reuse animation utilities from `app/globals.css`: `ar-fade-up` (with staggered `[animation-delay:…]`), `ar-ping`, `ar-eq-bar`. Add no new keyframes.
  - Whole site is `font-mono`; keep it.
  - Biome: sorted Tailwind classes, `import type`/`export type` for type-only, self-closing elements. `pnpm check:fix` autofixes class order.
  - `next/image` for real art; add Last.fm image host to `next.config.ts`.
- **Period mapping:** `short → 1month`, `medium → 6month`, `long → overall`; weekly stat uses `7day`.
- **Fail-soft:** every Last.fm fetch returns empty/null on error (never throws), mirroring `getTopTracks` returning `[]`.
- **Env:** `LASTFM_API_KEY`, `LASTFM_USERNAME` (`arazzy`). Spotify vars retained.
- **Branch:** `feat/music-lastfm-dashboard` (already checked out).

---

### Task 1: Last.fm types

**Files:**
- Create: `types/lastfm.ts`
- Modify: `types/index.ts` (add `export * from './lastfm';`)

**Interfaces:**
- Produces: `LastfmPeriod`, `LastfmArtist`, `LastfmTrack`, `LastfmRecentTrack`, `LastfmUserInfo`, `TopArtistsResult`, `TopTracksResult`, `GenreSlice`, `MusicRange`, `RANGE_TO_PERIOD` (the const lives in `lib/lastfm.ts`, Task 2; the type `MusicRange` is defined here).

- [ ] **Step 1: Create `types/lastfm.ts`**

```ts
export type LastfmPeriod =
  | '7day'
  | '1month'
  | '3month'
  | '6month'
  | '12month'
  | 'overall';

/** UI time-range keys reused from the existing TimeRangeSelector. */
export type MusicRange = 'short' | 'medium' | 'long';

export interface LastfmArtist {
  name: string;
  playcount: number;
  rank: number;
  url: string;
  /** Largest non-blank Last.fm image; usually absent for artists. */
  image?: string;
}

export interface LastfmTrack {
  name: string;
  artist: string;
  playcount: number;
  rank: number;
  url: string;
  /** Album art from Last.fm; usually present for tracks. */
  image?: string;
}

export interface LastfmRecentTrack {
  name: string;
  artist: string;
  album?: string;
  image?: string;
  nowPlaying: boolean;
  /** Unix seconds; absent when currently playing. */
  playedAt?: number;
}

export interface LastfmUserInfo {
  scrobbles: number;
  /** Unix seconds. */
  memberSince: number;
}

export interface TopArtistsResult {
  artists: LastfmArtist[];
  /** @attr.total — lifetime distinct-artist count. */
  total: number;
}

export interface TopTracksResult {
  tracks: LastfmTrack[];
  total: number;
}

export interface GenreSlice {
  name: string;
  pct: number;
}
```

- [ ] **Step 2: Add export to `types/index.ts`**

Add this line alphabetically (after `./image`):

```ts
export * from './lastfm';
```

- [ ] **Step 3: Typecheck**

Run: `pnpm tsc --noEmit`
Expected: passes (no usages yet).

- [ ] **Step 4: Commit**

```bash
git add types/lastfm.ts types/index.ts
git commit -m "feat(music): add Last.fm domain types"
```

---

### Task 2: Last.fm data layer

**Files:**
- Create: `lib/lastfm.ts`

**Interfaces:**
- Consumes: types from Task 1.
- Produces: `RANGE_TO_PERIOD`, `getUserInfo()`, `getTopArtists(period, limit?)`, `getTopTracks(period, limit?)`, `getRecentTracks(limit?)`, `getWeeklyScrobbles()`, `getGenreBreakdown(period, topN?)`.

- [ ] **Step 1: Create `lib/lastfm.ts`**

```ts
import type {
  GenreSlice,
  LastfmPeriod,
  LastfmRecentTrack,
  LastfmUserInfo,
  MusicRange,
  TopArtistsResult,
  TopTracksResult,
} from '@/types';

const API = 'https://ws.audioscrobbler.com/2.0/';

/** Last.fm's placeholder "star" image hash — treat any URL containing it as blank. */
const BLANK_IMAGE = '2a96cbd8b46e442fc41c2b86b821562f';

export const RANGE_TO_PERIOD: Record<MusicRange, LastfmPeriod> = {
  short: '1month',
  medium: '6month',
  long: 'overall',
};

interface RawImage {
  '#text': string;
  size: string;
}

/** Largest non-blank image URL, or undefined. */
function pickImage(images?: RawImage[]): string | undefined {
  if (!images) return undefined;
  for (const size of ['extralarge', 'large', 'medium', 'small']) {
    const img = images.find(i => i.size === size);
    const url = img?.['#text'];
    if (url && !url.includes(BLANK_IMAGE)) return url;
  }
  return undefined;
}

/**
 * Server-side Last.fm REST call. Fails soft to null so an outage degrades the
 * page rather than throwing. Mirrors lib/spotify.ts caching via next.revalidate.
 */
async function lastfmFetch(
  method: string,
  params: Record<string, string>,
  revalidate: number
): Promise<any | null> {
  const { LASTFM_API_KEY, LASTFM_USERNAME } = process.env;
  if (!LASTFM_API_KEY || !LASTFM_USERNAME) return null;

  const search = new URLSearchParams({
    method,
    user: LASTFM_USERNAME,
    api_key: LASTFM_API_KEY,
    format: 'json',
    ...params,
  });

  try {
    const res = await fetch(`${API}?${search}`, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getUserInfo(): Promise<LastfmUserInfo | null> {
  const data = await lastfmFetch('user.getInfo', {}, 3600);
  const u = data?.user;
  if (!u) return null;
  return {
    scrobbles: Number(u.playcount) || 0,
    memberSince: Number(u.registered?.unixtime) || 0,
  };
}

export async function getTopArtists(
  period: LastfmPeriod,
  limit = 10
): Promise<TopArtistsResult> {
  const data = await lastfmFetch(
    'user.getTopArtists',
    { period, limit: String(limit) },
    300
  );
  const raw = data?.topartists;
  if (!raw?.artist) return { artists: [], total: 0 };
  return {
    artists: raw.artist.map((a: any) => ({
      name: a.name,
      playcount: Number(a.playcount) || 0,
      rank: Number(a['@attr']?.rank) || 0,
      url: a.url,
      image: pickImage(a.image),
    })),
    total: Number(raw['@attr']?.total) || 0,
  };
}

export async function getTopTracks(
  period: LastfmPeriod,
  limit = 10
): Promise<TopTracksResult> {
  const data = await lastfmFetch(
    'user.getTopTracks',
    { period, limit: String(limit) },
    300
  );
  const raw = data?.toptracks;
  if (!raw?.track) return { tracks: [], total: 0 };
  return {
    tracks: raw.track.map((t: any) => ({
      name: t.name,
      artist: t.artist?.name ?? '',
      playcount: Number(t.playcount) || 0,
      rank: Number(t['@attr']?.rank) || 0,
      url: t.url,
      image: pickImage(t.image),
    })),
    total: Number(raw['@attr']?.total) || 0,
  };
}

export async function getRecentTracks(
  limit = 10
): Promise<LastfmRecentTrack[]> {
  const data = await lastfmFetch(
    'user.getRecentTracks',
    { limit: String(limit) },
    120
  );
  const raw = data?.recenttracks?.track;
  if (!raw) return [];
  return raw.map((t: any) => ({
    name: t.name,
    artist: t.artist?.['#text'] ?? '',
    album: t.album?.['#text'] || undefined,
    image: pickImage(t.image),
    nowPlaying: t['@attr']?.nowplaying === 'true',
    playedAt: t.date?.uts ? Number(t.date.uts) : undefined,
  }));
}

/** Approximate scrobbles in the last 7 days = sum of 7-day top-track playcounts. */
export async function getWeeklyScrobbles(): Promise<number> {
  const { tracks } = await getTopTracks('7day', 1000);
  return tracks.reduce((sum, t) => sum + t.playcount, 0);
}

/**
 * Genre breakdown for the sound profile: take the top artists for the window,
 * pull each artist's top community tag, and weight by the user's playcount for
 * that artist. Normalized to the top 6 slices (with an "everything else"
 * remainder). Artist-tag lookups are cached 24h.
 */
export async function getGenreBreakdown(
  period: LastfmPeriod,
  topN = 8
): Promise<GenreSlice[]> {
  const { artists } = await getTopArtists(period, topN);
  if (artists.length === 0) return [];

  const weights = new Map<string, number>();
  await Promise.all(
    artists.map(async artist => {
      const data = await lastfmFetch(
        'artist.getTopTags',
        { artist: artist.name },
        86_400
      );
      const tag = data?.toptags?.tag?.[0]?.name;
      if (!tag) return;
      const key = tag.toLowerCase();
      weights.set(key, (weights.get(key) ?? 0) + artist.playcount);
    })
  );

  const total = [...weights.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  const sorted = [...weights.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 6);
  const slices: GenreSlice[] = top.map(([name, w]) => ({
    name,
    pct: Math.round((w / total) * 100),
  }));
  const accounted = slices.reduce((a, s) => a + s.pct, 0);
  if (accounted < 100 && sorted.length > 6) {
    slices.push({ name: 'everything else', pct: 100 - accounted });
  }
  return slices;
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass. (`any` is used in the JSON mappers — `noExplicitAny` is not enforced outside `components/ui/**`, matching `lib/spotify.ts` patterns; if Biome flags it, prefer `unknown`-narrowing or leave as is per existing lib style.)

- [ ] **Step 3: (Optional) live sanity check** — only if a real `LASTFM_API_KEY` is available:

Run: `curl -s "https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=arazzy&api_key=$LASTFM_API_KEY&format=json&limit=3" | head -c 400`
Expected: JSON with `topartists.artist[].playcount` and `@attr.total`.

- [ ] **Step 4: Commit**

```bash
git add lib/lastfm.ts
git commit -m "feat(music): add Last.fm data layer"
```

---

### Task 3: Spotify artist-art search

**Files:**
- Modify: `lib/spotify.ts` (append a new exported function)

**Interfaces:**
- Consumes: existing `spotifyFetch` (module-private — add the function in the same file).
- Produces: `searchArtistImage(name: string): Promise<string | undefined>`.

- [ ] **Step 1: Append to `lib/spotify.ts`** (after `getRecentlyPlayed`)

```ts
/**
 * Best-effort artist image via Spotify search — used to enrich Last.fm artists
 * (which return blank images). Requires an exact name match to avoid mismatched
 * art. Cached 24h since artist art is effectively immutable.
 */
export async function searchArtistImage(
  name: string
): Promise<string | undefined> {
  const params = new URLSearchParams({ q: name, type: 'artist', limit: '1' });
  const res = await spotifyFetch(`/search?${params}`, 86_400);
  if (!res.ok) return undefined;
  const data = await res.json();
  const artist = data.artists?.items?.[0];
  if (!artist || artist.name?.toLowerCase() !== name.toLowerCase()) {
    return undefined;
  }
  const image = artist.images?.[1] || artist.images?.[0];
  return image?.url;
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add lib/spotify.ts
git commit -m "feat(music): add Spotify artist-image search for art enrichment"
```

---

### Task 4: Album-art resolver + art components + image host

**Files:**
- Create: `lib/album-art.ts`
- Create: `components/music/music-art.tsx`
- Modify: `next.config.ts` (add Last.fm image host)

**Interfaces:**
- Consumes: `searchArtistImage` (Task 3).
- Produces: `resolveArtistImage(name, lastfmImage?)` from `lib/album-art.ts`; `MusicArt`, `MusicArtFill`, `gradient` from `components/music/music-art.tsx`.

> **Note (refinement vs spec):** the gradient generator lives in the client component `music-art.tsx` (a render concern), not in `lib/album-art.ts` — because `lib/album-art.ts` imports the server-only `lib/spotify.ts` and must never be pulled into a client bundle. The resolver does only the Last.fm→Spotify cascade.

- [ ] **Step 1: Create `lib/album-art.ts`**

```ts
import { searchArtistImage } from '@/lib/spotify';

/**
 * Resolve an artist image: prefer the Last.fm image when present (rare for
 * artists), otherwise enrich via Spotify search. Returns undefined when neither
 * resolves — callers fall back to a gradient. Spotify lookups are deduped by
 * Next's fetch cache (identical search URLs share a cache entry).
 */
export async function resolveArtistImage(
  name: string,
  lastfmImage?: string
): Promise<string | undefined> {
  if (lastfmImage) return lastfmImage;
  return await searchArtistImage(name);
}
```

- [ ] **Step 2: Create `components/music/music-art.tsx`**

```tsx
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
      className={cn('flex-shrink-0 border border-border object-cover', shape, className)}
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
```

- [ ] **Step 3: Add Last.fm image host to `next.config.ts`** — add inside `images.remotePatterns` array:

```ts
      {
        hostname: 'lastfm.freetls.fastly.net',
        protocol: 'https',
      },
```

- [ ] **Step 4: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add lib/album-art.ts components/music/music-art.tsx next.config.ts
git commit -m "feat(music): add album-art resolver, art components, lastfm image host"
```

---

### Task 5: Format helpers + skeletons

**Files:**
- Create: `components/music/format.ts`
- Create: `components/music/music-skeletons.tsx`

**Interfaces:**
- Produces: `fmtNum`, `fmtDuration`, `fmtYear` from `format.ts`; `OnRepeatSkeleton`, `ArtistBadgesSkeleton`, `TrackBarsSkeleton`, `RecentCardsSkeleton`, `SoundProfileSkeleton` from `music-skeletons.tsx`.

- [ ] **Step 1: Create `components/music/format.ts`**

```ts
/** Shared formatters for the music page. */

/** Compact large counts (1847 → "1.8k", 47043 → "47k"). */
export function fmtNum(n: number): string {
  if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
  return n.toLocaleString();
}

/** Unix seconds → 4-digit year, or "—". */
export function fmtYear(unixSeconds?: number): string {
  if (!unixSeconds) return '—';
  return String(new Date(unixSeconds * 1000).getFullYear());
}
```

- [ ] **Step 2: Create `components/music/music-skeletons.tsx`**

```tsx
/** Mono placeholders for the music dashboard while Last.fm data loads. */
import { Skeleton } from '@/components/ui/skeleton';

const BADGE_KEYS = Array.from({ length: 6 }, (_, i) => `artist-badge-${i}`);
const BAR_KEYS = Array.from({ length: 8 }, (_, i) => `track-bar-${i}`);
const CARD_KEYS = Array.from({ length: 8 }, (_, i) => `recent-card-${i}`);
const ROTATION_KEYS = Array.from({ length: 3 }, (_, i) => `rotation-${i}`);
const LEGEND_KEYS = Array.from({ length: 6 }, (_, i) => `legend-${i}`);

export function OnRepeatSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-soft bg-card">
      <Skeleton className="h-[150px] w-full rounded-none" />
      <div className="space-y-4 p-5">
        <Skeleton className="h-5 w-2/3" />
        <div className="flex gap-6">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-10" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2 pt-2">
          {ROTATION_KEYS.map(key => (
            <Skeleton key={key} className="h-6 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArtistBadgesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {BADGE_KEYS.map(key => (
        <div
          key={key}
          className="flex items-center gap-3.5 rounded-lg border border-border bg-card px-4 py-3.5"
        >
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-2.5 w-1/3" />
            <Skeleton className="h-1 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrackBarsSkeleton() {
  return (
    <div className="space-y-1">
      {BAR_KEYS.map(key => (
        <div
          key={key}
          className="grid grid-cols-[18px_34px_1fr_64px] items-center gap-3 py-1.5"
        >
          <Skeleton className="h-2.5 w-4" />
          <Skeleton className="h-[30px] w-[30px] rounded-sm" />
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-10" />
        </div>
      ))}
    </div>
  );
}

export function SoundProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3.5 w-full rounded-full" />
      <div className="space-y-2.5">
        {LEGEND_KEYS.map(key => (
          <Skeleton key={key} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

export function RecentCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
      {CARD_KEYS.map(key => (
        <div
          key={key}
          className="overflow-hidden rounded-md border border-border"
        >
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2 px-3 py-3">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-2.5 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add components/music/format.ts components/music/music-skeletons.tsx
git commit -m "feat(music): add format helpers and dashboard skeletons"
```

---

### Task 6: Stats strip component

**Files:**
- Create: `components/music/stats-strip.tsx`

**Interfaces:**
- Produces: `MusicStat` (interface), `StatsStrip({ stats })`.

- [ ] **Step 1: Create `components/music/stats-strip.tsx`** (replicates the games `StatsGrid` to keep features decoupled)

```tsx
import { cn } from '@/lib/utils';

export interface MusicStat {
  label: string;
  value: string | number;
  colorClass?: string;
}

export function StatsStrip({ stats }: { stats: MusicStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 md:grid-cols-5">
      {stats.map(stat => (
        <div key={stat.label} className="bg-background px-3 py-5 text-center">
          <div
            className={cn(
              'font-bold text-lg tabular-nums leading-none',
              stat.colorClass ?? 'text-foreground-bright'
            )}
          >
            {stat.value}
          </div>
          <div className="mt-2 font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/music/stats-strip.tsx
git commit -m "feat(music): add stats strip"
```

---

### Task 7: On-Repeat hero component

**Files:**
- Create: `components/music/on-repeat.tsx`

**Interfaces:**
- Consumes: `MusicArt`, `MusicArtFill` (Task 4); `fmtNum` (Task 5); `LastfmArtist`, `LastfmTrack` (Task 1).
- Produces: `HeroArtist` (= `LastfmArtist & { resolvedImage?: string }`), `OnRepeat({ artist, others, topTrack, share })`.

- [ ] **Step 1: Create `components/music/on-repeat.tsx`**

```tsx
import { fmtNum } from '@/components/music/format';
import { MusicArt, MusicArtFill } from '@/components/music/music-art';
import { cn } from '@/lib/utils';
import type { LastfmArtist, LastfmTrack } from '@/types';

export type HeroArtist = LastfmArtist & { resolvedImage?: string };

function Metric({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div>
      <div className={cn('font-bold text-xl tabular-nums leading-none', color)}>
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[9px] text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

/**
 * Hero card for the all-time #1 artist: artist art banner, headline play
 * metrics, their top track, and an "also heavy rotation" mini-list.
 */
export function OnRepeat({
  artist,
  others,
  topTrack,
  share,
}: {
  artist: HeroArtist;
  others: HeroArtist[];
  topTrack: LastfmTrack | null;
  share: number;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border-soft bg-card">
      <div className="relative h-[150px] w-full overflow-hidden">
        <MusicArtFill name={artist.name} src={artist.resolvedImage} priority />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-syntax-green" />
          <span className="font-mono text-[10px] text-white">#1 artist</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 font-mono text-[10px] text-syntax-green">
          {'// on repeat'}
        </div>
        <div className="font-bold text-[19px] text-foreground-bright leading-tight tracking-tight">
          {artist.name}
        </div>

        <div className="mt-4 flex gap-6">
          <Metric
            value={fmtNum(artist.playcount)}
            label="plays"
            color="text-syntax-green"
          />
          <Metric
            value={`${share}%`}
            label="of library"
            color="text-foreground-bright"
          />
          <Metric value="#1" label="all time" color="text-primary" />
        </div>

        {topTrack && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-3">
            <MusicArt name={topTrack.name} src={topTrack.image} size={34} />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wide">
                their #1 track
              </div>
              <div className="mt-0.5 truncate font-semibold text-[12px] text-foreground-bright">
                {topTrack.name}
              </div>
            </div>
            <span className="flex-shrink-0 font-mono text-[10px] text-syntax-green tabular-nums">
              {fmtNum(topTrack.playcount)}×
            </span>
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-auto pt-5">
            <div className="mb-2.5 font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
              also heavy rotation
            </div>
            <div className="flex flex-col gap-2">
              {others.map(other => (
                <div key={other.name} className="flex items-center gap-2.5">
                  <MusicArt
                    name={other.name}
                    src={other.resolvedImage}
                    size={24}
                    round
                    showLetter
                  />
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground">
                    {other.name}
                  </span>
                  <span className="font-mono text-[10px] text-syntax-green tabular-nums">
                    {fmtNum(other.playcount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/music/on-repeat.tsx
git commit -m "feat(music): add On-Repeat hero card"
```

---

### Task 8: Artist badge component

**Files:**
- Create: `components/music/artist-badge.tsx`

**Interfaces:**
- Consumes: `MusicArt` (Task 4); `fmtNum` (Task 5); `LastfmArtist` (Task 1).
- Produces: `ResolvedArtist` (= `LastfmArtist & { resolvedImage?: string }`), `ArtistBadge({ artist, rank, max })`.

- [ ] **Step 1: Create `components/music/artist-badge.tsx`**

```tsx
import { fmtNum } from '@/components/music/format';
import { MusicArt } from '@/components/music/music-art';
import type { LastfmArtist } from '@/types';

export type ResolvedArtist = LastfmArtist & { resolvedImage?: string };

/** A ranked top-artist badge: round art with a rank pip + playcount bar. */
export function ArtistBadge({
  artist,
  rank,
  max,
}: {
  artist: ResolvedArtist;
  rank: number;
  max: number;
}) {
  const pct = max > 0 ? Math.max(8, (artist.playcount / max) * 100) : 0;

  return (
    <div className="group flex items-center gap-3.5 rounded-lg border border-border bg-card px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-primary">
      <div className="relative flex-shrink-0">
        <MusicArt name={artist.name} src={artist.resolvedImage} size={46} round showLetter />
        <div
          className="absolute -right-1 -bottom-1 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-card bg-primary px-1 font-bold text-[10px] text-primary-foreground"
          aria-hidden="true"
        >
          {rank}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-[13px] text-foreground-bright">
          {artist.name}
        </div>
        <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
          {fmtNum(artist.playcount)} plays
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary opacity-80 transition-opacity group-hover:opacity-100"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/music/artist-badge.tsx
git commit -m "feat(music): add top-artist badge"
```

---

### Task 9: Track bar component

**Files:**
- Create: `components/music/track-bar.tsx`

**Interfaces:**
- Consumes: `MusicArt` (Task 4); `fmtNum` (Task 5); `LastfmTrack` (Task 1).
- Produces: `TrackBar({ track, rank, max })`.

- [ ] **Step 1: Create `components/music/track-bar.tsx`**

```tsx
import { fmtNum } from '@/components/music/format';
import { MusicArt } from '@/components/music/music-art';
import type { LastfmTrack } from '@/types';

/** A single ranked row in the Top Tracks playcount bar chart. */
export function TrackBar({
  track,
  rank,
  max,
}: {
  track: LastfmTrack;
  rank: number;
  max: number;
}) {
  const pct = max > 0 ? Math.max(2, (track.playcount / max) * 100) : 0;

  return (
    <div className="group grid grid-cols-[18px_34px_1fr_64px] items-center gap-3 py-1.5 sm:grid-cols-[18px_34px_200px_1fr_64px]">
      <span className="text-right font-mono text-[10px] text-muted-foreground tabular-nums">
        {String(rank).padStart(2, '0')}
      </span>
      <MusicArt name={track.name} src={track.image} size={30} />
      <div className="min-w-0">
        <div className="truncate font-mono text-[11.5px] text-foreground-bright">
          {track.name}
        </div>
        <div className="truncate font-mono text-[9.5px] text-muted-foreground">
          {track.artist}
        </div>
      </div>
      <div className="hidden h-2.5 overflow-hidden rounded-full bg-border sm:block">
        <div
          className="h-full rounded-full bg-syntax-green opacity-80 transition-all group-hover:opacity-100"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-right font-bold font-mono text-[11px] text-syntax-green tabular-nums">
        {fmtNum(track.playcount)}×
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/music/track-bar.tsx
git commit -m "feat(music): add top-track bar"
```

---

### Task 10: Sound profile component

**Files:**
- Create: `components/music/sound-profile.tsx`

**Interfaces:**
- Consumes: `GenreSlice` (Task 1).
- Produces: `SoundProfile({ genres })`.

- [ ] **Step 1: Create `components/music/sound-profile.tsx`**

```tsx
import type { GenreSlice } from '@/types';

/** Syntax palette cycled across genre slices (bar fill + legend swatch). */
const SLICE_BG = [
  'bg-syntax-green',
  'bg-primary',
  'bg-syntax-purple',
  'bg-syntax-yellow',
  'bg-syntax-cyan',
  'bg-syntax-orange',
];

export function SoundProfile({ genres }: { genres: GenreSlice[] }) {
  if (genres.length === 0) {
    return (
      <p className="font-mono text-[11px] text-muted-foreground">
        no genre data
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex h-3.5 overflow-hidden rounded-full border border-border">
        {genres.map((g, i) => (
          <div
            key={g.name}
            className={SLICE_BG[i % SLICE_BG.length]}
            style={{ width: `${g.pct}%` }}
            title={`${g.name} · ${g.pct}%`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {genres.map((g, i) => (
          <div key={g.name} className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm ${SLICE_BG[i % SLICE_BG.length]}`}
            />
            <span className="flex-1 font-mono text-[11.5px] text-foreground">
              {g.name}
            </span>
            <span className="font-bold font-mono text-[11px] text-foreground-bright tabular-nums">
              {g.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/music/sound-profile.tsx
git commit -m "feat(music): add sound-profile genre breakdown"
```

---

### Task 11: Recent card component

**Files:**
- Create: `components/music/recent-card.tsx`

**Interfaces:**
- Consumes: `MusicArtFill` (Task 4); `LastfmRecentTrack` (Task 1).
- Produces: `RecentCard({ track })`.

- [ ] **Step 1: Create `components/music/recent-card.tsx`**

```tsx
import { MusicArtFill } from '@/components/music/music-art';
import type { LastfmRecentTrack } from '@/types';

/** Album-art card for a recently-played scrobble. */
export function RecentCard({ track }: { track: LastfmRecentTrack }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-border-soft">
      <div className="relative aspect-square w-full overflow-hidden">
        <MusicArtFill name={track.name} src={track.image} />
        {track.nowPlaying && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-syntax-green" />
            <span className="font-mono text-[9px] text-white">now</span>
          </div>
        )}
      </div>
      <div className="px-3 py-3">
        <div className="truncate font-semibold text-[12px] text-foreground-bright">
          {track.name}
        </div>
        <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
          {track.artist}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/music/recent-card.tsx
git commit -m "feat(music): add recently-played card"
```

---

### Task 12: Rewrite the music page

**Files:**
- Modify (full rewrite): `app/music/page.tsx`

**Interfaces:**
- Consumes: everything from Tasks 1–11, plus existing `NowPlaying` (`components/music/now-playing.tsx`), `TimeRangeSelector` (`components/music/time-range-selector.tsx`), and typography primitives.

- [ ] **Step 1: Replace `app/music/page.tsx` entirely**

```tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ArtistBadge, type ResolvedArtist } from '@/components/music/artist-badge';
import { fmtNum, fmtYear } from '@/components/music/format';
import {
  ArtistBadgesSkeleton,
  OnRepeatSkeleton,
  RecentCardsSkeleton,
  SoundProfileSkeleton,
  TrackBarsSkeleton,
} from '@/components/music/music-skeletons';
import { NowPlaying } from '@/components/music/now-playing';
import { OnRepeat } from '@/components/music/on-repeat';
import { RecentCard } from '@/components/music/recent-card';
import { SoundProfile } from '@/components/music/sound-profile';
import { StatsStrip, type MusicStat } from '@/components/music/stats-strip';
import { TimeRangeSelector } from '@/components/music/time-range-selector';
import { TrackBar } from '@/components/music/track-bar';
import {
  Comment,
  DisplayHeading,
  SectionLabel,
} from '@/components/ui/typography';
import { resolveArtistImage } from '@/lib/album-art';
import {
  RANGE_TO_PERIOD,
  getGenreBreakdown,
  getRecentTracks,
  getTopArtists,
  getTopTracks,
  getUserInfo,
  getWeeklyScrobbles,
} from '@/lib/lastfm';
import type { MusicRange } from '@/types';

export const metadata: Metadata = {
  title: 'Music',
  description:
    "Adam Rasfeld's listening habits — most-played artists and tracks, a genre sound profile, and recent scrobbles, pulled live from Last.fm.",
  alternates: { canonical: 'https://adamrasfeld.com/music' },
  openGraph: {
    title: 'Music',
    description:
      "Adam Rasfeld's listening habits — top artists, top tracks, and recent scrobbles from Last.fm.",
    url: 'https://adamrasfeld.com/music',
  },
  twitter: {
    title: 'Music',
    description:
      "Adam Rasfeld's listening habits — top artists, top tracks, and recent scrobbles.",
  },
};

function parseRange(value: string | string[] | undefined): MusicRange {
  if (value === 'short' || value === 'medium' || value === 'long') return value;
  return 'long';
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] text-muted-foreground">{children}</p>
  );
}

async function StatsSection() {
  const [info, artistsRes, tracksRes, weekly, genres] = await Promise.all([
    getUserInfo(),
    getTopArtists('overall', 1),
    getTopTracks('overall', 1),
    getWeeklyScrobbles(),
    getGenreBreakdown('overall'),
  ]);
  if (!info) return null;

  const stats: MusicStat[] = [
    { label: 'Scrobbles', value: fmtNum(info.scrobbles) },
    { label: 'Artists', value: fmtNum(artistsRes.total) },
    {
      label: 'Top genre',
      value: genres[0]?.name ?? '—',
      colorClass: 'text-syntax-green',
    },
    {
      label: 'This week',
      value: fmtNum(weekly),
      colorClass: 'text-primary',
    },
    { label: 'Since', value: fmtYear(info.memberSince) },
  ];
  // tracksRes is fetched to warm the cache for downstream sections; total unused here.
  void tracksRes;
  return <StatsStrip stats={stats} />;
}

async function OnRepeatSection() {
  const [{ artists }, { tracks }, info] = await Promise.all([
    getTopArtists('overall', 4),
    getTopTracks('overall', 50),
    getUserInfo(),
  ]);
  if (artists.length === 0) return <Empty>not connected</Empty>;

  const resolved = await Promise.all(
    artists.map(async a => ({
      ...a,
      resolvedImage: await resolveArtistImage(a.name, a.image),
    }))
  );
  const hero = resolved[0];
  const others = resolved.slice(1, 4);
  const topTrack = tracks.find(t => t.artist === hero.name) ?? tracks[0] ?? null;
  const share =
    info && info.scrobbles > 0
      ? Math.round((hero.playcount / info.scrobbles) * 1000) / 10
      : 0;

  return (
    <OnRepeat artist={hero} others={others} topTrack={topTrack} share={share} />
  );
}

async function TopArtistsSection({ range }: { range: MusicRange }) {
  const { artists } = await getTopArtists(RANGE_TO_PERIOD[range], 6);
  if (artists.length === 0) return <Empty>no artists available</Empty>;

  const max = Math.max(...artists.map(a => a.playcount), 1);
  const resolved: ResolvedArtist[] = await Promise.all(
    artists.map(async a => ({
      ...a,
      resolvedImage: await resolveArtistImage(a.name, a.image),
    }))
  );

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {resolved.map((artist, i) => (
        <ArtistBadge
          key={`${range}-${artist.name}`}
          artist={artist}
          rank={i + 1}
          max={max}
        />
      ))}
    </div>
  );
}

async function TopTracksSection({ range }: { range: MusicRange }) {
  const { tracks } = await getTopTracks(RANGE_TO_PERIOD[range], 8);
  if (tracks.length === 0) return <Empty>no tracks available</Empty>;

  const max = Math.max(...tracks.map(t => t.playcount), 1);
  return (
    <div>
      {tracks.map((track, i) => (
        <TrackBar
          key={`${range}-${track.name}-${track.artist}`}
          track={track}
          rank={i + 1}
          max={max}
        />
      ))}
    </div>
  );
}

async function SoundProfileSection() {
  const genres = await getGenreBreakdown('overall');
  return <SoundProfile genres={genres} />;
}

async function RecentlyPlayedSection() {
  const tracks = await getRecentTracks(8);
  if (tracks.length === 0) return <Empty>no recent listens</Empty>;
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
      {tracks.map((track, i) => (
        <RecentCard
          key={`recent-${track.playedAt ?? 'now'}-${i}`}
          track={track}
        />
      ))}
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{
    tracks?: string | string[];
    artists?: string | string[];
  }>;
}

export default async function Music({ searchParams }: PageProps) {
  const params = await searchParams;
  const tracksRange = parseRange(params.tracks);
  const artistsRange = params.artists
    ? parseRange(params.artists)
    : 'medium';

  return (
    <div className="min-h-screen">
      {/* Warm connections to the art CDNs before <Image> requests fire. */}
      <link rel="preconnect" href="https://i.scdn.co" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://lastfm.freetls.fastly.net" />

      {/* Hero */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-20 pb-10 [animation-delay:0.1s] md:px-12">
        <Comment className="mb-2.5">music</Comment>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <DisplayHeading className="[font-size:clamp(2.25rem,5vw,2.75rem)]">
            Listening Habits
          </DisplayHeading>
          <div className="flex items-center gap-2 pb-1">
            <div className="relative h-2 w-2">
              <span className="ar-ping absolute inset-0 rounded-full bg-syntax-green" />
              <span className="absolute inset-0 rounded-full bg-syntax-green" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              live from last.fm
            </span>
          </div>
        </div>
      </div>

      {/* Now playing (Spotify client island — polls every 30s) */}
      <NowPlaying />

      {/* Stats */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-10 [animation-delay:0.2s] md:px-12">
        <Suspense fallback={null}>
          <StatsSection />
        </Suspense>
      </div>

      {/* Bento: On Repeat hero + Top Artists */}
      <div className="ar-fade-up mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-6 pt-12 [animation-delay:0.3s] md:px-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Suspense fallback={<OnRepeatSkeleton />}>
            <OnRepeatSection />
          </Suspense>
        </div>
        <div className="lg:col-span-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <SectionLabel
              comment="most played"
              heading="Top Artists"
              color="green"
              headingClassName="text-base md:text-lg"
              className="mb-0"
            />
            <TimeRangeSelector
              param="artists"
              value={artistsRange}
              className="pb-0.5"
            />
          </div>
          <Suspense key={`artists-${artistsRange}`} fallback={<ArtistBadgesSkeleton />}>
            <TopArtistsSection range={artistsRange} />
          </Suspense>
        </div>
      </div>

      {/* Split: Top Tracks bar chart + Sound Profile */}
      <div className="ar-fade-up mx-auto grid w-full max-w-5xl grid-cols-1 gap-x-12 gap-y-12 px-6 pt-12 [animation-delay:0.45s] md:px-12 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <SectionLabel
              comment="on heavy rotation"
              heading="Top Tracks"
              color="green"
              headingClassName="text-base md:text-lg"
              className="mb-0"
            />
            <TimeRangeSelector
              param="tracks"
              value={tracksRange}
              className="pb-0.5"
            />
          </div>
          <Suspense key={`tracks-${tracksRange}`} fallback={<TrackBarsSkeleton />}>
            <TopTracksSection range={tracksRange} />
          </Suspense>
        </div>
        <div>
          <SectionLabel
            comment="sound profile"
            heading="What I Listen To"
            color="green"
            headingClassName="text-base md:text-lg"
            className="mb-5"
          />
          <Suspense fallback={<SoundProfileSkeleton />}>
            <SoundProfileSection />
          </Suspense>
        </div>
      </div>

      {/* Recently played */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-12 pb-20 [animation-delay:0.6s] md:px-12">
        <SectionLabel
          comment="history"
          heading="Recently Played"
          color="green"
          headingClassName="text-base md:text-lg"
          className="mb-5"
        />
        <Suspense fallback={<RecentCardsSkeleton />}>
          <RecentlyPlayedSection />
        </Suspense>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass. If Biome flags the `void tracksRes;` line as unused-pattern noise, instead drop `getTopTracks('overall', 1)` from the `Promise.all` and the `tracksRes` binding entirely (it only warmed cache).

- [ ] **Step 3: Commit**

```bash
git add app/music/page.tsx
git commit -m "feat(music): rewrite page as Last.fm listening dashboard"
```

---

### Task 13: Cleanup, env, and docs

**Files:**
- Delete: `components/music/track-row.tsx`, `components/music/artist-row.tsx` (only if no remaining importers)
- Modify: `.env.example`, `README.md`
- Possibly modify: any file importing the deleted components or `RowListSkeleton`

**Interfaces:** none produced.

- [ ] **Step 1: Confirm the old row components are now unused**

Run: `grep -rn "track-row\|artist-row\|TrackRow\|ArtistRow" app components` (exclude the files themselves)
Expected: no hits outside `components/music/track-row.tsx` / `artist-row.tsx`. If other importers exist, STOP and report — do not delete.

- [ ] **Step 2: Check `RowListSkeleton` usage**

Run: `grep -rn "RowListSkeleton\|spotify-skeletons" app components`
Expected: only the now-removed music page referenced it. The rewrite in Task 12 already dropped the import. Leave `components/spotify-skeletons.tsx` in place if anything else imports it; otherwise it can stay unused (no action required).

- [ ] **Step 3: Delete the superseded row components**

```bash
git rm components/music/track-row.tsx components/music/artist-row.tsx
```

- [ ] **Step 4: Add Last.fm env vars to `.env.example`** (append):

```
# Last.fm (read-only; key from https://www.last.fm/api/account/create)
LASTFM_API_KEY=
LASTFM_USERNAME=arazzy
```

- [ ] **Step 5: Document in `README.md`** — add a short "Last.fm" subsection near the Spotify docs explaining: the music page's dashboard data (top artists/tracks with playcounts, recent, totals, genres) comes from Last.fm via `LASTFM_API_KEY` + `LASTFM_USERNAME`; Spotify is retained for the live now-playing bar and artist-art enrichment. (Match the README's existing tone/length for the Spotify section.)

- [ ] **Step 6: Typecheck + lint**

Run: `pnpm tsc --noEmit && pnpm check`
Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore(music): remove old row components, document Last.fm env"
```

---

### Task 14: Build + runtime verification

**Files:** none (verification only).

- [ ] **Step 1: Ensure env is set** — `.env.local` has a real `LASTFM_API_KEY`, `LASTFM_USERNAME=arazzy`, and the existing Spotify vars. (If no key is available, note it: the page must still render with empty/`Empty` states and gradient art — verify that path instead.)

- [ ] **Step 2: Production build**

Run: `pnpm build`
Expected: compiles; `/music` builds without type or lint errors.

- [ ] **Step 3: Run and load the page**

Run: `pnpm dev`, then open `http://localhost:3000/music`.
Verify:
- Stats strip shows Scrobbles / Artists / Top genre / This week / Since (real numbers, or graceful blanks without a key).
- On-Repeat hero shows the #1 artist with art (Spotify-enriched) or gradient.
- Top Artists badges show rank pip + playcount bars; the `artists` toggle re-suspends only that section.
- Top Tracks bar chart shows playcount bars; `tracks` toggle works.
- Sound Profile stacked bar + legend render.
- Recently Played card grid renders.
- Now-playing bar still appears when Spotify is playing.
- No broken images (gradient fallback everywhere art is missing).

- [ ] **Step 4: Theme check** — toggle light/dark; confirm all modules use tokens correctly (no invisible text, primary/green accents read correctly in both).

- [ ] **Step 5: Final lint/type gate**

Run: `pnpm check && pnpm tsc --noEmit`
Expected: pass (matches pre-commit + pre-push hooks).

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix(music): verification fixes"
```
(Skip if nothing changed.)

---

## Self-Review

**Spec coverage:**
- Data layer (`lib/lastfm.ts`) → Task 2. ✓
- Art resolver (`lib/album-art.ts`) + gradient → Task 4. ✓
- Env vars → Task 13. ✓
- Page composition w/ Suspense + two toggles → Task 12. ✓
- Stats strip (real set) → Task 6 + Task 12 `StatsSection`. ✓
- On-Repeat hero (plays / library-share % / #1, top track, rotation) → Tasks 7, 12. ✓
- Top Artists badges → Tasks 8, 12. ✓
- Top Tracks bar chart → Tasks 9, 12. ✓
- Sound profile → Tasks 10, 12 (+ `getGenreBreakdown` Task 2). ✓
- Recently played cards → Tasks 11, 12. ✓
- Color mapping / tokens / typography / animations → Global Constraints, applied in every component task. ✓
- `next/image` host → Task 4. ✓
- Period mapping `short/medium/long → 1month/6month/overall` → `RANGE_TO_PERIOD` Task 2. ✓
- "This week" = summed 7day top-track playcounts → `getWeeklyScrobbles` Task 2. ✓
- Fail-soft → `lastfmFetch` Task 2. ✓
- Out of scope (no OAuth/scrobbling, Spotify now-playing only) → respected. ✓

**Placeholder scan:** No TBD/TODO; every code step has full content. ✓

**Type consistency:** `MusicRange`, `LastfmArtist/Track/RecentTrack`, `GenreSlice`, `RANGE_TO_PERIOD`, `MusicStat`, `ResolvedArtist`/`HeroArtist` (both `LastfmArtist & { resolvedImage?: string }`) used consistently across tasks. `resolveArtistImage(name, image)` signature matches all call sites. `getTopArtists`/`getTopTracks` return `{ artists|tracks, total }` consistently. ✓

**Note on the no-test-runner adaptation:** TDD steps are intentionally replaced with `tsc`/`check`/runtime gates because the project has no test framework (per `CLAUDE.md` and Global Constraints).
