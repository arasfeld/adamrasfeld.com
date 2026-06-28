'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';

const OPTIONS: { key: 'total' | 'recent'; label: string }[] = [
  { key: 'total', label: 'all time' },
  { key: 'recent', label: '2 weeks' },
];

export function SortToggle({
  value,
  className,
}: {
  value: 'total' | 'recent';
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onSelect = (next: 'total' | 'recent') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', next);
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div
      className={cn('flex gap-1', isPending && 'opacity-60', className)}
      aria-busy={isPending}
    >
      {OPTIONS.map(option => {
        const active = value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onSelect(option.key)}
            className={cn(
              'rounded-sm border px-2.5 py-1 font-mono text-[10px] transition-colors',
              active
                ? 'border-border-soft bg-surface-hover text-foreground-bright'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
