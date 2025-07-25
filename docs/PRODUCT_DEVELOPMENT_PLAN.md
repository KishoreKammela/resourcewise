# ResourceWise: Product Development Plan

This document outlines the detailed product development plan for the ResourceWise platform. It is based on the comprehensive product requirements and is structured into phases, milestones, and steps.

## Guiding Principles

- **User-Centric Flow**: The development order follows a logical user journey, starting from platform setup to core operations and finally advanced intelligence features.
- **Incremental Value**: Each phase delivers a significant and usable set of features.
- **API-First**: Core business logic is encapsulated in server actions and services, promoting a clean separation of concerns.

---

## Phase 1: Platform Foundation (Completed)

**Goal**: Establish the core infrastructure and foundational features for a company to onboard and start managing its essential data.

### Milestone 1.1: Company & User Onboarding (Completed)

- **Step 1.1.1: Company Registration**: Implemented the multi-step sign-up form for new companies (`/signup`).
- **Step 1.1.2: User Registration**: Implemented registration for platform users (`/signup/platform`).
- **Step 1.1.3: Core Company Profile**: Created the Firestore schema and UI for capturing basic company information (`/settings`).
- **Step 1.1.4: User Authentication**: Secured user login (`/login`) and registration using Firebase Authentication.
- **Step 1.1.5: Invitation-based Onboarding**: Implemented the full flow for inviting and registering new platform and company users via unique tokens (`/signup/invite/[token]`).

### Milestone 1.2: Team & Access Management (Completed)

- **Step 1.2.1: Team Member Management**:
  - Implemented the invitation flow for company admins to add team members.
  - Developed the UI for listing, viewing, and managing team members (activate/suspend) on the `/team` page.
- **Step 1.2.2: Platform User Management**:
  - Implemented the invitation flow for platform admins to add other platform users.
  - Developed the UI for listing and managing platform users on the `/settings/users` page.
- **Step 1.2.3: Role-Based Access Foundation**: Established roles (`platform` vs `company`, and specific roles like `admin`) which control UI visibility and actions.

---

## Phase 2: Core Operations (Completed)

**Goal**: Enable companies to manage their core business operations: clients, projects, and resource allocation.

### Milestone 2.1: Resource Management & AI Integration (Completed)

- **Step 2.1.1: Resource Management Foundation (Completed)**:
  - Created the "Add Resource" form and page structure (`/resources/add`).
  - Developed the backend services to create and store resource profiles in Firestore (`resource.services.ts`, `resourceActions.ts`).
  - Built the UI to list and display all resources (`/resources`) and view individual details (`/resources/[resourceId]`).
  - Implemented full editing functionality for resource profiles (`/resources/[resourceId]/edit`).
- **Step 2.1.2: AI-Powered Skills Extraction (Completed)**:
  - Implemented the Genkit flow (`smart-skills-extractor`) using the Gemini API to parse resumes (PDF, DOCX) and extract both technical and soft skills.
  - Integrated the AI flow with both the "Add Resource" and "Edit Resource" forms to auto-populate the skills fields upon resume upload.

### Milestone 2.2: Client & Project Management (Completed)

- **Step 2.2.1: Client Relationship Management (CRM) Core (Completed)**:
  - Implemented the UI and backend services for adding, listing, and editing clients.
  - Developed the detailed client profile page, capturing comprehensive business and relationship information.
- **Step 2.2.2: Comprehensive Project Management (Completed)**:
  - Implemented the UI and backend services for adding and listing projects under a specific client.
  - Developed the detailed project page, including tabs for overview, budget, team, and timeline.

### Milestone 2.3: Initial Resource Allocation (Completed)

- **Step 2.3.1: Basic Allocation System (Completed)**:
  - Developed the UI for allocating a resource from the resource pool to a specific project via a dialog form.
  - Implemented the backend logic to create `Allocation` documents in Firestore, linking resources to projects.
- **Step 2.3.2: Allocation Visualization (Completed)**:
  - Implemented a "Team" tab on the project detail page to display all allocated resources in a table.
  - This provides basic visibility into who is assigned to each project.

---

## Phase 3: Advanced Features & Intelligence (Completed)

**Goal**: Enhance the platform with advanced operational tools, deeper analytics, and more intelligent features.

### Milestone 3.1: Advanced Allocation & Performance Tracking (Completed)

- **Step 3.1.1: Advanced Allocation Management (Completed)**:
  - Enhanced the allocation form to include more details (e.g., role, allocation %, specific dates).
  - Implemented approval workflows for allocation requests.
- **Step 3.1.2: Performance Tracking (Completed)**:
  - Added fields to the `Allocation` model for tracking performance metrics (e.g., feedback scores, task completion rates).
  - Created a UI for project managers to provide feedback on allocated resources.

### Milestone 3.2: Comprehensive Analytics & Reporting (Completed)

- **Step 3.2.1: Foundational Analytics Dashboard (Completed)**:
  - Designed and implemented the main dashboard view for company executives.
  - Added key KPI cards for high-level metrics like Total Resources, Active Projects, and overall Resource Utilization %.
  - Created basic charts visualizing resource allocation (e.g., Billable vs. Non-Billable).
- **Step 3.2.2: Role-Based Dashboards**:
  - Implement specialized analytics dashboards for different user roles (Admin, HR, Project Manager).
- **Step 3.2.3: AI-Powered Recommendations (Completed)**:
  - Developed a Genkit flow (`resource-recommender`) that suggests the top 3-5 best-fit resources for a new project based on skills, availability, and past performance.
  - Integrated these recommendations directly into the resource allocation dialog.

---

## Phase 4: Strategic Intelligence & Optimization (Current)

**Goal**: Transform the platform from an operational tool into a strategic asset with predictive capabilities and enhanced client collaboration.

### Milestone 4.1: Predictive Analytics & Strategic Planning (Completed)

- **Step 4.1.1: Predictive Demand Forecasting (Completed)**:
  - Implemented a Genkit flow using the Gemini API to analyze historical project data and predict future skill demand.
  - Created a "Demand Forecast" dashboard to help with strategic hiring.

### Milestone 4.2: Client Collaboration Portal

- **Step 4.2.1: Secure Client Portal**:
  - Develop a separate, secure portal for clients to log in.
- **Step 4.2.2: Client-Facing Dashboards**:
  - Provide clients with a read-only view of their project's progress, allocated team members, and key milestones.
  - Implement a communication center for clients to interact with the project manager.

---

## Phase 5: Enhanced Operational Views (Planned)

**Goal**: Provide specialized views for managers to gain deeper insights into their resources and skills landscape.

### Milestone 5.1: Skills Matrix Visualization (Planned)

- **Step 5.1.1: Backend Data Aggregation**: Implement a new server action (`getSkillsMatrixData`) that fetches all resources and aggregates a complete list of unique technical and soft skills across the company.
- **Step 5.1.2: Frontend Table Component**: Develop a new client component (`SkillsMatrixClient.tsx`) that fetches the aggregated data and renders it in a responsive table. Resources will be listed as rows and skills as columns.
- **Step 5.1.3: Interactive UI**: Add features to the table, such as search/filter functionality for both skills and resources, and use icons or colors to indicate a resource's proficiency with a skill.
- **Step 5.1.4: Integration**: Create the main page for the Skills Matrix at `/resources/skills-matrix` and integrate the new client component.
