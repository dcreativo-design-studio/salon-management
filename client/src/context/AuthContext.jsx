// src/context/AuthContext.jsx
import * as jwt_decode from 'jwt-decode';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import {
  getMe as getMeService,
  login as loginService,
  logout as logoutService,
  register as registerService
} from '../services/authService';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update auth headers whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);

      // Check if token is still valid
      try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token expired
          handleLogout();
          toast.error('Your session has expired. Please log in again.');
        }
      } catch (err) {
        // Invalid token
        handleLogout();
      }
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Check if user is logged in on app load
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      if (token) {
        try {
          const userData = await getMeService();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError('Authentication failed. Please log in again.');
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await registerService(userData);
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Registration successful!');
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginService(credentials);
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const handleLogout = async () => {
    setLoading(true);

    try {
      await logoutService();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      toast.info('You have been logged out.');
    }
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    setLoading(true);

    try {
      const response = await api.put('/api/auth/profile', updatedData);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user password
  const updatePassword = async (passwordData) => {
    setLoading(true);

    try {
      const response = await api.put('/api/auth/password', passwordData);
      toast.success('Password updated successfully');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password (forgot password)
  const resetPassword = async (token, newPassword) => {
    setLoading(true);

    try {
      const response = await api.put(`/api/auth/resetpassword/${token}`, {
        password: newPassword
      });
      toast.success('Password has been reset successfully. Please log in.');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send password reset email
  const forgotPassword = async (email) => {
    setLoading(true);

    try {
      const response = await api.post('/api/auth/forgotpassword', { email });
      toast.success('Password reset email sent');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout: handleLogout,
        updateProfile,
        updatePassword,
        resetPassword,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
