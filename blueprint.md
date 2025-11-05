# **Blueprint: CourseHub - Online Curriculum Archive**

## **1. Overview**

CourseHub is a web application designed to be an online archive for educational materials. It allows users to easily find, download, and share learning resources. The platform is built with React and Material-UI, providing a modern, responsive, and user-friendly interface. The backend is powered by a separate service that manages data for courses, subjects, documents, and users.

## **2. Implemented Features & Design**

This section outlines all the styles, designs, and features implemented in the application from the initial version to the current one.

### **2.1. Core Architecture & Styling**

*   **Framework:** React (Vite)
*   **UI Library:** Material-UI (MUI) for a consistent and modern design.
*   **Routing:** `react-router-dom` for client-side navigation.
*   **State Management:**
    *   `@tanstack/react-query` for server state management (caching, fetching, updating data).
    *   React Context API (`AuthContext`) for global user authentication state.
*   **Styling:** A combination of MUI's `sx` prop and a global theme to ensure a visually balanced and polished look.
*   **Internationalization (i18n):** `react-i18next` and `i18next` are used to support multiple languages (English and Vietnamese).

### **2.2. User Authentication**

*   **Login Page:** A dedicated page (`/login`) for users to authenticate.
*   **Protected Routes:** `ProtectedRoute` and `AuthorizedRoute` components ensure that only authenticated users with the correct roles (e.g., 'ADMIN') can access specific pages.
*   **Auth Context:** The `AuthContext` provides global access to the current user's information and authentication status.

### **2.3. Main Layout & Navigation**

*   **Persistent Sidebar:** A `MainLayout` component includes a persistent sidebar for easy navigation across different pages.
*   **Navigation Links:** The sidebar contains links to all major sections of the application, including a separate section for Admin-only actions.

### **2.4. Page-Specific Features**

*   **Home Page (`/`):** A landing page with search and document listings.
*   **Settings & Profile Pages:** Allows users to customize their experience and view their profile.
*   **Courses Page (`/courses`):**
    *   Displays a list of all available courses.
    *   Fetches data using the `listCourses` function from `src/api/courses.js`.
    *   Navigates to the detail page for a selected course.
*   **Course Detail Page (`/courses/:courseId`):**
    *   Fetches and displays detailed information for a single course using `getCourse` from `src/api/courses.js`.
    *   Lists all associated course materials and provides a secure download mechanism.
*   **Admin: Create Course Page (`/admin/create-course`):**
    *   A feature-rich page for administrators to create new courses.
    *   Includes fields for title, description, and dynamic tags.
    *   Allows for uploading an associated course material file (`material`).
    *   Calls a specific backend endpoint (`/courses/create-with-material`) using `FormData` to handle both text and file data in a single request.
    *   Provides real-time upload progress and user feedback.
*   **Admin: Upload Page (`/admin/upload`):** A page dedicated to file uploads for administrators.

## **3. Development Log & Completed Tasks**

This section serves as a log of the development process.

### **3.1. Course Feature Implementation**

*   **[Completed]** Created the public "All Courses" page (`/courses`).
*   **[Completed]** Created the "Course Detail" page (`/courses/:courseId`).
*   **[Completed]** Implemented a secure file download mechanism for course materials.
*   **[Completed]** Added i18n translations for all new features.
*   **[Completed]** Maintained and updated this `blueprint.md` file.

## **4. Current Task: UI/UX Enhancement for Courses Page**

### **4.1. Objective**

To improve the user interface and experience of the "All Courses" page by implementing a consistent card layout and adding pagination.

### **4.2. Plan**

1.  **[In Progress] Update API Function:** Modify the `listCourses` function in `src/api/courses.js` to correctly handle pagination parameters (`page`, `size`) as expected by the backend.
2.  **[Pending] Refactor `CoursesPage.jsx`:**
    *   Implement state management for the current page number.
    *   Use Material-UI's `<Grid>` component to create a responsive layout for the course cards.
    *   Apply custom styling to ensure all cards in a row have the same height.
    *   Add the Material-UI `<Pagination>` component to the page.
    *   Connect the pagination component to the API calls to fetch data for the selected page.
3.  **[Pending] Update `blueprint.md`:** Document the completed UI/UX enhancements.
