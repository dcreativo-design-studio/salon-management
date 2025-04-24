// src/services/authService.js
import api from './api';

/**
 * Login a user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} - Response with user data and token
 */
export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

/**
 * Register a new user
 * @param {Object} userData - User data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User email
 * @param {string} userData.phone - User phone
 * @param {string} userData.password - User password
 * @returns {Promise} - Response with user data and token
 */
export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

/**
 * Get current user data
 * @returns {Promise} - Response with user data
 */
export const getMe = async () => {
  const response = await api.get('/api/auth/me');
  return response.data.user;
};

/**
 * Logout user
 * @returns {Promise} - Response with logout status
 */
export const logout = async () => {
  const response = await api.get('/api/auth/logout');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} - Response with updated user data
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/api/auth/profile', profileData);
  return response.data;
};

/**
 * Update user password
 * @param {Object} passwordData - Password data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise} - Response with update status
 */
export const updatePassword = async (passwordData) => {
  const response = await api.put('/api/auth/password', passwordData);
  return response.data;
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise} - Response with reset status
 */
export const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgotpassword', { email });
  return response.data;
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise} - Response with reset status
 */
export const resetPassword = async (token, password) => {
  const response = await api.put(`/api/auth/resetpassword/${token}`, { password });
  return response.data;
};

/**
 * Register a new staff member (admin only)
 * @param {Object} staffData - Staff data
 * @returns {Promise} - Response with staff data
 */
export const registerStaff = async (staffData) => {
  const response = await api.post('/api/auth/staff', staffData);
  return response.data;
};
