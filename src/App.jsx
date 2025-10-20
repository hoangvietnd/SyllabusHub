import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ProtectedRoute from './components/ProtectedRoute';

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

const drawerWidth = 240;

function App() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    // <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Topbar toggleDrawer={toggleDrawer} />
        <Sidebar drawerWidth={drawerWidth} open={open} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            transition: 'margin 0.3s',
            ml: open ? `${drawerWidth*2}px` : 0,
            mt: '64px'
          }}
        >
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                // <ProtectedRoute>
                  <HomeContent />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                // <ProtectedRoute>
                  <SubjectsPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/subjects/:subjectId"
              element={
                // <ProtectedRoute>
                  <SubjectDetailPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/documents/:docId"
              element={
                // <ProtectedRoute>
                  <DocumentDetailPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                // <ProtectedRoute>
                  <ProfilePage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                // <ProtectedRoute>
                  <SettingsPage />
                // </ProtectedRoute>
              }
            />
            <Route 
              path="/new-materials" 
              element={
                // <ProtectedRoute>
                  <NewMaterials />
                // </ProtectedRoute>
              }
            />
            <Route 
              path="/categories" 
              element={
                // <ProtectedRoute>
                  <Categories />
                // </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </Box>
    // </Router>
  );
}

export default App;