import Image from 'next/image';

import {
  CaseStudyBackLink,
  FeatureList,
  StackTable,
} from '@/components/portfolio/case-study';
import { SproutArchDiagram } from '@/components/portfolio/sprout-arch-diagram';
import { Button } from '@/components/ui/button';
import {
  Comment,
  DisplayHeading,
  MonoTag,
  SectionLabel,
} from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface PhoneFrameProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  sizes: string;
  className?: string;
}

function PhoneFrame({
  lightSrc,
  darkSrc,
  alt,
  sizes,
  className,
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[26px] border border-border bg-card shadow-md',
        className
      )}
    >
      <div className="relative aspect-[693/1500]">
        <Image
          src={lightSrc}
          alt={`${alt} — light theme`}
          fill
          sizes={sizes}
          className="object-cover dark:hidden"
        />
        <Image
          src={darkSrc}
          alt={`${alt} — dark theme`}
          fill
          sizes={sizes}
          className="hidden object-cover dark:block"
        />
      </div>
    </div>
  );
}

const STACK_ROWS: { layer: string; tech: string }[] = [
  { layer: 'Mobile', tech: 'Expo SDK 54 · React Native 0.81 · React 19' },
  { layer: 'Language', tech: 'TypeScript (strict mode)' },
  { layer: 'Routing', tech: 'Expo Router (file-based)' },
  { layer: 'Local DB', tech: 'expo-sqlite + Drizzle ORM' },
  { layer: 'Sync', tech: 'Custom lightweight sync engine (push/pull)' },
  { layer: 'Backend', tech: 'Supabase — Postgres, Auth, Storage, Realtime' },
  { layer: 'State', tech: 'TanStack Query (mutations + loading state)' },
  { layer: 'Monorepo', tech: 'Turborepo + pnpm workspaces' },
];

const FEATURES: string[] = [
  'Offline-first — reads always from SQLite, no spinner on data load',
  'One continuous timeline per child regardless of caregiver',
  'Role-based access: parent, caregiver, admin, org staff',
  'Event types: naps, meals, diapers, notes, messages',
  'Visibility controls: all / parents-only / org-only',
  'Automatic conflict resolution via last-write-wins on updated_at',
  'Sync activates on sign-in; app is fully usable offline without auth',
  'Photo uploads via Supabase Storage',
  'Real-time live updates via Supabase Realtime (in roadmap)',
  'Cross-platform — iOS + Android from single codebase',
];

const META_CHIPS = ['iOS', 'Android', 'Offline-first', 'Open source'];

export function SproutDetail() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-20 md:px-12">
      {/* Back link */}
      <CaseStudyBackLink />

      {/* Hero */}
      <div className="ar-fade-up mb-16 flex flex-wrap items-start gap-12 [animation-delay:0.15s]">
        <div className="min-w-[280px] flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <DisplayHeading className="[font-size:clamp(2.5rem,5vw,3.5rem)]">
              Sprout
            </DisplayHeading>
            <span className="inline-flex items-center rounded-sm border border-syntax-green/40 bg-syntax-green/10 px-2 py-0.5 font-mono text-[9px] text-syntax-green tracking-wide">
              active
            </span>
            <MonoTag>2025</MonoTag>
          </div>

          <p className="mb-6 max-w-lg font-mono text-[15px] text-foreground leading-relaxed">
            A cross-platform childcare tracking system for parents, caregivers,
            and daycares — built around the principle that{' '}
            <span className="text-primary">
              a child has one continuous timeline
            </span>
            .
          </p>

          <p className="mb-7 max-w-lg font-mono text-muted-foreground text-xs leading-loose">
            Whether you&apos;re a single parent logging naps at home, co-parents
            sharing a day across schedules, or daycare staff recording events
            during care hours — Sprout unifies it all into one timeline. Context
            changes; data persists.
          </p>

          <div className="mb-7 flex flex-wrap gap-1.5">
            {META_CHIPS.map(tag => (
              <MonoTag key={tag}>{tag}</MonoTag>
            ))}
          </div>

          <Button
            render={
              <a
                href="https://github.com/arasfeld/sprout"
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

        <PhoneFrame
          lightSrc="/sprout-home-light.webp"
          darkSrc="/sprout-home-dark.webp"
          alt="Sprout — home with quick actions"
          sizes="240px"
          className="mx-auto w-[240px] flex-shrink-0 lg:mx-0"
        />
      </div>

      {/* App showcase */}
      <div className="ar-fade-up mb-14 [animation-delay:0.25s]">
        <SectionLabel
          comment="app"
          heading="Two Views Of The Day"
          color="green"
          headingClassName="text-base md:text-lg"
        />
        <p className="mb-8 max-w-2xl font-mono text-muted-foreground text-xs leading-loose">
          Caregivers log events from the home grid. The same events flow into a
          continuous calendar timeline you can scrub by day, and a date-grouped
          list for at-a-glance review — same data, two lenses.
        </p>
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 sm:gap-10">
          <div className="flex flex-col items-center gap-3">
            <PhoneFrame
              lightSrc="/sprout-timeline-light.webp"
              darkSrc="/sprout-timeline-dark.webp"
              alt="Sprout — timeline calendar view"
              sizes="(min-width: 640px) 240px, 40vw"
              className="w-full"
            />
            <Comment className="!text-[10px]">timeline</Comment>
          </div>
          <div className="flex flex-col items-center gap-3">
            <PhoneFrame
              lightSrc="/sprout-list-light.webp"
              darkSrc="/sprout-list-dark.webp"
              alt="Sprout — list view grouped by date"
              sizes="(min-width: 640px) 240px, 40vw"
              className="w-full"
            />
            <Comment className="!text-[10px]">list</Comment>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="ar-fade-up mb-14 [animation-delay:0.35s]">
        <SectionLabel
          comment="architecture"
          heading="How It Works"
          color="green"
          headingClassName="text-base md:text-lg"
        />
        <p className="mb-6 max-w-2xl font-mono text-muted-foreground text-xs leading-loose">
          No custom API server. Clients talk directly to Supabase with
          authorization enforced at the database level via Postgres Row Level
          Security. The mobile app is offline-first — all reads and writes go
          through a local SQLite database synced by a lightweight engine.
        </p>
        <SproutArchDiagram />
      </div>

      {/* Tech stack */}
      <div className="ar-fade-up mb-14 [animation-delay:0.45s]">
        <SectionLabel
          comment="stack"
          heading="Tech Stack"
          color="green"
          headingClassName="text-base md:text-lg"
        />
        <StackTable rows={STACK_ROWS} />
      </div>

      {/* Features */}
      <div className="ar-fade-up [animation-delay:0.55s]">
        <SectionLabel
          comment="features"
          heading="Key Features"
          color="green"
          headingClassName="text-base md:text-lg"
        />
        <FeatureList items={FEATURES} />
      </div>
    </div>
  );
}
