import api from './axios';

/**
 * Get all locations/cities
 */
export const getLocations = async () => {
  try {
    const response = await api.get('/getLocations');
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching locations:', error);
    }
    throw error;
  }
};

export default {
  getLocations,
};
