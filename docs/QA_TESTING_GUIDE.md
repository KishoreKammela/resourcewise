# ResourceWise: Quality Assurance Testing Guide

## 1. Introduction

### 1.1 Purpose
This document provides a comprehensive guide for the Quality Assurance (QA) team to test the ResourceWise platform. Its goal is to ensure the application is robust, reliable, and meets all functional requirements before deployment. This is a living document and should be updated as new features are added.

### 1.2 Testing Scope
This guide covers testing for all major features, including:
- User Authentication & Registration
- Core Data Management (Resources, Clients, Projects)
- AI-Powered Features
- Platform & Company Administration
- User Interface & User Experience

### 1.3 Tools & Environment
- **Environment**: Staging environment, which should be a mirror of production.
- **Browser**: All tests should be performed on the latest versions of Google Chrome, Mozilla Firefox, and Safari.
- **Developer Tools**: Browser developer tools are essential for inspecting the console for errors, checking network requests, and examining the DOM.

---

## 2. Authentication & Onboarding

### 2.1 Company Registration (`/signup`)
- **Objective**: Ensure a new company and its first admin user can register successfully.
- **Test Cases**:
  1. **Happy Path**: Complete the multi-step form with valid data.
     - **Expected**: Registration succeeds, user is redirected to the `/login` page, and a success toast appears.
  2. **Validation - Step 1 (User Details)**:
     - Try to proceed with empty fields (First Name, Last Name, Email, Password). Expected: Validation errors appear.
     - Enter an invalid email format. Expected: "Please enter a valid email" error.
     - Enter a password that doesn't meet the policy. Expected: The `PasswordPolicy` component should highlight unmet criteria in real-time.
     - Enter a password and a non-matching confirmation password. Expected: "Passwords don't match" error.
  3. **Validation - Step 2 (Company Info)**:
     - Try to proceed with an empty company name. Expected: "Company name is required" error.
     - Enter an invalid website URL. Expected: "Please enter a valid URL" error.
  4. **Existing Email**: Attempt to register with an email address that is already in use.
     - **Expected**: The form submission should fail with a clear error message: "This email address is already in use...".
  5. **UI/UX**:
     - Check that the step indicator at the top correctly highlights the current step.
     - Ensure the "Go Back" button works and preserves the state of the previous step's form fields.

### 2.2 User Login (`/login`)
- **Objective**: Ensure registered users can log in securely.
- **Test Cases**:
  1. **Happy Path**: Log in with valid credentials for both a "Platform Admin" and a "Company Admin".
     - **Expected**: Login is successful. User is redirected to the correct dashboard (`/` or `/analytics`), a session cookie `__session` is set, and a success toast appears.
  2. **Invalid Credentials**:
     - Attempt login with an incorrect password. Expected: "Invalid email or password" error toast.
     - Attempt login with an email that does not exist. Expected: "Invalid email or password" error toast.
  3. **UI/UX**: The "Sign in" button should show a loading spinner and be disabled during the login attempt.

### 2.3 Invitation Flow (`/signup/invite/[token]`)
- **Objective**: Ensure users can register successfully via an invitation link.
- **Test Cases**:
  1. **Happy Path (Company & Platform)**:
     - Generate an invite link from the Team page (for a company user) and the Platform Users page (for a platform user).
     - Open the link in an incognito window. The user's name and email should be pre-filled and disabled.
     - Set a strong password and complete registration.
     - **Expected**: User is automatically logged in and redirected to the dashboard. The user should now appear as "Active" in the respective user list (Team or Platform Users).
  2. **Invalid/Expired Token**:
     - Attempt to access an invalid URL (e.g., `/signup/invite/bad-token`).
     - Let an invitation expire (7 days) and then try to use it.
     - **Expected**: A page appears stating "This invitation link is either invalid or has expired."
  3. **Password Validation**:
     - Test all password policy rules on this form. Expected: Real-time validation and server-side rejection of weak passwords.

---

## 3. Resource Management (`/resources`)

### 3.1 Resource Pool (`/resources`)
- **Objective**: Verify the functionality of the advanced data table for resources.
- **Test Cases**:
  1. **Pagination**:
     - With more than 10 resources, verify the pagination controls work correctly (Next, Previous, First, Last).
     - Change "Rows per page". Expected: The table should update to show the correct number of resources.
  2. **Sorting**:
     - Click on sortable column headers (Name, Designation, Availability, Allocation).
     - **Expected**: The table should re-fetch data from the server and display it sorted in ascending, then descending order. The URL should update with the `sort` query parameter.
  3. **Actions**:
     - Click the three-dots menu on a resource row.
     - Click "View". Expected: Redirects to `/resources/[resourceId]`.
     - Click "Edit". Expected: Redirects to `/resources/[resourceId]/edit`.
  4. **Empty State**: If no resources exist, ensure the table shows a "No results" message.

### 3.2 Add/Edit Resource Form
- **Objective**: Ensure resources can be created and updated correctly.
- **Test Cases**:
  1. **Happy Path**: Fill out all fields with valid data and save.
     - **Expected**: Resource is created/updated. Redirect to the details page or resource list. A success toast appears.
  2. **AI Skill Extraction**:
     - Upload a valid resume (PDF, DOCX). Expected: A toast indicates analysis is in progress. The "Technical Skills" and "Soft Skills" fields should be auto-populated shortly after.
     - Upload an invalid file type. Expected: Browser should prevent it, or backend should handle it gracefully.
     - Upload a resume with no discernible skills. Expected: A toast should indicate that no skills were found.
  3. **Dynamic Arrays (Experience, Education, Certs)**:
     - Click "Add Experience". Expected: A new set of form fields appears.
     - Fill out the fields, then click the trash icon. Expected: The field set is removed.
  4. **Validation**:
     - Try to save with required fields (First Name, Last Name) empty. Expected: Validation errors.
     - Enter invalid data (e.g., non-URL for a URL field). Expected: Validation errors.

### 3.3 Skills Matrix (`/resources/skills-matrix`)
- **Objective**: Test the functionality of the skills grid.
- **Test Cases**:
  1. **Display**: Verify that all unique skills from all resources are displayed as columns, and all resources are displayed as rows. A checkmark should appear at the intersection if a resource has that skill.
  2. **Filtering**:
     - Type in the "Filter resources..." input. Expected: The list of rows (resources) should filter in real-time.
     - Type in the "Filter skills..." input. Expected: The list of columns (skills) should filter in real-time.
  3. **Switches**:
     - Toggle the "Technical" and "Soft" skill switches. Expected: The columns should update to show/hide the respective skill types.

---

## 4. Platform Administration (`/settings/*` for Platform Users)

### 4.1 Platform User Management (`/settings/users`)
- **Objective**: Ensure platform admins can manage other platform users.
- **Test Cases**:
  1. **Invite User**:
     - Click "Invite User" and fill out the form.
     - **Expected**: A unique invitation link is generated and displayed in a dialog.
  2. **Suspend/Activate User**:
     - Click the action menu on an active user. Click "Suspend User". Expected: The user's status changes to "Suspended", and the action changes to "Activate User".
     - Click the action menu on a suspended user. Click "Activate User". Expected: The status changes back to "Active".
  3. **Edge Cases**:
     - An admin cannot suspend themselves. Expected: The action menu should be disabled for the currently logged-in user.

### 4.2 Platform Configuration (`/settings/platform-configuration`)
- **Objective**: Test the dynamic configuration of platform-wide settings.
- **Test Cases**:
  1. **Update Session Timeout**:
     - Change the "Inactivity Timeout" and "Warning Countdown" values. Click "Save Changes".
     - **Expected**: A success toast appears.
  2. **Verify Timeout Logic**:
     - Set a very short timeout (e.g., 1 minute) and a short warning (e.g., 10 seconds).
     - Open a new tab and remain idle.
     - **Expected**: After 50 seconds, the inactivity warning dialog should appear with a 10-second countdown. If no action is taken, the user should be logged out. If "Stay Logged In" is clicked, the timer should reset.
  3. **Validation**:
     - Try to save with non-numeric or negative values. Expected: A validation error message should appear.
