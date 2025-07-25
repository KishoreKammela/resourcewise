'use server';

import { getClientsByCompany } from '@/services/client.services';
import { getProjectsByCompany } from '@/services/project.services';
import { getResourcesByCompany } from '@/services/resource.services';

export interface DashboardAnalytics {
  kpis: {
    totalResources: number;
    activeProjects: number;
    totalClients: number;
    utilization: number;
  };
  utilizationChartData: Array<{
    name: string;
    billable: number;
    capacity: number;
  }>;
}

export async function getDashboardAnalytics(
  companyId: string
): Promise<DashboardAnalytics> {
  const [resources, projects, clients] = await Promise.all([
    getResourcesByCompany(companyId),
    getProjectsByCompany(companyId),
    getClientsByCompany(companyId),
  ]);

  const totalResources = resources.length;
  const activeProjects = projects.filter(
    (p) => p.status.projectStatus === 'Active'
  ).length;
  const totalClients = clients.length;

  const totalAllocationPercentage = resources.reduce(
    (acc, resource) =>
      acc + (resource.availability?.currentAllocationPercentage ?? 0),
    0
  );

  const totalCapacityPercentage = totalResources * 100;

  const utilization =
    totalCapacityPercentage > 0
      ? Math.round((totalAllocationPercentage / totalCapacityPercentage) * 100)
      : 0;

  // Simplified chart data for demonstration
  const utilizationChartData = [
    {
      name: 'Overall',
      billable: totalAllocationPercentage / 100, // Represent as sum of allocated resources
      capacity: totalResources, // Total number of resources
    },
  ];

  return {
    kpis: {
      totalResources,
      activeProjects,
      totalClients,
      utilization,
    },
    utilizationChartData,
  };
}
