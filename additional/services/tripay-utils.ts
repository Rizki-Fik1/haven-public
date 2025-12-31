// Client-side utilities only
// Server-side crypto operations moved to backend API routes

/**
 * Generate unique merchant reference
 */
export const generateMerchantRef = (prefix: string = "ORDER"): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Calculate total amount including fees
 */
export const calculateTotalAmount = (
  baseAmount: number,
  feeFlat: number = 0,
  feePercent: number = 0
): number => {
  const percentFee = Math.round(baseAmount * (feePercent / 100));
  return baseAmount + feeFlat + percentFee;
};

/**
 * Format amount to Tripay format (integer, no decimals)
 */
export const formatTripayAmount = (amount: number): number => {
  return Math.round(amount);
};

/**
 * Convert Unix timestamp to Date
 */
export const convertUnixToDate = (unixTimestamp: number): Date => {
  return new Date(unixTimestamp * 1000);
};

/**
 * Convert Date to Unix timestamp
 */
export const convertDateToUnix = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

/**
 * Generate expiry time (default: 24 hours from now)
 */
export const generateExpiryTime = (hoursFromNow: number = 24): number => {
  const now = new Date();
  const expiry = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
  return convertDateToUnix(expiry);
};

/**
 * Check if payment is expired
 */
export const isPaymentExpired = (expiredTime: number): boolean => {
  const now = convertDateToUnix(new Date());
  return now > expiredTime;
};

/**
 * Get payment status color for UI
 */
export const getPaymentStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "paid":
    case "settled":
      return "text-green-600 bg-green-100";
    case "unpaid":
      return "text-yellow-600 bg-yellow-100";
    case "expired":
    case "canceled":
    case "failed":
      return "text-red-600 bg-red-100";
    case "refund":
      return "text-blue-600 bg-blue-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

/**
 * Get payment status text for display
 */
export const getPaymentStatusText = (status: string): string => {
  switch (status.toLowerCase()) {
    case "unpaid":
      return "Menunggu Pembayaran";
    case "paid":
      return "Dibayar";
    case "settled":
      return "Selesai";
    case "expired":
      return "Kedaluwarsa";
    case "canceled":
      return "Dibatalkan";
    case "failed":
      return "Gagal";
    case "refund":
      return "Dikembalikan";
    default:
      return status;
  }
};
