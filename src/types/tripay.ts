// Tripay Payment Gateway Types - Updated from production

export interface TripayOrderItem {
  sku?: string;
  name: string;
  price: number;
  quantity: number;
  product_url?: string;
  image_url?: string;
}

export interface TripayCustomer {
  name: string;
  email: string;
  phone?: string;
}

export interface TripayPaymentRequest {
  method: string;
  merchant_ref: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_items: TripayOrderItem[];
  callback_url?: string;
  return_url?: string;
  expired_time?: number;
  signature: string;
}

export interface TripayPaymentChannel {
  code: string;
  name: string;
  type: "virtual_account" | "ewallet" | "retail" | "qris" | "credit_card";
  fee_merchant: {
    flat: number;
    percent: number;
  };
  fee_customer: {
    flat: number;
    percent: number;
  };
  total_fee: {
    flat: number;
    percent: number;
  };
  minimum_fee?: number;
  maximum_fee?: number;
  icon_url: string;
  active: boolean;
}

export type TripayPaymentStatus = 
  | "UNPAID" 
  | "PAID" 
  | "SETTLED" 
  | "EXPIRED" 
  | "CANCELED" 
  | "FAILED" 
  | "REFUND";

export interface TripayPaymentData {
  reference: string;
  merchant_ref: string;
  payment_selection_type: string;
  payment_method: string;
  payment_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  callback_url: string;
  return_url: string;
  amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  pay_code?: string;
  pay_url?: string;
  checkout_url: string;
  status: TripayPaymentStatus;
  expired_time: number;
  order_items: TripayOrderItem[];
  instructions?: Array<{
    title: string;
    steps: string[];
  }>;
  qr_code?: string;
  qr_url?: string;
  created_at: number;
  updated_at: number;
}

export interface TripayPaymentResponse {
  success: boolean;
  message: string;
  data: TripayPaymentData;
}

export interface TripayPaymentChannelsResponse {
  success: boolean;
  message: string;
  data: TripayPaymentChannel[];
}

export interface TripayTransactionDetailResponse {
  success: boolean;
  message: string;
  data: TripayPaymentData;
}

export interface TripayCallbackPayload {
  reference: string;
  merchant_ref: string;
  payment_method: string;
  payment_method_code: string;
  total_amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  is_closed_payment: number;
  status: TripayPaymentStatus;
  paid_at: number;
}
