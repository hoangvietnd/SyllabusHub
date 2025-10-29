import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Import Outlet
import { useAuth } from '../contexts/AuthContext';

/**
 * A component to protect routes that require authentication.
 * It now uses <Outlet /> to render child routes, which is the standard practice for React Router v6.
 * This ensures consistent behavior with AuthorizedRoute.
 */
function ProtectedRoute() { // Removed `children` prop
  const { isLoggedIn, loading } = useAuth();

  // While the AuthContext is initializing, show a loading state.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  // If initialization is complete, check for login status.
  if (isLoggedIn) {
    // If logged in, render the nested child routes via the Outlet.
    return <Outlet />;
  } else {
    // If not logged in, redirect to the login page.
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
