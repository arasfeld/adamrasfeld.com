'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { ArtistRow } from '@/components/music/artist-row';
import { NowPlayingBar } from '@/components/music/now-playing-bar';
import { TimeRangeSelector } from '@/components/music/time-range-selector';
import { TrackRow } from '@/components/music/track-row';
import { MusicPageSkeleton } from '@/components/spotify-skeletons';
import {
  Comment,
  DisplayHeading,
  SectionLabel,
} from '@/components/ui/typography';
import {
  useCurrentlyPlaying,
  useRecentlyPlayed,
  useTopArtists,
  useTopTracks,
} from '@/lib/spotify-hooks';
import {
  type Artist as SpotifyArtist,
  type Track as SpotifyTrack,
  TimeRange,
} from '@/types';

type Range = 'short' | 'medium' | 'long';

const RANGE_ENUM: Record<Range, TimeRange> = {
  short: TimeRange.ShortTerm,
  medium: TimeRange.MediumTerm,
  long: TimeRange.LongTerm,
};

function MusicContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tracksRange = (searchParams.get('tracks') as Range) || 'long';
  const artistsRange = (searchParams.get('artists') as Range) || 'long';

  const setRange = (key: 'tracks' | 'artists') => (value: Range) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const { tracks, isLoading: tracksLoading } = useTopTracks(
    10,
    0,
    RANGE_ENUM[tracksRange]
  );
  const { artists, isLoading: artistsLoading } = useTopArtists(
    10,
    0,
    RANGE_ENUM[artistsRange]
  );
  const { tracks: recentTracks, isLoading: recentLoading } =
    useRecentlyPlayed(10);
  const { playing: currentlyPlaying, isLoading: nowPlayingLoading } =
    useCurrentlyPlaying();

  const initialLoading =
    tracksLoading && artistsLoading && recentLoading && nowPlayingLoading;
  if (initialLoading) return <MusicPageSkeleton />;

  return (
    <div className="min-h-screen">
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

      {/* Now playing */}
      {currentlyPlaying?.item && (
        <NowPlayingBar track={currentlyPlaying.item} />
      )}

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
            value={tracksRange}
            onChange={setRange('tracks')}
            className="mb-5"
          />
          {tracksLoading ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              loading...
            </p>
          ) : tracks?.length > 0 ? (
            tracks.map((track: SpotifyTrack, i: number) => (
              <TrackRow
                key={`${tracksRange}-${track.id}`}
                track={track}
                rank={i + 1}
              />
            ))
          ) : (
            <p className="font-mono text-[11px] text-muted-foreground">
              no tracks available
            </p>
          )}
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
            value={artistsRange}
            onChange={setRange('artists')}
            className="mb-5"
          />
          {artistsLoading ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              loading...
            </p>
          ) : artists?.length > 0 ? (
            artists.map((artist: SpotifyArtist, i: number) => (
              <ArtistRow
                key={`${artistsRange}-${artist.id}`}
                artist={artist}
                rank={i + 1}
              />
            ))
          ) : (
            <p className="font-mono text-[11px] text-muted-foreground">
              no artists available
            </p>
          )}
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
          {recentLoading ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              loading...
            </p>
          ) : recentTracks?.length > 0 ? (
            recentTracks.map(
              (track: SpotifyTrack & { played_at: string }, i: number) => (
                <TrackRow
                  key={`recent-${track.played_at}`}
                  track={track}
                  rank={i + 1}
                />
              )
            )
          ) : (
            <p className="font-mono text-[11px] text-muted-foreground">
              no recent listens
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Music() {
  return (
    <Suspense fallback={<MusicPageSkeleton />}>
      <MusicContent />
    </Suspense>
  );
}
