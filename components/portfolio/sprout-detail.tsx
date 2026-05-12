import Link from 'next/link';

import { SproutArchDiagram } from '@/components/portfolio/sprout-arch-diagram';
import { SproutPhoneMockup } from '@/components/portfolio/sprout-phone-mockup';
import { Button } from '@/components/ui/button';
import {
  Comment,
  DisplayHeading,
  MonoTag,
  SectionLabel,
} from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const STACK_ROWS: { layer: string; tech: string }[] = [
  { layer: 'Mobile', tech: 'Expo SDK 55 · React Native 0.83 · React 19' },
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

        <div className="mx-auto flex-shrink-0 lg:mx-0">
          <SproutPhoneMockup />
        </div>
      </div>

      {/* Architecture */}
      <div className="ar-fade-up mb-14 [animation-delay:0.3s]">
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
      <div className="ar-fade-up mb-14 [animation-delay:0.4s]">
        <SectionLabel
          comment="stack"
          heading="Tech Stack"
          color="green"
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

      {/* Features */}
      <div className="ar-fade-up [animation-delay:0.5s]">
        <SectionLabel
          comment="features"
          heading="Key Features"
          color="green"
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
                className="mt-px flex-shrink-0 font-mono text-syntax-green text-xs"
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
