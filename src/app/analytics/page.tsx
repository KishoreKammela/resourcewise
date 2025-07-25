'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import {
  getDashboardAnalytics,
  type DashboardAnalytics,
} from '@/app/actions/analyticsActions';
import { Users, FolderKanban, Briefcase, Percent } from 'lucide-react';

function KpiCard({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

function AnalyticsContent() {
  const { companyProfile, loading: authLoading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<DashboardAnalytics | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const loading = authLoading || isPending;

  useEffect(() => {
    if (companyProfile?.id) {
      startTransition(() => {
        getDashboardAnalytics(companyProfile.id).then(setAnalyticsData);
      });
    }
  }, [companyProfile]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Executive Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Resources"
          value={analyticsData?.kpis.totalResources ?? 0}
          icon={Users}
          isLoading={loading}
        />
        <KpiCard
          title="Active Projects"
          value={analyticsData?.kpis.activeProjects ?? 0}
          icon={FolderKanban}
          isLoading={loading}
        />
        <KpiCard
          title="Total Clients"
          value={analyticsData?.kpis.totalClients ?? 0}
          icon={Briefcase}
          isLoading={loading}
        />
        <KpiCard
          title="Overall Utilization"
          value={`${analyticsData?.kpis.utilization ?? 0}%`}
          icon={Percent}
          isLoading={loading}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Resource Capacity vs. Allocated</CardTitle>
          <CardDescription>
            An overview of your entire talent pool&apos;s capacity versus their
            current allocation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="w-full h-[300px]">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={analyticsData?.utilizationChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  cursor={{ fill: 'hsla(var(--muted))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="capacity"
                  fill="hsl(var(--chart-1))"
                  name="Total Capacity (Resources)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="billable"
                  fill="hsl(var(--chart-2))"
                  name="Allocated (Resources)"
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>More Analytics Coming Soon</CardTitle>
          <CardDescription>
            We are working on providing more in-depth analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-10">
            <p>
              Predictive analytics, project profitability, and more will appear
              here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AppShell>
      <AnalyticsContent />
    </AppShell>
  );
}
