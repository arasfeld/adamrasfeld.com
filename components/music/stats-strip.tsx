import { cn } from '@/lib/utils';

export interface MusicStat {
  label: string;
  value: string | number;
  colorClass?: string;
}

export function StatsStrip({ stats }: { stats: MusicStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 md:grid-cols-5">
      {stats.map(stat => (
        <div key={stat.label} className="bg-background px-3 py-5 text-center">
          <div
            className={cn(
              'font-bold text-lg tabular-nums leading-none',
              stat.colorClass ?? 'text-foreground-bright'
            )}
          >
            {stat.value}
          </div>
          <div className="mt-2 font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
