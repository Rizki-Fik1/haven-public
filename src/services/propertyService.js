import { get } from './api';

/**
 * Get all properties
 */
export async function getProperties(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/properties?${queryString}` : '/properties';
  
  try {
    const response = await get(endpoint);
    return response;
  } catch (error) {
    // Silently handle expected errors
    if (error.message !== 'API_NOT_FOUND') {
      console.error('Error fetching properties:', error);
    }
    throw error;
  }
}

/**
 * Get property by ID
 */
export async function getPropertyById(id) {
  try {
    const response = await get(`/properties/${id}`);
    return response;
  } catch (error) {
    if (error.message !== 'API_NOT_FOUND') {
      console.error(`Error fetching property ${id}:`, error);
    }
    throw error;
  }
}

/**
 * Get featured properties
 */
export async function getFeaturedProperties(limit = 6) {
  try {
    const response = await get(`/properties?featured=true&limit=${limit}`);
    return response;
  } catch (error) {
    if (error.message !== 'API_NOT_FOUND') {
      console.error('Error fetching featured properties:', error);
    }
    throw error;
  }
}

/**
 * Search properties
 */
export async function searchProperties(searchParams) {
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await get(`/properties/search?${queryString}`);
    return response;
  } catch (error) {
    if (error.message !== 'API_NOT_FOUND') {
      console.error('Error searching properties:', error);
    }
    throw error;
  }
}

export default {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  searchProperties,
};
