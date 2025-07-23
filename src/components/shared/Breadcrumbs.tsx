
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

// A helper function to format segment names
const formatSegment = (segment: string) => {
  return segment
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // If we are on the root dashboard, don't show any breadcrumbs.
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
     return (
       <div className="flex items-center gap-2 text-sm text-muted-foreground">
         <span className="font-semibold text-foreground">Dashboard</span>
       </div>
     );
  }
  
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const name = formatSegment(segment);
    return { name, href, isLast };
  });


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
