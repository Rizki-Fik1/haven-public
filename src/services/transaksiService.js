import api from './axios';

/**
 * Transaksi Produk Service
 * Handle semua transaksi pembelian produk dari web
 */

/**
 * Create transaksi baru dari web
 * @param {Object} data - Data transaksi
 * @param {Array} data.items - Array of products [{id_produk, quantity, harga}]
 * @param {Object} data.customer - Customer info {nama, email, phone}
 * @param {string} data.payment_method - Tripay payment method code
 * @param {number} data.total_amount - Total amount
 */
export const createTransaksiWeb = async (data) => {
  try {
    const response = await api.post('/transaksi-produkweb', data);
    return response.data;
  } catch (error) {
    console.error('Error creating transaksi:', error);
    throw error;
  }
};

/**
 * Create transaksi baru (generic)
 * @param {Object} data - Data transaksi
 */
export const createTransaksi = async (data) => {
  try {
    const response = await api.post('/transaksi-produk', data);
    return response.data;
  } catch (error) {
    console.error('Error creating transaksi:', error);
    throw error;
  }
};

/**
 * Get transaksi history by user ID
 * @param {number} userId - User ID
 */
export const getTransaksiByUser = async (userId) => {
  try {
    const response = await api.get(`/transaksi-produk/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};

/**
 * Update transaksi status by merchant reference
 * Used for Tripay callback
 * @param {string} merchantRef - Tripay merchant reference
 * @param {Object} data - Update data {status, payment_status, etc}
 */
export const updateTransaksiByMerchantRef = async (merchantRef, data) => {
  try {
    const response = await api.post(`/transaksi-produk/merchant-ref/${merchantRef}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating transaksi:', error);
    throw error;
  }
};

/**
 * Get transaksi detail by ID
 * @param {number} transaksiId - Transaksi ID
 */
export const getTransaksiDetail = async (transaksiId) => {
  try {
    const response = await api.get(`/transaksi-produk/${transaksiId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaksi detail:', error);
    throw error;
  }
};

/**
 * Create transaksi produk (untuk single product)
 * @param {Object} data - Data transaksi produk
 */
export const createTransaksiProduk = async (data) => {
  try {
    const response = await api.post('/transaksi-produk', data);
    return response.data;
  } catch (error) {
    console.error('Error creating transaksi produk:', error);
    throw error;
  }
};

export default {
  createTransaksiWeb,
  createTransaksi,
  createTransaksiProduk,
  getTransaksiByUser,
  updateTransaksiByMerchantRef,
  getTransaksiDetail,
};
