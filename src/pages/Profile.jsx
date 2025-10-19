import * as React from 'react';
import { Box, Typography, Avatar, Grid, Paper, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({ name: 'Người dùng mẫu', email: 'giangvien@example.com', department: 'Computer Science' });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('profile');
    if (raw) setProfile(JSON.parse(raw));
  }, []);

  const save = () => {
    localStorage.setItem('profile', JSON.stringify(profile));
    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        User Profile
      </Typography>
      <Paper sx={{ p: 2, maxWidth: 800 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 72, height: 72 }}>{profile.name?.[0] ?? 'U'}</Avatar>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField fullWidth label="Name" value={profile.name} onChange={(e) => setProfile((s) => ({ ...s, name: e.target.value }))} sx={{ mb: 1 }} />
            <TextField fullWidth label="Email" value={profile.email} onChange={(e) => setProfile((s) => ({ ...s, email: e.target.value }))} sx={{ mb: 1 }} />
            <TextField fullWidth label="Department" value={profile.department} onChange={(e) => setProfile((s) => ({ ...s, department: e.target.value }))} sx={{ mb: 1 }} />
            <Button variant="contained" onClick={save}>Save</Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>Profile saved locally</Alert>
      </Snackbar>
    </Box>
  );
}

