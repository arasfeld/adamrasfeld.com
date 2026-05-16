import {
  Arrow,
  Box,
  Diagram,
  Group,
} from '@/components/portfolio/arch-diagram';

export function FreeboxArchDiagram() {
  return (
    <Diagram comment="claim flow">
      <Group label="actors" className="mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Box label="Poster" sub="lists an item" color="var(--primary)" />
          <Arrow />
          <Box
            label="Item"
            sub="photo · category\nlocation"
            color="var(--syntax-cyan)"
          />
          <Arrow>←</Arrow>
          <Box
            label="Interested users"
            sub="tap interested"
            color="var(--syntax-purple)"
          />
        </div>
      </Group>

      <div className="mb-2 flex justify-center">
        <Arrow vertical>↓ poster picks one</Arrow>
      </div>

      <Group label="lifecycle">
        <div className="flex flex-wrap items-center gap-1.5">
          <Box label="AVAILABLE" color="var(--syntax-green)" />
          <Arrow />
          <Box label="PENDING" color="var(--syntax-yellow)" />
          <Arrow />
          <Box label="TAKEN" color="var(--muted-foreground)" />
        </div>
      </Group>
    </Diagram>
  );
}
