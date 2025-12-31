import { useMutation, useQuery } from "@tanstack/react-query";
import {
  TripayPaymentResponse,
  TripayPaymentChannelsResponse,
  TripayTransactionDetailResponse,
  TripayOrderItem,
} from "@/types/tripay";
import { formatTripayAmount } from "@/lib/tripay-utils";
import axios from "axios";

export interface CreatePaymentParams {
  method: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderItems: TripayOrderItem[];
  amount: number;
  merchantRef?: string;
  expiryHours?: number;
}

/**
 * Create Tripay payment transaction via secure backend API
 */
export const createTripayPayment = async (
  params: CreatePaymentParams
): Promise<TripayPaymentResponse> => {
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

  const response = await axios.post("/api/tripay/create-payment", requestData);

  return response.data;
};

/**
 * Get available payment channels via secure backend API
 */
export const getTripayPaymentChannels =
  async (): Promise<TripayPaymentChannelsResponse> => {
    const response = await axios.get("/api/tripay/payment-channels");
    return response.data;
  };

/**
 * Get payment transaction detail via secure backend API
 */
export const getTripayTransactionDetail = async (
  reference: string
): Promise<TripayTransactionDetailResponse> => {
  const response = await axios.get(
    `/api/tripay/transaction-detail?reference=${reference}`
  );
  return response.data;
};

// React Query hooks
export const useCreateTripayPayment = () => {
  return useMutation({
    mutationFn: createTripayPayment,
  });
};

export const useTripayPaymentChannels = () => {
  return useQuery({
    queryKey: ["tripayPaymentChannels"],
    queryFn: getTripayPaymentChannels,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTripayTransactionDetail = (reference: string | null) => {
  return useQuery({
    queryKey: ["tripayTransactionDetail", reference],
    queryFn: () => getTripayTransactionDetail(reference!),
    enabled: !!reference,
    refetchInterval: (data) => {
      // Stop refetching if payment is completed or failed
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

// Helper function to convert cart items to Tripay order items
export const convertCartItemsToTripayOrderItems = (
  cartItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>
): TripayOrderItem[] => {
  return cartItems.map((item) => ({
    sku: item.id.toString(),
    name: item.name,
    price: formatTripayAmount(item.price),
    quantity: item.quantity,
  }));
};

// Helper function to calculate total amount from cart items
export const calculateCartTotal = (
  cartItems: Array<{
    price: number;
    quantity: number;
  }>
): number => {
  const total = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  return formatTripayAmount(total);
};
