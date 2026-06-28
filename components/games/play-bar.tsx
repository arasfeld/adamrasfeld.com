import { fmtHours } from '@/components/games/format';
import { cn } from '@/lib/utils';
import type { SteamGame } from '@/types';

/** A single ranked row in the Most Played bar chart. */
export function PlayBar({
  game,
  rank,
  max,
  metric,
}: {
  game: SteamGame;
  rank: number;
  max: number;
  metric: 'total' | 'recent';
}) {
  const value =
    metric === 'recent' ? game.playtime2Weeks : game.playtimeForever;
  const pct = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  const bar = metric === 'recent' ? 'bg-syntax-green' : 'bg-primary';
  const text = metric === 'recent' ? 'text-syntax-green' : 'text-primary';

  return (
    <div className="group grid grid-cols-[18px_1fr_52px] items-center gap-3 py-1.5 sm:grid-cols-[18px_150px_1fr_52px]">
      <span className="text-right font-mono text-[10px] text-muted-foreground tabular-nums">
        {String(rank).padStart(2, '0')}
      </span>
      <span className="truncate font-mono text-[11.5px] text-foreground-bright">
        {game.name}
      </span>
      <div className="hidden h-2.5 overflow-hidden rounded-full bg-border sm:block">
        <div
          className={cn(
            'h-full rounded-full opacity-80 transition-all group-hover:opacity-100',
            bar
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          'text-right font-bold font-mono text-[11px] tabular-nums',
          text
        )}
      >
        {fmtHours(value)}
      </span>
    </div>
  );
}
