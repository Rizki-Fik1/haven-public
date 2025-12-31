// Server-side utilities for Tripay integration
// These functions should only be used in API routes, not client-side

import crypto from "crypto";

/**
 * Generate HMAC signature for Tripay API requests (SERVER-SIDE ONLY)
 */
export const generateTripaySignature = (
  privateKey: string,
  merchantCode: string,
  merchantRef: string,
  amount: number
): string => {
  const data = `${merchantCode}${merchantRef}${amount}`;
  return crypto.createHmac("sha256", privateKey).update(data).digest("hex");
};

/**
 * Validate callback signature from Tripay (SERVER-SIDE ONLY)
 */
export const validateTripayCallback = (
  privateKey: string,
  callbackSignature: string,
  payload: any
): boolean => {
  const data = JSON.stringify(payload);
  const expectedSignature = crypto
    .createHmac("sha256", privateKey)
    .update(data)
    .digest("hex");

  return callbackSignature === expectedSignature;
};

/**
 * Generate unique merchant reference (SERVER-SIDE)
 */
export const generateMerchantRef = (prefix: string = "ORDER"): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Generate expiry time (default: 24 hours from now) (SERVER-SIDE)
 */
export const generateExpiryTime = (hoursFromNow: number = 24): number => {
  const now = new Date();
  const expiry = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
  return Math.floor(expiry.getTime() / 1000);
};

/**
 * Format amount to Tripay format (integer, no decimals) (SERVER-SIDE)
 */
export const formatTripayAmount = (amount: number): number => {
  return Math.round(amount);
};
