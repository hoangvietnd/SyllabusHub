import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/axiosInstance';

const AuthContext = createContext(null);

/**
 * Processes a decoded JWT token to create a standardized user object.
 * This function handles role hierarchy, ensuring the user is assigned the highest-level role they possess.
 * @param {object} decodedToken - The payload from the decoded JWT.
 * @returns {object|null} A standardized user object or null if the token is invalid.
 */
const processDecodedToken = (decodedToken) => {
  if (!decodedToken) return null;

  // 1. Define the role hierarchy as specified. Order is crucial: highest privilege first.
  const roleHierarchy = ['ADMIN', 'TEACHER', 'STUDENT'];

  // 2. Get the scopes from the token (e.g., "ROLE_TEACHER").
  const scopes = (decodedToken.scope || '').split(' ');

  // 3. Normalize the roles from the backend format to the frontend format.
  const userRoles = scopes.map(s => s.replace('ROLE_', ''));

  // 4. Find the highest-ranking role the user has. If none match, the result will be undefined.
  const highestRole = roleHierarchy.find(role => userRoles.includes(role));

  // 5. Create the standardized user object for the application.
  const user = {
    ...decodedToken,
    role: highestRole,       // The user's highest role, or undefined if they have no recognized roles.
    email: decodedToken.sub, // 'sub' (subject) is the standard JWT claim for the user identifier.
    roles: userRoles,        // Keep a list of all roles from the token.
  };

  return user;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const decodedToken = jwtDecode(accessToken);
          if (decodedToken.exp * 1000 > Date.now()) {
            const user = processDecodedToken(decodedToken);
            setUser(user);
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          } else {
            logout(); // Token is expired
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth from token:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = (accessToken, refreshToken) => {
    if (typeof accessToken !== 'string' || !accessToken) {
      console.error("Login failed: Invalid token.");
      logout();
      return;
    }
    try {
      const decodedToken = jwtDecode(accessToken);
      const user = processDecodedToken(decodedToken);

      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      setUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error("Failed to process login:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
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
