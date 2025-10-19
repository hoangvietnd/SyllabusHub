import * as React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth = 240;

import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ onSelectPage, mobileOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const go = (p) => {
        const to = p === 'dashboard' ? '/' : `/${p}`;
        if (onSelectPage) onSelectPage(p);
        if (navigate) navigate(to);
        onClose && onClose();
    };
    const isActive = (p) => {
        const to = p === 'dashboard' ? '/' : `/${p}`;
        return location.pathname === to || location.pathname.startsWith(to + '/');
    };

    const drawerContent = (
        <Box sx={{ backgroundColor: '#1e293b', height: '100%', color: 'white' }}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => go('dashboard')} selected={isActive('dashboard')}>
                        <ListItemIcon><DashboardIcon sx={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => go('courses')} selected={isActive('courses')}>
                        <ListItemIcon><SchoolIcon sx={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary="Courses" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => go('assignments')} selected={isActive('assignments')}>
                        <ListItemIcon><AssignmentIcon sx={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary="Assignments" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => go('calendar')} selected={isActive('calendar')}>
                        <ListItemIcon><EventIcon sx={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary="Calendar" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => go('profile')} selected={isActive('profile')}>
                        <ListItemIcon><PersonIcon sx={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => go('settings')} selected={isActive('settings')}>
                        <ListItemIcon><SettingsIcon sx={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="mailbox folders">
            {/* Temporary drawer for mobile */}
            <Drawer
                variant="temporary"
                open={Boolean(mobileOpen)}
                onClose={onClose}
                ModalProps={{ keepMounted: true }} // Better open performance on mobile.
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#1e293b', color: 'white' },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Permanent drawer for desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#1e293b', color: 'white' },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}
