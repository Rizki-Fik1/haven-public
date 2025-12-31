/**
 * Tripay Server-Side Utilities
 * IMPORTANT: File ini hanya untuk backend/server-side
 * Jangan gunakan di client-side karena mengandung operasi crypto sensitif
 */

import crypto from 'crypto';

/**
 * Generate HMAC signature untuk Tripay API requests
 * @param {string} privateKey - Tripay private key
 * @param {string} merchantCode - Tripay merchant code
 * @param {string} merchantRef - Merchant reference (unique order ID)
 * @param {number} amount - Total amount
 * @returns {string} HMAC signature
 */
export const generateTripaySignature = (
  privateKey,
  merchantCode,
  merchantRef,
  amount
) => {
  const data = `${merchantCode}${merchantRef}${amount}`;
  return crypto.createHmac('sha256', privateKey).update(data).digest('hex');
};

/**
 * Validate callback signature dari Tripay
 * @param {string} privateKey - Tripay private key
 * @param {string} callbackSignature - Signature dari Tripay callback
 * @param {Object} payload - Callback payload
 * @returns {boolean} Valid atau tidak
 */
export const validateTripayCallback = (
  privateKey,
  callbackSignature,
  payload
) => {
  const data = JSON.stringify(payload);
  const expectedSignature = crypto
    .createHmac('sha256', privateKey)
    .update(data)
    .digest('hex');

  return callbackSignature === expectedSignature;
};

/**
 * Generate unique merchant reference
 * @param {string} prefix - Prefix untuk reference
 * @returns {string} Generated reference
 */
export const generateMerchantRef = (prefix = 'ORDER') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Generate expiry time (default: 24 jam dari sekarang)
 * @param {number} hoursFromNow - Jam dari sekarang
 * @returns {number} Unix timestamp
 */
export const generateExpiryTime = (hoursFromNow = 24) => {
  const now = new Date();
  const expiry = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
  return Math.floor(expiry.getTime() / 1000);
};

/**
 * Format amount untuk Tripay (integer, tanpa desimal)
 * @param {number} amount - Amount to format
 * @returns {number} Formatted amount
 */
export const formatTripayAmount = (amount) => {
  return Math.round(amount);
};

export default {
  generateTripaySignature,
  validateTripayCallback,
  generateMerchantRef,
  generateExpiryTime,
  formatTripayAmount,
};
