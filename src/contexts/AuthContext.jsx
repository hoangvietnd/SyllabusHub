import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

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
    const initializeAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const decodedToken = jwtDecode(accessToken);

          if (decodedToken.exp * 1000 > Date.now()) {
            const userPayload = processDecodedToken(decodedToken);
            setUser(userPayload);
          } else {
            console.log("Access token expired, will be refreshed on next API call.");
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
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

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userPayload);

    } catch (error) {
      console.error("Failed to process login:", error);
      logout();
    }
  };

  const logout = () => {
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

export default AuthContext;
