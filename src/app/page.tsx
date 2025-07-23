'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  resourceUtilizationData,
  projectHealthData,
  kpis,
  upcomingDeadlines,
} from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];


function PlatformAdminDashboard() {
  return (
    <div>
      <PageHeader title="Platform Admin Dashboard" />
      <div className="p-4">
        <p>Welcome to the platform administration area.</p>
        <p>Here you can manage companies, subscriptions, and platform settings.</p>
      </div>
    </div>
  );
}

function CompanyDashboardContents() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Executive Dashboard" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={kpi.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col flex-grow justify-end">
              <div className="text-3xl font-bold font-serif">{kpi.value}</div>
              <p className="text-xs text-muted-foreground pt-1">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>
              Billable vs. Non-Billable hours this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={resourceUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}h`}
                />
                <Tooltip
                  cursor={{ fill: 'hsla(var(--muted))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius-md)'
                  }}
                />
                <Legend wrapperStyle={{fontSize: '0.8rem', paddingTop: '1rem'}}/>
                <Bar
                  dataKey="billable"
                  name="Billable"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="nonBillable"
                  name="Non-Billable"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Project Health</CardTitle>
            <CardDescription>
              Current status of all active projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={projectHealthData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {projectHealthData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                   contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius-md)'
                  }}
                />
                <Legend wrapperStyle={{fontSize: '0.8rem', paddingTop: '1rem'}}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Approaching Deadlines</CardTitle>
          <CardDescription>Projects with deadlines in the near future.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="w-[250px]">Progress</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingDeadlines.map((item) => (
                <TableRow key={item.project}>
                  <TableCell className="font-medium font-serif">{item.project}</TableCell>
                  <TableCell>{item.client}</TableCell>
                  <TableCell>{item.deadline}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress value={item.progress} className="w-full" />
                      <span className="text-muted-foreground font-mono text-xs">{item.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/projects">View Project</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


export default function Dashboard() {
  const { userRole } = useAuth();
  
  return (
    <AppShell>
      {userRole === 'platform' ? <PlatformAdminDashboard /> : <CompanyDashboardContents />}
    </AppShell>
  )
}
