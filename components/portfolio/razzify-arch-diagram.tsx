import {
  Arrow,
  Box,
  Diagram,
  Group,
} from '@/components/portfolio/arch-diagram';

export function RazzifyArchDiagram() {
  return (
    <Diagram comment="api + sdk + token refresh">
      <Group label="tauri 2 shell (rust)">
        <div className="flex flex-col items-center gap-1.5">
          <Box label="React App" color="var(--primary)" minWidth={210} />
          <Arrow vertical />
          <Box
            label="Token refresh singleton"
            sub="serializes concurrent 401s"
            color="var(--syntax-purple)"
            minWidth={210}
          />
          <Arrow vertical />
          <div className="flex flex-wrap items-stretch justify-center gap-1.5">
            <Box
              label="Spotify Web API"
              sub="library · discovery\nvia RTK Query"
              color="var(--syntax-green)"
            />
            <Box
              label="Web Playback SDK"
              sub="in-process device\nplay · pause · skip"
              color="var(--syntax-yellow)"
            />
          </div>
        </div>
      </Group>
    </Diagram>
  );
}
