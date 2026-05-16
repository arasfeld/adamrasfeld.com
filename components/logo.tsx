import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Stylized A·R monogram. Inherits `currentColor` so it themes with the
 * surrounding text color (typically `text-primary` in the header).
 */
export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 420 420"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="m175.177 288.742 15.448 36.387H19.539L123.798 69.673h44.473L272.05 324.965h-41.265l-85.397-209.951-69.415 173.444 99.204.284ZM204.322 69.673l15.86 38.367 98.227.571s34.147 6.151 35.83 40.255c1.234 25.019-30.174 44.534-35.935 44.617-6.216.089-65.451.24-65.451.24l19.197 39.718 29.011-.039 49.413 91.727h45.854l-58.149-100.038s19.572-10.151 25.138-14.761c5.779-5.083 28.642-24.087 30.233-58.08-.667-32.897-17.155-53.027-21.144-57.346-12.226-13.496-39.208-25.365-46.924-25.231-8.806.02-121.58-.419-121.16 0z"
      />
    </svg>
  );
}
