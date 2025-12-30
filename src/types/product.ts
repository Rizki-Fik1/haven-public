// Product Type Definitions

export interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  kategori?: string;
  gambar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface ProductTransaction {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  total_harga: number;
  status: string;
  payment_method?: string;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface ProductTransactionResponse {
  success: boolean;
  message: string;
  data: ProductTransaction[];
}

export interface CreateTransactionPayload {
  product_id: number;
  quantity: number;
  payment_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
}
