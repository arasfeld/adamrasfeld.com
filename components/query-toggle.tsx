'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';

interface QueryToggleProps<K extends string> {
  /** Search param this toggle writes (e.g. 'sort', 'tracks'). */
  param: string;
  options: readonly { key: K; label: string }[];
  value: K;
  className?: string;
}

/**
 * A small segmented toggle that reflects its selection into a URL search
 * param via router.replace, so server components re-render with the new
 * value. Used for the games sort and music time-range switches.
 */
export function QueryToggle<K extends string>({
  param,
  options,
  value,
  className,
}: QueryToggleProps<K>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onSelect = (next: K) => {
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
      {options.map(option => {
        const active = value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={active}
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
