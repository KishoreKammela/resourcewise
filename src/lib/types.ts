import type { LucideIcon } from 'lucide-react';
import type { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';
import type { Timestamp as ClientTimestamp } from 'firebase/firestore';

export type Timestamp = AdminTimestamp | ClientTimestamp;

export type UserProfileUpdate = {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: string;
    profilePictureUrl?: string;
  };
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  professionalInfo: {
    designation?: string;
    department?: string;
    employeeId?: string;
    workLocation?: string;
    workMode?: string;
  };
};

export type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp;
};

// Firestore Schema Types
export interface PlatformConfiguration {
  id: string; // e.g., 'sessionManagement'
  sessionTimeout?: {
    timeoutDurationMinutes: number;
    warningCountdownSeconds: number;
  };
}

export interface PlatformUser {
  // Core Fields
  id: string; // Document ID (auto-generated)
  email: string;
  userType:
    | 'admin'
    | 'superAdmin'
    | 'moderator'
    | 'supportAgent'
    | 'dataAnalyst';

  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: Timestamp;
    gender?: string;
    profilePictureUrl?: string;
  };

  // Address Information
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  // Professional Information
  professionalInfo: {
    designation?: string;
    department?: string;
    reportingManagerId?: string; // Reference to platformUser document
    joiningDate?: Timestamp;
    probationEndDate?: Timestamp;
  };

  // Access & Security
  permissions: {
    [key: string]: boolean | string[];
  };
  isActive: boolean;
  lastLogin?: Timestamp;
  loginAttempts: number;
  accountLockedUntil?: Timestamp;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;

  // Audit & Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string; // Reference to platformUser document ID
  updatedBy?: string; // Reference to platformUser document ID
}

export interface Company {
  // Core Identification
  id: string; // Document ID (auto-generated)
  companyName: string;
  companyWebsite?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyLogoUrl?: string;

  // Address Information
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  timezone: string;

  // Business Analytics Data
  businessInfo: {
    industry?: string;
    companyType?: string;
    companySizeRange?: string;
    growthStage?: string;
    annualRevenueRange?: string;
    foundingYear?: number;
    businessModel?: string;
  };

  // Operational Data
  operationalData: {
    primaryTechnologies: string[];
    serviceOfferings: string[];
    billingModels: string[];
    geographicPresence: {
      locations: string[];
      remotePolicy: string;
    };
    certifications: string[];
  };

  // Compliance & Legal
  compliance: {
    businessRegistrationNumber?: string;
    taxIdentificationNumber?: string;
    legalEntityType?: string;
    incorporationCountry?: string;
  };

  // Subscription & Billing
  subscription: {
    plan: string;
    status: string;
    billingCurrency: string;
    billingCycle: string;
    startDate?: Timestamp;
    endDate?: Timestamp;
    limits: {
      maxResourcesAllowed: number;
      maxProjectsAllowed: number;
      maxTeamMembersAllowed: number;
    };
  };

  // Platform Settings
  settings: {
    dateFormat: string;
    timeFormat: string;
    currency: string;
    workingHours: {
      start: string;
      end: string;
      days: string[];
    };
    holidays: Array<{
      date: string;
      name: string;
    }>;
    fiscalYearStart: string;
  };

  // Analytics & Tracking
  analytics: {
    onboardingCompleted: boolean;
    onboardingCompletionDate?: Timestamp;
    lastActiveDate?: Timestamp;
    featureUsageStats: {
      [featureName: string]: {
        usageCount: number;
        lastUsed: Timestamp;
      };
    };
  };

  // Audit & Metadata
  isActive: boolean;
  deactivationReason?: string;
  deactivationDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

export interface TeamMember {
  // Core Identification
  id: string; // Document ID (should match Firebase Auth UID)
  companyId: string; // Reference to company document
  employeeId?: string;
  email: string;
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profilePictureUrl?: string;
    dateOfBirth?: Timestamp;
    gender?: string;
  };

  // Address Information
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  // Professional Information
  professionalInfo: {
    designation?: string;
    department?: string;
    reportingManagerId?: string; // Reference to teamMember document
    joiningDate?: Timestamp;
    probationEndDate?: Timestamp;
  };

  // Authentication & Access
  authInfo: {
    userType: string;
    isEmailVerified: boolean;
    lastLogin?: Timestamp;
    loginAttempts: number;
    accountLockedUntil?: Timestamp;
  };

  // Permissions & Access Control
  permissions: {
    accessLevel: string;
    specificPermissions: {
      [key: string]: boolean;
    };
    accessibleClientIds?: string[];
    accessibleProjectIds?: string[];
    accessibleDepartmentIds?: string[];
  };

  // Contact & Communication
  contactInfo: {
    workPhone?: string;
    workEmail?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relation: string;
    };
    communicationPreferences: {
      email: boolean;
      sms: boolean;
      pushNotifications: boolean;
    };
    notificationSettings: {
      [notificationType: string]: boolean;
    };
  };

  // Employment Details
  employmentDetails: {
    status: string;
    type: string;
    salaryCurrency?: string;
    workLocation?: string;
    workMode?: string;
    terminationDate?: Timestamp;
    terminationReason?: string;
    noticePeriodDays?: number;
  };

  // Audit & Metadata
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

export interface Resource {
  // Core Identification
  id: string; // Document ID (auto-generated)
  companyId: string; // Reference to company document
  resourceCode?: string;

  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    profilePictureUrl?: string;
    dateOfBirth?: Timestamp;
    gender?: string;
    nationality?: string;
    languagesSpoken: string[];
  };

  // Address Information
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  // Professional Information
  professionalInfo: {
    designation?: string;
    department?: string;
    practiceArea?: string;
    seniorityLevel?: string;
    employmentType: string;
  };

  // Employment Details
  employmentDetails: {
    joiningDate?: Timestamp;
    probationEndDate?: Timestamp;
    reportingManagerId?: string;
    workLocation?: string;
    workMode?: string;
    status: string;
  };

  // Experience & Education
  experience: {
    totalYears?: number;
    yearsWithCompany?: number;
    previousCompanies?: Array<{
      companyName: string;
      role: string;
      duration: string;
      startDate?: Timestamp;
      endDate?: Timestamp;
    }>;
    education?: Array<{
      degree: string;
      institution: string;
      year: number;
      grade?: string;
    }>;
    certifications?: Array<{
      name: string;
      issuingOrganization: string;
      issueDate: Timestamp;
      expiryDate?: Timestamp;
      credentialId?: string;
    }>;
  };

  // Skills & Competencies
  skills: {
    technical: Array<{
      skill: string;
    }>;
    soft: Array<{
      skill: string;
    }>;
    aiExtractedSkills?: string[];
    endorsements?: Array<{
      skill: string;
      endorsedBy: string;
      endorsementDate: Timestamp;
    }>;
  };

  // Availability & Allocation
  availability: {
    status: string;
    currentAllocationPercentage: number;
    maxAllocationPercentage: number;
    preferredProjectTypes: string[];
    availabilityStartDate?: Timestamp;
    noticePeriodDays?: number;
  };

  // Financial Information
  financial: {
    hourlyRate?: number;
    dailyRate?: number;
    monthlySalary?: number;
    currency: string;
    billingRateClient?: number;
    costCenter?: string;
  };

  // Performance & Evaluation
  performance: {
    rating?: number;
    lastReviewDate?: Timestamp;
    nextReviewDate?: Timestamp;
    careerGoals?: string;
    developmentAreas: string[];
  };

  // External Profiles
  externalProfiles: {
    resumeUrl?: string;
    portfolioUrl?: string;
    linkedinProfile?: string;
    githubProfile?: string;
    otherDocuments?: Array<{
      type: string;
      url: string;
      uploadDate: Timestamp;
    }>;
  };

  // Audit & Metadata
  isActive: boolean;
  terminationDate?: Timestamp;
  terminationReason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

export interface Client {
  // Core Identification
  id: string; // Document ID (auto-generated)
  companyId: string; // Reference to company document
  clientCode?: string;

  // Basic Information
  basicInfo: {
    clientName: string;
    clientType?: string; // 'Direct Client' | 'Partner' | 'Subcontractor' | 'Internal'
    industry?: string;
    companySize?: string; // 'Startup' | 'SME' | 'Enterprise' | 'Fortune 500'
    website?: string;
    logoUrl?: string;
  };

  // Contact Information
  contactInfo: {
    primary: {
      name?: string;
      email?: string;
      phone?: string;
      designation?: string;
    };
    secondary?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  };

  // Address Information
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    timezone?: string;
  };

  // Business Information
  businessInfo: {
    registrationNumber?: string;
    taxIdentificationNumber?: string;
    annualRevenueRange?: string;
    employeeCountRange?: string;
    businessModel?: string; // 'B2B' | 'B2C' | 'B2B2C'
  };

  // Relationship Management
  relationship: {
    accountManagerId?: string; // Reference to teamMember
    status: string; // 'Prospect' | 'Active' | 'Inactive' | 'Lost' | 'On Hold'
    startDate?: Timestamp;
    healthScore?: number; // 1-5
    satisfactionRating?: number; // 1-5
  };

  // Commercial Information
  commercial: {
    contractType?: string; // 'MSA' | 'SOW' | 'Project-based' | 'Retainer' | 'Ad-hoc'
    paymentTerms?: string; // 'Net 30' | 'Net 60' | 'Advance' | 'Milestone-based'
    billingCurrency: string;
    standardBillingRate?: number;
    discountPercentage?: number;
    creditLimit?: number;
    paymentHistoryRating?: string; // 'Excellent' | 'Good' | 'Average' | 'Poor'
  };

  // Contract & Legal
  contract: {
    startDate?: Timestamp;
    endDate?: Timestamp;
    value?: number;
    documentUrl?: string;
    ndaSigned: boolean;
    ndaExpiryDate?: Timestamp;
    msaSigned: boolean;
    msaExpiryDate?: Timestamp;
  };

  // Communication & Preferences
  communication: {
    preferredMethod?: string; // 'Email' | 'Phone' | 'Slack' | 'Teams' | 'WhatsApp'
    frequency?: string; // 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly'
  };

  // Analytics & Tracking
  analytics: {
    totalProjectsCount: number;
    activeProjectsCount: number;
    totalRevenueGenerated: number;
  };

  // Audit & Metadata
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

export interface Project {
  // Core Identification
  id: string; // Document ID (auto-generated)
  companyId: string; // Reference to company document
  clientId: string; // Reference to client document
  clientName?: string; // Denormalized for easy display
  projectCode?: string;

  // Basic Information
  basicInfo: {
    projectName: string;
    description?: string;
    type?: string; // 'Development' | 'Maintenance' | 'Consulting' | 'Testing' | 'Migration' | 'Integration'
    category?: string; // 'Web Application' | 'Mobile App' | 'API' | 'Infrastructure'
    priorityLevel?: string; // 'Critical' | 'High' | 'Medium' | 'Low'
  };

  // Timeline Management
  timeline: {
    plannedStartDate?: Timestamp;
    plannedEndDate?: Timestamp;
    actualStartDate?: Timestamp;
    actualEndDate?: Timestamp;
    estimatedDurationDays?: number;
    actualDurationDays?: number;
    milestones?: Array<{
      name: string;
      plannedDate: Timestamp;
      actualDate?: Timestamp;
      status: string;
      description?: string;
    }>;
  };

  // Status & Progress
  status: {
    projectStatus: string; // 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled' | 'Delayed'
    progressPercentage: number; // 0-100
    healthStatus: string; // 'Green' | 'Yellow' | 'Red'
    lastStatusUpdate?: Timestamp;
    statusNotes?: string;
  };

  // Budget & Financial
  budget: {
    projectBudget?: number;
    currency: string;
    billingModel?: string; // 'Fixed Price' | 'Time & Material' | 'Milestone-based' | 'Hybrid'
    hourlyBillingRate?: number;
    totalBillableHours?: number;
    totalBilledAmount: number;
    totalCost: number;
    profitMarginPercentage?: number;
  };

  // Technical Requirements
  technical: {
    requiredSkills?: Array<{
      skill: string;
      level: string;
      count: number;
    }>;
    technologyStack?: string[];
    complexityLevel?: string; // 'Low' | 'Medium' | 'High' | 'Critical'
    requirements?: string;
    deliverables?: string[];
  };

  // Team Requirements & Management
  team: {
    estimatedSize?: number;
    requiredRoles?: Array<{
      role: string;
      count: number;
      level: string;
    }>;
    projectManagerId?: string; // Reference to teamMember
    technicalLeadId?: string; // Reference to resource
    clientProjectManager?: string;
    clientStakeholders?: Array<{
      name: string;
      email: string;
      role: string;
      phone?: string;
    }>;
  };

  // Project Management
  management: {
    methodology?: string; // 'Agile' | 'Waterfall' | 'Hybrid' | 'Kanban' | 'Scrum'
    sprintDurationWeeks?: number;
    totalSprintsPlanned?: number;
    currentSprintNumber?: number;
    projectManagementTool?: string;
    projectManagementUrl?: string;
  };

  // Communication & Reporting
  communication: {
    frequency?: string; // 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly'
    reportingSchedule?: Array<{
      reportType: string;
      frequency: string;
      dueDate: string;
      recipients: string[];
    }>;
    meetingSchedule?: Array<{
      meetingType: string;
      frequency: string;
      duration: number;
      participants: string[];
    }>;
    escalationMatrix?: Array<{
      level: number;
      contact: string;
      email: string;
      phone?: string;
    }>;
  };

  // Quality & Risk Management
  qualityRisk: {
    qualityMetrics?: {
      [metricName: string]: {
        target: number;
        current: number;
        unit: string;
      };
    };
    riskAssessment?: Array<{
      riskId: string;
      description: string;
      probability: string; // 'Low' | 'Medium' | 'High'
      impact: string; // 'Low' | 'Medium' | 'High'
      mitigation: string;
      owner: string;
      status: string;
    }>;
    changeRequests?: Array<{
      id: string;
      description: string;
      requestedBy: string;
      requestDate: Timestamp;
      status: string;
      impact: string;
      approvedBy?: string;
      approvalDate?: Timestamp;
    }>;
    issuesLog?: Array<{
      id: string;
      description: string;
      severity: string;
      status: string;
      assignedTo: string;
      createdDate: Timestamp;
      resolvedDate?: Timestamp;
    }>;
  };

  // Documents & Assets
  documents: {
    projectCharterUrl?: string;
    requirementsDocumentUrl?: string;
    technicalSpecificationUrl?: string;
    projectDocuments?: Array<{
      name: string;
      url: string;
      type: string;
      uploadDate: Timestamp;
    }>;
    repositoryUrls?: Array<{
      name: string;
      url: string;
      type: string; // 'Code' | 'Design' | 'Documentation'
    }>;
  };

  // Analytics & Performance
  analytics: {
    resourceUtilizationPercentage?: number;
    budgetUtilizationPercentage?: number;
    timelineAdherencePercentage?: number;
    clientSatisfactionScore?: number; // 1-5
    teamProductivityScore?: number; // 1-5
  };

  // Contract & Legal
  legal: {
    contractReference?: string;
    sowReference?: string;
    ipOwnership?: string; // 'Client' | 'Company' | 'Shared'
    confidentialityLevel?: string; // 'Public' | 'Internal' | 'Confidential' | 'Restricted'
  };

  // Audit & Metadata
  isActive: boolean;
  archivedAt?: Timestamp;
  archivedBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

export interface Allocation {
  // Core Identification
  id: string; // Document ID (auto-generated)
  companyId: string; // Reference to company document
  resourceId: string; // Reference to resource document
  projectId: string; // Reference to project document
  allocationCode?: string;

  // Allocation Details
  allocationDetails: {
    roleInProject?: string; // 'Lead Developer' | 'Senior Developer' | 'QA Engineer'
    allocationPercentage: number; // 0-100
    allocatedHoursPerDay?: number;
    allocatedHoursPerWeek?: number;
    allocationType?: string; // 'Full-time' | 'Part-time' | 'As-needed' | 'Consulting'
  };

  // Timeline
  timeline: {
    startDate: Timestamp;
    endDate?: Timestamp;
    plannedDurationDays?: number;
    actualDurationDays?: number;
    actualStartDate?: Timestamp;
    actualEndDate?: Timestamp;
    extensionRequests?: Array<{
      requestDate: Timestamp;
      requestedEndDate: Timestamp;
      reason: string;
      status: string; // 'Pending' | 'Approved' | 'Rejected'
      approvedBy?: string;
      approvalDate?: Timestamp;
    }>;
  };

  // Status & Progress
  status: {
    allocationStatus: string; // 'Planned' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled' | 'Extended'
    completionPercentage: number; // 0-100
    lastActivityDate?: Timestamp;
  };

  // Financial Information
  financial: {
    billingRate?: number; // Project-specific rate
    costRate?: number; // Internal cost for this allocation
    currency: string;
    totalBillableHours: number;
    totalBilledAmount: number;
    totalCost: number;
  };

  // Performance & Tracking
  performance: {
    actualHoursTotal: number;
    qualityRating: number; // 1-5
    productivityScore: number; // 1-5
    communicationScore: number; // 1-5
  };

  // Responsibilities & Tasks
  responsibilities: {
    primary?: string[];
    specificTasks?: Array<{
      taskId: string;
      description: string;
      status: string;
      dueDate?: Timestamp;
      completedDate?: Timestamp;
    }>;
    deliverables?: Array<{
      name: string;
      description: string;
      dueDate: Timestamp;
      status: string;
      deliveredDate?: Timestamp;
    }>;
    milestones?: Array<{
      name: string;
      plannedDate: Timestamp;
      actualDate?: Timestamp;
      status: string;
    }>;
  };

  // Skills & Requirements
  skills: {
    requiredForAllocation?: Array<{
      skill: string;
      level: string;
      importance: string; // 'Critical' | 'Important' | 'Nice-to-have'
    }>;
    skillsUtilized?: Array<{
      skill: string;
      proficiencyLevel: string;
      utilizationPercentage: number;
    }>;
    developmentOpportunities?: string[];
    trainingProvided?: Array<{
      trainingName: string;
      provider: string;
      completionDate: Timestamp;
      certificateUrl?: string;
    }>;
  };

  // Management & Approval
  management: {
    allocatedBy?: string; // Reference to teamMember who made allocation
    approvedBy?: string; // Reference to teamMember who approved
    approvalDate?: Timestamp;
    allocationReason?: string;
    replacementFor?: string; // Reference to another allocation if replacing
  };

  // Time Tracking Integration
  timeTracking: {
    enabled: boolean;
    tool?: string;
    projectId?: string;
    lastTimesheetDate?: Timestamp;
    pendingTimesheetApprovals: number;
  };

  // Feedback & Reviews
  feedback: {
    resourceFeedback?: string;
    projectManagerFeedback?: string;
    clientFeedback?: string;
    lessonsLearned?: string;
    improvementSuggestions?: string;
  };

  // Conflict & Overlap Management
  conflictManagement: {
    conflictingAllocations?: string[];
    overlapPercentage?: number;
    priorityLevel?: number;
    backupResourceId?: string;
  };

  // Audit & Metadata
  isActive: boolean;
  deactivationReason?: string;
  deactivationDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

export interface AuditLog {
  id: string; // Document ID (auto-generated)
  timestamp: Timestamp;
  actor: {
    id: string; // User UID
    displayName: string;
    role: 'platform' | 'company' | 'system';
  };
  action: string; // e.g., 'user.login', 'profile.update', 'company.create'
  target: {
    id: string;
    type: string; // e.g., 'user', 'company', 'project'
    displayName?: string;
  };
  status: 'success' | 'failure';
  companyId?: string;
  details?: {
    [key: string]: any;
    error?: string;
  };
}

export interface Invitation {
  id: string; // Document ID, which will be the unique token
  type: 'platform' | 'company';
  companyId?: string; // Required if type is 'company'
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Timestamp;
  createdAt: Timestamp;
  createdBy: string; // UID of the user who created the invitation
}

// UI-specific types (can be kept or adapted)

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
