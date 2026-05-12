'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { useScrolled } from './use-scrolled';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'about', href: '/about' },
  { label: 'portfolio', href: '/portfolio' },
  { label: 'resume', href: '/resume' },
  { label: 'music', href: '/music' },
  { label: 'contact', href: '/contact' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function Header() {
  const scrolled = useScrolled(24);
  const pathname = usePathname() ?? '/';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors',
        scrolled
          ? 'border-b border-border-soft bg-background/85 backdrop-blur'
          : 'border-b border-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-6 font-mono">
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
          className="flex items-center gap-2 md:gap-3 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <span className="text-primary">
            <Logo />
          </span>
          <span className="hidden sm:inline text-[11px] text-muted-foreground">
            adam<span className="text-primary">.</span>rasfeld
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 mx-auto pl-2">
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
