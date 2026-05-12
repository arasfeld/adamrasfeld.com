import Link from 'next/link';

import { ExperienceRow } from '@/components/experience-row';
import { Typewriter } from '@/components/typewriter';
import { Button } from '@/components/ui/button';
import {
  Comment,
  DisplayHeading,
  MonoTag,
  SectionLabel,
} from '@/components/ui/typography';
import {
  ABOUT,
  JOURNEY,
  SKILL_GROUPS,
  skillCategoryColor,
} from '@/lib/about-data';
import { cn } from '@/lib/utils';

const SYNTAX_TEXT_CLASS: Record<string, string> = {
  yellow: 'text-syntax-yellow',
  accent: 'text-primary',
  red: 'text-syntax-red',
  green: 'text-syntax-green',
  purple: 'text-syntax-purple',
};

export default function Home() {
  const meta = [ABOUT.location, '8+ yrs experience', 'open to opportunities'];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 pb-24 pt-24 md:px-16 md:pb-32 md:pt-32">
        <div className="mx-auto w-full max-w-5xl">
          <Comment
            color="green"
            className="mb-8 ar-fade-up [animation-delay:0.15s]"
          >
            hello, world
          </Comment>

          <DisplayHeading className="mb-7 ar-fade-up [animation-delay:0.3s] [font-size:clamp(3.5rem,9.5vw,8.25rem)]">
            {ABOUT.name.split(' ').map(word => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </DisplayHeading>

          <div className="mb-9 ar-fade-up [animation-delay:0.5s]">
            <p
              className="font-mono text-base text-primary md:text-lg"
              aria-live="polite"
            >
              <Typewriter text={ABOUT.title} />
            </p>
          </div>

          <div className="mb-10 max-w-2xl border-t border-border pt-7 ar-fade-up [animation-delay:0.7s]">
            <p className="font-mono text-[13px] leading-relaxed text-muted-foreground">
              {ABOUT.summary}
            </p>
          </div>

          <div className="mb-11 flex flex-wrap gap-2 ar-fade-up [animation-delay:0.85s]">
            {meta.map(tag => (
              <MonoTag key={tag}>{tag}</MonoTag>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 ar-fade-up [animation-delay:1s]">
            <Button
              render={<Link href="/portfolio" />}
              variant="default"
              size="default"
            >
              view work →
            </Button>
            <Button
              render={<Link href="/contact" />}
              variant="outline"
              size="default"
            >
              get in touch
            </Button>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="px-6 py-20 md:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <SectionLabel
            comment="experience"
            heading="Work History"
            color="green"
            className="mb-10"
          />
          <div className="border-t border-border">
            {JOURNEY.map(job => (
              <ExperienceRow key={`${job.company}-${job.year}`} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="px-6 pb-24 pt-8 md:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <SectionLabel
            comment="tooling"
            heading="Skills"
            color="purple"
            className="mb-10"
          />
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
            {SKILL_GROUPS.map(group => {
              const colorKey = skillCategoryColor[group.name];
              return (
                <div
                  key={group.name}
                  className="bg-card p-5 transition-colors hover:bg-surface-hover"
                >
                  <div
                    className={cn(
                      'mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em]',
                      SYNTAX_TEXT_CLASS[colorKey]
                    )}
                  >
                    {group.name}
                  </div>
                  <ul className="space-y-1.5">
                    {group.items.map(item => (
                      <li
                        key={item}
                        className="font-mono text-xs text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
