# Documentation: Executive Dashboard (Company)

## 1. Purpose

The Executive Dashboard is the primary landing page and central hub for users within a client company (e.g., an administrator, project manager, or executive). Its purpose is to provide a high-level, at-a-glance overview of the company's operational health, resource allocation, project status, and overall performance. It aggregates data from across the platform into digestible KPIs and visualizations.

---

## 2. Feature Breakdown

### Completed Features

- **Key Performance Indicator (KPI) Cards (`/analytics`)**:
  - **Functionality**: A set of prominent cards at the top of the dashboard that display real-time, critical business metrics.
  - **Live Metrics**:
    - **Total Resources**: A live count of all resources in the company's talent pool.
    - **Active Projects**: A live count of all projects currently in an "Active" state.
    - **Total Clients**: A live count of all clients managed by the company.
    - **Overall Utilization**: A calculated percentage showing how much of the total resource capacity is currently allocated to projects.

- **Resource Capacity Chart (`/analytics`)**:
  - **Functionality**: A bar chart that provides a clear visual comparison between the total number of available resources (capacity) and the number of resources currently allocated to projects.
  - **Data Source**: This chart is powered by a live server action that aggregates data from the `resources` and `allocations` collections in real-time.

- **AI-Powered Demand Forecasting (`/analytics/predictive-analytics`)**:
  - **Functionality**: A strategic tool that uses the Gemini API to analyze historical and current project data to predict future skill demand.
  - **Capabilities**:
    - **Trigger Analysis**: Users can initiate the AI analysis with a single button click.
    - **View Forecast**: The dashboard displays the AI-generated results, including:
      - A high-level summary of upcoming trends.
      - A detailed list of skills with predicted "rising", "stable", or "declining" demand.
      - Actionable strategic recommendations for hiring and training.

### Planned Features (Based on Roadmap)

- **Role-Based Dashboards**:
  - **Goal**: The current dashboard is geared towards executives. The plan is to create specialized versions of the dashboard for different user roles within the company.
  - **Planned Views**:
    - **Project Manager Dashboard**: Would focus on the health, budget, and timeline of the projects they manage directly.
    - **Resource Manager Dashboard**: Would highlight resource availability, skills gaps, and allocation conflicts.
    - **HR Dashboard**: Would focus on employee performance metrics, development goals, and skills matrix.
  - **Implementation Plan**:
    1.  Create dedicated React components for each dashboard variant.
    2.  Develop specific server actions to fetch the data required for each role.
    3.  Dynamically render the appropriate dashboard based on the logged-in user's assigned role.

---

## 3. Future Enhancements & Improvements

- **Customizable Widgets**: Allow users to add, remove, and rearrange widgets on their dashboard to tailor it to their specific needs.
- **Project Profitability Tracking**: Add a new chart or KPI to visualize the profitability of projects, comparing total billed amounts against the internal costs of allocated resources.
- **Client Health Scores**: Display a list of top clients, color-coded by their relationship health score, allowing for proactive relationship management.
- **Upcoming Deadline Widget**: Create a dedicated widget that lists all projects with deadlines approaching in the next 7 or 30 days.
- **Alerts & Notifications**: Implement a system to show important alerts on the dashboard, such as budget overruns, projects at risk, or critical allocation conflicts.
- **Date Range Filters**: Allow users to filter the entire dashboard by a specific date range (e.g., this quarter, last month) to analyze historical performance.
