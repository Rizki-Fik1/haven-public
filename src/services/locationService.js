import api from './axios';

/**
 * Get all locations/daerah
 */
export async function getLocations() {
  try {
    const response = await api.get('/daerah');
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching locations:', error);
    }
    throw error;
  }
}

/**
 * Get location by ID
 */
export async function getLocationById(id) {
  try {
    const response = await api.get(`/daerah/${id}`);
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error(`Error fetching location ${id}:`, error);
    }
    throw error;
  }
}

export default {
  getLocations,
  getLocationById,
};
