import {
  Arrow,
  Box,
  Diagram,
  Group,
} from '@/components/portfolio/arch-diagram';

export function SproutArchDiagram() {
  return (
    <Diagram comment="sync architecture">
      <Group label="mobile app" className="mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Box label="UI" sub="React Native" color="var(--primary)" />
          <Arrow />
          <Box
            label="SQLite + Drizzle"
            sub="useLiveQuery · offline reads"
            color="var(--syntax-green)"
          />
          <Arrow>↔</Arrow>
          <Box
            label="Sync Engine"
            sub="push / pull · pending queue"
            color="var(--syntax-purple)"
          />
        </div>
      </Group>

      <div className="mb-2 flex justify-end pr-16">
        <Arrow vertical />
      </div>

      <div className="flex justify-end">
        <Box
          label="Supabase"
          sub={'Postgres + RLS · Auth\nStorage · Realtime (future)'}
          color="var(--syntax-yellow)"
        />
      </div>
    </Diagram>
  );
}
