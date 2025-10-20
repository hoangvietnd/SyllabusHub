import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isTokenValid, refreshAccessToken } from '../utils/auth';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      let token = localStorage.getItem('token');
      if (token && isTokenValid(token)) {
        setValid(true);
      } else {
        // Try refresh
        const newToken = await refreshAccessToken();
        if (newToken && isTokenValid(newToken)) {
          setValid(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      }
      setLoading(false);
    };
    checkToken();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return valid ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;