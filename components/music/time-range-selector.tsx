'use client';

import { cn } from '@/lib/utils';

const RANGES: { key: 'short' | 'medium' | 'long'; label: string }[] = [
  { key: 'short', label: '4 wks' },
  { key: 'medium', label: '6 mos' },
  { key: 'long', label: 'all time' },
];

interface TimeRangeSelectorProps {
  value: 'short' | 'medium' | 'long';
  onChange: (value: 'short' | 'medium' | 'long') => void;
  className?: string;
}

export function TimeRangeSelector({
  value,
  onChange,
  className,
}: TimeRangeSelectorProps) {
  return (
    <div className={cn('flex gap-1', className)}>
      {RANGES.map(range => {
        const active = value === range.key;
        return (
          <button
            key={range.key}
            type="button"
            onClick={() => onChange(range.key)}
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
