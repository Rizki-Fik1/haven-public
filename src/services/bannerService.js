import api from './axios';

/**
 * Get all active banners
 */
export const getBanners = async () => {
  try {
    const response = await api.get('/banners');
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export default {
  getBanners,
};