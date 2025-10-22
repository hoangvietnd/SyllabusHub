import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AuthorizedRoute from './components/AuthorizedRoute'; // Import AuthorizedRoute

// Pages
import HomeContent from './pages/HomeContent';
import LoginPage from './pages/LoginPage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NewMaterials from './pages/NewMaterials';
import Categories from './pages/Categories';
import UploadPage from './pages/Admin/UploadPage.jsx'; // Import UploadPage

const drawerWidth = 240;

function App() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Topbar and Sidebar are rendered here and will be present on all pages */}
      <Topbar toggleDrawer={toggleDrawer} />
      <Sidebar drawerWidth={drawerWidth} open={open} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          transition: 'margin 0.3s',
          // Adjust margin based on whether the sidebar is open or closed
          ml: open ? `${drawerWidth}px` : '64px', // Adjust based on your collapsed sidebar width
          mt: '64px' // Adjust based on your Topbar height
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* General Authenticated Routes */}
          <Route path="/" element={<HomeContent />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
          <Route path="/documents/:docId" element={<DocumentDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/new-materials" element={<NewMaterials />} />
          <Route path="/categories" element={<Categories />} />

          {/* Admin & Teacher Routes */}
          <Route element={<AuthorizedRoute allowedRoles={['ADMIN', 'TEACHER']} />}>
            <Route path="/admin/upload" element={<UploadPage />} />
            {/* Add other admin/teacher specific routes here */}
          </Route>
          
          {/* Fallback route - maybe a 404 page */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
