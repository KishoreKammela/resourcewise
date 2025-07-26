'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { Logo } from './Logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="font-bold">ResourceWise</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
              <span className="font-bold">ResourceWise</span>
            </Link>
            <div className="mt-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className="-ml-2 rounded-md px-2 py-1 text-lg font-medium"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add search here if needed */}
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
            <ThemeSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
