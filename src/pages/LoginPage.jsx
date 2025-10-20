import React from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Fake login: set tokens
    localStorage.setItem('token', 'fake-access-token');
    localStorage.setItem('refreshToken', 'fake-refresh-token');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper sx={{ p: 4, width: 300 }}>
        <Typography variant="h6" gutterBottom>
          Login
        </Typography>
        <TextField label="Username" fullWidth margin="normal" />
        <TextField label="Password" type="password" fullWidth margin="normal" />
        <Button variant="contained" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;