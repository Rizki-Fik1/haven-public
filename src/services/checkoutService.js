import api from './axios';

/**
 * Checkout Service
 * Service untuk menangani checkout dan transaksi produk dengan integrasi Tripay
 */

/**
 * Membuat transaksi checkout baru
 * @param {Object} checkoutData - Data checkout
 * @param {number} checkoutData.id_user - ID user yang melakukan checkout (REQUIRED)
 * @param {number} checkoutData.id_produk - ID produk (REQUIRED)
 * @param {number} checkoutData.jumlah - Jumlah produk (REQUIRED)
 * @param {string} checkoutData.metode_pembayaran - Kode metode pembayaran (REQUIRED)
 * @param {string} checkoutData.nama_customer - Nama customer (REQUIRED)
 * @param {string} checkoutData.email_customer - Email customer (REQUIRED)
 * @param {string} [checkoutData.no_hp_customer] - Nomor HP customer (opsional)
 * @param {string} checkoutData.tripay_merchant_ref - Merchant reference Tripay (REQUIRED)
 * @param {string} checkoutData.callback_url - Callback URL Tripay (REQUIRED)
 * @param {string} checkoutData.return_url - Return URL setelah payment (REQUIRED)
 * @param {number} checkoutData.expired_time - Waktu expired dalam jam (REQUIRED)
 * @returns {Promise} Response dari API
 */
export const createCheckout = async (checkoutData) => {
  try {
    const response = await api.post('/transaksi-produk', checkoutData);
    return response.data;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
};

/** 
 * Mendapatkan daftar metode pembayaran yang tersedia dari Tripay
 * Menggunakan backend API untuk keamanan (tidak expose API key di client)
 * @returns {Promise} Daftar payment channels
 */
export const getPaymentChannels = async () => {
  try {
    const response = await api.get("/tripay/payment-channels");
    return response.data;
  } catch (error) {
    console.error("Error fetching Tripay payment channels:", error);
    throw error;
  }
};

/**
 * Mendapatkan detail transaksi berdasarkan reference
 * @param {string} reference - Reference transaksi dari Tripay
 * @returns {Promise} Detail transaksi
 */
export const getTransactionDetail = async (reference) => {
  try {
    const response = await api.get(`/tripay/transaction-detail?reference=${reference}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction detail:', error);
    throw error;
  }
};

/**
 * Mendapatkan riwayat transaksi user
 * @param {number|string} userId - ID user
 * @returns {Promise} Daftar transaksi user
 */
export const getUserTransactions = async (userId) => {
  try {
    const response = await api.get(`/transaksi-produk/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};

/**
 * Mendapatkan detail transaksi berdasarkan ID
 * @param {number|string} transactionId - ID transaksi
 * @returns {Promise} Detail transaksi
 */
export const getTransactionById = async (transactionId) => {
  try {
    const response = await api.get(`/transaksi-produk/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    throw error;
  }
};

/**
 * Membatalkan transaksi
 * @param {number|string} transactionId - ID transaksi
 * @returns {Promise} Response dari API
 */
export const cancelTransaction = async (transactionId) => {
  try {
    const response = await api.post(`/transaksi-produk/${transactionId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling transaction:', error);
    throw error;
  }
};

/**
 * Membuat pembayaran Tripay
 * @param {Object} paymentData - Data pembayaran
 * @param {string} paymentData.method - Kode metode pembayaran
 * @param {string} paymentData.customerName - Nama customer
 * @param {string} paymentData.customerEmail - Email customer
 * @param {string} [paymentData.customerPhone] - Nomor telepon customer
 * @param {Array} paymentData.orderItems - Item yang dibeli
 * @param {number} paymentData.amount - Total amount
 * @param {string} [paymentData.merchantRef] - Merchant reference (opsional)
 * @param {number} [paymentData.expiryHours] - Jam expired (default 24)
 * @returns {Promise} Response pembayaran Tripay
 */
export const createTripayPayment = async (paymentData) => {
  try {
    const response = await api.post('/tripay/create-payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating Tripay payment:', error);
    throw error;
  }
};

// Export sebagai object untuk kemudahan import
const checkoutService = {
  createCheckout,
  getPaymentChannels,
  getTransactionDetail,
  getUserTransactions,
  getTransactionById,
  cancelTransaction,
  createTripayPayment,
};

export default checkoutService;
