import api from './axios';

/**
 * Search apartments with filters and pagination
 */
export const searchApartments = async (params = {}) => {
  try {
    const response = await api.get('/apartments/search', { params });
    const data = response.data;
    
    // Normalize data to array if it's an object
    if (!Array.isArray(data.data)) {
      data.data = Object.values(data.data);
    }
    
    return data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error searching apartments:', error);
    }
    throw error;
  }
};

/**
 * Get apartment by ID
 */
export const getApartment = async (id) => {
  try {
    const response = await api.get(`/apartments/${id}`);
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error(`Error fetching apartment ${id}:`, error);
    }
    throw error;
  }
};

/**
 * Get featured apartments
 */
export const getFeaturedApartments = async () => {
  try {
    const response = await api.get('/apartments/featured');
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching featured apartments:', error);
    }
    throw error;
  }
};

/**
 * Get apartments list with pagination
 */
export const getApartments = async (params = {}) => {
  try {
    const response = await api.get('/apartments', { params });
    const data = response.data;
    
    // Normalize data to array if it's an object
    if (!Array.isArray(data.data)) {
      data.data = Object.values(data.data);
    }
    
    return data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching apartments:', error);
    }
    throw error;
  }
};

/**
 * Create new apartment (for owners)
 */
export const createApartment = async (apartmentData) => {
  try {
    const response = await api.post('/apartments', apartmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating apartment:', error);
    throw error;
  }
};

/**
 * Update apartment
 */
export const updateApartment = async (id, apartmentData) => {
  try {
    const response = await api.put(`/apartments/${id}`, apartmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating apartment ${id}:`, error);
    throw error;
  }
};

/**
 * Delete apartment
 */
export const deleteApartment = async (id) => {
  try {
    await api.delete(`/apartments/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting apartment ${id}:`, error);
    throw error;
  }
};

/**
 * Check apartment availability for specific dates
 */
export const getApartmentAvailability = async (id, checkIn, checkOut) => {
  try {
    const response = await api.get(`/apartments/${id}/availability`, {
      params: { checkIn, checkOut }
    });
    return response.data;
  } catch (error) {
    console.error(`Error checking availability for apartment ${id}:`, error);
    throw error;
  }
};

/**
 * Get apartments by city/location
 */
export const getApartmentsByCity = async (city) => {
  try {
    const response = await api.get('/apartments', {
      params: { city },
    });
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error(`Error fetching apartments by city ${city}:`, error);
    }
    throw error;
  }
};

export default {
  searchApartments,
  getApartment,
  getFeaturedApartments,
  getApartments,
  createApartment,
  updateApartment,
  deleteApartment,
  getApartmentAvailability,
  getApartmentsByCity,
};
