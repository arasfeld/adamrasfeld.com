import { Suspense } from 'react';

import { ArtistRow } from '@/components/music/artist-row';
import { NowPlaying } from '@/components/music/now-playing';
import { TimeRangeSelector } from '@/components/music/time-range-selector';
import { TrackRow } from '@/components/music/track-row';
import { RowListSkeleton } from '@/components/spotify-skeletons';
import {
  Comment,
  DisplayHeading,
  SectionLabel,
} from '@/components/ui/typography';
import { getRecentlyPlayed, getTopArtists, getTopTracks } from '@/lib/spotify';
import { TimeRange } from '@/types';

type Range = 'short' | 'medium' | 'long';

const RANGE_ENUM: Record<Range, TimeRange> = {
  short: TimeRange.ShortTerm,
  medium: TimeRange.MediumTerm,
  long: TimeRange.LongTerm,
};

function parseRange(value: string | string[] | undefined): Range {
  if (value === 'short' || value === 'medium' || value === 'long') return value;
  return 'long';
}

async function TopTracksList({ range }: { range: Range }) {
  const tracks = await getTopTracks(10, RANGE_ENUM[range]);
  if (tracks.length === 0) {
    return (
      <p className="font-mono text-[11px] text-muted-foreground">
        no tracks available
      </p>
    );
  }
  return (
    <>
      {tracks.map((track, i) => (
        <TrackRow key={`${range}-${track.id}`} track={track} rank={i + 1} />
      ))}
    </>
  );
}

async function TopArtistsList({ range }: { range: Range }) {
  const artists = await getTopArtists(10, RANGE_ENUM[range]);
  if (artists.length === 0) {
    return (
      <p className="font-mono text-[11px] text-muted-foreground">
        no artists available
      </p>
    );
  }
  return (
    <>
      {artists.map((artist, i) => (
        <ArtistRow key={`${range}-${artist.id}`} artist={artist} rank={i + 1} />
      ))}
    </>
  );
}

async function RecentlyPlayedList() {
  const tracks = await getRecentlyPlayed(10);
  if (tracks.length === 0) {
    return (
      <p className="font-mono text-[11px] text-muted-foreground">
        no recent listens
      </p>
    );
  }
  return (
    <>
      {tracks.map((track, i) => (
        <TrackRow
          key={`recent-${track.played_at}`}
          track={track}
          rank={i + 1}
        />
      ))}
    </>
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
  const artistsRange = parseRange(params.artists);

  return (
    <div className="min-h-screen">
      {/* Speeds up the first album-art request by warming the connection to
          Spotify's image CDN before the <Image> requests fire. */}
      <link rel="preconnect" href="https://i.scdn.co" crossOrigin="anonymous" />

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
              live from spotify
            </span>
          </div>
        </div>
      </div>

      {/* Now playing (client island — polls every 30s) */}
      <NowPlaying />

      {/* Top tracks + artists */}
      <div className="ar-fade-up mx-auto grid w-full max-w-5xl grid-cols-1 gap-x-16 gap-y-12 px-6 py-12 [animation-delay:0.3s] md:grid-cols-2 md:px-12">
        <section>
          <SectionLabel
            comment="top tracks"
            heading="Tracks"
            color="green"
            headingClassName="text-base md:text-lg"
            className="mb-4"
          />
          <TimeRangeSelector
            param="tracks"
            value={tracksRange}
            className="mb-5"
          />
          <Suspense
            key={`tracks-${tracksRange}`}
            fallback={<RowListSkeleton />}
          >
            <TopTracksList range={tracksRange} />
          </Suspense>
        </section>

        <section>
          <SectionLabel
            comment="top artists"
            heading="Artists"
            color="green"
            headingClassName="text-base md:text-lg"
            className="mb-4"
          />
          <TimeRangeSelector
            param="artists"
            value={artistsRange}
            className="mb-5"
          />
          <Suspense
            key={`artists-${artistsRange}`}
            fallback={<RowListSkeleton />}
          >
            <TopArtistsList range={artistsRange} />
          </Suspense>
        </section>
      </div>

      {/* Recently played */}
      <div className="ar-fade-up mx-auto w-full max-w-5xl border-border border-t px-6 pt-12 pb-20 [animation-delay:0.5s] md:px-12">
        <SectionLabel
          comment="history"
          heading="Recently Played"
          color="green"
          headingClassName="text-base md:text-lg"
          className="mb-5"
        />
        <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
          <Suspense fallback={<RowListSkeleton />}>
            <RecentlyPlayedList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
