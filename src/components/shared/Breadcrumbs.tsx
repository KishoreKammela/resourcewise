'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// A helper function to format segment names
const formatSegment = (segment: string) => {
  return segment
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const { userRole } = useAuth();
  const segments = pathname.split('/').filter(Boolean);

  const homeText = userRole === 'platform' ? 'Platform Dashboard' : 'Dashboard';
  const homeLink = '/';

  // If we are on the root dashboard, don't show any breadcrumbs.
  if (
    segments.length === 0 ||
    (segments.length === 1 && segments[0] === 'dashboard')
  ) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{homeText}</span>
      </div>
    );
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;
    let name = formatSegment(segment);
    let hide = false;

    // Handle the dynamic resource routes
    if (segments[0] === 'resources' && index === 1) {
      name = 'Details';
    }
    // Handle the dynamic client routes
    if (segments[0] === 'clients' && index === 1) {
      name = 'Details';
    }
    // A simple way to hide the ID segment itself
    if (
      (segments[0] === 'resources' || segments[0] === 'clients') &&
      index === 1
    ) {
      hide = true;
    }

    return { name, href, isLast, originalSegment: segment, hide };
  });

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href={homeLink}
            className="text-muted-foreground hover:text-foreground"
          >
            {homeText}
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb) => {
          if (breadcrumb.hide) {
            return null;
          }

          return (
            <li key={breadcrumb.href}>
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <Link
                  href={breadcrumb.href}
                  className={
                    breadcrumb.isLast
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                  aria-current={breadcrumb.isLast ? 'page' : undefined}
                >
                  {breadcrumb.name}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
