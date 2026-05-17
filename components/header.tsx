import Link from 'next/link';

import { DesktopNav } from '@/components/header/desktop-nav';
import { MobileMenu } from '@/components/header/mobile-menu';
import { ScrollShell } from '@/components/header/scroll-shell';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

const NAV = [
  { label: 'about', href: '/about' },
  { label: 'portfolio', href: '/portfolio' },
  { label: 'resume', href: '/resume' },
  { label: 'music', href: '/music' },
  { label: 'contact', href: '/contact' },
];

export function Header() {
  return (
    <ScrollShell>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 font-mono">
        <MobileMenu items={NAV} />

        <Link
          href="/"
          className="group absolute left-1/2 flex -translate-x-1/2 items-center gap-2 md:static md:translate-x-0 md:gap-3"
        >
          <span className="text-primary">
            <Logo />
          </span>
          <span className="hidden text-[11px] text-muted-foreground transition-colors group-hover:text-foreground sm:inline">
            adam<span className="text-primary">.</span>rasfeld
          </span>
        </Link>

        <DesktopNav items={NAV} />

        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </ScrollShell>
  );
}
