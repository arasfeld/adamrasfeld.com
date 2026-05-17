import { ChevronDown } from 'lucide-react';

import type { Job } from '@/lib/about-data';

interface ExperienceRowProps {
  job: Job;
}

/**
 * Click-to-expand work-history row used on the home page.
 * Header: year (left) · company + role/location (middle) · chevron (right).
 * Expanded body: blurb + stack chips.
 *
 * Uses native <details>/<summary> for the disclosure (no JS, focus and
 * keyboard handling are free). The chevron rotates via group-open variant.
 */
export function ExperienceRow({ job }: ExperienceRowProps) {
  return (
    <details className="group/job block border-border border-b">
      <summary className="block cursor-pointer list-none rounded-sm px-2 py-6 outline-none transition-colors focus-visible:bg-surface-hover [&::-webkit-details-marker]:hidden">
        <div className="-mx-2 grid grid-cols-[110px_1fr_18px] items-start gap-6 md:grid-cols-[150px_1fr_18px]">
          <div className="pt-1 font-mono text-[10px] text-muted-foreground tracking-wide">
            {job.year}
          </div>
          <div>
            <div className="mb-1 font-bold font-mono text-foreground-bright text-sm tracking-tight transition-colors group-hover/job:text-primary">
              {job.company}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground">
              {job.role} · {job.location}
            </div>
          </div>
          <ChevronDown
            aria-hidden="true"
            className="mt-1 size-4 text-muted-foreground transition-transform duration-300 group-open/job:rotate-180"
          />
        </div>
      </summary>

      <div className="pb-6 md:pl-[174px]">
        <p className="mb-4 max-w-2xl font-mono text-foreground text-xs leading-relaxed">
          {job.blurb}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {job.stack.map(tech => (
            <span
              key={tech}
              className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] text-syntax-cyan tracking-wide"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </details>
  );
}
