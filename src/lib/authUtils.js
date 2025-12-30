/**
 * Authentication utility functions for token management and auth state
 */

// Token storage keys
export const TOKEN_KEY = 'authToken';

/**
 * Get auth token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set auth token in both localStorage and cookie
 */
export const setAuthToken = (token) => {
  // Store in localStorage for client-side access
  localStorage.setItem(TOKEN_KEY, token);

  // Store in cookie for potential SSR/middleware access
  document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=strict`;
};

/**
 * Remove auth token from both localStorage and cookies
 */
export const removeAuthToken = () => {
  // Remove from localStorage
  localStorage.removeItem(TOKEN_KEY);

  // Remove from cookies
  document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
  removeAuthToken();
};

/**
 * Redirect to login page with optional redirect URL
 */
export const redirectToLogin = (redirectUrl) => {
  const loginUrl = '/login';
  const url = redirectUrl
    ? `${loginUrl}?redirect=${encodeURIComponent(redirectUrl)}`
    : loginUrl;

  window.location.href = url;
};

/**
 * Get redirect URL from query params
 */
export const getRedirectUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('redirect') || '/';
};
