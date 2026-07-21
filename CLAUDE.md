# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**. Git hooks are managed by **lefthook** (auto-installed via `prepare`).

```bash
pnpm dev              # next dev — local dev server on :3000
pnpm build            # next build — production build
pnpm start            # next start — serve the production build
pnpm lint             # biome lint (read-only)
pnpm lint:fix         # biome lint --write
pnpm format           # biome format --write
pnpm check            # biome check (lint + format + import organization)
pnpm check:fix        # biome check --write — what pre-commit runs
pnpm tsc --noEmit     # type-check — what pre-push runs
```

Lefthook automation (defined in `lefthook.yml`):
- **pre-commit**: runs `biome check --write --staged` on staged JS/TS/JSON/CSS files and re-stages fixes.
- **pre-push**: runs `pnpm tsc --noEmit`.

There is no test suite or test runner configured.

## Stack & Conventions

- **Next.js 16** App Router, **React 19**, TypeScript strict mode.
- **Tailwind v4** via `@tailwindcss/postcss` — no `tailwind.config.*`. Design tokens are declared inline in `app/globals.css` using `@theme inline` and CSS variables. Theme switching uses `.dark` selector (driven by `next-themes`) plus the `@custom-variant dark` directive.
- **Biome** replaces ESLint + Prettier. Notable rules:
  - Sorted Tailwind classes are enforced on `className`/`class` and on the `clsx`, `cva`, `cn`, `tw`, `twMerge` function calls (`useSortedClasses` with safe autofix).
  - `useImportType` / `useExportType` are errors — use `import type` / `export type` for type-only imports/exports.
  - `useSelfClosingElements` is enforced.
  - `components/ui/**` has relaxed a11y + `noExplicitAny` overrides (these files are generated/curated, don't fight the rule).
- **Path alias**: `@/*` resolves from the project root (not `src/`). E.g. `@/components/header`, `@/lib/utils`.
- **shadcn** is configured (`components.json`) with style `base-vega` and `baseColor: neutral`. Components are added to `components/ui/`. This project uses **`@base-ui/react`** (Base UI by the Floating UI team) — not Radix. When wiring a Base UI primitive into a `Link` or other custom element, use its `render` prop (e.g. `<Button render={<Link href="…" />}>` and `<DropdownMenuTrigger render={<Button … />}>`), not `asChild`.
- **Icon library**: `lucide-react`.
- **Fonts**: `JetBrains_Mono` is loaded via `next/font/google` in `app/layout.tsx` and exposed as `--font-jetbrains-mono`. It backs both `--font-sans` and `--font-mono`, and `body` is `font-mono` — the whole site is monospaced by design.
- **`cn`** helper lives in `lib/utils.ts` (`clsx` + `tailwind-merge`).

## Design System

The site is built around a **code-editor aesthetic** using the Atom One Light/Dark color palette. The conventions show up in two places:

1. **CSS tokens** (`app/globals.css`): `--syntax-{green,red,yellow,purple,cyan,orange}`, plus app tokens like `--foreground-bright`, `--border-soft`, `--surface-hover`. These are exposed as Tailwind utilities (e.g. `text-syntax-green`, `bg-surface-hover`).
2. **Typography primitives** (`components/ui/typography.tsx`): `Comment` (renders `// foo` in a syntax color), `SectionLabel` (the dominant kicker-comment + heading pattern, used on every page), `DisplayHeading` (clamp-scaled mono page H1), `MonoTag` (small bordered chip). Re-use these instead of hand-rolling matching markup.

Custom keyframes (`ar-fade-up`, `ar-blink`, `ar-eq-bar`, `ar-ping`, `ar-check`) live in `globals.css` and are applied via the matching utility classes. The home page staggers `[animation-delay:…]` on `.ar-fade-up` blocks for the entrance.

## Architecture

### Content as data

Page content is hard-coded TypeScript, not pulled from a CMS:
- `lib/about-data.ts` — `ABOUT`, `JOURNEY` (work history, used by home/portfolio), `EDUCATION`, `SKILL_GROUPS`, `VALUES`, `INTERESTS` (personal/about-me interests), plus the `skillCategoryColor` mapping that ties skill categories to syntax color tokens. Shared by home and about pages.
- `lib/portfolio-data.ts` — `PROJECTS` array (typed by `types/portfolio.ts`), plus `getProject(slug)` and `getDetailSlugs()` helpers.

When adding or editing project listings/jobs/skills, edit these data files; the rendering pages will pick them up automatically.

### Portfolio detail pages

`app/portfolio/[slug]/page.tsx` looks up the project, then renders a detail component from a manually-maintained `DETAIL_COMPONENTS` registry. To add a new detail page:
1. Set `hasDetail: true` in the project's entry in `lib/portfolio-data.ts`.
2. Create a component under `components/portfolio/<slug>-detail.tsx`.
3. Register it in `DETAIL_COMPONENTS` in `app/portfolio/[slug]/page.tsx`.

`generateStaticParams` is driven by `getDetailSlugs()`, so the SSG params follow `hasDetail` automatically.

Detail pages share `CaseStudyBackLink`, `StackTable`, and `FeatureList` from `components/portfolio/case-study.tsx` — use them instead of hand-rolling the back-link header, striped stack table, or ✓-feature grid. Heroes and prose stay bespoke per project.

### Music page (Last.fm + Spotify)

`/music` is a **Last.fm** dashboard rendered server-side. `lib/lastfm.ts` wraps the Last.fm API (`LASTFM_API_KEY`/`LASTFM_USERNAME`) with per-call `revalidate` windows and **fails soft** — every function returns `null`/empty on error so a Last.fm outage degrades sections instead of erroring the page. `app/music/page.tsx` streams each section through its own `Suspense` boundary (skeletons in `components/music/music-skeletons.tsx`); the time-range switches are the shared `QueryToggle` (`components/query-toggle.tsx`), which reflects selection into URL search params.

Spotify is kept for two things only:
- **Now playing**: `lib/spotify-hooks.ts` (`useCurrentlyPlaying`, SWR, 30s polling) → `app/api/spotify/currently-playing`. Never call Spotify hosts from the client — go through `/api/spotify/*` so credentials stay server-side.
- **Artist art enrichment**: `lib/spotify.ts` `searchArtistImage` (via `lib/album-art.ts`) fills in images Last.fm doesn't provide. It fails soft to `undefined` — art is decorative and must never take a section down.

`lib/spotify.ts` exchanges the long-lived `SPOTIFY_REFRESH_TOKEN` for an access token, cached via `fetch({ next: { revalidate: 3300 } })`. The one-time `/api/spotify/login` → `/api/spotify/callback` flow (see README) mints the refresh token; both routes **404 in production** and verify OAuth `state` via an httpOnly cookie — they're local-setup only.

### Games page (Steam)

`/games` mirrors the music-page pattern: `lib/steam.ts` wraps the Steam Web API (`STEAM_API_KEY`/`STEAM_ID`, vanity names resolved via ResolveVanityURL) through a single fail-soft `steamFetch`, and `app/games/page.tsx` streams sections through `Suspense` (skeletons in `components/games/games-skeletons.tsx`). `lib/games-data.ts` holds the curated `COMPLETIONIST_SHOWCASE` appids and `STEAM_TOTALS`. The page deliberately omits live presence (online/in-game state). Shared formatters (`fmtNum`, `fmtHours`, `fmtRelative`, …) live in `lib/format.ts`; art thumbnails with gradient fallbacks share `components/art-image.tsx` (wrapped by `components/games/game-art.tsx` and `components/music/music-art.tsx`).

### Contact form

`app/api/contact/route.ts` uses **Resend** (`RESEND_API_KEY`) to email submissions. The route layers several silent bot checks before sending — honeypot (`website` field), gibberish detection (`hasLongContinuousStrings`), spammy TLD list, spammy keyword list, and a User-Agent sniff. **All bot rejections return `200 OK` with a fake success message**; don't "fix" that by returning an error — it's intentional to deny bots feedback. Validation uses **Zod 4** (`z.email(...)` etc.).

### SEO / structured data

`lib/structured-data.ts` centralizes all schema.org JSON-LD payloads (Person, WebSite, WebPage, AboutPage, ContactPage, CollectionPage for portfolio). Use `stringifyJsonLd(data)` — it escapes `<` to `<` for XSS-safe inline injection — and inject via `<script type="application/ld+json" dangerouslySetInnerHTML={…} />` (see `app/layout.tsx`). `app/opengraph-image.tsx` provides the OG image via `@vercel/og`. `app/sitemap.ts` and `app/robots.ts` produce their respective routes.

The root `metadata` in `app/layout.tsx` defines the `title.template`, OpenGraph defaults, and Twitter card. Page-level files should export their own `metadata` (static) or `generateMetadata` (dynamic, async) to override.

### Theming

`ThemeProvider` from `next-themes` is mounted in `app/layout.tsx` with `attribute="class"`, `defaultTheme="system"`, `disableTransitionOnChange`. The `<html>` element gets `suppressHydrationWarning` because `next-themes` mutates `class` before hydration. Don't read `theme` synchronously in SSR — gate on `useEffect` / mounted state.

## Environment

Required env vars (see `.env.example`):
- `RESEND_API_KEY` — contact form delivery.
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`, `SPOTIFY_REFRESH_TOKEN` — now-playing + artist art.
- `LASTFM_API_KEY`, `LASTFM_USERNAME` — music page data.
- `STEAM_API_KEY`, `STEAM_ID` — games page data (SteamID64 or vanity name).

`next.config.ts` allowlists external image hosts via `images.remotePatterns` (`i.scdn.co` for Spotify art, `lastfm.freetls.fastly.net` for Last.fm, `**.steamstatic.com`/`media.steampowered.com` for Steam). Add new hosts there before using them with `next/image`.
