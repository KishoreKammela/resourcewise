# Documentation: Company-Facing Application & Dashboards

## 1. Overall Purpose

This document outlines the features and structure of the main application used by customer companies. It covers all modules, from high-level executive dashboards to detailed management pages for resources, clients, and projects. Its purpose is to provide a comprehensive guide for company users like administrators, project managers, and executives.

---

## 2. Main Application Structure & Status

### 2.1 Dashboard Module

- **Purpose**: Provides at-a-glance overviews tailored to different strategic needs.
- **Pages**:
  - `/dashboard/executive-summary`: **(Placeholder)** Intended to be the primary landing page with consolidated KPIs. The current implementation is on `/analytics`.
  - `/dashboard/resource-overview`: **(Placeholder)** Will provide a deep dive into resource allocation, availability, and skills distribution.
  - `/dashboard/project-portfolio`: **(Placeholder)** A visual summary of the health, progress, and financial status of all projects.
  - `/dashboard/financial-summary`: **(Placeholder)** A roll-up of all financial data, including revenue, costs, and profitability across the company.

### 2.2 Resources Module

- **Purpose**: The central hub for managing the company's talent pool.
- **Pages**:
  - `/resources`: **(Completed)** The main "Resource Pool" view. Displays a filterable and searchable table of all company resources, showing key details like name, designation, and availability.
  - `/resources/add`: **(Completed)** Form for adding a new resource profile. Includes the AI-powered resume parsing feature to extract skills.
  - `/resources/[resourceId]`: **(Completed)** The detailed profile page for a single resource, showing all their information across multiple cards.
  - `/resources/[resourceId]/edit`: **(Completed)** Form for editing an existing resource's profile. Also includes the AI skill extraction feature.
  - `/resources/skills-matrix`: **(Placeholder)** Will provide a grid view of all resources against all skills, allowing for easy identification of experts and skill gaps.
  - `/resources/performance-analytics`: **(Placeholder)** A dashboard to analyze and compare resource performance metrics across projects.
  - `/resources/availability-planning`: **(Placeholder)** A visual tool for forecasting resource availability and planning for future project needs.
  - `/resources/resource-development`: **(Placeholder)** Tools for setting development goals, tracking training, and managing career progression for resources.

### 2.3 Clients Module

- **Purpose**: Manages all information and interactions related to the company's clients.
- **Pages**:
  - `/clients`: **(Completed)** The "Client Portfolio" view. Displays a table of all clients with key contact info, status, and project count.
  - `/clients/add`: **(Completed)** A comprehensive form for adding a new client.
  - `/clients/[clientId]`: **(Completed)** A detailed view of a single client, showing all their commercial, contact, and relationship information.
  - `/clients/[clientId]/edit`: **(Completed)** Form for editing an existing client's profile.
  - `/clients/relationship-management`: **(Placeholder)** A CRM-focused view to track client health scores, interactions, and satisfaction ratings.
  - `/clients/contract-management`: **(Placeholder)** A dedicated area to manage client contracts, NDAs, MSAs, and renewal dates.
  - `/clients/client-analytics`: **(Placeholder)** A dashboard for analyzing client profitability, project success rates, and overall lifetime value.

### 2.4 Projects Module

- **Purpose**: The central hub for defining, tracking, and managing all projects.
- **Pages**:
  - `/projects`: **(Completed)** The "Project Portfolio" view. Displays a table of all projects, their associated client, status, deadline, and progress.
  - `/projects/add`: **(Completed)** Form for adding a new project and linking it to a client.
  - `/projects/[projectId]`: **(Completed)** A detailed, tabbed view of a single project, including an overview, team allocations, budget, and timeline. Features the "Allocate Resource" dialog with AI recommendations.
  - `/projects/project-planning`: **(Placeholder)** Advanced tools for project setup, including defining milestones, dependencies, and detailed requirements.
  - `/projects/timeline-management`: **(Placeholder)** A Gantt chart view for visualizing and managing project timelines and dependencies.
  - `/projects/budget-tracking`: **(Placeholder)** A dashboard for tracking project expenses against budget, with burn-down charts and cost analysis.
  - `/projects/performance-metrics`: **(Placeholder)** Analytics view to track project KPIs like on-time delivery, budget variance, and scope creep.

### 2.5 Allocations Module

- **Purpose**: Provides tools for assigning resources to projects and managing their workload.
- **Pages**:
  - `/allocations`: **(Completed)** The main "Allocation Board". Currently shows a placeholder, but is planned to be a visual board (e.g., a timeline or Kanban view) of all resource allocations.
  - `/allocations/capacity-planning`: **(Placeholder)** A strategic tool to forecast resource capacity vs. project demand.
  - `/allocations/conflict-resolution`: **(Placeholder)** An interface to identify and resolve scheduling conflicts for over-allocated resources.
  - `/allocations/performance-tracking`: **(In Progress)** The foundation is built. Future work will allow managers to input and track performance scores for allocated resources.
  - `/allocations/time-management`: **(Placeholder)** Integration with time-tracking tools to monitor hours logged against allocated hours.

### 2.6 Team Module

- **Purpose**: Manages user accounts, roles, and permissions within the company.
- **Pages**:
  - `/team`: **(Completed)** The "Team Members" view. A table of all invited and registered users, with their roles and status. Admins can suspend or reactivate members.
  - `/team/role-management`: **(Placeholder)** An interface to create custom roles and define granular permissions for each.
  - `/team/access-control`: **(Placeholder)** A detailed view to manage which users have access to which projects or clients.
  - `/team/team-analytics`: **(Placeholder)** A dashboard to analyze team composition, role distribution, and other HR-related metrics.

### 2.7 Analytics Module

- **Purpose**: Provides high-level strategic insights by aggregating data from across the platform.
- **Pages**:
  - `/analytics`: **(Completed)** The "Executive Dashboard". Features live KPI cards for key metrics (Total Resources, Active Projects, etc.) and a chart for resource capacity vs. allocation.
  - `/analytics/resource-analytics`: **(Placeholder)** Deep-dive analytics on resource utilization, billability, and skill distribution.
  - `/analytics/project-performance`: **(Placeholder)** Comparative analytics across all projects to identify trends and measure success.
  - `/analytics/client-insights`: **(Placeholder)** Insights into client health, profitability, and project history.
  - `/analytics/financial-reports`: **(Placeholder)** Comprehensive financial reporting, including revenue, cost, and profit margin analysis.
  - `/analytics/predictive-analytics`: **(Completed)** The AI-powered "Demand Forecast" page, which analyzes project data to predict future skill needs.

### 2.8 Settings Module

- **Purpose**: Configuration for the company's account.
- **Pages**:
  - `/settings`: **(Completed)** The "Company Profile" page where admins can update company name, website, timezone, and default currency.
  - `/settings/integration-management`: **(Placeholder)** A page to manage integrations with third-party tools (e.g., accounting software, code repositories).
  - `/settings/subscription-management`: **(Placeholder)** A portal for the company to manage their subscription plan, view invoices, and update billing details.

---

## 3. Future Enhancements & Improvements

- **Client Collaboration Portal**: A secure, client-facing portal where clients can log in to view the progress of their specific projects.
- **Advanced Role-Based Access Control (RBAC)**: Fully implement the planned granular permissions system.
- **Custom Reporting Engine**: Allow users to build and save their own custom reports from any data source in the platform.
- **Automated Alerts & Notifications**: A system to notify users about critical events, such as budget overruns, approaching deadlines, or allocation conflicts.
