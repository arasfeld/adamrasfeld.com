import {
  Arrow,
  Box,
  Diagram,
  Group,
} from '@/components/portfolio/arch-diagram';

export function JoyceArchDiagram() {
  return (
    <Diagram comment="order state machine">
      <Group label="client" className="mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Box
            label="Cart"
            sub="localStorage\nReact Context"
            color="var(--primary)"
          />
          <Arrow />
          <Box
            label="Checkout form"
            sub="react-hook-form · Zod"
            color="var(--syntax-cyan)"
          />
        </div>
      </Group>

      <div className="mb-4 flex justify-center">
        <Arrow vertical>↓ create Stripe session</Arrow>
      </div>

      <Group label="order lifecycle" className="mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Box label="DRAFT" color="var(--muted-foreground)" />
          <Arrow />
          <Box label="PENDING_PAYMENT" color="var(--syntax-yellow)" />
          <Arrow />
          <Box label="PAID" color="var(--syntax-green)" />
        </div>
      </Group>

      <div className="mb-2 flex justify-center">
        <Arrow vertical>↑ checkout.session.completed</Arrow>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Box
          label="Stripe webhook"
          sub="advances state"
          color="var(--syntax-purple)"
        />
        <Arrow />
        <Box
          label="Resend"
          sub="confirmation email"
          color="var(--syntax-orange)"
        />
      </div>
    </Diagram>
  );
}
