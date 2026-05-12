import Image from 'next/image';
import Link from 'next/link';

import { DeviceWire } from '@/components/portfolio/device-wire';
import type { Project, ProjectKind, ProjectStatus } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

/** Maps a project kind to its accent color class for the dot-grid header. */
const TYPE_COLOR: Record<ProjectKind, { text: string; rgb: string }> = {
  mobile: { text: 'text-syntax-green', rgb: '152, 195, 121' },
  web: { text: 'text-primary', rgb: '97, 175, 239' },
  desktop: { text: 'text-syntax-purple', rgb: '198, 120, 221' },
};

const STATUS_BADGE: Record<
  ProjectStatus,
  { dotClass: string; textClass: string; label: string } | null
> = {
  live: {
    dotClass: 'bg-syntax-green',
    textClass: 'text-syntax-green',
    label: 'live',
  },
  wip: {
    dotClass: 'bg-syntax-yellow',
    textClass: 'text-syntax-yellow',
    label: 'wip',
  },
  active: null,
};

export function ProjectCard({ project }: ProjectCardProps) {
  const accent = TYPE_COLOR[project.type];
  const statusBadge = STATUS_BADGE[project.status];
  const detailHref = project.hasDetail ? `/portfolio/${project.id}` : null;

  return (
    <article className="group flex flex-col border border-border bg-card transition-colors hover:border-primary/60">
      {/* Dot-grid header */}
      <div
        className={cn(
          'relative flex h-48 items-center justify-center overflow-hidden border-b border-border',
          accent.text
        )}
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(var(--type-rgb), 0.16) 1.2px, transparent 1.2px)',
          backgroundSize: '22px 22px',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ['--type-rgb' as any]: accent.rgb,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute h-40 w-40 rounded-full opacity-15 blur-2xl"
          style={{ backgroundColor: `rgb(var(--type-rgb))` }}
        />
        <div className="relative">
          {project.image ? (
            <div className="overflow-hidden rounded-md border border-border bg-card shadow-md">
              <div className="flex items-center gap-1 border-b border-border bg-background/60 px-2 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/35" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
              </div>
              <div className="relative aspect-video w-[220px] sm:w-[240px]">
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 240px, 220px"
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <DeviceWire type={project.type} />
          )}
        </div>

        {/* Year */}
        <span className="absolute right-2.5 top-2.5 border border-border bg-card px-1.5 py-px font-mono text-[9px] tracking-wide text-muted-foreground">
          {project.year}
        </span>

        {/* Status */}
        {statusBadge && (
          <span
            className={cn(
              'absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 font-mono text-[9px]',
              statusBadge.textClass
            )}
          >
            <span
              aria-hidden="true"
              className={cn('h-1.5 w-1.5 rounded-full', statusBadge.dotClass)}
            />
            {statusBadge.label}
          </span>
        )}

        {/* Type */}
        <span
          className={cn(
            'absolute bottom-2.5 right-2.5 font-mono text-[9px] tracking-wide',
            accent.text
          )}
        >
          {project.type}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-mono text-sm font-bold tracking-tight text-foreground-bright">
          {project.title}
        </h3>
        <p className="mb-4 flex-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map(s => (
            <span
              key={s}
              className="rounded-sm border border-border px-1.5 py-px font-mono text-[9px] tracking-wide text-syntax-cyan"
            >
              {s}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="px-1.5 py-px font-mono text-[9px] text-muted-foreground">
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        <div className="flex gap-3 border-t border-border pt-3.5 font-mono text-[10px]">
          {detailHref ? (
            <Link
              href={detailHref}
              className="text-primary transition-opacity hover:opacity-70"
            >
              → case study
            </Link>
          ) : (
            <span className="text-muted-foreground/60">→ coming soon</span>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-muted-foreground transition-colors hover:text-foreground"
            >
              ⬡ github
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-syntax-green transition-opacity hover:opacity-70"
            >
              ↗ visit
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
