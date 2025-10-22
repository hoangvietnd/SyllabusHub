import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthorizedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();

  // If user is logged in and their role is in the allowed list, render the child routes
  if (isLoggedIn && allowedRoles.includes(user?.role)) {
    return <Outlet />;
  }

  // If user is not logged in or doesn't have the right role, redirect to home
  // You could also redirect to a specific 'unauthorized' page if you have one
  return <Navigate to="/" replace />;
};

export default AuthorizedRoute;
