'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block">
              ResourceWise
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
            <Link
              href="/case-studies"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Case Studies
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center">
            {!loading &&
              (user ? (
                <Button asChild>
                  <Link href="/analytics">Dashboard</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
