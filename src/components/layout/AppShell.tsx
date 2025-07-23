'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  FolderKanban,
  GanttChartSquare,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Users,
  UsersRound,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/resources', label: 'Resources', icon: Users },
  { href: '/clients', label: 'Clients', icon: Briefcase },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/allocations', label: 'Allocations', icon: GanttChartSquare },
  { href: '/team', label: 'Team', icon: UsersRound },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const settingsNav: NavItem = {
  href: '/settings',
  label: 'Settings',
  icon: Settings,
};

function Logo() {
  const { state } = useSidebar();
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6 text-primary"
        fill="currentColor"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
      </svg>
      {state === 'expanded' && (
        <h1 className="text-lg font-bold">ResourceWise</h1>
      )}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.href === '/'
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
                  tooltip={{
                    children: item.label,
                    side: 'right',
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(settingsNav.href)}
                tooltip={{ children: settingsNav.label, side: 'right' }}
              >
                <Link href={settingsNav.href}>
                  <settingsNav.icon />
                  <span>{settingsNav.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Can add breadcrumbs or page title here */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
