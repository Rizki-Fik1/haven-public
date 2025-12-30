/**
 * Tripay Utility Functions
 * Helper functions untuk format dan kalkulasi Tripay
 */

/**
 * Format amount untuk Tripay (harus integer, tanpa desimal)
 * Tripay menggunakan format Rupiah tanpa desimal
 * @param {number} amount - Amount to format
 * @returns {number} Formatted amount
 */
export const formatTripayAmount = (amount) => {
  return Math.round(amount);
};

/**
 * Format currency ke format Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate total dengan fee
 * @param {number} amount - Base amount
 * @param {number} feeFlat - Flat fee
 * @param {number} feePercent - Percentage fee
 * @returns {number} Total with fee
 */
export const calculateTotalWithFee = (amount, feeFlat, feePercent) => {
  const percentFee = (amount * feePercent) / 100;
  return formatTripayAmount(amount + feeFlat + percentFee);
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
 * Format timestamp Tripay ke Date
 * @param {number} timestamp - Unix timestamp
 * @returns {Date} Date object
 */
export const formatTripayTimestamp = (timestamp) => {
  return new Date(timestamp * 1000);
};

/**
 * Check apakah payment sudah expired
 * @param {number} expiredTime - Expired timestamp
 * @returns {boolean} Is expired
 */
export const isPaymentExpired = (expiredTime) => {
  const now = Math.floor(Date.now() / 1000);
  return now > expiredTime;
};

/**
 * Get payment status label
 * @param {string} status - Payment status
 * @returns {string} Status label
 */
export const getPaymentStatusLabel = (status) => {
  const statusLabels = {
    UNPAID: 'Belum Dibayar',
    PAID: 'Sudah Dibayar',
    SETTLED: 'Selesai',
    EXPIRED: 'Kadaluarsa',
    CANCELED: 'Dibatalkan',
    FAILED: 'Gagal',
  };
  return statusLabels[status] || status;
};

/**
 * Get payment status color untuk UI
 * @param {string} status - Payment status
 * @returns {string} Status color
 */
export const getPaymentStatusColor = (status) => {
  const statusColors = {
    UNPAID: 'warning',
    PAID: 'success',
    SETTLED: 'success',
    EXPIRED: 'error',
    CANCELED: 'error',
    FAILED: 'error',
  };
  return statusColors[status] || 'default';
};
