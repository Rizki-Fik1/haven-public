import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import { setAuthToken, removeAuthToken, getAuthToken } from '../lib/authUtils';

// ==================== Auth API Functions ====================

export const authApi = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  // Google login user
  googleLogin: async (credentials) => {
    const response = await api.post('/auth/google/login', credentials);
    return response.data;
  },

  // Google register user
  googleRegister: async (credentials) => {
    const response = await api.post('/auth/google/register', credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const formData = new FormData();

    formData.append('nama', userData.nama);
    formData.append('nik', userData.nik);
    formData.append('email', userData.email);
    formData.append('alamat', userData.alamat);
    formData.append('password', userData.password);
    formData.append('status', userData.status);

    if (userData.phone) {
      formData.append('phone', userData.phone);
    }

    if (userData.gambarktp instanceof File) {
      formData.append('gambarktp', userData.gambarktp);
    }

    if (userData.fotoselfie instanceof File) {
      formData.append('fotoselfie', userData.fotoselfie);
    }

    const response = await api.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get current user profile
  getAuth: async () => {
    const response = await api.get('/account');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const formData = new FormData();

    if (userData.nama) formData.append('nama', userData.nama);
    if (userData.nik) formData.append('nik', userData.nik.toString());
    if (userData.alamat) formData.append('alamat', userData.alamat);
    if (userData.phone) formData.append('phone', userData.phone);
    if (userData.status) formData.append('status', userData.status);

    if (userData.gambarktp instanceof File) {
      formData.append('gambarktp', userData.gambarktp);
    }

    if (userData.fotoselfie instanceof File) {
      formData.append('fotoselfie', userData.fotoselfie);
    }

    const response = await api.post('/account/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data) => {
    const response = await api.post('/forget-password', data);
    return response.data;
  },

  // Logout user
  logout: async () => {
    await api.post('/logout');
  },
};

// ==================== Auth Hooks ====================

/**
 * Hook for user login
 */
export const useLogin = (options = {}) => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Save token to localStorage
      if (data.token) {
        setAuthToken(data.token);
      }
    },
    ...options,
  });
};

/**
 * Hook for Google login
 */
export const useGoogleLogin = (options = {}) => {
  return useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: (data) => {
      if (data.token) {
        setAuthToken(data.token);
      }
    },
    ...options,
  });
};

/**
 * Hook for Google register
 */
export const useGoogleRegister = (options = {}) => {
  return useMutation({
    mutationFn: authApi.googleRegister,
    ...options,
  });
};

/**
 * Hook for user registration
 */
export const useRegister = (options = {}) => {
  return useMutation({
    mutationFn: authApi.register,
    ...options,
  });
};

/**
 * Hook for getting current user data
 */
export const useAuth = (options = {}) => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getAuth,
    enabled: !!getAuthToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      // Invalidate user profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    ...options,
  });
};

/**
 * Hook for forgot password
 */
export const useForgotPassword = (options = {}) => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    ...options,
  });
};

/**
 * Hook for user logout
 */
export const useLogout = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear tokens from localStorage
      removeAuthToken();
      // Clear all queries
      queryClient.clear();
      // Redirect to login page
      window.location.href = '/login';
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      removeAuthToken();
      queryClient.clear();
      window.location.href = '/login';
    },
    ...options,
  });
};
