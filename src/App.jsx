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
import SubjectDetailPage from './pages/SubjectDetailPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NewMaterials from './pages/NewMaterials';
import Categories from './pages/Categories';
import UploadPage from './pages/Admin/UploadPage';
import CreateCoursePage from './pages/Admin/CreateCoursePage'; // Import trang mới
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
          <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
          <Route path="/documents/:docId" element={<DocumentDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/new-materials" element={<NewMaterials />} />
          <Route path="/categories" element={<Categories />} />

          {/* Admin & Teacher Routes (also inside MainLayout) */}
          <Route element={<AuthorizedRoute allowedRoles={['ADMIN', 'TEACHER']} />}>
            <Route path="/admin/upload" element={<UploadPage />} />
            <Route path="/admin/create-course" element={<CreateCoursePage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
