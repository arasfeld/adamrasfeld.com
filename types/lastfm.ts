export type LastfmPeriod =
  | '7day'
  | '1month'
  | '3month'
  | '6month'
  | '12month'
  | 'overall';

/** UI time-range keys used by the music page's QueryToggle. */
export type MusicRange = 'short' | 'medium' | 'long';

export interface LastfmArtist {
  name: string;
  playcount: number;
  rank: number;
  url: string;
  /** Largest non-blank Last.fm image; usually absent for artists. */
  image?: string;
}

export interface LastfmTrack {
  name: string;
  artist: string;
  playcount: number;
  rank: number;
  url: string;
  /** Album art from Last.fm; usually present for tracks. */
  image?: string;
}

export interface LastfmRecentTrack {
  name: string;
  artist: string;
  album?: string;
  image?: string;
  nowPlaying: boolean;
  /** Unix seconds; absent when currently playing. */
  playedAt?: number;
}

export interface LastfmUserInfo {
  scrobbles: number;
  /** Unix seconds. */
  memberSince: number;
}

export interface TopArtistsResult {
  artists: LastfmArtist[];
  /** @attr.total — lifetime distinct-artist count. */
  total: number;
}

export interface TopTracksResult {
  tracks: LastfmTrack[];
  total: number;
}

export interface GenreSlice {
  name: string;
  pct: number;
}
