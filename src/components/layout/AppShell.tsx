'use client';

import * as React from 'react';
import { type ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AreaChart,
  BarChart3,
  Briefcase,
  Building,
  ChevronDown,
  FolderKanban,
  GanttChartSquare,
  LayoutDashboard,
  LucideIcon,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
  UsersRound,
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
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { Breadcrumbs } from '../shared/Breadcrumbs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { UserProfile } from '../shared/UserProfile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { InactivityWarningDialog } from '../shared/InactivityWarningDialog';
import { Logo } from '../public/Logo';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: NavItem[];
};

export const companyNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/resources',
    label: 'Resources',
    icon: Users,
    children: [
      { href: '/resources', label: 'Resource Pool', icon: Users },
      { href: '/resources/skills-matrix', label: 'Skills Matrix', icon: Users },
      {
        href: '/resources/performance-analytics',
        label: 'Performance Analytics',
        icon: Users,
      },
      {
        href: '/resources/availability-planning',
        label: 'Availability Planning',
        icon: Users,
      },
      {
        href: '/resources/resource-development',
        label: 'Resource Development',
        icon: Users,
      },
    ],
  },
  {
    href: '/clients',
    label: 'Clients',
    icon: Briefcase,
    children: [
      { href: '/clients', label: 'Client Portfolio', icon: Users },
      {
        href: '/clients/relationship-management',
        label: 'Relationship Management',
        icon: Users,
      },
      {
        href: '/clients/contract-management',
        label: 'Contract Management',
        icon: Users,
      },
      {
        href: '/clients/client-analytics',
        label: 'Client Analytics',
        icon: Users,
      },
    ],
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: FolderKanban,
    children: [
      { href: '/projects', label: 'Project Portfolio', icon: Users },
      {
        href: '/projects/project-planning',
        label: 'Project Planning',
        icon: Users,
      },
      {
        href: '/projects/timeline-management',
        label: 'Timeline Management',
        icon: Users,
      },
      {
        href: '/projects/budget-tracking',
        label: 'Budget Tracking',
        icon: Users,
      },
      {
        href: '/projects/performance-metrics',
        label: 'Performance Metrics',
        icon: Users,
      },
    ],
  },
  {
    href: '/allocations',
    label: 'Allocations',
    icon: GanttChartSquare,
    children: [
      { href: '/allocations', label: 'Allocation Board', icon: Users },
      {
        href: '/allocations/capacity-planning',
        label: 'Capacity Planning',
        icon: Users,
      },
      {
        href: '/allocations/conflict-resolution',
        label: 'Conflict Resolution',
        icon: Users,
      },
      {
        href: '/allocations/performance-tracking',
        label: 'Performance Tracking',
        icon: Users,
      },
      {
        href: '/allocations/time-management',
        label: 'Time Management',
        icon: Users,
      },
    ],
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
    ],
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    children: [
      { href: '/analytics', label: 'Executive Dashboard', icon: Users },
      {
        href: '/analytics/resource-analytics',
        label: 'Resource Analytics',
        icon: Users,
      },
      {
        href: '/analytics/project-performance',
        label: 'Project Performance',
        icon: Users,
      },
      {
        href: '/analytics/client-insights',
        label: 'Client Insights',
        icon: Users,
      },
      {
        href: '/analytics/financial-reports',
        label: 'Financial Reports',
        icon: Users,
      },
      {
        href: '/analytics/predictive-analytics',
        label: 'Predictive Analytics',
        icon: Users,
      },
    ],
  },
];

export const companySettingsNav: NavItem = {
  href: '/settings',
  label: 'Settings',
  icon: Settings,
  children: [
    { href: '/settings', label: 'Company Profile', icon: Users },
    {
      href: '/settings/integration-management',
      label: 'Integration Management',
      icon: Users,
    },
    {
      href: '/settings/subscription-management',
      label: 'Subscription Management',
      icon: Users,
    },
  ],
};

const platformNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/companies',
    label: 'Customer Companies',
    icon: Building,
  },
  {
    href: '/platform-analytics',
    label: 'Platform Analytics',
    icon: AreaChart,
  },
  {
    href: '/subscriptions',
    label: 'Subscriptions',
    icon: Ticket,
  },
  {
    href: '/support',
    label: 'Support Tickets',
    icon: Ticket,
  },
];

const platformSettingsNav: NavItem = {
  href: '/settings',
  label: 'System Admin',
  icon: Settings,
  children: [
    {
      href: '/settings/users',
      label: 'Platform Users',
      icon: Users,
    },
    {
      href: '/settings/platform-configuration',
      label: 'Platform Configuration',
      icon: Users,
    },
    {
      href: '/settings/roles',
      label: 'Roles & Permissions',
      icon: ShieldCheck,
    },
  ],
};

function AppLogo() {
  const { state } = useSidebar();
  const href = '/dashboard';

  return (
    <Link href={href} className="flex items-center gap-2.5">
      <Logo />
      {state === 'expanded' && (
        <h1 className="text-xl font-bold font-serif tracking-tight">
          ResourceWise
        </h1>
      )}
    </Link>
  );
}

export const NavMenuItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = React.useState(
    pathname.startsWith(item.href) && item.href !== '/dashboard'
  );

  React.useEffect(() => {
    if (state === 'collapsed') {
      setIsOpen(false);
    }
  }, [state]);

  const isActive = item.children
    ? pathname.startsWith(item.href)
    : pathname === item.href;

  const linkContent = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-muted',
        state === 'collapsed' && 'justify-center'
      )}
    >
      <item.icon className="h-6 w-6" />
      {state === 'expanded' && <span>{item.label}</span>}
    </div>
  );

  if (!item.children || state === 'collapsed') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href}>{linkContent}</Link>
          </TooltipTrigger>
          {state === 'collapsed' && (
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-muted'
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-6 w-6" />
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

const unauthenticatedRoutes = [
  '/',
  '/login',
  '/signup',
  '/signup/platform',
  '/pricing',
  '/features',
  '/contact',
  '/case-studies',
];

function AuthenticatedShell({ children }: { children: ReactNode }) {
  const { state } = useSidebar();
  const { userRole } = useAuth();
  const { isIdle, countdown, reset, logout } = useInactivityTimeout();

  const navItems = userRole === 'platform' ? platformNavItems : companyNavItems;
  const settingsNav =
    userRole === 'platform' ? platformSettingsNav : companySettingsNav;

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <AppLogo />
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
          <div
            className={cn(
              'p-2',
              state === 'collapsed' && 'p-0 flex justify-center'
            )}
          >
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
      <InactivityWarningDialog
        isOpen={isIdle}
        countdown={countdown}
        onStayLoggedIn={reset}
        onLogout={logout}
      />
    </>
  );
}

function FullPageLoader() {
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

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { sessionStatus, loading } = useAuth();

  useEffect(() => {
    if (sessionStatus === 'loading') {
      return;
    }

    const isPublicRoute = unauthenticatedRoutes.some((route) => {
      if (route.startsWith('/signup/invite')) {
        return pathname.startsWith('/signup/invite');
      }
      return route === pathname;
    });

    if (sessionStatus === 'authenticated' && isPublicRoute) {
      router.push('/dashboard');
    } else if (sessionStatus === 'unauthenticated' && !isPublicRoute) {
      router.push('/login');
    }
  }, [sessionStatus, pathname, router]);

  const isPublicRoute = unauthenticatedRoutes.some((route) => {
    if (route.startsWith('/signup/invite')) {
      return pathname.startsWith('/signup/invite');
    }
    return route === pathname;
  });

  if (loading) {
    return <FullPageLoader />;
  }

  if (sessionStatus === 'unauthenticated' && isPublicRoute) {
    return <>{children}</>;
  }

  if (sessionStatus === 'authenticated' && !isPublicRoute) {
    return (
      <SidebarProvider>
        <AuthenticatedShell>{children}</AuthenticatedShell>
      </SidebarProvider>
    );
  }

  return <FullPageLoader />;
}
