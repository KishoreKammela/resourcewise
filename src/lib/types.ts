import type { LucideIcon } from 'lucide-react';

export type Resource = {
  id: string;
  name: string;
  email: string;
  designation: string;
  skills: string[];
  availability: 'Available' | 'Partially Allocated' | 'Fully Allocated';
  allocation: number;
};

export type Client = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  status: 'Active' | 'Inactive' | 'On Hold';
  projectCount: number;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  status: 'On Track' | 'At Risk' | 'Off Track' | 'Completed';
  deadline: string;
  progress: number;
};

export type Allocation = {
  id: string;
  resourceName: string;
  projectName: string;
  clientName: string;
  percentage: number;
  startDate: string;
  endDate: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Project Manager' | 'HR Manager' | 'Viewer';
  status: 'Active' | 'Invited' | 'Inactive';
};

export type Kpi = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export type ResourceUtilization = {
  name: string;
  billable: number;
  nonBillable: number;
};

export type ProjectHealth = {
  name: 'On Track' | 'At Risk' | 'Off Track';
  value: number;
};

export type UpcomingDeadline = {
  project: string;
  client: string;
  deadline: string;
  progress: number;
};
