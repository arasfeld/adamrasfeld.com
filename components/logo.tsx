import { useId } from 'react';
import { LOGO_PATH_D } from '@/lib/brand';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  const gradientId = `logo-gradient-${useId().replace(/:/g, '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 420 420"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--syntax-purple)" />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradientId})`} d={LOGO_PATH_D} />
    </svg>
  );
}
