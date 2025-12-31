// Tripay Payment Gateway Types

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
  method: string; // Payment method code (e.g., 'BCAVA', 'MANDIRIVA', 'BRIVA', etc.)
  merchant_ref: string; // Unique order reference from merchant
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_items: TripayOrderItem[];
  callback_url?: string;
  return_url?: string;
  expired_time?: number; // Unix timestamp
  signature: string;
}

export interface TripayPaymentData {
  reference: string; // Tripay reference
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
  created_at: number;
  updated_at: number;
}

export interface TripayPaymentResponse {
  success: boolean;
  message: string;
  data: TripayPaymentData;
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

export interface TripayPaymentChannelsResponse {
  success: boolean;
  message: string;
  data: TripayPaymentChannel[];
}

export interface TripayCallback {
  reference: string;
  merchant_ref: string;
  payment_method: string;
  payment_method_code: string;
  total_amount: number;
  fee_merchant: number;
  fee_customer: number;
  amount_received: number;
  is_closed_payment: number;
  status: TripayPaymentStatus;
  paid_at?: number;
  note?: string;
}

export type TripayPaymentStatus =
  | "UNPAID"
  | "PAID"
  | "SETTLED"
  | "CANCELED"
  | "EXPIRED"
  | "FAILED"
  | "REFUND";

export interface TripayTransactionDetail {
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
  checkout_url: string;
  status: TripayPaymentStatus;
  paid_at?: number;
  note?: string;
  created_at: number;
  updated_at: number;
  order_items: TripayOrderItem[];
}

export interface TripayTransactionDetailResponse {
  success: boolean;
  message: string;
  data: TripayTransactionDetail;
}

// Extended transaction types for internal use
export interface TripayPaymentInfo {
  tripay_reference: string;
  tripay_merchant_ref: string;
  tripay_status: TripayPaymentStatus;
  tripay_checkout_url: string;
  tripay_amount: number;
  tripay_fee_merchant: number;
  tripay_fee_customer: number;
  tripay_expired_time: number;
  tripay_created_at: number;
  tripay_updated_at?: number;
  tripay_paid_at?: number;
}
