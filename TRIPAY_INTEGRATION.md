# Integrasi Tripay Payment Gateway

Dokumentasi integrasi Tripay untuk Haven Project.

## 📋 Konfigurasi

### Environment Variables

File `.env` sudah dikonfigurasi dengan kredensial Tripay:

```env
# Tripay Configuration (Sandbox Mode)
TRIPAY_API_KEY=DEV-Mw0X24wAGYwvEWoM83Mpm0OQPtLHa1PY3N6S72CI
TRIPAY_PRIVATE_KEY=n3Xq6-ACznD-HVKCw-UDheP-fDIFf
TRIPAY_MERCHANT_CODE=T17133
TRIPAY_BASE_URL=https://tripay.co.id/api-sandbox

# Public Config (Safe untuk client-side)
VITE_TRIPAY_MERCHANT_CODE=T17133
VITE_TRIPAY_CALLBACK_URL=https://haven.co.id/api/tripay/callback
VITE_TRIPAY_RETURN_URL=https://haven.co.id/pembelian
```

**⚠️ PENTING:**
- `TRIPAY_API_KEY` dan `TRIPAY_PRIVATE_KEY` HANYA untuk backend/server-side
- Jangan expose kredensial ini di client-side code
- Gunakan prefix `VITE_` hanya untuk config yang aman di-expose

## 📁 Struktur File

### Client-Side Files
```
src/
├── services/
│   ├── tripayService.js       # Service untuk Tripay API calls
│   └── checkoutService.js     # Service untuk checkout & transaksi
├── lib/
│   ├── tripay-utils.js        # Client-side utilities (format, display)
│   └── tripay-server-utils.js # Server-side utilities (crypto, signature)
└── types/
    └── tripay.ts              # TypeScript type definitions
```

### Legacy Files (Reference)
```
additional/
├── services/
│   ├── tripay.ts              # Legacy TypeScript implementation
│   ├── tripay-utils.ts        # Legacy client utilities
│   └── tripay-server-utils.ts # Legacy server utilities
└── shop-component/            # Legacy UI components
```

## 🔧 Services

### tripayService.js

Service utama untuk integrasi Tripay:

```javascript
import { 
  getTripayPaymentChannels,
  createTripayPayment,
  getTripayTransactionDetail,
  useTripayPaymentChannels,
  useCreateTripayPayment,
  useTripayTransactionDetail
} from '@/services/tripayService';
```

**Functions:**
- `getTripayPaymentChannels()` - Get daftar metode pembayaran
- `createTripayPayment(params)` - Buat transaksi pembayaran
- `getTripayTransactionDetail(reference)` - Get detail transaksi

**React Query Hooks:**
- `useTripayPaymentChannels()` - Hook untuk payment channels
- `useCreateTripayPayment()` - Hook untuk create payment
- `useTripayTransactionDetail(reference)` - Hook untuk transaction detail

### checkoutService.js

Service untuk checkout flow:

```javascript
import { 
  createCheckout,
  getPaymentChannels,
  getTransactionDetail,
  getUserTransactions
} from '@/services/checkoutService';
```

## 🛠️ Utilities

### Client-Side (tripay-utils.js)

```javascript
import {
  formatTripayAmount,
  formatRupiah,
  generateMerchantRef,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  isPaymentExpired
} from '@/lib/tripay-utils';
```

### Server-Side (tripay-server-utils.js)

**⚠️ HANYA untuk backend/API routes:**

```javascript
import {
  generateTripaySignature,
  validateTripayCallback,
  generateMerchantRef,
  generateExpiryTime
} from '@/lib/tripay-server-utils';
```

## 📝 Type Definitions

File `src/types/tripay.ts` berisi TypeScript definitions:

- `TripayOrderItem` - Item dalam order
- `TripayPaymentChannel` - Channel pembayaran
- `TripayPaymentData` - Data transaksi
- `TripayPaymentResponse` - Response dari API
- `TripayPaymentStatus` - Status pembayaran
- `TripayCallbackPayload` - Payload callback dari Tripay

## 🔄 Flow Pembayaran

### 1. Get Payment Channels
```javascript
const { data: channels } = useTripayPaymentChannels();
```

### 2. Create Payment
```javascript
const createPayment = useCreateTripayPayment();

await createPayment.mutateAsync({
  method: 'BRIVA',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  orderItems: [
    { sku: '1', name: 'Product A', price: 100000, quantity: 1 }
  ],
  amount: 100000,
  expiryHours: 24
});
```

### 3. Check Transaction Status
```javascript
const { data: transaction } = useTripayTransactionDetail(reference);
```

## 🔐 Security Best Practices

1. **Jangan expose API Key di client-side**
   - ❌ Jangan: Hardcode API key di React components
   - ✅ Lakukan: Panggil backend API yang handle authentication

2. **Gunakan Backend API**
   - Semua request ke Tripay harus melalui backend
   - Backend yang generate signature dengan private key

3. **Validate Callbacks**
   - Selalu validate signature dari Tripay callback
   - Gunakan `validateTripayCallback()` di backend

## 🚀 Migration dari Project Lama

### Perubahan Utama:

1. **Environment Variables**
   - ✅ Sudah disinkronkan dengan project lama
   - ✅ Menggunakan sandbox credentials dari `additional/.env`

2. **API Calls**
   - ✅ Hardcoded API key sudah dihapus
   - ✅ Semua calls sekarang melalui backend API

3. **Type Definitions**
   - ✅ File `tripay.ts` sudah diperbaiki
   - ✅ Menambahkan missing types

4. **Utilities**
   - ✅ Client dan server utilities sudah dipisah
   - ✅ Security best practices sudah diterapkan

## 📚 Referensi

- [Tripay Documentation](https://tripay.co.id/developer)
- [Tripay API Reference](https://tripay.co.id/developer?tab=api)

## ⚠️ TODO untuk Backend

Backend perlu implement endpoints berikut:

1. `GET /api/tripay/payment-channels` - Get payment channels
2. `POST /api/tripay/create-payment` - Create payment transaction
3. `GET /api/tripay/transaction-detail` - Get transaction detail
4. `POST /api/tripay/callback` - Handle Tripay callback

Gunakan `tripay-server-utils.js` untuk generate signature dan validate callbacks.
