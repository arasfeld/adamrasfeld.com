import {
  Arrow,
  Box,
  Diagram,
  Group,
} from '@/components/portfolio/arch-diagram';

export function FluxArchDiagram() {
  return (
    <Diagram comment="local-only data flow">
      <Group label="device — no backend">
        <div className="flex flex-wrap items-center gap-1.5">
          <Box
            label="UI"
            sub="React Native\nExpo Router"
            color="var(--primary)"
          />
          <Arrow>↔</Arrow>
          <Box
            label="Redux thunks"
            sub="async I/O bridge"
            color="var(--syntax-purple)"
          />
          <Arrow>↔</Arrow>
          <Box
            label="StorageService"
            sub="namespaced keys\nsingleton"
            color="var(--syntax-cyan)"
          />
          <Arrow>↔</Arrow>
          <Box
            label="AsyncStorage"
            sub="device-local"
            color="var(--syntax-green)"
          />
        </div>
      </Group>
    </Diagram>
  );
}
