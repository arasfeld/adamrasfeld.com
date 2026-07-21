import type { Metadata } from 'next';
import Image from 'next/image';

import {
  Comment,
  DisplayHeading,
  MonoTag,
  SectionLabel,
  syntaxColorClass,
} from '@/components/ui/typography';
import {
  ABOUT,
  EDUCATION,
  INTERESTS,
  SKILL_GROUPS,
  skillCategoryColor,
  VALUES,
} from '@/lib/about-data';
import { aboutStructuredData, stringifyJsonLd } from '@/lib/structured-data';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Adam Rasfeld',
  description:
    'Get to know Adam Rasfeld — a software engineer in Cincinnati, Ohio. Beyond the editor: family, gaming, music, running, and tinkering with side projects.',
  alternates: {
    canonical: 'https://adamrasfeld.com/about',
  },
  openGraph: {
    title: 'About Adam Rasfeld',
    description:
      'Get to know Adam Rasfeld — a software engineer in Cincinnati, Ohio, and what he gets up to outside the editor.',
    url: 'https://adamrasfeld.com/about',
  },
  twitter: {
    title: 'About Adam Rasfeld',
    description:
      'Get to know Adam Rasfeld — a software engineer in Cincinnati, Ohio, and what he gets up to outside the editor.',
  },
};

const BIO_PARAGRAPHS: string[] = [
  "I'm a full-stack software engineer in the suburbs of Cincinnati, Ohio. I've loved building software for over a decade — I like things that feel simple to use and hold up under the hood, and I tend to think in systems more than features. AI-assisted development is part of my daily loop these days, and I'm always chasing the next thing to learn.",
  "Off the clock I'm a husband and dad to two kids (and two very-much-in-charge cats). When I'm not with my family you'll usually find me gaming, getting a lift or run in, knocking out yardwork, or working through a TV series or movie. I played trombone in symphonic band and jazz ensemble back in the day, and I still go to as many concerts and festivals as I can.",
];

export default function About() {
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
            {/* Bio */}
            <div className="mb-11 border-border border-b pb-11">
              <SectionLabel
                comment="hello"
                heading="A bit about me"
                color="green"
                headingClassName="text-base md:text-base"
              />
              {BIO_PARAGRAPHS.map(para => (
                <p
                  key={para}
                  className="mb-4 max-w-2xl font-mono text-[13px] text-foreground leading-loose last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Outside the editor */}
            <div className="mb-11 border-border border-b pb-11">
              <SectionLabel
                comment="off-the-clock"
                heading="Outside the Editor"
                color="green"
                headingClassName="text-base md:text-base"
              />
              <div className="flex flex-col gap-5">
                {INTERESTS.map(group => (
                  <div
                    key={group.label}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr] sm:gap-4"
                  >
                    <div className="pt-1 font-mono font-semibold text-[11px] text-primary">
                      {group.label}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map(item => (
                        <MonoTag key={item}>{item}</MonoTag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
                  open to freelance
                </span>
              </div>
            </div>

            <div className="mb-7 border-border border-b pb-6">
              <Comment className="mb-2.5">resume</Comment>
              <a
                href="/adam-rasfeld-resume.pdf"
                target="_blank"
                rel="noopener"
                download
                className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground tracking-wide transition-colors hover:border-primary/50 hover:bg-surface-hover hover:text-foreground-bright"
              >
                <span aria-hidden="true">↓</span> download resume.pdf
              </a>
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
                        syntaxColorClass[colorKey]
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
