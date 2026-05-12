'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { Job } from '@/lib/about-data';
import { cn } from '@/lib/utils';

interface ExperienceRowProps {
  job: Job;
}

/**
 * Click-to-expand work-history row used on the home page.
 * Header: year (left) · company + role/location (middle) · chevron (right).
 * Expanded body: blurb + stack chips.
 */
export function ExperienceRow({ job }: ExperienceRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen(o => !o)}
      className="group block w-full cursor-pointer border-border border-b py-6 text-left"
    >
      <div className="grid grid-cols-[110px_1fr_18px] items-start gap-6 md:grid-cols-[150px_1fr_18px]">
        <div className="pt-1 font-mono text-[10px] text-muted-foreground tracking-wide">
          {job.year}
        </div>
        <div>
          <div className="mb-1 font-bold font-mono text-foreground-bright text-sm tracking-tight transition-colors group-hover:text-primary">
            {job.company}
          </div>
          <div className="font-mono text-[11px] text-muted-foreground">
            {job.role} · {job.location}
          </div>
        </div>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'mt-1 size-4 text-muted-foreground transition-transform duration-300',
            open && 'rotate-180'
          )}
        />
      </div>

      <div
        className={cn(
          'grid overflow-hidden transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="min-h-0">
          <div className="pt-4 md:pl-[174px]">
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
        </div>
      </div>
    </button>
  );
}
