# ScoutSmart Application Documentation

## 1. Project Overview
ScoutSmart is a web application for managing Boy Scouts of the Philippines (BSP) activities, membership, and units. It features role-based access control (Admin, Staff, Unit Leader, Scout) and provides dashboards for analytics, management, and reporting.

## 2. Page Documentation

### 2.1 Public Pages

#### Landing Page
*   **Route:** `/`
*   **Access:** Public
*   **Content:**
    *   **Hero Section:** Welcome message with "Join the Scouts" and "Scout ID Lookup" form.
    *   **Event Carousel:** Displays promoted events (images).
    *   **About Us:** Information cards (Membership, Activities, Community).
    *   **Mission & Vision:** BSP Mission and Vision statements.
    *   **Call to Action:** "Ready to start your journey?" section.
*   **Buttons & Actions:**
    *   `Sign In` (Header) -> Navigates to `/login`.
    *   `Register` (Header) -> Navigates to `/register`.
    *   `Check Status` (Hero Form) -> Look up a scout by UID. Navigates to `/membership-status/:uid`.
    *   `Join Now` (CTA) -> Navigates to `/register`.

#### Login Page
*   **Route:** `/login`
*   **Access:** Public
*   **Content:** Email and Password login form.
*   **Buttons & Actions:**
    *   `Sign In` -> Authenticates user with Supabase. Redirects to `/dashboard` on success.
    *   `Forgot password?` -> Navigates to `/forgot-password`.
    *   `Sign up` -> Navigates to `/register`.

#### Registration Page
*   **Route:** `/register`
*   **Access:** Public
*   **Content:** Multi-step registration form.
    *   **Role Selection:** Staff, Unit Leader, Scout.
*   **Buttons & Actions:**
    *   `Continue` (Role Selection) -> Proceed to role-specific form.
    *   **Staff/Unit Leader Flow:**
        *   `Submit Registration` -> Creates Supabase auth user with "pending" status.
    *   **Scout Flow:**
        *   `Register Scout` -> Submits scout details (Personal, Contact, Medical, Affiliation) and uploads photos.

### 2.2 Dashboard & Management Pages

#### Dashboard
*   **Route:** `/dashboard`
*   **Access:** Protected (All Roles)
*   **Content:**
    *   **Stats Cards:** Total Scouts, Active Scouts, Registered Schools, Registered Units (Admin/Staff only).
    *   **Scout ID Card:** Digital ID display (Scout role only).
    *   **Recent Announcements:** List of latest announcements.
    *   **Upcoming Activities:** List of upcoming activities.
*   **Buttons & Actions:**
    *   `View All` (Announcements) -> Navigates to `/announcements`.
    *   `View All` (Activities) -> Navigates to `/activities`.

#### Scouts Management
*   **Route:** `/scouts`
*   **Access:** Admin, Staff, Unit Leader
*   **Content:**
    *   **Stats Overview:** Total, Active, Pending, Expired counts.
    *   **Tabs:** All Scouts, Active, Pending, Expired.
    *   **Search & Filter:** Search bar, Filter panel (Municipality, Rank, etc.).
    *   **Scouts Table:** List of scouts with columns for ID, Name, Rank, Status, etc.
*   **Buttons & Actions:**
    *   `Add Scout` -> Opens `ScoutFormDialog` to create a new scout.
    *   `Export CSV` -> Downloads scout list as CSV.
    *   `Bulk Delete` -> Deletes selected scouts (Admin only).
    *   `Edit` (Table Row) -> Opens `ScoutFormDialog` with scout data.
    *   `View` (Table Row) -> Opens `ViewScoutDialog` with full details.
    *   `ID Card` (Table Row) -> Generates and downloads PDF ID card.
    *   `Approve` (Table Row - Pending) -> Changes status to "Active" (Admin/Staff).

#### Activities Management
*   **Route:** `/activities`
*   **Access:** Admin, Staff, Unit Leader
*   **Content:**
    *   **Tabs:** Upcoming, Ongoing, Completed.
    *   **Activity Cards:** List of activities with date, location, capacity.
*   **Buttons & Actions:**
    *   `Create Activity` -> Opens `ActivityFormDialog`.
    *   `View Details` (Card) -> Opens `ViewActivityDialog`.
    *   `Edit` (Card) -> Opens `ActivityFormDialog` with data.
    *   `Attendance` (Card) -> Opens `MarkAttendanceDialog`.
    *   `Delete` (Card) -> Deletes activity (with confirmation).

#### Announcements
*   **Route:** `/announcements`
*   **Access:** Admin, Staff, Unit Leader
*   **Content:**
    *   **Tabs:** All, Announcement, Policy, Event.
    *   **Announcement Cards:** Title, Content, Author, Date.
*   **Buttons & Actions:**
    *   `Post Announcement` -> Opens `AnnouncementFormDialog`.
    *   `Edit` (Card) -> Opens `AnnouncementFormDialog`.
    *   `Delete` (Card) -> Deletes announcement.

#### Units Management
*   **Route:** `/units`
*   **Access:** Admin, Staff
*   **Content:**
    *   **Search Bar:** Search units by name.
    *   **Unit Cards:** Unit Name, Leader, Status, Scout Count.
*   **Buttons & Actions:**
    *   `Add Unit` -> Opens `UnitFormDialog`.
    *   `View Scouts` (Card) -> Navigates to `/scouts?unitId=...`.
    *   `Edit` (Card) -> Opens `UnitFormDialog`.
    *   `Delete` (Card) -> Deletes unit.

#### Schools Management
*   **Route:** `/schools`
*   **Access:** Admin, Staff
*   **Content:**
    *   **Search Bar:** Search schools by name/municipality.
    *   **School Cards:** Name, Principal, Address, Scout Count, Logo.
*   **Buttons & Actions:**
    *   `Add School` -> Opens `SchoolFormDialog`.
    *   `Export List` -> Downloads schools CSV.
    *   `View Scouts` (Card) -> Navigates to `/scouts?schoolId=...`.
    *   `Edit` (Card) -> Opens `SchoolFormDialog`.
    *   `Delete` (Card) -> Deletes school.

### 2.3 Admin & Utilities

#### Reports
*   **Route:** `/reports`
*   **Access:** Admin
*   **Content:**
    *   **Generate Report Cards:** Options to generate new reports.
    *   **History:** List of previously generated reports.
*   **Buttons & Actions:**
    *   `Scouts Enrollment` -> Generates & Downloads CSV of all scouts.
    *   `Schools Report` -> Generates & Downloads CSV of schools.
    *   `Units Report` -> Generates & Downloads CSV of units.
    *   `Activities Report` -> Generates & Downloads CSV of activities.
    *   `Membership Statistics` -> Generates & Downloads CSV of statistics.
    *   `Download` (History Card) -> Re-downloads report.
    *   `Print` (History Card) -> Opens browser print dialog.

#### User Approvals
*   **Route:** `/user-approvals`
*   **Access:** Admin
*   **Content:**
    *   **Pending Users Table:** List of Staff/Unit Leaders waiting for approval.
*   **Buttons & Actions:**
    *   `Approve` -> Activates user account; allows login.
    *   `Reject` -> Deletes user account.

#### Staff Members
*   **Route:** `/staff-members`
*   **Access:** Admin
*   **Content:** List of approved Staff users.
*   **Actions:** View contact info and school affiliation.

#### Unit Leaders
*   **Route:** `/unit-leaders`
*   **Access:** Admin
*   **Content:** List of approved Unit Leader users.
*   **Actions:** View contact info and unit affiliation.

#### Audit Trail
*   **Route:** `/audit`
*   **Access:** Admin
*   **Content:** Log of system actions (Create, Update, Delete, Login).
*   **Buttons & Actions:**
    *   `Refresh` -> Reloads logs.
    *   `Export` -> Downloads logs as CSV.
    *   `Filter` -> Filter by Category, User, Date.

#### Settings
*   **Route:** `/settings`
*   **Access:** Admin
*   **Content:**
    *   **Tabs:** General, Landing Page, Notifications, Security, Backup.
*   **Buttons & Actions:**
    *   `Save Changes` -> Persists settings to database.
    *   `Initialize Default Settings` -> Resets/Creates base settings.
    *   `Backup Now` -> Triggers database backup (Mock/Placeholder).

#### View Scout Dialog
*   **Content:** Full scout profile including personal, contact, medical, and status info.
*   **Actions:**
    *   `Edit` -> Switches to Edit mode.
    *   `Download ID` -> Generates PDF ID.
    *   `Print Profile` -> Print view.
    *   `Delete` -> Removes scout.

#### Common UI Elements
*   **Sidebar:** Navigation menu (content varies by role).
    *   `Logout` -> Signs out and redirects to login.
*   **Theme Toggle:** Switches between Light/Dark mode.

## 3. Key Components Functionality
*   **ScoutFormDialog:** Handles creation/edition of scouts. Includes logic for file uploads (Profile Photo, Payment Proof).
*   **ActivityFormDialog:** Handles creation/edition of activities. Includes Map Selector for location.
*   **AnnouncementFormDialog:** Handles creation/edition of announcements, policies, and events. Supports photo uploads.
*   **MapSelector:** Interactive map component for picking locations.
*   **ScoutsTable:** Data table with sorting, filtering, and pagination support.
*   **Export Utility:** Functions to convert JSON data to CSV for reports.
