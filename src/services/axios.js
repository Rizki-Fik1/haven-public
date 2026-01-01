import axios from 'axios';
import { getAuthToken, clearAuthData, redirectToLogin } from '../lib/authUtils';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://admin.haven.co.id/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from auth utils
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      clearAuthData();
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        redirectToLogin(window.location.pathname);
      }
    }

    if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    }

    if (error.response?.status === 404) {
      // Not found - silently handle for fallback
      error.isNotFound = true;
    }

    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;