import axios from 'axios';
import crypto from 'crypto';

/**
 * Generate HMAC signature for Tripay
 */
function generateSignature(privateKey, merchantCode, merchantRef, amount) {
  const data = `${merchantCode}${merchantRef}${amount}`;
  return crypto.createHmac('sha256', privateKey).update(data).digest('hex');
}

/**
 * Generate unique merchant reference
 */
function generateMerchantRef(prefix = 'ORDER') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Generate expiry time
 */
function generateExpiryTime(hoursFromNow = 24) {
  const now = new Date();
  const expiry = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
  return Math.floor(expiry.getTime() / 1000);
}

/**
 * Format amount (no decimals)
 */
function formatAmount(amount) {
  return Math.round(amount);
}

/**
 * Vercel Serverless Function - Create Tripay Payment
 * POST /api/tripay/create-payment
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    // Get environment variables
    const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY;
    const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY;
    const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE;
    const TRIPAY_BASE_URL = process.env.TRIPAY_BASE_URL || 'https://tripay.co.id/api-sandbox';
    const TRIPAY_CALLBACK_URL = process.env.TRIPAY_CALLBACK_URL || '';
    const TRIPAY_RETURN_URL = process.env.TRIPAY_RETURN_URL || '';

    // Validate environment variables
    if (!TRIPAY_API_KEY || !TRIPAY_PRIVATE_KEY || !TRIPAY_MERCHANT_CODE) {
      console.error('Missing Tripay configuration');
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured',
      });
    }

    // Parse request body
    const {
      method,
      customerName,
      customerEmail,
      customerPhone,
      orderItems,
      amount,
      merchantRef,
      expiryHours = 24,
    } = req.body;

    // Validate required fields
    if (!method || !customerName || !customerEmail || !orderItems || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Generate payment data
    const finalMerchantRef = merchantRef || generateMerchantRef('SHOP');
    const formattedAmount = formatAmount(amount);
    const expiredTime = generateExpiryTime(expiryHours);

    // Generate signature
    const signature = generateSignature(
      TRIPAY_PRIVATE_KEY,
      TRIPAY_MERCHANT_CODE,
      finalMerchantRef,
      formattedAmount
    );

    // Prepare Tripay request
    const tripayRequest = {
      method,
      merchant_ref: finalMerchantRef,
      amount: formattedAmount,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || '',
      order_items: orderItems,
      callback_url: TRIPAY_CALLBACK_URL,
      return_url: TRIPAY_RETURN_URL,
      expired_time: expiredTime,
      signature,
    };

    console.log('🔄 Creating Tripay payment:', {
      merchant_ref: finalMerchantRef,
      amount: formattedAmount,
      method,
    });

    // Make request to Tripay API
    const response = await axios.post(
      `${TRIPAY_BASE_URL}/transaction/create`,
      tripayRequest,
      {
        headers: {
          Authorization: `Bearer ${TRIPAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Payment created successfully:', response.data.data.reference);

    // Return success response
    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: 'Payment created successfully',
    });
  } catch (error) {
    console.error('❌ Tripay payment creation error:', error.response?.data || error.message);

    // Handle Tripay API errors
    if (error.response?.data) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: error.response.data.message || 'Payment creation failed',
        errors: error.response.data.errors || null,
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
