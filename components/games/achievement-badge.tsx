import { fmtRelative } from '@/components/games/format';
import { AchievementIcon } from '@/components/games/game-art';
import { cn } from '@/lib/utils';
import type { RecentAchievement } from '@/types';

interface Tier {
  label: string;
  border: string;
  text: string;
  bar: string;
  hover: string;
}

/** Maps global unlock rarity (%) to a tier + the syntax color it borrows. */
function tierOf(rarity: number): Tier {
  if (rarity < 5)
    return {
      label: 'ultra rare',
      border: 'border-syntax-yellow',
      text: 'text-syntax-yellow',
      bar: 'bg-syntax-yellow',
      hover: 'hover:border-syntax-yellow',
    };
  if (rarity < 10)
    return {
      label: 'very rare',
      border: 'border-syntax-purple',
      text: 'text-syntax-purple',
      bar: 'bg-syntax-purple',
      hover: 'hover:border-syntax-purple',
    };
  if (rarity < 25)
    return {
      label: 'rare',
      border: 'border-primary',
      text: 'text-primary',
      bar: 'bg-primary',
      hover: 'hover:border-primary',
    };
  return {
    label: 'common',
    border: 'border-border',
    text: 'text-muted-foreground',
    bar: 'bg-muted-foreground',
    hover: 'hover:border-border-soft',
  };
}

export function AchievementBadge({
  achievement,
}: {
  achievement: RecentAchievement;
}) {
  const tier =
    achievement.rarity !== undefined ? tierOf(achievement.rarity) : null;
  const fill =
    achievement.rarity !== undefined
      ? Math.max(8, 100 - achievement.rarity)
      : 0;

  return (
    <div
      className={cn(
        'flex items-center gap-3.5 rounded-lg border border-border bg-card px-4 py-3.5 transition-all hover:-translate-y-0.5',
        tier ? tier.hover : 'hover:border-border-soft'
      )}
    >
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            'grid h-11 w-11 place-items-center overflow-hidden rounded-lg border bg-surface-hover',
            tier
              ? cn(tier.border, tier.text)
              : 'border-border text-syntax-yellow'
          )}
        >
          <AchievementIcon src={achievement.icon} alt={achievement.name} />
        </div>
        <div
          className={cn(
            'absolute -right-1 -bottom-1 grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-card font-bold text-[10px] text-background',
            tier ? tier.bar : 'bg-muted-foreground'
          )}
          aria-hidden="true"
        >
          ★
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-[13px] text-foreground-bright">
          {achievement.name}
        </div>
        <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
          {achievement.game} · {fmtRelative(achievement.unlockTime)}
        </div>
        {tier && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className={cn('h-full rounded-full', tier.bar)}
                style={{ width: `${fill}%` }}
              />
            </div>
            <span
              className={cn(
                'whitespace-nowrap font-mono text-[9px] uppercase tracking-wide',
                tier.text
              )}
            >
              {tier.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
