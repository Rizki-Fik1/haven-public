import api from './axios';

/**
 * Get all fasilitas
 */
export const getFasilitas = async () => {
  try {
    const response = await api.get('/getFasilitas');
    return response.data;
  } catch (error) {
    console.error('Error fetching fasilitas:', error);
    throw error;
  }
};

export default {
  getFasilitas,
};
