import api from "./axios";

/**
 * Tripay Service - Handle payment gateway operations
 * Complete service for Tripay integration
 */

/**
 * Get available payment channels from Tripay via backend
 * @returns {Promise} Payment channels response
 */
export const getTripayPaymentChannels = async () => {
  try {
    const response = await api.get('/tripay/payment-channels');
    return response.data;
  } catch (error) {
    console.error('Error fetching Tripay payment channels:', error);
    throw error;
  }
};

/**
 * Create Tripay payment transaction via backend API
 * @param {Object} params - Payment parameters
 * @param {string} params.method - Payment method code
 * @param {string} params.customerName - Customer name
 * @param {string} params.customerEmail - Customer email
 * @param {string} [params.customerPhone] - Customer phone (optional)
 * @param {Array} params.orderItems - Order items
 * @param {number} params.amount - Total amount
 * @param {string} [params.merchantRef] - Merchant reference (optional)
 * @param {number} [params.expiryHours=24] - Expiry hours (default 24)
 * @returns {Promise} Payment response
 */
export const createTripayPayment = async (params) => {
  const {
    method,
    customerName,
    customerEmail,
    customerPhone,
    orderItems,
    amount,
    merchantRef,
    expiryHours = 24,
  } = params;

  const requestData = {
    method,
    customerName,
    customerEmail,
    customerPhone,
    orderItems,
    amount: formatTripayAmount(amount),
    merchantRef: merchantRef || generateMerchantRef(),
    expiryHours,
  };

  try {
    const response = await api.post("/tripay/create-payment", requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating Tripay payment:', error);
    throw error;
  }
};

/**
 * Get payment transaction detail from Tripay
 * @param {string} reference - Transaction reference
 * @returns {Promise} Transaction detail response
 */
export const getTripayTransactionDetail = async (reference) => {
  try {
    const response = await api.get(`/tripay/transaction-detail`, {
      params: { reference }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Tripay transaction detail:', error);
    throw error;
  }
};

/**
 * Check payment status
 * @param {string} reference - Transaction reference
 * @returns {Promise<string>} Payment status
 */
export const checkPaymentStatus = async (reference) => {
  try {
    const response = await getTripayTransactionDetail(reference);
    return response.data.status;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

// ==================== Helper Functions ====================

/**
 * Format amount untuk Tripay (harus integer, tanpa desimal)
 * @param {number} amount - Amount to format
 * @returns {number} Formatted amount
 */
export const formatTripayAmount = (amount) => {
  return Math.round(amount);
};

/**
 * Calculate fee for payment method
 * @param {number} amount - Base amount
 * @param {Object} channel - Payment channel object
 * @returns {number} Fee amount
 */
export const calculateFee = (amount, channel) => {
  if (!channel || !channel.total_fee) return 0;
  
  const percentFee = (amount * channel.total_fee.percent) / 100;
  const totalFee = channel.total_fee.flat + percentFee;

  // Apply minimum and maximum fee limits
  if (channel.minimum_fee && totalFee < channel.minimum_fee) {
    return channel.minimum_fee;
  }
  if (channel.maximum_fee && totalFee > channel.maximum_fee) {
    return channel.maximum_fee;
  }

  return Math.round(totalFee);
};

/**
 * Calculate total amount including fee
 * @param {number} amount - Base amount
 * @param {Object} channel - Payment channel object
 * @returns {number} Total with fee
 */
export const calculateTotalWithFee = (amount, channel) => {
  const fee = calculateFee(amount, channel);
  return amount + fee;
};

/**
 * Generate merchant reference (unique order ID)
 * @param {string} prefix - Prefix for reference
 * @returns {string} Generated reference
 */
export const generateMerchantRef = (prefix = 'ORDER') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Convert cart items to Tripay order items format
 * @param {Array} cartItems - Cart items
 * @returns {Array} Tripay order items
 */
export const convertCartToOrderItems = (cartItems) => {
  return cartItems.map((item) => ({
    sku: (item.id_produk || item.id || '').toString(),
    name: item.judul_produk || item.nama || item.name || 'Product',
    price: formatTripayAmount(item.harga || item.price || 0),
    quantity: item.quantity || 1,
    image_url: item.image || item.gambar?.[0]?.url_gambar,
  }));
};

/**
 * Calculate cart total
 * @param {Array} cartItems - Cart items
 * @returns {number} Total amount
 */
export const calculateCartTotal = (cartItems) => {
  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.harga || item.price || 0);
    const quantity = parseInt(item.quantity || 1);
    return sum + (price * quantity);
  }, 0);
  return formatTripayAmount(total);
};

/**
 * Check if payment is completed
 * @param {string} status - Payment status
 * @returns {boolean}
 */
export const isPaymentCompleted = (status) => {
  return ['PAID', 'SETTLED'].includes(status);
};

/**
 * Check if payment is failed/expired
 * @param {string} status - Payment status
 * @returns {boolean}
 */
export const isPaymentFailed = (status) => {
  return ['EXPIRED', 'CANCELED', 'FAILED'].includes(status);
};

/**
 * Check if payment is pending
 * @param {string} status - Payment status
 * @returns {boolean}
 */
export const isPaymentPending = (status) => {
  return status === 'UNPAID';
};

/**
 * Get payment status color for UI
 * @param {string} status - Payment status
 * @returns {string} Color name
 */
export const getStatusColor = (status) => {
  const colors = {
    UNPAID: 'yellow',
    PAID: 'green',
    SETTLED: 'green',
    EXPIRED: 'red',
    CANCELED: 'red',
    FAILED: 'red',
  };
  return colors[status] || 'gray';
};

/**
 * Get payment status label in Indonesian
 * @param {string} status - Payment status
 * @returns {string} Status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    UNPAID: 'Menunggu Pembayaran',
    PAID: 'Dibayar',
    SETTLED: 'Selesai',
    EXPIRED: 'Kadaluarsa',
    CANCELED: 'Dibatalkan',
    FAILED: 'Gagal',
  };
  return labels[status] || status;
};

/**
 * Group payment channels by category
 * @param {Array} channels - Payment channels
 * @returns {Object} Grouped channels
 */
export const groupChannelsByCategory = (channels) => {
  return channels.reduce((groups, channel) => {
    const group = channel.group;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(channel);
    return groups;
  }, {});
};

/**
 * Filter active payment channels
 * @param {Array} channels - Payment channels
 * @returns {Array} Active channels
 */
export const getActiveChannels = (channels) => {
  return channels.filter((channel) => channel.active);
};

/**
 * Format payment channel name
 * @param {Object} channel - Payment channel
 * @returns {string} Formatted name
 */
export const formatChannelName = (channel) => {
  return `${channel.name} (${channel.group})`;
};

export default {
  getTripayPaymentChannels,
  createTripayPayment,
  getTripayTransactionDetail,
  checkPaymentStatus,
  formatTripayAmount,
  calculateFee,
  calculateTotalWithFee,
  generateMerchantRef,
  convertCartToOrderItems,
  calculateCartTotal,
  isPaymentCompleted,
  isPaymentFailed,
  isPaymentPending,
  getStatusColor,
  getStatusLabel,
  groupChannelsByCategory,
  getActiveChannels,
  formatChannelName,
};
