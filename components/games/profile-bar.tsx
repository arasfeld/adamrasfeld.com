import { GameArt } from '@/components/games/game-art';
import { cn } from '@/lib/utils';
import type { SteamProfile } from '@/types';

const STATE_TEXT = {
  'in-game': 'text-syntax-green',
  online: 'text-primary',
  offline: 'text-muted-foreground',
} as const;

const STATE_DOT = {
  'in-game': 'bg-syntax-green',
  online: 'bg-primary',
  offline: 'bg-muted-foreground',
} as const;

export function ProfileBar({
  profile,
  level,
}: {
  profile: SteamProfile;
  level: number;
}) {
  const stateLabel =
    profile.state === 'in-game' && profile.playing
      ? `in-game · ${profile.playing}`
      : profile.state;

  return (
    <div className="border-border border-y bg-card/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-4 px-6 py-3.5 md:px-12">
        <div className="relative flex-shrink-0">
          <GameArt
            name={profile.persona}
            src={profile.avatar}
            width={40}
            height={40}
            className="rounded-sm border border-border"
          />
          <span
            className={cn(
              'absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background',
              STATE_DOT[profile.state]
            )}
          />
        </div>

        <div className="min-w-0">
          <div className="font-mono font-semibold text-[13px] text-foreground-bright">
            {profile.persona}
          </div>
          <div
            className={cn(
              'mt-0.5 font-mono text-[10px]',
              STATE_TEXT[profile.state]
            )}
          >
            {stateLabel}
          </div>
        </div>

        {level > 0 && (
          <div className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-syntax-yellow bg-syntax-yellow/10 px-2.5 py-1">
            <span className="font-mono text-[9px] text-muted-foreground tracking-wide">
              LVL
            </span>
            <span className="font-bold text-[13px] text-syntax-yellow leading-none">
              {level}
            </span>
          </div>
        )}

        <div className="flex-1" />

        <div className="flex flex-shrink-0 items-center gap-2">
          <span className="relative h-2 w-2">
            <span className="ar-ping absolute inset-0 rounded-full bg-syntax-green" />
            <span className="absolute inset-0 rounded-full bg-syntax-green" />
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            live from steam
          </span>
        </div>
      </div>
    </div>
  );
}
