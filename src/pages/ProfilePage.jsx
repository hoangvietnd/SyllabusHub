import React from 'react';
import { Typography, Avatar, Paper, Box, Button } from '@mui/material';

function ProfilePage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" sx={{ width: 64, height: 64 }} />
        <Box>
          <Typography variant="h6">John Doe</Typography>
          <Typography variant="body2">johndoe@example.com</Typography>
        </Box>
      </Box>
      <Box mt={2}>
        <Button variant="outlined">Edit Profile</Button>
      </Box>
    </Paper>
  );
}

export default ProfilePage;