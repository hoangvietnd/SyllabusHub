import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import useAuth from '../hooks/useAuth';
import api from '../utils/axiosInstance';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import useTitle from '../hooks/useTitle';

function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(t('sidebar.profile'));
  }, [setTitle, t]);

  useEffect(() => {
    if (user) {
      setProfile(user);
      setLoading(false);
    } else {
      setError(t('profilePage.loadingError'));
      api.get('/auth/me').then(response => {
        setProfile(response.data);
      }).catch(err => {
        console.error('Lỗi tải hồ sơ:', err);
        setError(t('profilePage.loadingFailed'));
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user, t]);

  const getRoleIcon = (role) => {
    if (role === 'ADMIN') return <AdminPanelSettingsIcon color="primary" />;
    return <PersonIcon color="action" />;
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
  }

  if (error && !profile) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  if (!profile) {
    return <Typography sx={{m: 3}}>{t('profilePage.noProfile')}</Typography>
  }

  return (
    <Paper
      elevation={5}
      sx={{
        maxWidth: '850px',
        margin: 'auto',
        borderRadius: '16px',
        overflow: 'hidden',
        mt: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          height: '220px',
          background: 'linear-gradient(135deg, #4267B2 0%, #2E4C8B 100%)',
          position: 'relative'
        }}
      />
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        p: { xs: 2, sm: 3 },
        mt: '-90px',
      }}>
        <Avatar
          sx={{
            width: 160,
            height: 160,
            bgcolor: 'primary.light',
            fontSize: '4.5rem',
            border: '5px solid white',
            zIndex: 1,
          }}
        >
          {profile.email ? profile.email.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        <Box sx={{ ml: { sm: 4 }, mt: { xs: 2, sm: 8 }, textAlign: { xs: 'center', sm: 'left' }, width: '100%' }}>
          <Typography variant="h4" fontWeight="bold">
            {profile.email || t('profilePage.infoUnavailable')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {profile.role?.toLowerCase() || t('profilePage.roleUndefined')}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<EditIcon />} sx={{ ml: { sm: 'auto' }, mt: { xs: 2, sm: 4 } }} disabled>
          {t('profilePage.editProfile')}
        </Button>
      </Box>
      <Divider sx={{ my: 1 }} variant="middle" />
      <Box p={{ xs: 2, sm: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>{t('profilePage.detailsTitle')}</Typography>
        <List>
          <ListItem>
            <ListItemIcon sx={{minWidth: 40}}>
              <EmailIcon color="action" />
            </ListItemIcon>
            <ListItemText primary={t('profilePage.emailLabel')} secondary={profile.email || 'N/A'} />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{minWidth: 40}}>
              {getRoleIcon(profile.role)}
            </ListItemIcon>
            <ListItemText primary={t('profilePage.roleLabel')} secondary={profile.role || 'N/A'} />
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box p={2} sx={{ textAlign: 'right', background: '#fafafa' }}>
         <Button
          variant="contained"
          color="error"
          onClick={logout}
          sx={{ borderRadius: '8px', px: 3, py: 1 }}
        >
          {t('profilePage.logoutButton')}
        </Button>
      </Box>
    </Paper>
  );
}

export default ProfilePage;
