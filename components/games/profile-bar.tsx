import { GameArt } from '@/components/games/game-art';
import type { SteamProfile } from '@/types';

export function ProfileBar({
  profile,
  level,
}: {
  profile: SteamProfile;
  level: number;
}) {
  const memberSince = profile.memberSince
    ? new Date(profile.memberSince * 1000).getFullYear()
    : null;

  return (
    <div className="border-border border-y bg-card/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-4 px-6 py-3.5 md:px-12">
        <GameArt
          name={profile.persona}
          src={profile.avatar}
          width={40}
          height={40}
          priority
          className="flex-shrink-0 rounded-sm border border-border"
        />

        <div className="min-w-0">
          <div className="font-mono font-semibold text-[13px] text-foreground-bright">
            {profile.persona}
          </div>
          {memberSince && (
            <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
              member since {memberSince}
            </div>
          )}
        </div>

        <div className="flex-1" />

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
      </div>
    </div>
  );
}
