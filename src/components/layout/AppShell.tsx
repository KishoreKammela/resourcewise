
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LogOut,
  UserCircle,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { Breadcrumbs } from '../shared/Breadcrumbs';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { href: '/dashboard/executive-summary', label: 'Executive Summary', icon: Users },
      { href: '/dashboard/resource-overview', label: 'Resource Overview', icon: Users },
      { href: '/dashboard/project-portfolio', label: 'Project Portfolio', icon: Users },
      { href: '/dashboard/financial-summary', label: 'Financial Summary', icon: Users },
    ],
  },
  {
    href: '/resources',
    label: 'Resources',
    icon: Users,
    children: [
      { href: '/resources', label: 'Resource Pool', icon: Users },
      { href: '/resources/skills-matrix', label: 'Skills Matrix', icon: Users },
      { href: '/resources/performance-analytics', label: 'Performance Analytics', icon: Users },
      { href: '/resources/availability-planning', label: 'Availability Planning', icon: Users },
      { href: '/resources/resource-development', label: 'Resource Development', icon: Users },
    ],
  },
  {
    href: '/clients',
    label: 'Clients',
    icon: Briefcase,
    children: [
        { href: '/clients', label: 'Client Portfolio', icon: Users },
        { href: '/clients/relationship-management', label: 'Relationship Management', icon: Users },
        { href: '/clients/contract-management', label: 'Contract Management', icon: Users },
        { href: '/clients/client-analytics', label: 'Client Analytics', icon: Users },
    ]
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: FolderKanban,
    children: [
        { href: '/projects', label: 'Project Portfolio', icon: Users },
        { href: '/projects/project-planning', label: 'Project Planning', icon: Users },
        { href: '/projects/timeline-management', label: 'Timeline Management', icon: Users },
        { href: '/projects/budget-tracking', label: 'Budget Tracking', icon: Users },
        { href: '/projects/performance-metrics', label: 'Performance Metrics', icon: Users },
    ]
  },
  {
    href: '/allocations',
    label: 'Allocations',
    icon: GanttChartSquare,
     children: [
        { href: '/allocations', label: 'Allocation Board', icon: Users },
        { href: '/allocations/capacity-planning', label: 'Capacity Planning', icon: Users },
        { href: '/allocations/conflict-resolution', label: 'Conflict Resolution', icon: Users },
        { href: '/allocations/performance-tracking', label: 'Performance Tracking', icon: Users },
        { href: '/allocations/time-management', label: 'Time Management', icon: Users },
    ]
  },
  {
    href: '/team',
    label: 'Team',
    icon: UsersRound,
    children: [
        { href: '/team', label: 'Team Members', icon: Users },
        { href: '/team/role-management', label: 'Role Management', icon: Users },
        { href: '/team/access-control', label: 'Access Control', icon: Users },
        { href: '/team/team-analytics', label: 'Team Analytics', icon: Users },
    ]
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    children: [
        { href: '/analytics', label: 'Executive Dashboard', icon: Users },
        { href: '/analytics/resource-analytics', label: 'Resource Analytics', icon: Users },
        { href: '/analytics/project-performance', label: 'Project Performance', icon: Users },
        { href: '/analytics/client-insights', label: 'Client Insights', icon: Users },
        { href: '/analytics/financial-reports', label: 'Financial Reports', icon: Users },
        { href: '/analytics/predictive-analytics', label: 'Predictive Analytics', icon: Users },
    ]
  },
];

const settingsNav: NavItem = {
  href: '/settings',
  label: 'Settings',
  icon: Settings,
  children: [
    { href: '/settings', label: 'Company Profile', icon: Users },
    { href: '/settings/platform-configuration', label: 'Platform Configuration', icon: Users },
    { href: '/settings/integration-management', label: 'Integration Management', icon: Users },
    { href: '/settings/subscription-management', label: 'Subscription Management', icon: Users },
  ]
};

function Logo() {
  const { state } = useSidebar();
  return (
    <Link href="/" className="flex items-center gap-2.5">
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

function UserProfile() {
  const { userProfile, logout } = useAuth();
  const { state } = useSidebar();

  if (!userProfile) {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        {state === 'expanded' && <Skeleton className="h-4 w-24" />}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <UserCircle className="h-8 w-8 text-muted-foreground" />
        {state === 'expanded' && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{userProfile.displayName}</span>
            <span className="text-xs text-muted-foreground">{userProfile.email}</span>
          </div>
        )}
      </div>
      {state === 'expanded' && (
        <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8">
          <LogOut />
        </Button>
      )}
    </div>
  );
}

const NavMenuItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = useState(pathname.startsWith(item.href));

  useEffect(() => {
    if (state === 'collapsed') {
      setIsOpen(false);
    }
  }, [state]);

  const isActive = item.children
    ? pathname.startsWith(item.href)
    : pathname === item.href;

  if (!item.children || state === 'collapsed') {
    return (
      <Link
        href={item.children ? item.children[0].href : item.href}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-muted',
          state === 'collapsed' && 'justify-center'
        )}
      >
        <item.icon className="h-5 w-5" />
        {state === 'expanded' && <span>{item.label}</span>}
      </Link>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-muted'
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 transform transition-transform',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="py-1 pl-8">
        <div className="flex flex-col space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === child.href
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const unauthenticatedRoutes = ['/login', '/signup'];

function AuthenticatedAppShell({ children }: { children: ReactNode }) {
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

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const isUnauthenticatedRoute = unauthenticatedRoutes.includes(pathname);

    if (!user && !isUnauthenticatedRoute) {
      router.push('/login');
    }

    if (user && isUnauthenticatedRoute) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-12 w-12 animate-spin text-primary"
          fill="currentColor"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
        </svg>
      </div>
    );
  }

  const isUnauthenticatedRoute = unauthenticatedRoutes.includes(pathname);
  if ((!user && !isUnauthenticatedRoute) || (user && isUnauthenticatedRoute)) {
    return null;
  }

  if (isUnauthenticatedRoute) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AuthenticatedAppShell>{children}</AuthenticatedAppShell>
    </SidebarProvider>
  );
}
