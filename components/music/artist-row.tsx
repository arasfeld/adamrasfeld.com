import Image from 'next/image';

import type { Artist as SpotifyArtist } from '@/types';

interface ArtistRowProps {
  artist: SpotifyArtist;
  rank?: number;
}

export function ArtistRow({ artist, rank }: ArtistRowProps) {
  const image = artist.images[1] || artist.images[0];
  const genre = artist.genres[0];

  return (
    <div className="-mx-2 flex items-center gap-3.5 rounded-sm border-b border-border px-2 py-2.5 transition-colors hover:bg-surface-hover">
      {rank !== undefined && (
        <span className="w-5 flex-shrink-0 text-right font-mono text-[10px] text-muted-foreground">
          {String(rank).padStart(2, '0')}
        </span>
      )}
      {image && (
        <Image
          src={image.url}
          alt={artist.name}
          width={34}
          height={34}
          className="flex-shrink-0 rounded-full border border-border object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-xs font-semibold text-foreground-bright">
          {artist.name}
        </div>
        {genre && (
          <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
            {genre}
          </div>
        )}
      </div>
    </div>
  );
}
