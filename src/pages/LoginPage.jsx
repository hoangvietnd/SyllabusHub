import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });

      // The backend now returns a JSON object with accessToken and refreshToken.
      const { accessToken, refreshToken } = response.data;

      login(accessToken, refreshToken);
      
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
      console.error("Login failed:", err);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <TextField 
            label="Email" 
            type="email"
            fullWidth 
            required
            margin="normal" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            label="Password" 
            type="password" 
            fullWidth 
            required
            margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          {error && <Typography color="error" align="center" sx={{ my: 2 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.5 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;
