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
import { Timestamp } from 'firebase/firestore';

export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    companyId: 'comp-1',
    personalInfo: {
      firstName: 'Clark',
      lastName: 'Kent',
      email: 'clark.kent@resourcewise.com',
    },
    authInfo: {
      userType: 'Super Admin',
      isEmailVerified: true,
      loginAttempts: 0,
    },
    employmentDetails: {
      status: 'active',
      type: 'Full-time',
    },
    // Omitting other fields for placeholder brevity
  } as TeamMember,
  {
    id: 'tm-2',
    companyId: 'comp-1',
    personalInfo: {
      firstName: 'Bruce',
      lastName: 'Wayne',
      email: 'bruce.wayne@resourcewise.com',
    },
    authInfo: {
      userType: 'Admin',
      isEmailVerified: true,
      loginAttempts: 0,
    },
    employmentDetails: {
      status: 'active',
      type: 'Full-time',
    },
  } as TeamMember,
  {
    id: 'tm-3',
    companyId: 'comp-1',
    personalInfo: {
      firstName: 'Lois',
      lastName: 'Lane',
      email: 'lois.lane@resourcewise.com',
    },
    authInfo: {
      userType: 'Project Manager',
      isEmailVerified: false,
      loginAttempts: 0,
    },
    employmentDetails: {
      status: 'on_leave', // 'Invited' is not a valid status, using 'on_leave'
      type: 'Full-time',
    },
  } as TeamMember,
  {
    id: 'tm-4',
    companyId: 'comp-1',
    personalInfo: {
      firstName: 'Jimmy',
      lastName: 'Olsen',
      email: 'jimmy.olsen@resourcewise.com',
    },
    authInfo: {
      userType: 'Viewer',
      isEmailVerified: true,
      loginAttempts: 0,
    },
    employmentDetails: {
      status: 'active',
      type: 'Full-time',
    },
  } as TeamMember,
];

export const resources: Resource[] = [
  {
    id: 'res-001',
    companyId: 'comp-1',
    personalInfo: {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.j@example.com',
      languagesSpoken: ['English'],
    },
    professionalInfo: {
      designation: 'Senior Frontend Developer',
    },
    skills: {
      technical: [
        { skill: 'React', level: 'Expert', yearsOfExperience: 5 },
        { skill: 'TypeScript', level: 'Expert', yearsOfExperience: 4 },
        { skill: 'Next.js', level: 'Advanced', yearsOfExperience: 3 },
      ],
      soft: ['Communication', 'Teamwork'],
    },
    availability: {
      status: 'Partially Available',
      currentAllocationPercentage: 50,
      maxAllocationPercentage: 100,
    },
    employmentDetails: {
      status: 'Active',
    }
  } as Resource,
  {
    id: 'res-002',
    companyId: 'comp-1',
    personalInfo: {
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.w@example.com',
      languagesSpoken: ['English'],
    },
    professionalInfo: {
      designation: 'Backend Developer',
    },
    skills: {
      technical: [
        { skill: 'Node.js', level: 'Expert', yearsOfExperience: 6 },
        { skill: 'Python', level: 'Advanced', yearsOfExperience: 4 },
        { skill: 'PostgreSQL', level: 'Advanced', yearsOfExperience: 5 },
      ],
      soft: ['Problem Solving'],
    },
    availability: {
      status: 'Unavailable',
      currentAllocationPercentage: 100,
      maxAllocationPercentage: 100,
    },
    employmentDetails: {
      status: 'Active',
    }
  } as Resource,
  {
    id: 'res-003',
    companyId: 'comp-1',
    personalInfo: {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.b@example.com',
      languagesSpoken: ['English'],
    },
    professionalInfo: {
      designation: 'UI/UX Designer',
    },
    skills: {
      technical: [
        { skill: 'Figma', level: 'Expert', yearsOfExperience: 5 },
        { skill: 'Adobe XD', level: 'Expert', yearsOfExperience: 4 },
        { skill: 'User Research', level: 'Advanced', yearsOfExperience: 3 },
      ],
      soft: ['Creativity', 'User Empathy'],
    },
    availability: {
      status: 'Available',
      currentAllocationPercentage: 0,
      maxAllocationPercentage: 100,
    },
     employmentDetails: {
      status: 'Active',
    }
  } as Resource,
  {
    id: 'res-004',
    companyId: 'comp-1',
    personalInfo: {
      firstName: 'Diana',
      lastName: 'Prince',
      email: 'diana.p@example.com',
      languagesSpoken: ['English', 'Greek'],
    },
    professionalInfo: {
      designation: 'Project Manager',
    },
    skills: {
      technical: [
        { skill: 'Agile', level: 'Expert', yearsOfExperience: 8 },
        { skill: 'Scrum', level: 'Expert', yearsOfExperience: 6 },
        { skill: 'Jira', level: 'Advanced', yearsOfExperience: 7 },
      ],
      soft: ['Leadership', 'Negotiation'],
    },
    availability: {
      status: 'Unavailable',
      currentAllocationPercentage: 100,
      maxAllocationPercentage: 100,
    },
     employmentDetails: {
      status: 'Active',
    }
  } as Resource,
];

export const clients: Client[] = [
  {
    id: 'cli-01',
    companyId: 'comp-1',
    basicInfo: {
      clientName: 'Innovate Corp',
    },
    contactInfo: {
      primary: {
        name: 'John Doe',
        email: 'john.doe@innovate.com',
      },
    },
    relationship: {
      status: 'Active',
    },
    analytics: {
      activeProjectsCount: 3,
      totalProjectsCount: 5,
      totalRevenueGenerated: 500000,
    },
  } as Client,
  {
    id: 'cli-02',
    companyId: 'comp-1',
    basicInfo: {
      clientName: 'Synergy Solutions',
    },
    contactInfo: {
      primary: {
        name: 'Jane Smith',
        email: 'jane.smith@synergy.com',
      },
    },
    relationship: {
      status: 'On Hold',
    },
    analytics: {
      activeProjectsCount: 2,
      totalProjectsCount: 2,
      totalRevenueGenerated: 250000,
    },
  } as Client,
  {
    id: 'cli-03',
    companyId: 'comp-1',
    basicInfo: {
      clientName: 'Apex Industries',
    },
    contactInfo: {
      primary: {
        name: 'Peter Jones',
        email: 'peter.jones@apex.com',
      },
    },
    relationship: {
      status: 'Inactive',
    },
    analytics: {
      activeProjectsCount: 0,
      totalProjectsCount: 1,
      totalRevenueGenerated: 100000,
    },
  } as Client,
];

export const projects: Project[] = [
  {
    id: 'proj-101',
    companyId: 'comp-1',
    clientId: 'cli-01',
    basicInfo: {
      projectName: 'E-commerce Platform',
    },
    status: {
      projectStatus: 'Active',
      progressPercentage: 75,
      healthStatus: 'On Track',
    },
    timeline: {
      plannedEndDate: Timestamp.fromDate(new Date('2024-12-31')),
    },
  } as Project,
  {
    id: 'proj-102',
    companyId: 'comp-1',
    clientId: 'cli-02',
    basicInfo: {
      projectName: 'Mobile Banking App',
    },
    status: {
      projectStatus: 'Active',
      progressPercentage: 40,
      healthStatus: 'At Risk',
    },
    timeline: {
      plannedEndDate: Timestamp.fromDate(new Date('2024-10-15')),
    },
  } as Project,
  {
    id: 'proj-103',
    companyId: 'comp-1',
    clientId: 'cli-01',
    basicInfo: {
      projectName: 'CRM Integration',
    },
    status: {
      projectStatus: 'On Hold',
      progressPercentage: 60,
      healthStatus: 'On Track',
    },
    timeline: {
      plannedEndDate: Timestamp.fromDate(new Date('2024-11-30')),
    },
  } as Project,
  {
    id: 'proj-104',
    companyId: 'comp-1',
    clientId: 'cli-01',
    basicInfo: {
      projectName: 'Data Analytics Dashboard',
    },
    status: {
      projectStatus: 'Completed',
      progressPercentage: 100,
      healthStatus: 'On Track',
    },
    timeline: {
      plannedEndDate: Timestamp.fromDate(new Date('2024-08-01')),
    },
  } as Project,
];

export const allocations: Allocation[] = [
  {
    id: 'alloc-1',
    resourceId: 'res-001',
    resourceName: 'Alice Johnson',
    projectId: 'proj-101',
    projectName: 'E-commerce Platform',
    companyId: 'comp-1',
    companyName: 'Innovate Corp',
    percentage: 50,
  } as unknown as Allocation,
  {
    id: 'alloc-2',
    resourceId: 'res-002',
    resourceName: 'Bob Williams',
    projectId: 'proj-102',
    projectName: 'Mobile Banking App',
    companyId: 'comp-1',
    companyName: 'Synergy Solutions',
    percentage: 100,
  } as unknown as Allocation,
  {
    id: 'alloc-3',
    resourceId: 'res-004',
    resourceName: 'Diana Prince',
    projectId: 'proj-101',
    projectName: 'E-commerce Platform',
    companyId: 'comp-1',
    companyName: 'Innovate Corp',
    percentage: 100,
  } as unknown as Allocation,
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

export const upcomingDeadlines = projects
  .filter((p) => p.status.projectStatus !== 'Completed')
  .map((project) => ({
    project: project.basicInfo.projectName,
    client:
      clients.find((c) => c.id === project.clientId)?.basicInfo.clientName ||
      'N/A',
    deadline: project.timeline.plannedEndDate
      ? project.timeline.plannedEndDate.toDate().toLocaleDateString()
      : 'N/A',
    progress: project.status.progressPercentage,
  }));
