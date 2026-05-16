import {
  Arrow,
  Box,
  Diagram,
  Group,
} from '@/components/portfolio/arch-diagram';

export function MapGameArchDiagram() {
  return (
    <Diagram comment="region queue">
      <Group label="game loop" className="mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Box
            label="Region[]"
            sub="id · name · svgPath"
            color="var(--syntax-cyan)"
          />
          <Arrow />
          <Box label="Shuffle" sub="randomize order" color="var(--primary)" />
          <Arrow />
          <Box
            label="Queue head"
            sub="current target"
            color="var(--syntax-purple)"
          />
        </div>
      </Group>

      <div className="mb-2 flex justify-center">
        <Arrow vertical>↓ user clicks</Arrow>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-6">
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono text-[9px] text-syntax-green tracking-wide">
            correct
          </span>
          <Box
            label="Pop queue"
            sub="next target"
            color="var(--syntax-green)"
          />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono text-[9px] text-syntax-red tracking-wide">
            wrong / skip
          </span>
          <Box
            label="Rotate to tail"
            sub={'attempts++\ncolor: green → red'}
            color="var(--syntax-red)"
          />
        </div>
      </div>
    </Diagram>
  );
}
