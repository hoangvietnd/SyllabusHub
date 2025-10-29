import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/axiosInstance'; // api instance will be configured with interceptors

const AuthContext = createContext(null);

/**
 * Processes a decoded JWT token to create a standardized user object.
 * This function handles role hierarchy, ensuring the user is assigned the highest-level role they possess.
 * @param {object} decodedToken - The payload from the decoded JWT.
 * @returns {object|null} A standardized user object or null if the token is invalid.
 */
const processDecodedToken = (decodedToken) => {
  if (!decodedToken) return null;

  const roleHierarchy = ['ADMIN', 'TEACHER', 'STUDENT'];
  const scopes = (decodedToken.scope || '').split(' ');
  const userRoles = scopes.map(s => s.replace('ROLE_', ''));
  const highestRole = roleHierarchy.find(role => userRoles.includes(role));

  return {
    ...decodedToken,
    role: highestRole,
    email: decodedToken.sub,
    roles: userRoles,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs once on app startup to initialize auth state.
    const initializeAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const decodedToken = jwtDecode(accessToken);

          // Check if token is expired
          if (decodedToken.exp * 1000 > Date.now()) {
            const userPayload = processDecodedToken(decodedToken);
            setUser(userPayload);
          } else {
            // If the access token is expired, the interceptor will handle refreshing it when the first API call is made.
            // We can also proactively refresh it here, but for simplicity, we'll let the interceptor do its job.
            console.log("Access token expired, will be refreshed on next API call.");
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        // Clear any lingering invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = (accessToken, refreshToken) => {
    try {
      const decodedToken = jwtDecode(accessToken);
      const userPayload = processDecodedToken(decodedToken);

      // Store tokens and set user state
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userPayload);

    } catch (error) {
      console.error("Failed to process login:", error);
      // Ensure a clean state on login failure
      logout();
    }
  };

  const logout = () => {
    // Clear everything
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const authValue = {
    user,
    isLoggedIn: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
