import type { Metadata } from 'next';
import Image from 'next/image';

import {
  Comment,
  DisplayHeading,
  SectionLabel,
} from '@/components/ui/typography';
import {
  ABOUT,
  EDUCATION,
  JOURNEY,
  SKILL_GROUPS,
  skillCategoryColor,
  VALUES,
} from '@/lib/about-data';
import { aboutStructuredData, stringifyJsonLd } from '@/lib/structured-data';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Adam Rasfeld - Full Stack Developer',
  description:
    'Learn about Adam Rasfeld, a passionate Full Stack Developer with 11+ years of experience. From Miami University to leading enterprise applications, discover his journey in software development.',
  alternates: {
    canonical: 'https://adamrasfeld.com/about',
  },
  openGraph: {
    title: 'About Adam Rasfeld - Full Stack Developer',
    description:
      'Learn about Adam Rasfeld, a passionate Full Stack Developer with 11+ years of experience.',
    url: 'https://adamrasfeld.com/about',
  },
  twitter: {
    title: 'About Adam Rasfeld - Full Stack Developer',
    description:
      'Learn about Adam Rasfeld, a passionate Full Stack Developer with 11+ years of experience.',
  },
};

const SYNTAX_TEXT_CLASS: Record<string, string> = {
  yellow: 'text-syntax-yellow',
  accent: 'text-primary',
  red: 'text-syntax-red',
  green: 'text-syntax-green',
  purple: 'text-syntax-purple',
};

const BACKGROUND_PARAGRAPHS: string[] = [
  `My path in software started at Miami University where I earned a B.S. in Computer Science. First job out of school was at RoviSys — enterprise automation, WinForms to WPF migrations, AutoCAD SDK integrations. Good foundation in writing systems that run in environments where "it crashed" has real consequences.`,
  'Kroger Digital was where I got a taste of scale. Consumer-facing e-commerce means your bug affects a few million people. I consolidated a fragmented repo structure into a Lerna monorepo, drove test coverage past 90%, and rebuilt auth flows to WCAG standards — learned a lot about what it means to care about quality.',
  'At Divisions Maintenance Group I went deep on mobile for the first time — React Native, a native module to get gRPC working on iOS and Android, and a Kafka migration from a service-bus system. At Upstart as SE IV I led the decomposition of a Rails monolith into Kafka-backed microservices, defined data ownership across teams, and built keyset-paginated reporting APIs.',
  'At Seamless.AI I worked on sales-engagement platforms and Chrome extensions — built customizable datatables, shipped the Connect campaign workflow, migrated the extension to Manifest v3, and mentored a junior engineer. The stack was React + Node, the challenges were product engineering at real-world SaaS scale.',
  'Now at Filevine on the F2 (Filevine Finance) team, building a financial platform layered onto the core legal-tech product. The stack pulls together Svelte + TanStack Query on the frontend with C# and Node.js on the backend, and AG-Grid for the heavier data surfaces. It is also where I have leaned hard into AI-assisted development — Claude Code is part of the daily loop.',
];

export default function About() {
  const currentJob = JOURNEY[0];

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(aboutStructuredData),
        }}
      />
      <div className="mx-auto w-full max-w-5xl px-6 py-20 md:px-12">
        {/* Page title */}
        <div className="ar-fade-up mb-12 [animation-delay:0.1s]">
          <Comment className="mb-2.5">about</Comment>
          <DisplayHeading className="[font-size:clamp(2.25rem,5vw,2.75rem)]">
            {ABOUT.name}
          </DisplayHeading>
        </div>

        <div className="ar-fade-up flex flex-col gap-12 [animation-delay:0.2s] lg:flex-row lg:items-start lg:gap-14">
          {/* Main column */}
          <div className="min-w-0 flex-1">
            {/* Journey */}
            <div className="mb-11 border-border border-b pb-11">
              <SectionLabel
                comment="journey"
                heading="Background"
                color="green"
                headingClassName="text-base md:text-base"
              />
              {BACKGROUND_PARAGRAPHS.map(para => (
                <p
                  key={para}
                  className="mb-4 max-w-2xl font-mono text-[13px] text-foreground leading-loose last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Values */}
            <div>
              <SectionLabel
                comment="values"
                heading="What I Care About"
                color="green"
                headingClassName="text-base md:text-base"
              />
              <div>
                {VALUES.map((value, i) => (
                  <div
                    key={value.title}
                    className={cn(
                      'grid grid-cols-1 gap-5 pb-5 sm:grid-cols-[160px_1fr] sm:gap-6 sm:pb-6',
                      i < VALUES.length - 1 &&
                        'mb-5 border-border border-b sm:mb-6'
                    )}
                  >
                    <div className="pt-0.5 font-mono font-semibold text-[11px] text-primary">
                      {value.title}
                    </div>
                    <p className="font-mono text-[13px] text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full flex-shrink-0 lg:sticky lg:top-20 lg:w-56">
            <div className="mx-auto mb-7 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10">
              <Image
                src="/me.webp"
                alt="Adam Rasfeld"
                width={144}
                height={144}
                priority
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mb-7 border-border border-b pb-6">
              <Comment className="mb-2.5">currently</Comment>
              <div className="font-mono font-semibold text-[12px] text-foreground-bright">
                {currentJob.role}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                {currentJob.company} · {currentJob.location}
                <br />
                Feb 2023 → present
              </div>
            </div>

            <div className="mb-7 border-border border-b pb-6">
              <Comment className="mb-2.5">education</Comment>
              <div className="font-mono font-semibold text-[12px] text-foreground-bright">
                {EDUCATION.school}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                {EDUCATION.degree}
                <br />
                {EDUCATION.location} · {EDUCATION.year}
              </div>
            </div>

            <div className="mb-7 border-border border-b pb-6">
              <Comment className="mb-2.5">location</Comment>
              <div className="font-mono text-[11px] text-foreground">
                ◈ {ABOUT.location}
              </div>
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-sm border border-syntax-green/40 bg-syntax-green/10 px-2 py-0.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-syntax-green"
                />
                <span className="font-mono text-[9px] text-syntax-green tracking-wide">
                  open to work
                </span>
              </div>
            </div>

            <div>
              <Comment className="mb-3">skills</Comment>
              {SKILL_GROUPS.map(group => {
                const colorKey = skillCategoryColor[group.name];
                return (
                  <div key={group.name} className="mb-2.5">
                    <div
                      className={cn(
                        'mb-1 font-mono text-[9px] uppercase tracking-[0.18em]',
                        SYNTAX_TEXT_CLASS[colorKey]
                      )}
                    >
                      {group.name}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                      {group.items.join(' · ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
