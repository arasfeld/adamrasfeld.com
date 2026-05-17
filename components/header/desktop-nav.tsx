'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  items: NavItem[];
}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav({ items }: DesktopNavProps) {
  const pathname = usePathname() ?? '/';

  return (
    <nav className="mx-auto hidden items-center gap-7 pl-2 md:flex">
      {items.map(item => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-[11px] tracking-wide transition-colors hover:text-foreground',
              active ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
