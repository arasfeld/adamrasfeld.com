# Home Page Live Dashboard — Design

**Date:** 2026-07-03
**Status:** Approved

## Summary

Replace the homepage's Work History and Skills sections with a live dashboard:
a bento grid of four tiles that surface data from the rest of the site
(Last.fm/Spotify, Steam, portfolio data, and a static status card). Tighten the
hero so the dashboard is visible near the fold. The homepage becomes a living
index of the site rather than a resume.

## Goals

- Remove the resume-flavored sections (Work History, Skills) from `/`.
- Show fresh, live content on every visit using data sources that already exist.
- Keep the code-editor aesthetic and existing design-system primitives.
- Degrade gracefully: a dead third-party API must never break the page.

## Non-goals

- No new third-party integrations (no GitHub activity, no new APIs).
- No changes to /about, /music, /games, /portfolio pages.
- No changes to the header/footer or global layout.

## Hero changes

Keep: name (`DisplayHeading`), `Typewriter` title, meta chips
(`Cincinnati · 11+ yrs experience · open to freelance`), and both CTA buttons
(`view work →`, `get in touch`).

Remove: the `ABOUT.summary` paragraph (covered by /about).

Tighten: reduce section padding (`pt-24 pb-24 md:pt-32 md:pb-32` → approx
`pt-20 pb-14 md:pt-28 md:pb-16`) and re-flow the `ar-fade-up` animation delays.

## Dashboard section

A `SectionLabel` (comment `now`, heading "What I'm Up To") above a bento grid:

- Mobile: single column.
- `lg`: 12-col grid — Music (col-span-6) + Gaming (col-span-6) on the first
  row, Featured project (col-span-7) + Currently (col-span-5) on the second.

Every tile is a bordered card (`border border-border bg-card`, hover
`hover:border-primary/60` like `ProjectCard`), with a `// comment` kicker and a
footer link (`→ music`, `→ games`, `→ case study` / `→ portfolio`,
`→ about`). The whole tile is NOT one big link; the footer link is the link
(matches ProjectCard behavior, keeps inner links possible).

### Tile 1 — Music (`// listening`, → /music)

Server component under its own `Suspense`:
- Top artist this month: `getTopArtists(RANGE_TO_PERIOD.short ≈ '1month', 1)`
  enriched via `resolveArtistImage`; render with `MusicArt` (round).
- Last scrobble: `getRecentTracks(1)` — track name, artist, relative time.
- On top, a compact now-playing client island: new `NowPlayingInline`
  component in `components/music/` reusing `useCurrentlyPlaying` (SWR, 30s) —
  renders a one-line eq-bars + track title row when live, `null` otherwise.

Fallback when Last.fm returns empty: static copy ("listening habits") with the
footer link intact.

### Tile 2 — Gaming (`// playing`, → /games)

Server component under its own `Suspense`:
- Most-played of the last 2 weeks: `getRecentlyPlayed()` sorted by
  `playtime2Weeks`; render hero game with `GameArt` capsule + "Xh past 2 wks".
- Latest achievement: `getRecentAchievements(1)` — icon, name, game.

Fallback when Steam returns empty: static copy with footer link intact.

### Tile 3 — Featured project (`// building`, → case study or /portfolio)

- Add optional `featured?: boolean` to the `Project` type
  (`types/portfolio.ts`) and set it on one entry in `lib/portfolio-data.ts`.
- Selection: first project with `featured`, else first with `hasDetail`.
- Render: light/dark screenshot (reuse the dual-`next/image` pattern; no
  `priority` on the dark variant), title, tagline, up to 4 stack chips,
  footer `→ case study` (or `→ portfolio` if no detail page).
- Static data — no Suspense needed.

### Tile 4 — Currently (`// status`, → /about, /contact)

Static card, content from `lib/about-data.ts`:
- Role line: current title/company (from `ABOUT`), location.
- Availability: "open to freelance work" with a `get in touch →` link
  to /contact.
- 2–3 interests pulled from `INTERESTS`.

## Data flow & resilience

- All lib functions already fail soft (`null`/empty on error); each live tile
  has an explicit empty-state fallback so the grid never has holes.
- Per-tile `Suspense` with small skeletons (new `components/home/`
  skeletons following `games-skeletons.tsx` conventions).
- `/` becomes a dynamic route (like /music, /games); fetch caching comes from
  the per-call `revalidate` windows already inside the lib functions.

## File plan

- `app/page.tsx` — rewrite below-hero content; remove JOURNEY/skills imports.
- `components/home/music-tile.tsx`, `game-tile.tsx`, `project-tile.tsx`,
  `status-tile.tsx`, `home-skeletons.tsx` — new.
- `components/music/now-playing-inline.tsx` — new compact client island.
- `components/experience-row.tsx` — delete (only used by home).
- `lib/about-data.ts` — remove `JOURNEY` (no remaining users).
- `types/portfolio.ts`, `lib/portfolio-data.ts` — add `featured` flag.
- `CLAUDE.md` — update "Content as data" (JOURNEY gone, featured flag) and
  note the home dashboard pattern.

## Verification

No test suite. Verify with `pnpm check`, `pnpm tsc --noEmit`, `pnpm build`,
and a manual `pnpm dev` pass over `/` (tiles render, fallbacks render when env
vars are stripped, now-playing island appears when Spotify is active).
