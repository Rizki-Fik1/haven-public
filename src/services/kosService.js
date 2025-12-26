import api from './axios';

/**
 * Get Kos with pagination and filters
 */
export const getKos = async (params = {}) => {
  try {
    const response = await api.get('/getKos', { params });
    const data = response.data;
    
    // Normalize data to array if it's an object
    if (!Array.isArray(data.data)) {
      data.data = Object.values(data.data);
    }
    
    return data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching kos:', error);
    }
    throw error;
  }
};

/**
 * Get Kos list (for featured carousel)
 */
export const getKosList = async (limit = 6) => {
  try {
    const response = await api.get('/kos', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching kos list:', error);
    }
    throw error;
  }
};

/**
 * Get single Kamar detail
 */
export const getKamarDetail = async (kosId, kamarId) => {
  try {
    const response = await api.get(`/getKamar/${kosId}/kamar/${kamarId}`);
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error(`Error fetching kamar ${kamarId}:`, error);
    }
    throw error;
  }
};

/**
 * Get Kos detail with all rooms
 */
export const getKosDetail = async (kosId) => {
  try {
    const response = await api.get(`/getKos/${kosId}`);
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error(`Error fetching kos ${kosId}:`, error);
    }
    throw error;
  }
};

/**
 * Get Tipe Kos options
 */
export const getTipeKos = async () => {
  try {
    const response = await api.get('/getTipekos');
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching tipe kos:', error);
    }
    throw error;
  }
};

/**
 * Get Kos by city/daerah
 */
export const getKosByCity = async (daerah) => {
  try {
    const response = await api.get('/kos', {
      params: { daerah },
    });
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error(`Error fetching kos by city ${daerah}:`, error);
    }
    throw error;
  }
};

/**
 * Get featured Kos for homepage (from /getKos endpoint - returns kamar data)
 */
export const getFeaturedKos = async (limit = 6) => {
  try {
    const response = await api.get('/getKos', {
      params: {
        per_page: limit,
        page: 1,
      },
    });
    
    const data = response.data;
    
    // Normalize data to array if it's an object
    if (!Array.isArray(data.data)) {
      data.data = Object.values(data.data);
    }
    
    return data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching featured kos:', error);
    }
    throw error;
  }
};

export default {
  getKos,
  getKosList,
  getKamarDetail,
  getKosDetail,
  getTipeKos,
  getKosByCity,
  getFeaturedKos,
};
