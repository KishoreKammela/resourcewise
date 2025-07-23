
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
  UserCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { Breadcrumbs } from '../shared/Breadcrumbs';
import { Skeleton } from '../ui/skeleton';
import { useEffect } from 'react';

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
  )
}

const unauthenticatedRoutes = ['/login', '/signup'];

function AuthenticatedAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <>
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
             <Separator className="my-2" />
             <div className="p-2">
                <UserProfile />
             </div>
          </SidebarMenu>
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
    return null; // or a loading spinner
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
