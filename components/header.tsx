'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useScrolled } from './use-scrolled';

const NAV = [
  { label: 'about', href: '/about' },
  { label: 'portfolio', href: '/portfolio' },
  { label: 'resume', href: '/resume' },
  { label: 'music', href: '/music' },
  { label: 'contact', href: '/contact' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const scrolled = useScrolled(24);
  const pathname = usePathname() ?? '/';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors',
        scrolled
          ? 'border-border-soft border-b bg-background/85 backdrop-blur'
          : 'border-transparent border-b'
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 font-mono">
        {/* Mobile hamburger menu - far left */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon-sm" />}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {NAV.map(item => (
                <DropdownMenuItem
                  key={item.href}
                  render={<Link href={item.href} className="w-full" />}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logo + brand - left on desktop, center on mobile */}
        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 md:static md:translate-x-0 md:gap-3"
        >
          <span className="text-primary">
            <Logo />
          </span>
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            adam<span className="text-primary">.</span>rasfeld
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="mx-auto hidden items-center gap-7 pl-2 md:flex">
          {NAV.map(item => {
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

        {/* Theme toggle - right side */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
