import api from './axios';

/**
 * Get all locations/daerah
 */
export async function getLocations() {
  try {
    const response = await api.get('/getLokasi');
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching locations:', error);
    }
    throw error;
  }
}

/**
 * Search kos by daerah
 */
export async function searchKosByDaerah(daerah) {
  try {
    const response = await api.get('/kos', {
      params: { daerah }
    });
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error(`Error searching kos by daerah ${daerah}:`, error);
    }
    throw error;
  }
}

/**
 * Get location by ID
 */
export async function getLocationById(id) {
  try {
    const locations = await getLocations();
    const locationData = locations.data || locations;
    const location = Array.isArray(locationData) 
      ? locationData.find(loc => loc.id === id)
      : null;
    
    if (!location) {
      throw new Error('Location not found');
    }
    
    return {
      data: location,
      success: true
    };
  } catch (error) {
    console.error(`Error fetching location ${id}:`, error);
    throw error;
  }
}

export default {
  getLocations,
  searchKosByDaerah,
  getLocationById,
};
