// src/services/api.js
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Send cookies with requests
});

// Add a request interceptor to add auth token from local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not a login/register request
    if (error.response?.status === 401 &&
        !originalRequest.url.includes('/api/auth/login') &&
        !originalRequest.url.includes('/api/auth/register') &&
        !originalRequest._retry) {
      // Token expired, remove from storage
      localStorage.removeItem('token');

      // Refresh page or redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
