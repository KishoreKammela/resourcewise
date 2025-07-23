import type {
  Resource,
  Client,
  Project,
  Allocation,
  TeamMember,
  Kpi,
  ResourceUtilization,
  ProjectHealth,
  UpcomingDeadline,
} from './types';
import {
  Users,
  Briefcase,
  FolderKanban,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export const resources: Resource[] = [
  {
    id: 'res-001',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    designation: 'Senior Frontend Developer',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    availability: 'Partially Allocated',
    allocation: 50,
  },
  {
    id: 'res-002',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    designation: 'Backend Developer',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
    availability: 'Fully Allocated',
    allocation: 100,
  },
  {
    id: 'res-003',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    designation: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'User Research'],
    availability: 'Available',
    allocation: 0,
  },
  {
    id: 'res-004',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    designation: 'Project Manager',
    skills: ['Agile', 'Scrum', 'Jira'],
    availability: 'Fully Allocated',
    allocation: 100,
  },
];

export const clients: Client[] = [
  {
    id: 'cli-01',
    name: 'Innovate Corp',
    contactPerson: 'John Doe',
    email: 'john.doe@innovate.com',
    status: 'Active',
    projectCount: 3,
  },
  {
    id: 'cli-02',
    name: 'Synergy Solutions',
    contactPerson: 'Jane Smith',
    email: 'jane.smith@synergy.com',
    status: 'Active',
    projectCount: 2,
  },
  {
    id: 'cli-03',
    name: 'Apex Industries',
    contactPerson: 'Peter Jones',
    email: 'peter.jones@apex.com',
    status: 'Inactive',
    projectCount: 1,
  },
];

export const projects: Project[] = [
  {
    id: 'proj-101',
    name: 'E-commerce Platform',
    client: 'Innovate Corp',
    status: 'On Track',
    deadline: '2024-12-31',
    progress: 75,
  },
  {
    id: 'proj-102',
    name: 'Mobile Banking App',
    client: 'Synergy Solutions',
    status: 'At Risk',
    deadline: '2024-10-15',
    progress: 40,
  },
  {
    id: 'proj-103',
    name: 'CRM Integration',
    client: 'Innovate Corp',
    status: 'On Track',
    deadline: '2024-11-30',
    progress: 60,
  },
  {
    id: 'proj-104',
    name: 'Data Analytics Dashboard',
    client: 'Innovate Corp',
    status: 'Completed',
    deadline: '2024-08-01',
    progress: 100,
  },
];

export const allocations: Allocation[] = [
  {
    id: 'alloc-1',
    resourceName: 'Alice Johnson',
    projectName: 'E-commerce Platform',
    clientName: 'Innovate Corp',
    percentage: 50,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
  },
  {
    id: 'alloc-2',
    resourceName: 'Bob Williams',
    projectName: 'Mobile Banking App',
    clientName: 'Synergy Solutions',
    percentage: 100,
    startDate: '2024-05-15',
    endDate: '2024-10-15',
  },
  {
    id: 'alloc-3',
    resourceName: 'Diana Prince',
    projectName: 'E-commerce Platform',
    clientName: 'Innovate Corp',
    percentage: 100,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Clark Kent',
    email: 'clark.kent@resourcewise.com',
    role: 'Super Admin',
    status: 'Active',
  },
  {
    id: 'tm-2',
    name: 'Bruce Wayne',
    email: 'bruce.wayne@resourcewise.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 'tm-3',
    name: 'Lois Lane',
    email: 'lois.lane@resourcewise.com',
    role: 'Project Manager',
    status: 'Invited',
  },
  {
    id: 'tm-4',
    name: 'Jimmy Olsen',
    email: 'jimmy.olsen@resourcewise.com',
    role: 'Viewer',
    status: 'Active',
  },
];

export const kpis: Kpi[] = [
  {
    title: 'Total Resources',
    value: '84',
    change: '+12% from last month',
    icon: Users,
  },
  {
    title: 'Active Projects',
    value: '23',
    change: '+2 from last month',
    icon: FolderKanban,
  },
  {
    title: 'Overall Utilization',
    value: '78%',
    change: '+3.2% from last month',
    icon: TrendingUp,
  },
  {
    title: 'Bench Time',
    value: '12%',
    change: '-1.5% from last month',
    icon: TrendingDown,
  },
];

export const resourceUtilizationData: ResourceUtilization[] = [
  { name: 'Jan', billable: 4000, nonBillable: 2400 },
  { name: 'Feb', billable: 3000, nonBillable: 1398 },
  { name: 'Mar', billable: 2000, nonBillable: 9800 },
  { name: 'Apr', billable: 2780, nonBillable: 3908 },
  { name: 'May', billable: 1890, nonBillable: 4800 },
  { name: 'Jun', billable: 2390, nonBillable: 3800 },
  { name: 'Jul', billable: 3490, nonBillable: 4300 },
];

export const projectHealthData: ProjectHealth[] = [
  { name: 'On Track', value: 15 },
  { name: 'At Risk', value: 6 },
  { name: 'Off Track', value: 2 },
];

export const upcomingDeadlines: UpcomingDeadline[] = [
  {
    project: 'Mobile Banking App',
    client: 'Synergy Solutions',
    deadline: '2024-10-15',
    progress: 40,
  },
  {
    project: 'CRM Integration',
    client: 'Innovate Corp',
    deadline: '2024-11-30',
    progress: 60,
  },
  {
    project: 'E-commerce Platform',
    client: 'Innovate Corp',
    deadline: '2024-12-31',
    progress: 75,
  },
];
