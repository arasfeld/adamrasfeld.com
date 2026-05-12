import type { Metadata } from 'next';

import { PrintButton } from '@/components/print-button';
import { Comment } from '@/components/ui/typography';
import {
  ABOUT,
  EDUCATION,
  JOURNEY,
  SKILL_GROUPS,
  skillCategoryColor,
  type Job,
} from '@/lib/about-data';
import { resumeStructuredData, stringifyJsonLd } from '@/lib/structured-data';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Resume - Adam Rasfeld',
  description:
    'Adam Rasfeld — Full Stack Developer. 8+ years of experience across React, Node.js, Ruby on Rails, gRPC, Kafka, and more.',
  alternates: { canonical: 'https://adamrasfeld.com/resume' },
  openGraph: {
    title: 'Resume - Adam Rasfeld',
    description:
      'Full Stack Developer with 8+ years of experience building scalable web applications and system architectures.',
    url: 'https://adamrasfeld.com/resume',
  },
  twitter: {
    title: 'Resume - Adam Rasfeld',
    description:
      'Full Stack Developer with 8+ years of experience building scalable web applications and system architectures.',
  },
};

const SYNTAX_TEXT_CLASS: Record<string, string> = {
  yellow: 'text-syntax-yellow',
  accent: 'text-primary',
  red: 'text-syntax-red',
  green: 'text-syntax-green',
  purple: 'text-syntax-purple',
};

function JobBlock({ job, isLast }: { job: Job; isLast: boolean }) {
  return (
    <div
      className={cn('job-block', !isLast && 'mb-7 border-b border-border pb-7')}
    >
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-3">
        <div className="font-mono text-sm font-bold tracking-tight text-foreground-bright">
          {job.company}
        </div>
        <div className="flex-shrink-0 font-mono text-[10px] text-muted-foreground">
          {job.year}
        </div>
      </div>
      <div className="mb-2.5 font-mono text-[11px] text-primary">
        {job.role}
        <span className="text-muted-foreground"> · {job.location}</span>
      </div>
      <p className="mb-3 max-w-2xl font-mono text-xs leading-relaxed text-foreground">
        {job.blurb}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {job.stack.map(s => (
          <span
            key={s}
            className="rounded-sm border border-border px-1.5 py-px font-mono text-[9px] tracking-wide text-syntax-cyan"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(resumeStructuredData),
        }}
      />
      <div className="mx-auto w-full max-w-5xl px-6 py-16 md:px-12">
        {/* File path + print button */}
        <div className="no-print mb-9 flex items-center justify-between ar-fade-up [animation-delay:0.1s]">
          <div className="font-mono text-[11px] text-muted-foreground">
            <span>~/documents/</span>
            <span className="text-foreground">resume</span>
            <span className="text-primary">.txt</span>
            <span className="ml-3 rounded-sm border border-border px-1.5 py-px text-[9px]">
              updated May 2026
            </span>
          </div>
          <PrintButton />
        </div>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-14 ar-fade-up [animation-delay:0.2s]">
          {/* Sidebar */}
          <aside className="resume-sidebar w-full flex-shrink-0 lg:sticky lg:top-20 lg:w-52">
            <div className="mb-7 border-b border-border pb-6">
              <h1 className="mb-1.5 font-mono text-[22px] font-bold leading-tight tracking-tight text-foreground-bright">
                Adam
                <br />
                Rasfeld
              </h1>
              <div className="font-mono text-[11px] text-primary">
                {ABOUT.title}
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-syntax-green/40 bg-syntax-green/10 px-2 py-0.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-syntax-green"
                />
                <span className="font-mono text-[9px] tracking-wide text-syntax-green">
                  open to work
                </span>
              </div>
            </div>

            <div className="mb-7 border-b border-border pb-6">
              <Comment className="mb-3">contact</Comment>
              <ul className="space-y-1.5 font-mono text-[11px]">
                <li className="text-foreground">◈ {ABOUT.location}</li>
                <li>
                  <a
                    href={`mailto:${ABOUT.email}`}
                    className="text-primary transition-opacity hover:opacity-70"
                  >
                    {ABOUT.email}
                  </a>
                </li>
                <li>
                  <a
                    href={ABOUT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary transition-opacity hover:opacity-70"
                  >
                    github.com/arasfeld
                  </a>
                </li>
                <li>
                  <a
                    href={ABOUT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary transition-opacity hover:opacity-70"
                  >
                    linkedin.com/in/adam-rasfeld
                  </a>
                </li>
                <li>
                  <a
                    href="https://adamrasfeld.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary transition-opacity hover:opacity-70"
                  >
                    adamrasfeld.com
                  </a>
                </li>
                <li className="pt-2">
                  <a
                    href="/adam-rasfeld-resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ↓ download resume.pdf
                  </a>
                </li>
              </ul>
            </div>

            <div className="mb-7 border-b border-border pb-6">
              <Comment className="mb-3">education</Comment>
              <div className="font-mono text-xs font-semibold text-foreground-bright">
                {EDUCATION.school}
              </div>
              <div className="font-mono text-[11px] text-foreground">
                {EDUCATION.degree}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {EDUCATION.location} · {EDUCATION.year}
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
                    <div className="font-mono text-[10px] leading-relaxed text-foreground">
                      {group.items.join(' · ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1">
            <section className="mb-9 border-b border-border pb-9">
              <Comment className="mb-1.5">summary</Comment>
              <h2 className="mb-4 font-mono text-base font-bold tracking-tight text-foreground-bright">
                Profile
              </h2>
              <p className="max-w-2xl font-mono text-[13px] leading-loose text-foreground">
                {ABOUT.summary}
              </p>
            </section>

            <section className="mb-9 border-b border-border pb-9">
              <Comment className="mb-1.5">experience</Comment>
              <h2 className="mb-5 font-mono text-base font-bold tracking-tight text-foreground-bright">
                Work History
              </h2>
              {JOURNEY.map((job, i) => (
                <JobBlock
                  key={`${job.company}-${job.year}`}
                  job={job}
                  isLast={i === JOURNEY.length - 1}
                />
              ))}
            </section>

            <section>
              <Comment className="mb-1.5">skills</Comment>
              <h2 className="mb-5 font-mono text-base font-bold tracking-tight text-foreground-bright">
                Tooling
              </h2>
              <div className="grid gap-3.5">
                {SKILL_GROUPS.map(group => {
                  const colorKey = skillCategoryColor[group.name];
                  return (
                    <div
                      key={group.name}
                      className="grid grid-cols-1 items-baseline gap-3 sm:grid-cols-[100px_1fr]"
                    >
                      <div
                        className={cn(
                          'pt-0.5 font-mono text-[9px] uppercase tracking-[0.18em]',
                          SYNTAX_TEXT_CLASS[colorKey]
                        )}
                      >
                        {group.name}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map(item => (
                          <span
                            key={item}
                            className="rounded-sm border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
