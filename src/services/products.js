import api from './axios';

/**
 * Get all products
 * @returns {Promise} Products response
 */
export const getProducts = async () => {
  const response = await api.get("/getProduk");
  return response.data;
};

/**
 * Get product transactions for a user
 * @param {string|number} userId - User ID
 * @returns {Promise} Product transactions response
 */
export const getProductTransactions = async (userId) => {
  const response = await api.get(`/transaksi-produk/user/${userId}`);
  return response.data;
};
