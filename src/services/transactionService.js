import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axios';

// ==================== Transaction API Functions ====================

export const transactionApi = {
  /**
   * Create a new booking transaction
   * POST /transaksi
   */
  createBookingTransaction: async (transactionData) => {
    const response = await api.post('/transaksi', transactionData);
    return response.data;
  },

  /**
   * Get all transactions for a user
   * GET /user/{userId}/transaksi
   */
  getUserTransactions: async (userId) => {
    const response = await api.get(`/user/${userId}/transaksi`);
    return response.data;
  },

  /**
   * Get payment detail for a transaction
   * GET /pembayaran/{transaksiId}
   */
  getPaymentDetail: async (transaksiId) => {
    const response = await api.get(`/pembayaran/${transaksiId}`);
    return response.data;
  },

  /**
   * Get transaction detail
   * GET /transaksi/{transaksiId}
   */
  getTransactionDetail: async (transaksiId) => {
    const response = await api.get(`/transaksi/${transaksiId}`);
    return response.data;
  },
};

// ==================== Transaction Hooks ====================

/**
 * Hook for creating a booking transaction
 */
export const useCreateBooking = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.createBookingTransaction,
    onSuccess: (data) => {
      // Invalidate user transactions query to refetch
      queryClient.invalidateQueries({ queryKey: ['userTransactions'] });
    },
    ...options,
  });
};

/**
 * Hook for getting user transactions
 */
export const useUserTransactions = (userId, options = {}) => {
  return useQuery({
    queryKey: ['userTransactions', userId],
    queryFn: () => transactionApi.getUserTransactions(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook for getting payment detail
 */
export const usePaymentDetail = (transaksiId, options = {}) => {
  return useQuery({
    queryKey: ['paymentDetail', transaksiId],
    queryFn: () => transactionApi.getPaymentDetail(transaksiId),
    enabled: !!transaksiId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook for getting transaction detail
 */
export const useTransactionDetail = (transaksiId, options = {}) => {
  return useQuery({
    queryKey: ['transactionDetail', transaksiId],
    queryFn: () => transactionApi.getTransactionDetail(transaksiId),
    enabled: !!transaksiId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export default transactionApi;