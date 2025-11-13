import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import useAuth from '../hooks/useAuth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      // SỬ DỤNG FETCH: Đơn giản, trực tiếp, không có interceptor phức tạp.
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          // Header quan trọng để backend hiểu đây là dữ liệu JSON
          'Content-Type': 'application/json',
        },
        // Dữ liệu phải được chuyển thành chuỗi JSON
        body: JSON.stringify({ 
          email, 
          password 
        }),
      });

      // `fetch` không tự động báo lỗi cho các status như 401, 404, 500.
      // Chúng ta phải tự kiểm tra `response.ok`.
      if (!response.ok) {
        // Cố gắng đọc thông báo lỗi từ body của response
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Server responded with status ${response.status}`;
        throw new Error(errorMessage);
      }

      // Nếu thành công, đọc dữ liệu JSON từ body
      const data = await response.json();
      const { accessToken, refreshToken } = data;

      if (accessToken && refreshToken) {
        login(accessToken, refreshToken);
        navigate('/');
      } else {
        setError('Login failed: No tokens received.');
      }
    } catch (err) {
      // Catch block này bây giờ sẽ bắt cả lỗi mạng (fetch không kết nối được) và lỗi logic ở trên.
      setError(`Login failed: ${err.message}`);
      console.error('Login error:', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: '#333',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '400px',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, mb: 2, py: 1.2 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;
