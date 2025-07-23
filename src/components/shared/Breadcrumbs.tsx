
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { name, href, isLast };
  });

  if (segments.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Dashboard</span>
      </div>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb) => (
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
        ))}
      </ol>
    </nav>
  );
}
