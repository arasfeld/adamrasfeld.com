# Music page redesign — Last.fm listening dashboard

**Date:** 2026-06-29
**Branch:** `feat/music-lastfm-dashboard`
**Status:** Approved design, pending implementation plan

## Goal

Replace the current two-column music page (`app/music/page.tsx`) with a richer
"listening dashboard" ported from the imported Claude Design prototype
(`music.html`). The prototype is a bento-style dashboard with a stats strip, an
"On Repeat" hero, top-artist badges, a top-track bar chart, a genre sound
profile, and an album-art card grid for recently played.

The prototype is driven by **mock data** with fields the Spotify Web API does
not expose (per-track/artist play counts, minutes streamed, listening totals).
We resolve this by sourcing the data-rich dashboard from **Last.fm**, which
returns real play counts, selectable periods, totals, and genre tags. Spotify is
retained **only** for the live now-playing bar.

This redesign mirrors the existing **games page** (`app/games/page.tsx`, shipped
in `c882ec8`), which is already this exact dashboard pattern. Components map
roughly 1:1, so the work is largely "mirror the games architecture against
Last.fm data."

## Data sources

### Last.fm (primary — the whole dashboard)
- Public profile, key-only REST API (no OAuth). User: `arazzy`
  (47k+ scrobbles, 2,286 artists, member since 2010).
- Methods used:
  - `user.getInfo` → total scrobbles (`playcount`), member-since year.
  - `user.getTopArtists` (period) → real `playcount` + `rank` per artist,
    plus `@attr.total` for the artist count.
  - `user.getTopTracks` (period) → real `playcount` + `rank` per track,
    plus `@attr.total` for the track count.
  - `user.getRecentTracks` → recently played scrobbles.
  - Genre tags: aggregated from `artist.getTopTags` (or `tag` data on
    top-artist objects) across top artists, weighted by playcount.
- Period mapping (design toggle → Last.fm `period`):
  `short` → `1month`, `medium` → `6month`, `long` → `overall`.

### Spotify (now-playing only)
- Existing `lib/spotify.ts` + `components/music/now-playing*` are reused
  unchanged. The `<NowPlaying>` client island still polls every 30s.
- Spotify is **also** used as the artist-art enrichment source (see below).

## New data layer

### `lib/lastfm.ts`
Mirrors `lib/spotify.ts`: server-only functions, each a REST GET with
`LASTFM_API_KEY`, cached with `next: { revalidate }` (e.g. 300s for top
lists/recent, longer for `getUserInfo`). Returns typed objects (new types under
`types/`, e.g. `LastfmArtist`, `LastfmTrack`, `LastfmUserInfo`). Each fetch
fails soft to an empty list/null so a Last.fm outage degrades gracefully rather
than throwing (same pattern as `getTopTracks` returning `[]`).

### `lib/album-art.ts`
The art resolver cascade:
1. Use the Last.fm-provided image when present and non-blank (reliable for
   **albums/tracks/recent**).
2. For **artists only** (Last.fm returns blank artist images by policy), enrich
   via a Spotify artist search (`/search?type=artist`), **deduped by artist
   name** and cached ~24h (art rarely changes).
3. Fall back to a **deterministic gradient** generated from a name hash —
   ports the prototype's `hueOf(name)` so art-less items still look
   intentional. Tracks/recent never trigger step 2.

### Env
Add to `.env.example` and README:
- `LASTFM_API_KEY` — Last.fm read key (from last.fm/api/account/create).
- `LASTFM_USERNAME` — `arazzy`.

Spotify vars stay (now-playing + art enrichment).

## Page composition (`app/music/page.tsx`)

Server component, same shape as `app/games/page.tsx`:
- Two URL search-param toggles: `?artists=` and `?tracks=` (parsed to
  `short | medium | long`, default `long`/`medium` per prototype).
- Each section wrapped in its own `<Suspense>` with a skeleton, keyed by range,
  so slow/cold sections stream independently and toggles re-suspend just their
  section.
- Spotify `<NowPlaying>` island unchanged, below the page header.
- Page `metadata` export mirrors the games page (title/description/canonical/OG).

## Modules (each mirrors an existing games component)

| Music module | Mirrors | Data |
|---|---|---|
| **Stats strip** — Scrobbles · Artists · Top genre · This week · Since 2010 | `components/games/stats-grid.tsx` | `getUserInfo` + 7-day scrobbles + top tag |
| **On Repeat hero** — #1 artist, plays, library-share %, their #1 track, heavy rotation (#2–4) | `components/games/currently-into.tsx` | Last.fm `overall` |
| **Top Artists** — badge w/ rank pip + playcount progress bar | `components/games/achievement-badge.tsx` | `getTopArtists(period)` |
| **Top Tracks** — horizontal play-count bar chart | `components/games/play-bar.tsx` | `getTopTracks(period)` |
| **Sound Profile** — stacked genre bar + legend | new (small) | tags aggregated across top artists, playcount-weighted |
| **Recently Played** — album-art card grid | `components/games/showcase-card.tsx` | `getRecentTracks` |

New/changed components live in `components/music/`:
- Add bar/badge/card/hero/stats/sound-profile components + a `format.ts`
  (`fmtNum`, etc.) mirroring `components/games/format.ts`, and a
  `music-skeletons.tsx` mirroring `games-skeletons.tsx`.
- Replace `track-row.tsx` / `artist-row.tsx` with the bar/badge versions.
- Reuse `time-range-selector.tsx`, `now-playing.tsx`, `now-playing-bar.tsx`
  as-is. Remove `components/spotify-skeletons.tsx` usage from the music page if
  no longer referenced (verify no other importers first).

### Stats strip — real-data set (approved)
Scrobbles (total `playcount`) · Artists (`@attr.total`) · Top genre (most common
tag) · This week (sum of `playcount` from `user.getTopTracks` with
`period=7day`) · Since (member-since year). The
prototype's fabricated "minutes streamed / minutes this year / hours this week"
are **dropped** — no fake numbers on the live site.

### On Repeat hero — real-data set
The prototype's three hero stats (plays / streamed / #1) become: plays
(`playcount`), library-share % (`playcount / total scrobbles`), and rank (#1).
"Their #1 track" = the user's top track whose artist matches the hero artist.

## Design-system conformance (required)

This is a hard requirement, not a nice-to-have. The redesign must read as native
to the site, following `CLAUDE.md` and the existing games/about pages:

- **Tokens only.** No hard-coded hex/hsl colors in components (the prototype's
  inline `tokens.*` styles are translated to Tailwind utilities backed by CSS
  variables). Use `text-foreground-bright`, `text-muted-foreground`,
  `border-border` / `border-border-soft`, `bg-card` / `bg-surface-hover`,
  `text-syntax-green`, `text-primary`, etc.
- **Color mapping.** Prototype `tokens.accent` (vivid) → site `--primary`
  (blue: rank badges, artist progress bars, "#1"). Prototype `tokens.green` →
  `syntax-green` (playcounts, `//` comments, now-playing eq). Sound-profile
  segments cycle the syntax palette: green, primary, purple, yellow, cyan,
  orange. Everything resolves per-theme via `.dark` automatically.
- **Typography primitives.** Reuse `Comment`, `SectionLabel`, `DisplayHeading`,
  `MonoTag` from `components/ui/typography.tsx` instead of hand-rolled markup —
  same as games/about.
- **Animations.** Reuse existing keyframe utilities (`ar-fade-up` with staggered
  `[animation-delay:…]`, `ar-ping` for the live dot, `ar-eq-bar` for now-playing)
  from `globals.css`. Do not add new keyframes unless a module genuinely needs
  one absent from both games and the prototype.
- **Mono everywhere.** Site is `font-mono` by design; keep it.
- **Biome rules.** Sorted Tailwind classes; `import type` / `export type` for
  type-only; self-closing elements. Run `pnpm check:fix` and `pnpm tsc --noEmit`
  before completion (matches pre-commit/pre-push hooks).
- **`next/image`.** Real art uses `next/image`; `i.scdn.co` is already
  allow-listed in `next.config.ts`. Add any Last.fm image host
  (`lastfm.freetls.fastly.net`) to `images.remotePatterns` before use.
- **SEO.** If the page H1/structure changes materially, keep
  `lib/structured-data.ts` / sitemap consistent (music route already present).

## Performance

- All Last.fm + art-enrichment requests are **server-side** and cached
  (`revalidate`); nothing extra runs in the browser beyond the existing
  now-playing poll.
- Sections fetch in parallel and stream via `<Suspense>`; a cold art lookup
  never blocks the rest of the page.
- Artist-art enrichment is deduped by name (~8–12 unique lookups across all
  sections) and cached ~24h, so it is near-free after warm-up.

## Out of scope

- No Last.fm OAuth, scrobbling, or writes.
- No Spotify changes beyond reuse for now-playing + artist-art search.
- No blanket Spotify enrichment of tracks/albums (Last.fm already has that art).
- Unrelated refactors.

## Acceptance criteria

- `/music` renders the six modules with live Last.fm data, in both light/dark.
- Period toggles re-suspend only their section and reflect Last.fm periods.
- Now-playing bar still works (Spotify).
- Real artist photos appear where Spotify search resolves them; gradients
  elsewhere; no broken images.
- No fabricated numbers shown.
- `pnpm check` and `pnpm tsc --noEmit` pass.
- Graceful empty/degraded states when Last.fm returns nothing.
