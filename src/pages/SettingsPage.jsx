import React, { useContext } from 'react';
import {
  Typography,
  FormControlLabel,
  Switch,
  Paper,
  Box
} from '@mui/material';
import ThemeContext from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

function SettingsPage() {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        {t('settings.title')}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">{t('settings.theme.title')}</Typography>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
          label={t('settings.theme.darkMode')}
        />
      </Box>
      <Box>
        <Typography variant="h6">{t('settings.notifications.title')}</Typography>
        <FormControlLabel control={<Switch />} label={t('settings.notifications.email')} />
      </Box>
    </Paper>
  );
}

export default SettingsPage;
