'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { Breadcrumbs } from '../shared/Breadcrumbs';
import { cn } from '@/lib/utils';
import type { NavItem } from './AppShell';
import { NavMenuItem } from './AppShell';
import { UserProfile } from '../shared/UserProfile';


function Logo() {
  const { state } = useSidebar();
  return (
    <Link href="/platform-admin/dashboard" className="flex items-center gap-2.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-7 w-7 text-primary"
        fill="currentColor"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
      </svg>
      {state === 'expanded' && (
        <h1 className="text-xl font-bold font-serif tracking-tight">ResourceWise</h1>
      )}
    </Link>
  );
}

export function AppShell({ children, navItems, settingsNav }: { children: ReactNode, navItems: NavItem[], settingsNav: NavItem }) {
    const { state } = useSidebar();
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
           <div className="flex flex-col gap-1">
              {[...navItems].map((item) => (
                <NavMenuItem key={item.href} item={item} />
              ))}
            </div>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
           <div className="flex flex-col gap-1">
              <NavMenuItem item={settingsNav} />
           </div>
          <Separator className="my-2" />
          <div className={cn("p-2", state === 'collapsed' && 'p-0 flex justify-center')}>
            <UserProfile />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 px-4 md:px-6">
          <SidebarTrigger />
          <Breadcrumbs />
          <div className="flex-1" />
          <ThemeSwitcher />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </>
  );
}
