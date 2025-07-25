# Documentation: Platform Dashboard

## 1. Purpose

The Platform Dashboard serves as the central command center for the super-administrators of the ResourceWise platform. Its primary purpose is to provide the necessary tools and insights to manage the entire ecosystem, including all customer companies, platform-wide settings, user access, and overall system health. This is an internal-facing dashboard, not visible to client companies.

---

## 2. Feature Breakdown

### Completed Features

- **Platform User Management (`/settings/users`)**:
  - **Functionality**: A fully functional interface to manage platform-level administrators and support staff.
  - **Capabilities**:
    - View a list of all registered platform users and their current status (Active, Suspended).
    - View pending invitations for users who have not yet registered.
    - Invite new users by generating a secure, token-based invitation link.
    - Suspend or reactivate existing user accounts.

- **Platform Configuration (`/settings/platform-configuration`)**:
  - **Functionality**: A settings panel for configuring global platform behavior.
  - **Capabilities**:
    - **Session Management**: Admins can define the rules for automatic user session timeouts due to inactivity, including the timeout duration and the warning period before logout.

### Planned Features (Based on Roadmap)

- **Full Customer Company Management (`/companies`)**:
  - **Goal**: Implement a comprehensive view to manage the lifecycle of all customer companies.
  - **Planned Steps**:
    1.  Develop a table view to list all companies, showing key details like name, subscription plan, status (active, trial, suspended), and total users.
    2.  Implement actions to manually approve, suspend, or deactivate a company account.
    3.  Create a detailed view for each company, showing their usage statistics, admin users, and audit logs.

- **Subscription & Billing Management (`/subscriptions`)**:
  - **Goal**: Integrate with a payment provider like Stripe to manage subscription plans and billing.
  - **Planned Steps**:
    1.  Define different subscription tiers (e.g., Free, Pro, Enterprise) with varying limits on resources, projects, etc.
    2.  Build an interface for admins to view a company's current subscription, billing history, and upcoming invoices.
    3.  Implement functionality to upgrade, downgrade, or cancel a company's subscription plan.

- **Platform-Wide Analytics (`/platform-analytics`)**:
  - **Goal**: Create a dashboard with KPIs that measure the health and growth of the entire platform.
  - **Planned Metrics**:
    - Monthly Active Users (MAU)
    - New Company Sign-ups
    - Subscription Growth Rate
    - Churn Rate
    - Feature Adoption Rates

### Placeholders (Routes Exist, Implementation Pending)

- **Support Ticket Management (`/support`)**: A route exists, but a full ticketing system needs to be designed and built.
- **Advanced Roles & Permissions (`/settings/roles`)**: The route is in place, but a granular, role-based access control (RBAC) system for platform staff needs to be implemented.

---

## 3. Future Enhancements & Improvements

Beyond the current roadmap, the Platform Dashboard could be enhanced with the following features:

- **System Health Monitoring**: A dedicated view showing the status of critical services, API response times, and error rates to proactively identify and address issues.
- **Automated Onboarding Workflows**: Create automated sequences for new companies, such as welcome emails, setup checklists, and guided tours.
- **Global Announcements**: An interface for platform admins to push announcements or notifications to all users or specific companies.
- **Data Export Tools**: Allow admins to securely export platform-level data (e.g., user lists, company data) for reporting or backup purposes.
- **Customizable Dashboards**: Enable platform admins to create and save their own customized dashboard views with the metrics that matter most to them.
