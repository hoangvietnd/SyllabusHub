import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { TitleProvider } from '../contexts/TitleContext';

const drawerWidth = 240;

function MainLayout() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <TitleProvider>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Topbar toggleDrawer={toggleDrawer} open={open} drawerWidth={drawerWidth} />
        <Sidebar drawerWidth={drawerWidth} open={open} />
        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            bgcolor: 'background.default',
            minHeight: '100vh',
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `-${drawerWidth}px`,
            ...(open && {
              transition: (theme) => theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
              marginLeft: 0,
            }),
          }}
        >
          <Toolbar />
          <Box component="div" sx={{ p: 3, flexGrow: 1 }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </TitleProvider>
  );
}

export default MainLayout;
