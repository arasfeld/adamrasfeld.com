import Link from 'next/link';

import {
  Comment,
  type SyntaxColor,
  syntaxColorClass,
} from '@/components/ui/typography';
import { cn } from '@/lib/utils';

/** The `← portfolio · // case study` header shared by every detail page. */
export function CaseStudyBackLink() {
  return (
    <div className="ar-fade-up mb-9 flex items-center gap-2">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        ← portfolio
      </Link>
      <span className="text-border">·</span>
      <Comment className="!text-[11px]">case study</Comment>
    </div>
  );
}

/** Two-column striped layer/tech table for the Tech Stack section. */
export function StackTable({
  rows,
}: {
  rows: { layer: string; tech: string }[];
}) {
  return (
    <div className="overflow-hidden border border-border">
      {rows.map((row, i) => (
        <div
          key={row.layer}
          className={cn(
            'grid grid-cols-[110px_1fr] gap-6 px-4 py-3',
            i < rows.length - 1 && 'border-border border-b',
            i % 2 === 1 && 'bg-card/60'
          )}
        >
          <div className="pt-px font-mono text-[10px] text-muted-foreground">
            {row.layer}
          </div>
          <div className="font-mono text-[11px] text-foreground">
            {row.tech}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Two-column ✓-checklist grid for the Key Features section. */
export function FeatureList({
  items,
  color = 'green',
}: {
  items: string[];
  color?: SyntaxColor;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
      {items.map(item => (
        <div
          key={item}
          className="flex items-start gap-3 border-border border-b py-3"
        >
          <span
            aria-hidden="true"
            className={cn(
              'mt-px flex-shrink-0 font-mono text-xs',
              syntaxColorClass[color]
            )}
          >
            ✓
          </span>
          <span className="font-mono text-[11px] text-muted-foreground leading-relaxed">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}
