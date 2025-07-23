'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarProvider,
} from '@/components/ui/sidebar';
import { 
  Users,
  Building,
  Ticket,
  AreaChart,
  ShieldCheck,
  LayoutDashboard,
  LucideIcon,
  Settings
} from 'lucide-react';
import { NavItem } from '@/components/layout/AppShell';
import { AppShell } from '@/components/layout/PlatformAppShell';


const platformNavItems: NavItem[] = [
  {
    href: '/platform-admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/platform-admin/companies',
    label: 'Customer Companies',
    icon: Building,
  },
  {
    href: '/platform-admin/analytics',
    label: 'Platform Analytics',
    icon: AreaChart,
  },
  {
    href: '/platform-admin/subscriptions',
    label: 'Subscriptions',
    icon: Ticket,
  },
  {
    href: '/platform-admin/support',
    label: 'Support Tickets',
    icon: Ticket,
  },
];

const platformSettingsNav: NavItem = {
  href: '/platform-admin/settings',
  label: 'System Admin',
  icon: Settings,
  children: [
    {
      href: '/platform-admin/settings/users',
      label: 'Platform Users',
      icon: Users
    },
    {
      href: '/platform-admin/settings/roles',
      label: 'Roles & Permissions',
      icon: ShieldCheck
    }
  ]
};

export default function PlatformAdminLayout({ children }: { children: ReactNode }) {
  const { user, userRole, loading } = useAuth();

  if (loading || !user || userRole !== 'platform') {
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

  return (
    <SidebarProvider>
        <AppShell navItems={platformNavItems} settingsNav={platformSettingsNav}>
            {children}
        </AppShell>
    </SidebarProvider>
  );
}
