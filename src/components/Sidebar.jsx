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
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Sidebar({ drawerWidth, open }) {
  const { t } = useTranslation();

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
          bgcolor: 'grey.100',
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
        <ListItem button component={Link} to="/settings">
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary={t('sidebar.settings')} />
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
    </Drawer>
  );
}

export default Sidebar;
