import { fmtMonthYear } from '@/components/games/format';

import { GameBanner } from '@/components/games/game-art';
import type { ShowcaseGame } from '@/types';

export function ShowcaseCard({ game }: { game: ShowcaseGame }) {
  const perfect = game.total > 0 && game.achieved >= game.total;

  return (
    <div className="overflow-hidden rounded-md border border-border-soft bg-card transition-all hover:-translate-y-0.5 hover:border-syntax-yellow">
      <div className="relative h-28 w-full overflow-hidden">
        <GameBanner name={game.name} appid={game.appid} />
        {perfect && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-syntax-yellow px-2 py-1 font-bold text-[11px] text-background">
            <span aria-hidden="true">★</span> 100%
          </div>
        )}
        <div className="absolute bottom-2.5 left-2.5 rounded-sm bg-black/45 px-2 py-0.5 font-mono text-[10px] text-white tabular-nums">
          {game.achieved} / {game.total}
        </div>
      </div>
      <div className="px-3.5 py-3">
        <div className="truncate font-semibold text-[13px] text-foreground-bright">
          {game.name}
        </div>
        <div className="mt-1.5 font-mono text-[10px] text-muted-foreground">
          {game.completedAt
            ? `completed ${fmtMonthYear(game.completedAt)}`
            : `${game.achieved}/${game.total} achievements`}
        </div>
      </div>
    </div>
  );
}
