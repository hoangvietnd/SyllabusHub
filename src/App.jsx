import * as React from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Settings from './pages/Settings';
import Assignments from './pages/Assignments';
import Profile from './pages/Profile';
import CourseDetail from './pages/CourseDetail';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  React.useEffect(() => {
    const handler = (e) => {
      const to = e.detail?.to;
      if (to) navigate(to);
    };
    window.addEventListener('navigate-to', handler);
    return () => window.removeEventListener('navigate-to', handler);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default'
      }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    );
  }

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onMenuClick={handleDrawerToggle} onLogout={handleLogout} />
      <Sidebar onSelectPage={(p) => navigate(p === 'dashboard' ? '/' : `/${p}`)} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 2, mt: 8, width: { md: `calc(100% - 240px)` } }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
          <Route path="/courses/:id" element={<PrivateRoute><CourseDetail /></PrivateRoute>} />
          <Route path="/assignments" element={<PrivateRoute><Assignments /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
    </Box>
  );
}
