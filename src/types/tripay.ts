// Tripay Type Definitions

export interface TripayOrderItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  product_url?: string;
  image_url?: string;
}

export interface TripayPaymentChannel {
  code: string;
  name: string;
  group: string;
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
  minimum_fee: number;
  maximum_fee: number;
  icon_url: string;
  active: boolean;
}

export interface TripayPaymentData {
  reference: string;
  merchant_ref: string;
  payment_selection_type: string;
  payment_method: string;
  payment_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  callback_url: string;
  return_url: string;
  amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  pay_code: string;
  pay_url: string;
  checkout_url: string;
  status: string;
  expired_time: number;
  order_items: TripayOrderItem[];
  instructions: Array<{
    title: string;
    steps: string[];
  }>;
  qr_code?: string;
  qr_url?: string;
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
  data: {
    reference: string;
    merchant_ref: string;
    payment_method: string;
    payment_name: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    amount: number;
    fee_merchant: number;
    fee_customer: number;
    total_fee: number;
    amount_received: number;
    status: string;
    paid_at: number;
    order_items: TripayOrderItem[];
  };
}
