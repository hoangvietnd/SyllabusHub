import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts & Route Protectors
import MainLayout from './components/MainLayout';
import AuthorizedRoute from './components/AuthorizedRoute';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import HomeContent from './pages/HomeContent';
import SubjectsPage from './pages/SubjectsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Categories from './pages/Categories';
import CoursesPage from './pages/CoursesPage';
import CourseFormPage from './pages/CourseFormPage';
import CourseDetailPage from './pages/CourseDetailPage'; // Import the detail page
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Public Route: Login Page (no layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes with Main Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* General Authenticated Routes */}
          <Route path="/" element={<HomeContent />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/categories" element={<Categories />} />
          
          {/* CRUD Routes for Courses */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/new" element={<CourseFormPage />} />
          <Route path="/courses/edit/:id" element={<CourseFormPage />} />
          {/* This is the new route that connects the URL to the detail page component */}
          <Route path="/courses/:id" element={<CourseDetailPage />} />

        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
