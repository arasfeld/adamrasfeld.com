import type { Metadata } from 'next';
import Link from 'next/link';

import { Comment } from '@/components/ui/typography';

export const metadata: Metadata = {
  title: '404 · Not Found',
  description: "This page doesn't exist. Maybe a broken link, or it moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="ar-fade-up flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center md:px-12">
      <Comment className="mb-4 text-[11px]">404</Comment>

      <div
        aria-hidden="true"
        className="ar-glitch select-none font-bold text-muted-foreground leading-none [font-size:clamp(5rem,14vw,8rem)] [letter-spacing:-0.05em]"
      >
        404
      </div>

      <p className="mt-5 max-w-xs font-mono text-[12px] text-muted-foreground leading-[1.8]">
        This page doesn't exist.
        <br />
        <span className="opacity-60">Maybe a broken link, or it moved.</span>
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
      >
        <span aria-hidden="true" className="opacity-60">
          ←
        </span>
        go home
      </Link>
    </div>
  );
}
