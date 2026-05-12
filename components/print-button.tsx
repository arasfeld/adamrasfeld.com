'use client';

import { cn } from '@/lib/utils';

interface PrintButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function PrintButton({
  className,
  children = '↓ save as pdf',
}: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined') window.print();
      }}
      className={cn(
        'rounded-sm border border-border bg-transparent px-3 py-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary hover:text-primary',
        className
      )}
    >
      {children}
    </button>
  );
}
