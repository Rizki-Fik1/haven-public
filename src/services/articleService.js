import api from './axios';

/**
 * Get all articles
 */
export async function getArticles(params = {}) {
  try {
    const response = await api.get('/artikel', { params });
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching articles:', error);
    }
    throw error;
  }
}

/**
 * Get article by ID
 */
export async function getArticleById(id) {
  try {
    const response = await api.get(`/artikel/${id}`);
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error(`Error fetching article ${id}:`, error);
    }
    throw error;
  }
}

/**
 * Get latest articles
 */
export async function getLatestArticles(limit = 6) {
  try {
    const response = await api.get('/artikel', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching latest articles:', error);
    }
    throw error;
  }
}

export default {
  getArticles,
  getArticleById,
  getLatestArticles,
};
