import Image from 'next/image';

import {
  CaseStudyBackLink,
  FeatureList,
  StackTable,
} from '@/components/portfolio/case-study';
import { FreeboxArchDiagram } from '@/components/portfolio/freebox-arch-diagram';
import { Button } from '@/components/ui/button';
import {
  DisplayHeading,
  MonoTag,
  SectionLabel,
} from '@/components/ui/typography';

const STACK_ROWS: { layer: string; tech: string }[] = [
  { layer: 'Frontend', tech: 'Next.js 16 App Router · React 19 · TypeScript' },
  { layer: 'Styling', tech: 'Tailwind CSS v4 · shadcn/ui · Radix primitives' },
  { layer: 'State', tech: 'Redux Toolkit · RTK Query (API caching)' },
  { layer: 'Backend', tech: 'Next.js API routes · Prisma 7 ORM' },
  { layer: 'Database', tech: 'PostgreSQL' },
  { layer: 'Auth', tech: 'NextAuth.js · Google OAuth · Prisma adapter' },
  { layer: 'Media', tech: 'Cloudinary (uploads + transforms)' },
  { layer: 'Deploy', tech: 'Vercel' },
];

const FEATURES: string[] = [
  'Google OAuth sign-in with profile picture auto-population',
  'Drag-and-drop image uploads optimized via Cloudinary',
  'Item lifecycle: AVAILABLE → PENDING → TAKEN',
  'Interest system — poster picks among interested users',
  'User dashboard with posted items and expressed interests',
  'Location-aware pickup addresses with coordinates',
  'Light, dark, and system theme via next-themes',
  'RTK Query caching with automatic refetch on focus',
];

const META_CHIPS = ['Web', 'Marketplace', 'Postgres + Prisma', 'Open source'];

export function FreeboxDetail() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-20 md:px-12">
      <CaseStudyBackLink />

      <div className="ar-fade-up mb-16 flex flex-wrap items-start gap-12 [animation-delay:0.15s]">
        <div className="min-w-[280px] flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <DisplayHeading className="[font-size:clamp(2.5rem,5vw,3.5rem)]">
              Freebox
            </DisplayHeading>
            <MonoTag>2025</MonoTag>
          </div>

          <p className="mb-6 max-w-lg font-mono text-[15px] text-foreground leading-relaxed">
            A community marketplace for giving away free items —{' '}
            <span className="text-primary">interest-based claims</span> keep
            distribution fair, posters pick recipients, and the whole flow runs
            on Next.js + Prisma + Cloudinary.
          </p>

          <p className="mb-7 max-w-lg font-mono text-muted-foreground text-xs leading-loose">
            Items move through an AVAILABLE → PENDING → TAKEN lifecycle. RTK
            Query caches API responses for snappy navigation, NextAuth handles
            Google sign-in, and Cloudinary stores optimized photos with
            drag-and-drop uploads from the post-an-item flow.
          </p>

          <div className="mb-7 flex flex-wrap gap-1.5">
            {META_CHIPS.map(tag => (
              <MonoTag key={tag}>{tag}</MonoTag>
            ))}
          </div>

          <Button
            render={
              <a
                href="https://github.com/arasfeld/freebox"
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
                src="/freebox-light.webp"
                alt="Freebox marketplace — available items grid, light theme"
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover dark:hidden"
              />
              <Image
                src="/freebox-dark.webp"
                alt="Freebox marketplace — available items grid, dark theme"
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
          NextAuth + the Prisma adapter handle session persistence. Items move
          through a state machine: a poster lists an item, interested users tap
          in, and the poster selects a recipient — flipping the item to PENDING
          and then TAKEN on hand-off. RTK Query caches API responses, Cloudinary
          hosts photos, and Postgres backs everything via Prisma.
        </p>
        <FreeboxArchDiagram />
      </div>

      <div className="ar-fade-up mb-14 [animation-delay:0.4s]">
        <SectionLabel
          comment="stack"
          heading="Tech Stack"
          color="accent"
          headingClassName="text-base md:text-lg"
        />
        <StackTable rows={STACK_ROWS} />
      </div>

      <div className="ar-fade-up [animation-delay:0.5s]">
        <SectionLabel
          comment="features"
          heading="Key Features"
          color="accent"
          headingClassName="text-base md:text-lg"
        />
        <FeatureList items={FEATURES} color="accent" />
      </div>
    </div>
  );
}
