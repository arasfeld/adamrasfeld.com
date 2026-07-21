import Image from 'next/image';

import {
  CaseStudyBackLink,
  FeatureList,
  StackTable,
} from '@/components/portfolio/case-study';
import { FluxArchDiagram } from '@/components/portfolio/flux-arch-diagram';
import { Button } from '@/components/ui/button';
import {
  Comment,
  DisplayHeading,
  MonoTag,
  SectionLabel,
} from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const STACK_ROWS: { layer: string; tech: string }[] = [
  { layer: 'Frontend', tech: 'Expo SDK 54 · React Native 0.81 · React 19' },
  { layer: 'Language', tech: 'TypeScript (strict mode)' },
  {
    layer: 'Routing',
    tech: 'Expo Router (file-based) · Stack + Tab navigation',
  },
  { layer: 'Styling', tech: 'HeroUI Native · Uniwind (Tailwind v4 universal)' },
  { layer: 'State', tech: 'Redux Toolkit · async thunks · custom hooks' },
  { layer: 'Local DB', tech: 'AsyncStorage via StorageService singleton' },
  {
    layer: 'Date utils',
    tech: 'date-fns · @react-native-community/datetimepicker',
  },
  { layer: 'Feedback', tech: 'Expo Notifications · Expo Haptics' },
  { layer: 'Build', tech: 'Expo CLI · Metro · EAS Build' },
];

const FEATURES: string[] = [
  'Track multiple vices, each with its own color and start date',
  'Days-sober counter auto-calculated from the start date',
  'Daily check-ins with mood sentiment and optional notes',
  'Off-days log a relapse without resetting your main streak',
  'Per-vice streak counter plus longest-streak tracking',
  'Tiered achievement badges — common, rare, epic, legendary',
  'Calendar heatmap visualizes check-in density over time',
  'Stats tab: longest streaks, badge progress, check-in counts',
  'Light / dark theme with six customizable accent colors',
  'iPad-optimized layout with capped content width',
];

const META_CHIPS = [
  'iOS · Android · Web',
  'Offline-first',
  'Local-only data',
  'Open source',
];

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

export function FluxDetail() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-20 md:px-12">
      <CaseStudyBackLink />

      <div className="ar-fade-up mb-16 flex flex-wrap items-start gap-12 [animation-delay:0.15s]">
        <div className="min-w-[280px] flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <DisplayHeading className="[font-size:clamp(2.5rem,5vw,3.5rem)]">
              Flux
            </DisplayHeading>
            <span className="inline-flex items-center rounded-sm border border-syntax-green/40 bg-syntax-green/10 px-2 py-0.5 font-mono text-[9px] text-syntax-green tracking-wide">
              active
            </span>
            <MonoTag>2025</MonoTag>
          </div>

          <p className="mb-6 max-w-lg font-mono text-[15px] text-foreground leading-relaxed">
            A cross-platform sobriety tracker for any number of vices —{' '}
            <span className="text-syntax-green">
              streaks, mood-tagged check-ins, and tiered badges
            </span>{' '}
            without giving up your data.
          </p>

          <p className="mb-7 max-w-lg font-mono text-muted-foreground text-xs leading-loose">
            No server, no account. Everything lives in AsyncStorage via a
            StorageService singleton, and Redux Toolkit thunks bridge the async
            I/O to reducers. Off-days let you log a relapse without resetting
            your main streak, and badges unlock at milestone day counts.
          </p>

          <div className="mb-7 flex flex-wrap gap-1.5">
            {META_CHIPS.map(tag => (
              <MonoTag key={tag}>{tag}</MonoTag>
            ))}
          </div>

          <Button
            render={
              <a
                href="https://github.com/arasfeld/flux"
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
          lightSrc="/flux-home-light.webp"
          darkSrc="/flux-home-dark.webp"
          alt="Flux — today view with streaks and habits"
          sizes="240px"
          className="mx-auto w-[240px] flex-shrink-0 lg:mx-0"
        />
      </div>

      <div className="ar-fade-up mb-14 [animation-delay:0.25s]">
        <SectionLabel
          comment="app"
          heading="Your Progress, Two Ways"
          color="green"
          headingClassName="text-base md:text-lg"
        />
        <p className="mb-8 max-w-2xl font-mono text-muted-foreground text-xs leading-loose">
          The calendar shows a month at a glance — color dots per habit, off
          days, and per-habit completion bars. The stats tab zooms out to streak
          history, mood distribution, and badge progress — same data, two
          lenses.
        </p>
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 sm:gap-10">
          <div className="flex flex-col items-center gap-3">
            <PhoneFrame
              lightSrc="/flux-calendar-light.webp"
              darkSrc="/flux-calendar-dark.webp"
              alt="Flux — monthly calendar with per-habit dots"
              sizes="(min-width: 640px) 240px, 40vw"
              className="w-full"
            />
            <Comment className="!text-[10px]">calendar</Comment>
          </div>
          <div className="flex flex-col items-center gap-3">
            <PhoneFrame
              lightSrc="/flux-stats-light.webp"
              darkSrc="/flux-stats-dark.webp"
              alt="Flux — stats with streak history and mood"
              sizes="(min-width: 640px) 240px, 40vw"
              className="w-full"
            />
            <Comment className="!text-[10px]">stats</Comment>
          </div>
        </div>
      </div>

      <div className="ar-fade-up mb-14 [animation-delay:0.35s]">
        <SectionLabel
          comment="architecture"
          heading="How It Works"
          color="green"
          headingClassName="text-base md:text-lg"
        />
        <p className="mb-6 max-w-2xl font-mono text-muted-foreground text-xs leading-loose">
          There is no backend. All state lives in AsyncStorage, wrapped by a
          StorageService singleton with namespaced keys. Redux Toolkit thunks
          (loadVicesFromStorage, addOffDays, removeCheckIn) handle the async
          read/write boundary; reducers stay synchronous and persist on each
          mutation. The data model includes off-days so a relapse is captured
          without losing streak history, and badge logic runs against the full
          check-in history on every change.
        </p>
        <FluxArchDiagram />
      </div>

      <div className="ar-fade-up mb-14 [animation-delay:0.45s]">
        <SectionLabel
          comment="stack"
          heading="Tech Stack"
          color="green"
          headingClassName="text-base md:text-lg"
        />
        <StackTable rows={STACK_ROWS} />
      </div>

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
