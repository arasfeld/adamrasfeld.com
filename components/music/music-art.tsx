import { ArtFill, ArtThumb } from '@/components/art-image';
import { cn } from '@/lib/utils';

interface MusicArtProps {
  name: string;
  src?: string;
  size: number;
  round?: boolean;
  showLetter?: boolean;
  priority?: boolean;
  className?: string;
}

/** Fixed-size album/artist thumbnail with a deterministic gradient fallback. */
export function MusicArt({
  name,
  src,
  size,
  round,
  showLetter,
  priority,
  className,
}: MusicArtProps) {
  return (
    <ArtThumb
      name={name}
      src={src}
      width={size}
      height={size}
      showLetter={!!showLetter}
      priority={priority}
      className={cn(
        'border border-border',
        round ? 'rounded-full' : 'rounded-sm',
        className
      )}
    />
  );
}

/** Fill-style art (hero banner, recent cards). Parent must be relative + sized. */
export function MusicArtFill(props: {
  name: string;
  src?: string;
  priority?: boolean;
  className?: string;
}) {
  return <ArtFill {...props} />;
}
