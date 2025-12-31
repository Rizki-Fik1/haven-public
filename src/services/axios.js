import axios from 'axios';
import { getAuthToken } from '../lib/authUtils';

// Base API URL dari environment variable
const API_URL = import.meta.env.VITE_API_URL || 'https://haven.co.id/api';

// Create axios instance dengan konfigurasi default
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
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

// Response interceptor - handle error responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired atau invalid
    if (error.response?.status === 401) {
      // Clear token dan redirect ke login
      localStorage.removeItem('authToken');
      
      // Hanya redirect jika bukan di halaman login/register
      const currentPath = window.location.pathname;
      if (!['/login', '/register', '/forgot-password'].includes(currentPath)) {
        window.location.href = '/login';
      }
    }

    // Handle 404 - silently untuk mengurangi noise di console
    if (error.response?.status === 404) {
      error.isNotFound = true;
    }

    // Log error untuk debugging (kecuali 404)
    if (error.response?.status !== 404) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
