import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTripayPaymentChannels,
  createTripayPayment,
  getTripayTransactionDetail,
  checkPaymentStatus,
  getActiveChannels,
  groupChannelsByCategory,
  calculateFee,
  calculateTotalWithFee,
  isPaymentCompleted,
  isPaymentFailed,
} from '../services/tripayService';

/**
 * Hook untuk create payment
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => createTripayPayment(params),
    onSuccess: (data) => {
      console.log('Payment created successfully:', data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['tripay'] });
    },
    onError: (error) => {
      console.error('Failed to create payment:', error);
    },
  });
}

/**
 * Hook untuk get payment channels
 */
export function usePaymentChannels() {
  return useQuery({
    queryKey: ['tripay', 'channels'],
    queryFn: getTripayPaymentChannels,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      // Return only active channels
      if (data?.data) {
        return {
          ...data,
          data: getActiveChannels(data.data),
        };
      }
      return data;
    },
  });
}

/**
 * Hook untuk get transaction detail
 * @param {string|null} reference - Transaction reference
 * @param {Object} options - Query options
 */
export function useTransactionDetail(reference, options = {}) {
  return useQuery({
    queryKey: ['tripay', 'transaction', reference],
    queryFn: () => getTripayTransactionDetail(reference),
    enabled: !!reference && (options?.enabled !== false),
    refetchInterval: (data) => {
      // Custom refetch interval based on status
      if (!data) return false;
      
      const status = data.data?.status;
      if (!status) return false;

      // Stop refetching if payment is completed or failed
      if (isPaymentCompleted(status) || isPaymentFailed(status)) {
        return false;
      }

      // Refetch every 5 seconds for pending payments
      return options?.refetchInterval ?? 5000;
    },
  });
}

/**
 * Hook untuk check payment status
 * @param {string|null} reference - Transaction reference
 */
export function usePaymentStatus(reference) {
  return useQuery({
    queryKey: ['tripay', 'status', reference],
    queryFn: () => checkPaymentStatus(reference),
    enabled: !!reference,
    refetchInterval: (status) => {
      if (!status) return false;

      // Stop refetching if completed or failed
      if (isPaymentCompleted(status) || isPaymentFailed(status)) {
        return false;
      }

      return 5000; // 5 seconds
    },
  });
}

/**
 * Hook untuk grouped payment channels
 */
export function useGroupedPaymentChannels() {
  const { data, ...rest } = usePaymentChannels();

  return {
    ...rest,
    data: data?.data ? groupChannelsByCategory(data.data) : undefined,
  };
}

/**
 * Hook untuk calculate fee
 * @param {number} amount - Base amount
 * @param {string|null} channelCode - Payment channel code
 */
export function useCalculateFee(amount, channelCode) {
  const { data: channelsData } = usePaymentChannels();

  if (!channelCode || !channelsData?.data) {
    return { fee: 0, total: amount, channel: null };
  }

  const channel = channelsData.data.find((ch) => ch.code === channelCode);

  if (!channel) {
    return { fee: 0, total: amount, channel: null };
  }

  const fee = calculateFee(amount, channel);
  const total = calculateTotalWithFee(amount, channel);

  return { fee, total, channel };
}

/**
 * Hook untuk get channel by code
 * @param {string|null} channelCode - Payment channel code
 */
export function usePaymentChannel(channelCode) {
  const { data: channelsData, ...rest } = usePaymentChannels();

  const channel = channelCode && channelsData?.data
    ? channelsData.data.find((ch) => ch.code === channelCode)
    : null;

  return {
    ...rest,
    data: channel,
  };
}

export default {
  useCreatePayment,
  usePaymentChannels,
  useTransactionDetail,
  usePaymentStatus,
  useGroupedPaymentChannels,
  useCalculateFee,
  usePaymentChannel,
};
