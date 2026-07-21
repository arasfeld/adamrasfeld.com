'use client';

import { useEffect } from 'react';

import { Comment } from '@/components/ui/typography';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="ar-fade-up flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center md:px-12">
      <Comment className="mb-4 text-[11px]">error</Comment>

      <div
        aria-hidden="true"
        className="select-none font-bold text-muted-foreground leading-none [font-size:clamp(5rem,14vw,8rem)] [letter-spacing:-0.05em]"
      >
        500
      </div>

      <p className="mt-5 max-w-xs font-mono text-[12px] text-muted-foreground leading-[1.8]">
        Something went wrong.
        <br />
        <span className="opacity-60">Probably temporary — try again.</span>
      </p>

      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
      >
        <span aria-hidden="true" className="opacity-60">
          ↻
        </span>
        try again
      </button>
    </div>
  );
}
