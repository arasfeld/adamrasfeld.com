import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AchievementBadge } from '@/components/games/achievement-badge';
import { CurrentlyInto } from '@/components/games/currently-into';
import {
  AchievementsSkeleton,
  BarChartSkeleton,
  CurrentlyIntoSkeleton,
  ShowcaseSkeleton,
} from '@/components/games/games-skeletons';
import { PlayBar } from '@/components/games/play-bar';
import { ProfileBar } from '@/components/games/profile-bar';
import { ShowcaseCard } from '@/components/games/showcase-card';
import { type GameStat, StatsGrid } from '@/components/games/stats-grid';
import { QueryToggle } from '@/components/query-toggle';
import {
  Comment,
  DisplayHeading,
  SectionLabel,
} from '@/components/ui/typography';
import { fmtHours, fmtNum } from '@/lib/format';
import { STEAM_TOTALS } from '@/lib/games-data';
import {
  getGameCompletion,
  getLevel,
  getOwnedGames,
  getProfile,
  getRecentAchievements,
  getRecentlyPlayed,
  getShowcaseAchievements,
} from '@/lib/steam';

export const metadata: Metadata = {
  title: 'Games',
  description:
    "Adam Rasfeld's Steam library — most-played games, recently played, the completionist showcase, and recent achievements, pulled live from the Steam Web API.",
  alternates: {
    canonical: 'https://adamrasfeld.com/games',
  },
  openGraph: {
    title: 'Games',
    description:
      "Adam Rasfeld's Steam library — most-played games, completionist showcase, and recent achievements.",
    url: 'https://adamrasfeld.com/games',
  },
  twitter: {
    title: 'Games',
    description:
      "Adam Rasfeld's Steam library — most-played games, completionist showcase, and recent achievements.",
  },
};

type Sort = 'total' | 'recent';

const SORT_OPTIONS: { key: Sort; label: string }[] = [
  { key: 'total', label: 'all time' },
  { key: 'recent', label: '2 weeks' },
];

function parseSort(value: string | string[] | undefined): Sort {
  return value === 'recent' ? 'recent' : 'total';
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] text-muted-foreground">{children}</p>
  );
}

async function HeroMeta() {
  const games = await getOwnedGames();
  if (games.length === 0) {
    return (
      <span className="pb-1 font-mono text-[11px] text-muted-foreground">
        not connected
      </span>
    );
  }
  const totalHours = Math.round(
    games.reduce((sum, g) => sum + g.playtimeForever, 0) / 60
  );
  return (
    <span className="pb-1 font-mono text-[11px] text-muted-foreground tabular-nums">
      {games.length.toLocaleString()} games · {totalHours.toLocaleString()} hrs
    </span>
  );
}

async function ProfileSection() {
  const [profile, level] = await Promise.all([getProfile(), getLevel()]);
  if (!profile) return null;
  return <ProfileBar profile={profile} level={level} />;
}

async function StatsSection() {
  const games = await getOwnedGames();
  if (games.length === 0) return null;
  const totalHours = Math.round(
    games.reduce((sum, g) => sum + g.playtimeForever, 0) / 60
  );
  const recentMinutes = games.reduce((sum, g) => sum + g.playtime2Weeks, 0);
  const stats: GameStat[] = [
    { label: 'Games', value: games.length.toLocaleString() },
    { label: 'Hours', value: totalHours.toLocaleString() },
    {
      label: 'Perfect',
      value: STEAM_TOTALS.perfectGames,
      colorClass: 'text-syntax-green',
    },
    {
      label: 'Achievements',
      value: fmtNum(STEAM_TOTALS.achievementsInPerfectGames),
      colorClass: 'text-syntax-yellow',
    },
    {
      label: '2-wk hrs',
      value: fmtHours(recentMinutes),
      colorClass: 'text-primary',
    },
  ];
  return <StatsGrid stats={stats} />;
}

async function CurrentlyIntoSection() {
  const recent = await getRecentlyPlayed();
  if (recent.length === 0) return <Empty>no recent sessions</Empty>;
  const sorted = [...recent].sort(
    (a, b) => b.playtime2Weeks - a.playtime2Weeks
  );
  const hero = sorted[0];
  const others = sorted.slice(1, 4);
  const completion = await getGameCompletion(hero.appid);
  return <CurrentlyInto game={hero} others={others} completion={completion} />;
}

async function RecentAchievementsSection() {
  const achievements = await getRecentAchievements(8);
  if (achievements.length === 0) return <Empty>no recent achievements</Empty>;
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {achievements.map(achievement => (
        <AchievementBadge
          key={`${achievement.appid}-${achievement.name}`}
          achievement={achievement}
        />
      ))}
    </div>
  );
}

async function MostPlayedSection({ sort }: { sort: Sort }) {
  const games = await getOwnedGames();
  if (games.length === 0) return <Empty>no games available</Empty>;
  const sorted = [...games]
    .sort((a, b) =>
      sort === 'recent'
        ? b.playtime2Weeks - a.playtime2Weeks
        : b.playtimeForever - a.playtimeForever
    )
    .filter(g => (sort === 'recent' ? g.playtime2Weeks > 0 : true))
    .slice(0, 8);
  if (sorted.length === 0) return <Empty>no recent play</Empty>;
  const max = Math.max(
    ...sorted.map(g =>
      sort === 'recent' ? g.playtime2Weeks : g.playtimeForever
    ),
    1
  );
  return (
    <div>
      {sorted.map((game, i) => (
        <PlayBar
          key={game.appid}
          game={game}
          rank={i + 1}
          max={max}
          metric={sort}
        />
      ))}
    </div>
  );
}

async function ShowcaseSection() {
  const games = await getShowcaseAchievements();
  if (games.length === 0) return <Empty>showcase unavailable</Empty>;
  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {games.map(game => (
        <ShowcaseCard key={game.appid} game={game} />
      ))}
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ sort?: string | string[] }>;
}

export default async function Games({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = parseSort(params.sort);

  return (
    <div className="min-h-screen">
      {/* Warm the connection to Steam's art CDN before <Image> requests fire. */}
      <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" />

      {/* Hero */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-20 pb-10 [animation-delay:0.1s] md:px-12">
        <Comment className="mb-2.5">games</Comment>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <DisplayHeading className="[font-size:clamp(2.25rem,5vw,2.75rem)]">
            Steam Library
          </DisplayHeading>
          <Suspense fallback={null}>
            <HeroMeta />
          </Suspense>
        </div>
      </div>

      {/* Profile / status bar */}
      <Suspense
        fallback={
          <div className="border-border border-y">
            <div className="mx-auto h-[69px] w-full max-w-5xl" />
          </div>
        }
      >
        <ProfileSection />
      </Suspense>

      {/* Stats */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-10 [animation-delay:0.2s] md:px-12">
        <Suspense fallback={null}>
          <StatsSection />
        </Suspense>
      </div>

      {/* Bento: currently into (hero) + recent achievements */}
      <div className="ar-fade-up mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-6 pt-12 [animation-delay:0.3s] md:px-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Suspense fallback={<CurrentlyIntoSkeleton />}>
            <CurrentlyIntoSection />
          </Suspense>
        </div>
        <div className="lg:col-span-8">
          <SectionLabel
            comment="unlocked"
            heading="Recent Achievements"
            color="green"
            headingClassName="text-base md:text-lg"
            className="mb-5"
          />
          <Suspense fallback={<AchievementsSkeleton />}>
            <RecentAchievementsSection />
          </Suspense>
        </div>
      </div>

      {/* Completionist showcase */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-12 [animation-delay:0.45s] md:px-12">
        <SectionLabel
          comment="100% completed"
          heading="Completionist Showcase"
          color="green"
          headingClassName="text-base md:text-lg"
          className="mb-5"
        />
        <Suspense fallback={<ShowcaseSkeleton />}>
          <ShowcaseSection />
        </Suspense>
      </div>

      {/* Most played bar chart */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-12 pb-20 [animation-delay:0.6s] md:px-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <SectionLabel
            comment="library"
            heading="Most Played"
            color="green"
            headingClassName="text-base md:text-lg"
            className="mb-0"
          />
          <QueryToggle
            param="sort"
            options={SORT_OPTIONS}
            value={sort}
            className="pb-0.5"
          />
        </div>
        <Suspense key={sort} fallback={<BarChartSkeleton />}>
          <MostPlayedSection sort={sort} />
        </Suspense>
      </div>
    </div>
  );
}
