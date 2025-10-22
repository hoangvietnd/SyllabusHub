import React from 'react';
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import UploadIcon from '@mui/icons-material/Upload'; // Import Upload icon
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

function Sidebar({ drawerWidth, open }) {
  const { t } = useTranslation();
  const { user } = useAuth(); // Get user from auth context

  const isAdminOrTeacher = user?.role === 'ADMIN' || user?.role === 'TEACHER';

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper', // Use theme's paper background
          color: 'text.primary'
        }
      }}
    >
      <Toolbar
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h6">CourseHub</Typography>
      </Toolbar>

      <List>
        {/* General Navigation */}
        <ListItem button component={Link} to="/">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary={t('sidebar.home')} />
        </ListItem>
        <ListItem button component={Link} to="/subjects">
          <ListItemIcon><BookIcon /></ListItemIcon>
          <ListItemText primary={t('sidebar.subjects')} />
        </ListItem>
        <ListItem button component={Link} to="/new-materials">
          <ListItemIcon><NewReleasesIcon /></ListItemIcon>
          <ListItemText primary={t('sidebar.newMaterials')} />
        </ListItem>
        <ListItem button component={Link} to="/categories">
          <ListItemIcon><CategoryIcon /></ListItemIcon>
          <ListItemText primary={t('sidebar.categories')} />
        </ListItem>
        
        <Divider sx={{ my: 1 }} />

        {/* Admin/Teacher Specific Navigation */}
        {isAdminOrTeacher && (
          <ListItem button component={Link} to="/admin/upload">
            <ListItemIcon><UploadIcon /></ListItemIcon>
            <ListItemText primary={t('sidebar.upload')} />
          </ListItem>
        )}

      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      {/* Moved Settings to the bottom */}
      <List>
        <ListItem button component={Link} to="/settings">
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary={t('sidebar.settings')} />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
