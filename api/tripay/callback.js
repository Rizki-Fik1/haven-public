import crypto from 'crypto';
import axios from 'axios';

/**
 * Validate callback signature from Tripay
 */
function validateSignature(privateKey, signature, payload) {
  const data = JSON.stringify(payload);
  const expectedSignature = crypto
    .createHmac('sha256', privateKey)
    .update(data)
    .digest('hex');
  return signature === expectedSignature;
}

/**
 * Process payment callback and update database
 */
async function processPaymentCallback(callbackData) {
  const { merchant_ref, status, reference, paid_at } = callbackData;

  try {
    // Determine new status based on Tripay status
    let newStatus = 'belum_lunas';
    switch (status) {
      case 'PAID':
        newStatus = 'lunas';
        break;
      case 'EXPIRED':
      case 'FAILED':
        newStatus = 'dibatalkan';
        break;
      default:
        newStatus = 'belum_lunas';
    }

    // Prepare update data
    const updateData = {
      status: newStatus,
      tripay_reference: reference,
      tripay_status: status,
      ...(paid_at && {
        tripay_paid_at: new Date(paid_at * 1000).toISOString(),
      }),
    };

    // Update your database via API
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin.haven.co.id/api';
    
    console.log(`🔄 Updating transaction ${merchant_ref} with status: ${newStatus}`);

    await axios.post(
      `${API_URL}/transaksi-produk/merchant-ref/${merchant_ref}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ Updated transaction ${merchant_ref} successfully`);
  } catch (error) {
    console.error('❌ Error updating transaction:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Vercel Serverless Function - Tripay Callback Webhook
 * POST /api/tripay/callback
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
    const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY;

    if (!TRIPAY_PRIVATE_KEY) {
      console.error('Missing Tripay private key');
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured',
      });
    }

    // Get callback signature from headers
    const callbackSignature = req.headers['x-callback-signature'];

    if (!callbackSignature) {
      console.error('Missing callback signature');
      return res.status(400).json({
        success: false,
        message: 'Missing callback signature',
      });
    }

    // Parse request body
    const callbackData = req.body;

    // Validate signature
    const isValidSignature = validateSignature(
      TRIPAY_PRIVATE_KEY,
      callbackSignature,
      callbackData
    );

    if (!isValidSignature) {
      console.error('Invalid callback signature');
      return res.status(403).json({
        success: false,
        message: 'Invalid signature',
      });
    }

    // Log callback data
    console.log('📥 Tripay callback received:', {
      reference: callbackData.reference,
      merchant_ref: callbackData.merchant_ref,
      status: callbackData.status,
      amount: callbackData.amount_received,
    });

    // Process the callback
    await processPaymentCallback(callbackData);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Callback processed successfully',
    });
  } catch (error) {
    console.error('❌ Tripay callback error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
