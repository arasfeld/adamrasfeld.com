import type { GenreSlice } from '@/types';

/** Syntax palette cycled across genre slices (bar fill + legend swatch). */
const SLICE_BG = [
  'bg-syntax-green',
  'bg-primary',
  'bg-syntax-purple',
  'bg-syntax-yellow',
  'bg-syntax-cyan',
  'bg-syntax-orange',
];

export function SoundProfile({ genres }: { genres: GenreSlice[] }) {
  if (genres.length === 0) {
    return (
      <p className="font-mono text-[11px] text-muted-foreground">
        no genre data
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex h-3.5 overflow-hidden rounded-full border border-border">
        {genres.map((g, i) => (
          <div
            key={g.name}
            className={SLICE_BG[i % SLICE_BG.length]}
            style={{ width: `${g.pct}%` }}
            title={`${g.name} · ${g.pct}%`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {genres.map((g, i) => (
          <div key={g.name} className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm ${SLICE_BG[i % SLICE_BG.length]}`}
            />
            <span className="flex-1 font-mono text-[11.5px] text-foreground">
              {g.name}
            </span>
            <span className="font-bold font-mono text-[11px] text-foreground-bright tabular-nums">
              {g.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
