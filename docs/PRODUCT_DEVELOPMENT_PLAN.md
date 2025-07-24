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

## Phase 2: Core Operations (In Progress)

**Goal**: Enable companies to manage their core business operations: clients, projects, and resource allocation.

### Milestone 2.1: Resource Management & AI Integration (Next Up)
- **Step 2.1.1: Resource Management Foundation**:
    - Create the "Add Resource" form and page structure.
    - Develop the backend services to create and store resource profiles in Firestore.
    - Build the UI to list and display all resources in the company's talent pool.
- **Step 2.1.2: AI-Powered Skills Extraction**:
    - Implement the Genkit flow (`smart-skills-extractor`) using the Gemini API to parse resumes (PDF, DOCX) and extract a list of technical skills.
    - Integrate the AI flow with the "Add Resource" form to auto-populate the skills field upon resume upload.

### Milestone 2.2: Client & Project Management (Upcoming)
- **Step 2.2.1: Client Relationship Management (CRM) Core**:
    - Implement the UI and backend services for adding and listing clients.
    - Develop the detailed client profile page, capturing business and relationship information.
- **Step 2.2.2: Comprehensive Project Management**:
    - Implement the UI and backend services for adding projects under a specific client.
    - Develop the detailed project page, including tabs for overview, budget, team, and timeline.

### Milestone 2.3: Initial Resource Allocation (Upcoming)
- **Step 2.3.1: Basic Allocation System**:
    - Develop the UI for allocating a resource from the resource pool to a specific project.
    - Implement the backend logic to create `Allocation` documents in Firestore, linking resources to projects.
    - Display allocated resources on the project detail page.
- **Step 2.3.2: Allocation & Conflict Visualization**:
    - Create a basic "Allocation Board" or "Resource Calendar" view.
    - Implement simple visual indicators to detect and flag potential over-allocations for a resource.

---

## Phase 3: Advanced Features & Intelligence (Future)

**Goal**: Enhance the platform with advanced operational tools, deeper analytics, and more intelligent features.

### Milestone 3.1: Advanced Allocation & Performance Tracking
- **Step 3.1.1: Advanced Allocation Management**:
    - Enhance the allocation form to include more details (e.g., role, allocation %, specific dates).
    - Implement approval workflows for allocation requests.
- **Step 3.1.2: Performance Tracking**:
    - Add fields to the `Allocation` model for tracking performance metrics (e.g., feedback scores, task completion rates).
    - Create a UI for project managers to provide feedback on allocated resources.

### Milestone 3.2: Comprehensive Analytics & Reporting
- **Step 3.2.1: Foundational Analytics Dashboard**:
    - Design and implement the main dashboard view for company executives.
    - Add key KPI cards for high-level metrics like Total Resources, Active Projects, and overall Resource Utilization %.
    - Create basic charts visualizing resource allocation (e.g., Billable vs. Non-Billable).
- **Step 3.2.2: Role-Based Dashboards**:
    - Implement specialized analytics dashboards for different user roles (Admin, HR, Project Manager).
- **Step 3.2.3: AI-Powered Recommendations**:
    - Develop a Genkit flow that suggests the top 3-5 best-fit resources for a new project based on skills, availability, and past performance.
    - Integrate these recommendations directly into the project setup and allocation screens.

---

## Phase 4: Strategic Intelligence & Optimization (Future)

**Goal**: Transform the platform from an operational tool into a strategic asset with predictive capabilities and enhanced client collaboration.

### Milestone 4.1: Predictive Analytics & Strategic Planning
- **Step 4.1.1: Predictive Demand Forecasting**:
    - Implement a Genkit flow using the Gemini API to analyze historical project data and predict future skill demand.
    - Create a "Demand Forecast" dashboard to help with strategic hiring.

### Milestone 4.2: Client Collaboration Portal
- **Step 4.2.1: Secure Client Portal**:
    - Develop a separate, secure portal for clients to log in.
- **Step 4.2.2: Client-Facing Dashboards**:
    - Provide clients with a read-only view of their project's progress, allocated team members, and key milestones.
    - Implement a communication center for clients to interact with the project manager.