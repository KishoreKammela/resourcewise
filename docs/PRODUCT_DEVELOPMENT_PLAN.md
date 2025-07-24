# ResourceWise: Product Development Plan

This document outlines the detailed product development plan for the ResourceWise platform. It is based on the comprehensive product requirements and is structured into phases, milestones, and steps.

## Guiding Principles
- **User-Centric Flow**: The development order follows a logical user journey, starting from platform setup to core operations and finally advanced intelligence features.
- **Incremental Value**: Each phase delivers a significant and usable set of features.
- **API-First**: Core business logic is encapsulated in server actions and services, promoting a clean separation of concerns.

---

## Phase 1: Platform Foundation (Month 1-2)

**Goal**: Establish the core infrastructure and foundational features for a company to onboard and start managing its essential data.

### Milestone 1.1: Multi-Tenant Platform & Company Onboarding
- **Step 1.1.1: Company Registration**: Implement the multi-step sign-up form for new companies.
- **Step 1.1.2: Core Company Profile**: Create the Firestore schema and UI for capturing basic company information (name, website, etc.).
- **Step 1.1.3: Subscription & Billing Foundation**: Implement basic subscription status in the Firestore `Company` model. (Full billing management in a later phase).
- **Step 1.1.4: Initial User Authentication**: Secure user login and registration using Firebase Authentication.

### Milestone 1.2: Advanced Team & Resource Management
- **Step 1.2.1: Team Member Management**:
    - Implement the invitation flow for company admins to add team members.
    - Develop the UI for listing, viewing, and managing team members (activate/suspend).
    - Implement Role-Based Access Control (RBAC) foundation based on roles defined in the PRD.
- **Step 1.2.2: Resource Management Foundation**:
    - Create the "Add Resource" form and page structure.
    - Develop the backend services to create and store resource profiles in Firestore.
- **Step 1.2.3: AI-Powered Skills Extraction**:
    - Implement the Genkit flow (`smart-skills-extractor`) using the Gemini API to parse resumes (PDF, DOCX) and extract a list of technical skills.
    - Integrate the AI flow with the "Add Resource" form to auto-populate the skills field upon resume upload.

---

## Phase 2: Core Operations (Month 3-4)

**Goal**: Enable companies to manage their core business operations: clients, projects, and basic resource allocation.

### Milestone 2.1: Client & Project Management
- **Step 2.1.1: Client Relationship Management (CRM) Core**:
    - Implement the UI and backend services for adding and listing clients.
    - Develop the detailed client profile page, capturing business and relationship information.
- **Step 2.1.2: Comprehensive Project Management**:
    - Implement the UI and backend services for adding projects under a specific client.
    - Develop the detailed project page, including tabs for overview, budget, team, and timeline.

### Milestone 2.2: Initial Resource Allocation
- **Step 2.2.1: Basic Allocation System**:
    - Develop the UI for allocating a resource from the resource pool to a specific project.
    - Implement the backend logic to create `Allocation` documents in Firestore, linking resources to projects.
    - Display allocated resources on the project detail page.
- **Step 2.2.2: Allocation & Conflict Visualization**:
    - Create a basic "Allocation Board" or "Resource Calendar" view.
    - Implement simple visual indicators to detect and flag potential over-allocations for a resource.

### Milestone 2.3: Foundational Analytics
- **Step 2.3.1: Core Analytics Dashboard**:
    - Design and implement the main dashboard view for company executives.
    - Add key KPI cards for high-level metrics like Total Resources, Active Projects, and overall Resource Utilization %.
    - Create basic charts visualizing resource allocation (e.g., Billable vs. Non-Billable).

---

## Phase 3: Advanced Features & Intelligence (Month 5-6)

**Goal**: Enhance the platform with advanced operational tools, deeper analytics, and more intelligent features.

### Milestone 3.1: Advanced Allocation & Performance Tracking
- **Step 3.1.1: Advanced Allocation Management**:
    - Enhance the allocation form to include more details (e.g., role, allocation %, specific dates).
    - Implement approval workflows for allocation requests.
- **Step 3.1.2: Performance Tracking**:
    - Add fields to the `Allocation` model for tracking performance metrics (e.g., feedback scores, task completion rates).
    - Create a UI for project managers to provide feedback on allocated resources.

### Milestone 3.2: Comprehensive Analytics & Reporting
- **Step 3.2.1: Role-Based Dashboards**:
    - Implement specialized analytics dashboards for different user roles (Admin, HR, Project Manager).
- **Step 3.2.2: Custom Reporting Engine**:
    - Develop a feature for users to build and save custom reports.
    - Implement data export functionality (CSV, PDF) for all major data types (resources, projects, allocations).
- **Step 3.2.3: AI-Powered Recommendations**:
    - Develop a Genkit flow that suggests the top 3-5 best-fit resources for a new project based on skills, availability, and past performance.
    - Integrate these recommendations directly into the project setup and allocation screens.

---

## Phase 4: Strategic Intelligence & Optimization (Month 7-8)

**Goal**: Transform the platform from an operational tool into a strategic asset with predictive capabilities and enhanced client collaboration.

### Milestone 4.1: Predictive Analytics & Strategic Planning
- **Step 4.1.1: Predictive Demand Forecasting**:
    - Implement a Genkit flow using the Gemini API to analyze historical project data and predict future skill demand.
    - Create a "Demand Forecast" dashboard to help with strategic hiring.
- **Step 4.1.2: Attrition Risk Prediction**:
    - Develop a model to identify resources at risk of attrition based on factors like under-utilization, low performance scores, or prolonged time on the bench.
- **Step 4.1.3: "What-If" Scenario Planning**:
    - Create a UI that allows managers to model different allocation scenarios to see the impact on budget, timeline, and resource utilization.

### Milestone 4.2: Client Collaboration Portal
- **Step 4.2.1: Secure Client Portal**:
    - Develop a separate, secure portal for clients to log in.
- **Step 4.2.2: Client-Facing Dashboards**:
    - Provide clients with a read-only view of their project's progress, allocated team members, and key milestones.
    - Implement a communication center for clients to interact with the project manager.

### Milestone 4.3: Mobile & Integration
- **Step 4.3.1: Mobile Application (Phase 1)**:
    - Scope and develop a companion mobile app focusing on core read-only features and notifications.
- **Step 4.3.2: Third-Party Integrations**:
    - Develop a framework for integrating with external systems (e.g., Jira, Asana, Slack).
    - Implement the first key integration based on customer demand.
