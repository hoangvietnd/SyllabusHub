import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const drawerWidth = 240;

function MainLayout() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
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
          marginLeft: open ? `${drawerWidth}px` : '64px',
          marginTop: '64px',
        }}
      >
        {/* Child routes will be rendered here */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
