// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://admin.haven.co.id/api';

/**
 * Base fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Silently handle 404 errors as they're expected when backend is not ready
      if (response.status === 404) {
        throw new Error('API_NOT_FOUND');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    // Only log non-404 errors to reduce console noise
    if (error.message !== 'API_NOT_FOUND') {
      console.error('API Error:', error);
    }
    throw error;
  }
}

/**
 * GET request
 */
export async function get(endpoint, options = {}) {
  return fetchAPI(endpoint, {
    method: 'GET',
    ...options,
  });
}

/**
 * POST request
 */
export async function post(endpoint, data, options = {}) {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * PUT request
 */
export async function put(endpoint, data, options = {}) {
  return fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * DELETE request
 */
export async function del(endpoint, options = {}) {
  return fetchAPI(endpoint, {
    method: 'DELETE',
    ...options,
  });
}

export default {
  get,
  post,
  put,
  delete: del,
};
