import Image from 'next/image';
import Link from 'next/link';

import { RazzifyArchDiagram } from '@/components/portfolio/razzify-arch-diagram';
import { Button } from '@/components/ui/button';
import {
  Comment,
  DisplayHeading,
  MonoTag,
  SectionLabel,
} from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const STACK_ROWS: { layer: string; tech: string }[] = [
  { layer: 'Frontend', tech: 'React 19 · TypeScript' },
  { layer: 'Components', tech: 'Mantine UI · Lucide icons' },
  { layer: 'State', tech: 'Redux Toolkit · RTK Query · Redux Persist' },
  { layer: 'Auth', tech: 'Spotify OAuth 2.0 · singleton token-refresh layer' },
  {
    layer: 'Player',
    tech: 'Spotify Web Playback SDK · device_id management',
  },
  { layer: 'Data', tech: 'Spotify Web API (REST) via RTK Query' },
  { layer: 'Bundler', tech: 'Vite · Vitest' },
  { layer: 'Shell', tech: 'Tauri 2 (Rust backend) — small native binary' },
];

const FEATURES: string[] = [
  'OAuth sign-in with refresh tokens persisted across restarts',
  'Top tracks and artists with 4-week / 6-month / all-time filter',
  'Recently played timeline',
  'In-app playback — play, pause, skip, seek via the Playback SDK',
  'Playlist browsing with drill-in to full track listings',
  'Album and artist detail pages',
  'New releases and discovery feed',
  'Theme and accent color customizer',
  'Native window via Tauri — tiny binary compared to Electron',
];

const META_CHIPS = [
  'Desktop',
  'macOS · Windows · Linux',
  'Rust + React',
  'Open source',
];

export function RazzifyDetail() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-20 md:px-12">
      <div className="ar-fade-up mb-9 flex items-center gap-2">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← portfolio
        </Link>
        <span className="text-border">·</span>
        <Comment className="!text-[11px]">case study</Comment>
      </div>

      <div className="ar-fade-up mb-16 flex flex-wrap items-start gap-12 [animation-delay:0.15s]">
        <div className="min-w-[280px] flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <DisplayHeading className="[font-size:clamp(2.5rem,5vw,3.5rem)]">
              Razzify
            </DisplayHeading>
            <MonoTag>2025</MonoTag>
          </div>

          <p className="mb-6 max-w-lg font-mono text-[15px] text-foreground leading-relaxed">
            A native-feeling Spotify desktop client packaged with{' '}
            <span className="text-syntax-purple">Tauri 2</span> — Rust shell,
            React UI, Web Playback SDK for in-app device control.
          </p>

          <p className="mb-7 max-w-lg font-mono text-muted-foreground text-xs leading-loose">
            The Web API powers library and discovery; the Web Playback SDK runs
            in-process for native playback. A singleton token-refresher
            collapses concurrent 401s into a single in-flight refresh, so
            playback never stutters mid-track. Migrated from Electron to Tauri
            for a much smaller binary.
          </p>

          <div className="mb-7 flex flex-wrap gap-1.5">
            {META_CHIPS.map(tag => (
              <MonoTag key={tag}>{tag}</MonoTag>
            ))}
          </div>

          <Button
            render={
              <a
                href="https://github.com/arasfeld/razzify"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            variant="outline"
            size="default"
          >
            ⬡ view on github
          </Button>
        </div>

        <div className="mx-auto w-full max-w-[420px] flex-shrink-0 lg:mx-0">
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-md">
            <div className="flex items-center gap-1 border-border border-b bg-background/60 px-2 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/35" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="relative aspect-[16/10]">
              <Image
                src="/razzify-light.png"
                alt="Razzify desktop client — playlist view, light theme"
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover dark:hidden"
              />
              <Image
                src="/razzify-dark.png"
                alt="Razzify desktop client — playlist view, dark theme"
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="hidden object-cover dark:block"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ar-fade-up mb-14 [animation-delay:0.3s]">
        <SectionLabel
          comment="architecture"
          heading="How It Works"
          color="purple"
          headingClassName="text-base md:text-lg"
        />
        <p className="mb-6 max-w-2xl font-mono text-muted-foreground text-xs leading-loose">
          Tauri 2 wraps the React app in a Rust shell that opens a native window
          and handles IPC. The Spotify Web API (queries, library, discovery) is
          consumed via RTK Query for caching and dedupe; the Web Playback SDK
          runs in-process to register a device, receive state events, and
          forward playback controls. A single token-refresh singleton serializes
          401 recovery so simultaneous failing requests share one refresh.
        </p>
        <RazzifyArchDiagram />
      </div>

      <div className="ar-fade-up mb-14 [animation-delay:0.4s]">
        <SectionLabel
          comment="stack"
          heading="Tech Stack"
          color="purple"
          headingClassName="text-base md:text-lg"
        />
        <div className="overflow-hidden border border-border">
          {STACK_ROWS.map((row, i) => (
            <div
              key={row.layer}
              className={cn(
                'grid grid-cols-[110px_1fr] gap-6 px-4 py-3',
                i < STACK_ROWS.length - 1 && 'border-border border-b',
                i % 2 === 1 && 'bg-card/60'
              )}
            >
              <div className="pt-px font-mono text-[10px] text-muted-foreground">
                {row.layer}
              </div>
              <div className="font-mono text-[11px] text-foreground">
                {row.tech}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ar-fade-up [animation-delay:0.5s]">
        <SectionLabel
          comment="features"
          heading="Key Features"
          color="purple"
          headingClassName="text-base md:text-lg"
        />
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {FEATURES.map(feature => (
            <div
              key={feature}
              className="flex items-start gap-3 border-border border-b py-3"
            >
              <span
                aria-hidden="true"
                className="mt-px flex-shrink-0 font-mono text-syntax-purple text-xs"
              >
                ✓
              </span>
              <span className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
