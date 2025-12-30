import axios from 'axios';

/**
 * Vercel Serverless Function - Get Tripay Payment Channels
 * GET /api/tripay/payment-channels
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    // Get environment variables
    const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY;
    const TRIPAY_BASE_URL = process.env.TRIPAY_BASE_URL || 'https://tripay.co.id/api-sandbox';

    // Validate environment variables
    if (!TRIPAY_API_KEY) {
      console.error('Missing Tripay API key');
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured',
      });
    }

    console.log('🔄 Fetching payment channels from Tripay...');

    // Make request to Tripay API
    const response = await axios.get(
      `${TRIPAY_BASE_URL}/merchant/payment-channel`,
      {
        headers: {
          Authorization: `Bearer ${TRIPAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ Retrieved ${response.data.data.length} payment channels`);

    // Return success response
    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: 'Payment channels retrieved successfully',
    });
  } catch (error) {
    console.error('❌ Tripay payment channels error:', error.response?.data || error.message);

    // Handle Tripay API errors
    if (error.response?.data) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: error.response.data.message || 'Failed to get payment channels',
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
