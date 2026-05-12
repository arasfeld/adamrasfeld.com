import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BoxProps {
  label: string;
  sub?: string;
  /** Color CSS variable name, e.g. `var(--primary)` or `var(--syntax-green)`. */
  color: string;
}

function Box({ label, sub, color }: BoxProps) {
  return (
    <div
      className="rounded-sm border px-3.5 py-2.5"
      style={{
        borderColor: `color-mix(in srgb, ${color} 33%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 5%, transparent)`,
        minWidth: 130,
      }}
    >
      <div
        className="font-mono text-[11px] font-bold"
        style={{ color, marginBottom: sub ? 3 : 0 }}
      >
        {label}
      </div>
      {sub && (
        <div className="font-mono text-[9px] leading-relaxed text-muted-foreground">
          {sub}
        </div>
      )}
    </div>
  );
}

function Arrow({
  children = '→',
  vertical = false,
  className,
}: {
  children?: ReactNode;
  vertical?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-shrink-0 items-center justify-center text-base text-muted-foreground',
        vertical ? 'py-1' : 'px-1',
        className
      )}
    >
      {children}
    </div>
  );
}

export function SproutArchDiagram() {
  return (
    <div className="border border-border bg-card p-6">
      <div className="mb-5 font-mono text-[9px] tracking-[0.15em] text-muted-foreground">
        {'// sync architecture'}
      </div>

      {/* Top row: mobile app container */}
      <div className="relative mb-4 border border-dashed border-border p-5 pb-4">
        <span className="absolute -top-2 left-3.5 bg-card px-1.5 font-mono text-[9px] text-muted-foreground">
          mobile app
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <Box label="UI" sub="React Native" color="var(--primary)" />
          <Arrow>→</Arrow>
          <Box
            label="SQLite + Drizzle"
            sub="useLiveQuery · offline reads"
            color="var(--syntax-green)"
          />
          <Arrow>↔</Arrow>
          <Box
            label="Sync Engine"
            sub="push / pull · pending queue"
            color="var(--syntax-purple)"
          />
        </div>
      </div>

      <div className="mb-2 flex justify-end pr-16">
        <Arrow vertical>↓</Arrow>
      </div>

      <div className="flex justify-end">
        <Box
          label="Supabase"
          sub={'Postgres + RLS · Auth\nStorage · Realtime (future)'}
          color="var(--syntax-yellow)"
        />
      </div>
    </div>
  );
}
