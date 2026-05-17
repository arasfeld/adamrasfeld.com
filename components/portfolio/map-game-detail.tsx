import Image from 'next/image';
import Link from 'next/link';

import { MapGameArchDiagram } from '@/components/portfolio/map-game-arch-diagram';
import { Button } from '@/components/ui/button';
import {
  Comment,
  DisplayHeading,
  MonoTag,
  SectionLabel,
} from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const STACK_ROWS: { layer: string; tech: string }[] = [
  { layer: 'Frontend', tech: 'Next.js 16 App Router · React 19 · TypeScript' },
  {
    layer: 'Styling',
    tech: 'Tailwind CSS v4 · shadcn/ui · Radix · next-themes',
  },
  { layer: 'Icons', tech: 'lucide-react' },
  { layer: 'Maps', tech: 'Pure SVG paths — no external map library' },
  { layer: 'Interaction', tech: 'react-zoom-pan-pinch (pan + zoom)' },
  { layer: 'Data', tech: 'Static Region[] arrays · client-only, no API' },
  { layer: 'Build', tech: 'pnpm · Next 16 turbopack' },
];

const FEATURES: string[] = [
  'Six game modes — US states, Europe, Africa, Asia, North America, South America',
  'Random region queue — skip moves the target to the back of the queue',
  'Color-graded attempt feedback (green / yellow / orange / red)',
  'Timer plus per-region attempt counter in the results dialog',
  'Pinch and scroll zoom on mobile and trackpad',
  'Per-mode settings — e.g. Asia toggle for "Show Disputed Territories"',
  'Dark, light, and system theme toggle',
];

const META_CHIPS = ['Web', 'Six regions', 'Pure SVG', 'Work in progress'];

export function MapGameDetail() {
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
              Map Game
            </DisplayHeading>
            <span className="inline-flex items-center rounded-sm border border-syntax-yellow/40 bg-syntax-yellow/10 px-2 py-0.5 font-mono text-[9px] text-syntax-yellow tracking-wide">
              wip
            </span>
            <MonoTag>2025</MonoTag>
          </div>

          <p className="mb-6 max-w-lg font-mono text-[15px] text-foreground leading-relaxed">
            A click-based geography quiz across six regions with{' '}
            <span className="text-primary">color-graded feedback</span> — green
            on first try, escalating to red as you miss.
          </p>

          <p className="mb-7 max-w-lg font-mono text-muted-foreground text-xs leading-loose">
            No map library — every region is a pure SVG path, shuffled into a
            queue at game start. Correct answers pop the queue; wrong or skipped
            answers go to the back and bump the region&apos;s color toward red.
            react-zoom-pan-pinch handles pan and zoom on mobile and trackpad.
          </p>

          <div className="mb-7 flex flex-wrap gap-1.5">
            {META_CHIPS.map(tag => (
              <MonoTag key={tag}>{tag}</MonoTag>
            ))}
          </div>

          <Button
            render={
              <a
                href="https://github.com/arasfeld/map-game"
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
            <div className="relative aspect-video">
              <Image
                src="/map-game-light.webp"
                alt="Map Game — US states quiz, light theme"
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover dark:hidden"
              />
              <Image
                src="/map-game-dark.webp"
                alt="Map Game — US states quiz, dark theme"
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
          color="accent"
          headingClassName="text-base md:text-lg"
        />
        <p className="mb-6 max-w-2xl font-mono text-muted-foreground text-xs leading-loose">
          Each game mode exports a Region[] of{' '}
          <code className="rounded-sm border border-border bg-card px-1.5 py-px font-mono text-[10px] text-foreground">
            {'{ id, name, abbreviation, svgPath }'}
          </code>{' '}
          consumed by a shared useMapGame hook. The hook shuffles regions into a
          queue at start: a correct click pops the head, a wrong or skipped one
          rotates it to the tail and increments its attempt count. Color
          intensity is a function of attempts — first-try green, mid-difficulty
          yellow/orange, hard red — so the finished map doubles as a heatmap of
          your weak spots.
        </p>
        <MapGameArchDiagram />
      </div>

      <div className="ar-fade-up mb-14 [animation-delay:0.4s]">
        <SectionLabel
          comment="stack"
          heading="Tech Stack"
          color="accent"
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
          color="accent"
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
                className="mt-px flex-shrink-0 font-mono text-primary text-xs"
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
