import { useMutation, useQuery } from "@tanstack/react-query";
import { formatTripayAmount } from "../lib/tripay-utils";
import api from "./axios";

/**
 * Tripay Service
 * Service khusus untuk integrasi Tripay API
 */

/**
 * Get available payment channels from Tripay
 * Endpoint dari project lama: /api/tripay/api-sandbox
 * @returns {Promise} Payment channels response
 */
export const getTripayPaymentChannels = async () => {
  try {
    const response = await axios.get(
      "https://tripay.co.id/api-sandbox/merchant/payment-channel",
      {
        headers: {
          Authorization: `Bearer DEV-Mw0X24wAGYwvEWoM83Mpm0OQPtLHa1PY3N6S72CI`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching Tripay payment channels:", error);
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
    merchantRef,
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
    const response = await api.get(`/tripay/transaction-detail?reference=${reference}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Tripay transaction detail:', error);
    throw error;
  }
};

// ==================== React Query Hooks ====================

/**
 * Hook untuk create Tripay payment dengan React Query
 */
export const useCreateTripayPayment = () => {
  return useMutation({
    mutationFn: createTripayPayment,
  });
};

/**
 * Hook untuk get payment channels dengan React Query
 */
export const useTripayPaymentChannels = () => {
  return useQuery({
    queryKey: ["tripayPaymentChannels"],
    queryFn: getTripayPaymentChannels,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1, // Retry 1x jika gagal
  });
};

/**
 * Hook untuk get transaction detail dengan React Query
 * @param {string|null} reference - Transaction reference
 */
export const useTripayTransactionDetail = (reference) => {
  return useQuery({
    queryKey: ["tripayTransactionDetail", reference],
    queryFn: () => getTripayTransactionDetail(reference),
    enabled: !!reference,
    refetchInterval: (query) => {
      // Stop refetching if payment is completed or failed
      const data = query.state.data;
      if (!data) return false;
      const status = data.data.status;
      if (
        ["PAID", "SETTLED", "EXPIRED", "CANCELED", "FAILED"].includes(status)
      ) {
        return false;
      }
      return 5000; // Refetch every 5 seconds for pending payments
    },
  });
};

// ==================== Helper Functions ====================

/**
 * Convert cart items to Tripay order items format
 * @param {Array} cartItems - Cart items
 * @returns {Array} Tripay order items
 */
export const convertCartItemsToTripayOrderItems = (cartItems) => {
  return cartItems.map((item) => ({
    sku: item.id.toString(),
    name: item.name,
    price: formatTripayAmount(item.price),
    quantity: item.quantity,
  }));
};

/**
 * Calculate total amount from cart items
 * @param {Array} cartItems - Cart items
 * @returns {number} Total amount
 */
export const calculateCartTotal = (cartItems) => {
  const total = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  return formatTripayAmount(total);
};

export default {
  getTripayPaymentChannels,
  createTripayPayment,
  getTripayTransactionDetail,
  useCreateTripayPayment,
  useTripayPaymentChannels,
  useTripayTransactionDetail,
  convertCartItemsToTripayOrderItems,
  calculateCartTotal,
};
