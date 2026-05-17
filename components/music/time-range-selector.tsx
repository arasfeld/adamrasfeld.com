'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';

const RANGES: { key: 'short' | 'medium' | 'long'; label: string }[] = [
  { key: 'short', label: '4 wks' },
  { key: 'medium', label: '6 mos' },
  { key: 'long', label: 'all time' },
];

interface TimeRangeSelectorProps {
  param: 'tracks' | 'artists';
  value: 'short' | 'medium' | 'long';
  className?: string;
}

export function TimeRangeSelector({
  param,
  value,
  className,
}: TimeRangeSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onSelect = (next: 'short' | 'medium' | 'long') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(param, next);
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div
      className={cn('flex gap-1', isPending && 'opacity-60', className)}
      aria-busy={isPending}
    >
      {RANGES.map(range => {
        const active = value === range.key;
        return (
          <button
            key={range.key}
            type="button"
            onClick={() => onSelect(range.key)}
            className={cn(
              'rounded-sm border px-2.5 py-1 font-mono text-[10px] transition-colors',
              active
                ? 'border-border-soft bg-surface-hover text-foreground-bright'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
