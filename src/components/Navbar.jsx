import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

export default function Navbar({ onMenuClick, onLogout }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const [isDark, setIsDark] = useState(window.currentTheme === 'dark');
    useEffect(() => {
        setIsDark(window.currentTheme === 'dark');
    }, [theme.palette.mode]);
    const open = Boolean(anchorEl);
    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: '#2563eb' }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Curriculum Dashboard
                </Typography>

                <IconButton sx={{ mr: 1 }} onClick={() => window.toggleTheme?.()} color="inherit">
                    {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>

                <Tooltip title="Account">
                    <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                    <MenuItem onClick={() => window.dispatchEvent(new CustomEvent('navigate-to', { detail: { to: '/profile' } }))}>Profile</MenuItem>
                    <MenuItem onClick={() => window.dispatchEvent(new CustomEvent('navigate-to', { detail: { to: '/settings' } }))}>Settings</MenuItem>
                    <MenuItem onClick={() => { handleClose(); onLogout && onLogout(); }}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
