import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-6">
        {/* Mobile hamburger menu - far left */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" />}
            >
              <Menu className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                render={<Link href="/about" className="w-full" />}
              >
                About
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/portfolio" className="w-full" />}
              >
                Portfolio
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/resume" className="w-full" />}
              >
                Resume
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/music" className="w-full" />}
              >
                Music
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/contact" className="w-full" />}
              >
                Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop navigation - left side */}
        <div className="hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="font-bold">Adam Rasfeld</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
            <Link
              href="/portfolio"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Portfolio
            </Link>
            <Link
              href="/resume"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Resume
            </Link>
            <Link
              href="/music"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Music
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Mobile logo - center */}
        <div className="md:hidden flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </div>

        {/* Theme toggle - right side */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
