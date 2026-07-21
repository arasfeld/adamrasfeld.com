import type { Metadata } from 'next';
import { cache, Suspense } from 'react';

import {
  ArtistBadge,
  type ResolvedArtist,
} from '@/components/music/artist-badge';
import {
  ArtistBadgesSkeleton,
  OnRepeatSkeleton,
  RecentCardsSkeleton,
  SoundProfileSkeleton,
  TrackBarsSkeleton,
} from '@/components/music/music-skeletons';
import { NowPlaying } from '@/components/music/now-playing';
import { OnRepeat } from '@/components/music/on-repeat';
import { RecentCard } from '@/components/music/recent-card';
import { SoundProfile } from '@/components/music/sound-profile';
import { type MusicStat, StatsStrip } from '@/components/music/stats-strip';
import { TrackBar } from '@/components/music/track-bar';
import { QueryToggle } from '@/components/query-toggle';
import {
  Comment,
  DisplayHeading,
  SectionLabel,
} from '@/components/ui/typography';
import { resolveArtistImage } from '@/lib/album-art';
import { fmtNum, fmtYear } from '@/lib/format';
import {
  getGenreBreakdown,
  getRecentTracks,
  getTopArtists,
  getTopTracks,
  getUserInfo,
  getWeeklyScrobbles,
  RANGE_TO_PERIOD,
} from '@/lib/lastfm';
import type { MusicRange } from '@/types';

export const metadata: Metadata = {
  title: 'Music',
  description:
    "Adam Rasfeld's listening habits — most-played artists and tracks, a genre sound profile, and recent scrobbles, pulled live from Last.fm.",
  alternates: { canonical: 'https://adamrasfeld.com/music' },
  openGraph: {
    title: 'Music',
    description:
      "Adam Rasfeld's listening habits — top artists, top tracks, and recent scrobbles from Last.fm.",
    url: 'https://adamrasfeld.com/music',
  },
  twitter: {
    title: 'Music',
    description:
      "Adam Rasfeld's listening habits — top artists, top tracks, and recent scrobbles.",
  },
};

const RANGE_OPTIONS: { key: MusicRange; label: string }[] = [
  { key: 'short', label: '4 wks' },
  { key: 'medium', label: '6 mos' },
  { key: 'long', label: 'all time' },
];

function parseRange(value: string | string[] | undefined): MusicRange {
  if (value === 'short' || value === 'medium' || value === 'long') return value;
  return 'long';
}

// Deduped across StatsSection and SoundProfileSection within a render.
const getOverallGenres = cache(() => getGenreBreakdown('overall'));

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] text-muted-foreground">{children}</p>
  );
}

async function StatsSection() {
  const [info, artistsRes, weekly, genres] = await Promise.all([
    getUserInfo(),
    getTopArtists('overall', 1),
    getWeeklyScrobbles(),
    getOverallGenres(),
  ]);
  if (!info) return null;

  const stats: MusicStat[] = [
    { label: 'Scrobbles', value: fmtNum(info.scrobbles) },
    { label: 'Artists', value: fmtNum(artistsRes.total) },
    {
      label: 'Top genre',
      value: genres[0]?.name ?? '—',
      colorClass: 'text-syntax-green',
    },
    {
      label: 'This week',
      value: fmtNum(weekly),
      colorClass: 'text-primary',
    },
    { label: 'Since', value: fmtYear(info.memberSince) },
  ];
  return <StatsStrip stats={stats} />;
}

async function OnRepeatSection() {
  const [{ artists }, { tracks }, info] = await Promise.all([
    getTopArtists('overall', 4),
    getTopTracks('overall', 50),
    getUserInfo(),
  ]);
  if (artists.length === 0) return <Empty>not connected</Empty>;

  const resolved = await Promise.all(
    artists.map(async a => ({
      ...a,
      resolvedImage: await resolveArtistImage(a.name, a.image),
    }))
  );
  const hero = resolved[0];
  const others = resolved.slice(1, 4);
  const topTrack =
    tracks.find(t => t.artist === hero.name) ?? tracks[0] ?? null;
  const share =
    info && info.scrobbles > 0
      ? Math.round((hero.playcount / info.scrobbles) * 1000) / 10
      : 0;

  return (
    <OnRepeat artist={hero} others={others} topTrack={topTrack} share={share} />
  );
}

async function TopArtistsSection({ range }: { range: MusicRange }) {
  const { artists } = await getTopArtists(RANGE_TO_PERIOD[range], 6);
  if (artists.length === 0) return <Empty>no artists available</Empty>;

  const max = Math.max(...artists.map(a => a.playcount), 1);
  const resolved: ResolvedArtist[] = await Promise.all(
    artists.map(async a => ({
      ...a,
      resolvedImage: await resolveArtistImage(a.name, a.image),
    }))
  );

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {resolved.map((artist, i) => (
        <ArtistBadge
          key={`${range}-${artist.name}`}
          artist={artist}
          rank={i + 1}
          max={max}
        />
      ))}
    </div>
  );
}

async function TopTracksSection({ range }: { range: MusicRange }) {
  const { tracks } = await getTopTracks(RANGE_TO_PERIOD[range], 8);
  if (tracks.length === 0) return <Empty>no tracks available</Empty>;

  const max = Math.max(...tracks.map(t => t.playcount), 1);
  return (
    <div>
      {tracks.map((track, i) => (
        <TrackBar
          key={`${range}-${track.name}-${track.artist}`}
          track={track}
          rank={i + 1}
          max={max}
        />
      ))}
    </div>
  );
}

async function SoundProfileSection() {
  const genres = await getOverallGenres();
  return <SoundProfile genres={genres} />;
}

async function RecentlyPlayedSection() {
  const tracks = await getRecentTracks(8);
  if (tracks.length === 0) return <Empty>no recent listens</Empty>;
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
      {tracks.map((track, i) => (
        <RecentCard
          key={`recent-${track.playedAt ?? 'now'}-${i}`}
          track={track}
        />
      ))}
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{
    tracks?: string | string[];
    artists?: string | string[];
  }>;
}

export default async function Music({ searchParams }: PageProps) {
  const params = await searchParams;
  const tracksRange = parseRange(params.tracks);
  const artistsRange = params.artists ? parseRange(params.artists) : 'medium';

  return (
    <div className="min-h-screen">
      {/* Warm connections to the art CDNs before <Image> requests fire. */}
      <link rel="preconnect" href="https://i.scdn.co" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://lastfm.freetls.fastly.net" />

      {/* Hero */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-20 pb-10 [animation-delay:0.1s] md:px-12">
        <Comment className="mb-2.5">music</Comment>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <DisplayHeading className="[font-size:clamp(2.25rem,5vw,2.75rem)]">
            Listening Habits
          </DisplayHeading>
          <div className="flex items-center gap-2 pb-1">
            <div className="relative h-2 w-2">
              <span className="ar-ping absolute inset-0 rounded-full bg-syntax-green" />
              <span className="absolute inset-0 rounded-full bg-syntax-green" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              live from last.fm
            </span>
          </div>
        </div>
      </div>

      {/* Now playing (Spotify client island — polls every 30s) */}
      <NowPlaying />

      {/* Stats */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-10 [animation-delay:0.2s] md:px-12">
        <Suspense fallback={null}>
          <StatsSection />
        </Suspense>
      </div>

      {/* Bento: On Repeat hero + Top Artists */}
      <div className="ar-fade-up mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-6 pt-12 [animation-delay:0.3s] md:px-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Suspense fallback={<OnRepeatSkeleton />}>
            <OnRepeatSection />
          </Suspense>
        </div>
        <div className="lg:col-span-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <SectionLabel
              comment="most played"
              heading="Top Artists"
              color="green"
              headingClassName="text-base md:text-lg"
              className="mb-0"
            />
            <QueryToggle
              param="artists"
              options={RANGE_OPTIONS}
              value={artistsRange}
              className="pb-0.5"
            />
          </div>
          <Suspense
            key={`artists-${artistsRange}`}
            fallback={<ArtistBadgesSkeleton />}
          >
            <TopArtistsSection range={artistsRange} />
          </Suspense>
        </div>
      </div>

      {/* Split: Top Tracks bar chart + Sound Profile */}
      <div className="ar-fade-up mx-auto grid w-full max-w-5xl grid-cols-1 gap-x-12 gap-y-12 px-6 pt-12 [animation-delay:0.45s] md:px-12 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <SectionLabel
              comment="on heavy rotation"
              heading="Top Tracks"
              color="green"
              headingClassName="text-base md:text-lg"
              className="mb-0"
            />
            <QueryToggle
              param="tracks"
              options={RANGE_OPTIONS}
              value={tracksRange}
              className="pb-0.5"
            />
          </div>
          <Suspense
            key={`tracks-${tracksRange}`}
            fallback={<TrackBarsSkeleton />}
          >
            <TopTracksSection range={tracksRange} />
          </Suspense>
        </div>
        <div>
          <SectionLabel
            comment="sound profile"
            heading="What I Listen To"
            color="green"
            headingClassName="text-base md:text-lg"
            className="mb-5"
          />
          <Suspense fallback={<SoundProfileSkeleton />}>
            <SoundProfileSection />
          </Suspense>
        </div>
      </div>

      {/* Recently played */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl px-6 pt-12 pb-20 [animation-delay:0.6s] md:px-12">
        <SectionLabel
          comment="history"
          heading="Recently Played"
          color="green"
          headingClassName="text-base md:text-lg"
          className="mb-5"
        />
        <Suspense fallback={<RecentCardsSkeleton />}>
          <RecentlyPlayedSection />
        </Suspense>
      </div>
    </div>
  );
}
