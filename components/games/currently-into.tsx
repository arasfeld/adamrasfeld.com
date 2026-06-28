import { fmtHours } from '@/components/games/format';
import { GameArt, GameBanner } from '@/components/games/game-art';
import { cn } from '@/lib/utils';
import type { SteamGame } from '@/types';

interface Completion {
  achieved: number;
  total: number;
  percent: number;
}

function Metric({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div>
      <div className={cn('font-bold text-xl tabular-nums leading-none', color)}>
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[9px] text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

/**
 * Hero card for the most-active game: wide banner art, headline playtime
 * metrics, achievement progress, and an "also in rotation" mini-list. Replaces
 * the old vertical Recently Played list.
 */
export function CurrentlyInto({
  game,
  others,
  completion,
}: {
  game: SteamGame;
  others: SteamGame[];
  completion: Completion | null;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border-soft bg-card">
      <div className="relative h-[150px] w-full overflow-hidden">
        <GameBanner name={game.name} appid={game.appid} />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-syntax-green" />
          <span className="font-mono text-[10px] text-white">most active</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 font-mono text-[10px] text-syntax-green">
          {'// currently into'}
        </div>
        <div className="font-bold text-[19px] text-foreground-bright leading-tight tracking-tight">
          {game.name}
        </div>

        <div className="mt-4 flex gap-6">
          <Metric
            value={fmtHours(game.playtime2Weeks)}
            label="last 2 wks"
            color="text-syntax-green"
          />
          <Metric
            value={fmtHours(game.playtimeForever)}
            label="all time"
            color="text-foreground-bright"
          />
          {completion && (
            <Metric
              value={`${completion.percent}%`}
              label="achieved"
              color="text-primary"
            />
          )}
        </div>

        {completion && (
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${completion.percent}%` }}
            />
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-auto pt-5">
            <div className="mb-2.5 font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
              also in rotation
            </div>
            <div className="flex flex-col gap-2">
              {others.map(other => (
                <div key={other.appid} className="flex items-center gap-2.5">
                  <GameArt
                    name={other.name}
                    appid={other.appid}
                    art="capsule"
                    width={24}
                    height={24}
                    className="rounded-sm border border-border"
                  />
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground">
                    {other.name}
                  </span>
                  <span className="font-mono text-[10px] text-syntax-green tabular-nums">
                    {fmtHours(other.playtime2Weeks)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
