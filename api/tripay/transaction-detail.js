import axios from 'axios';

/**
 * Vercel Serverless Function - Get Tripay Transaction Detail
 * GET /api/tripay/transaction-detail?reference=xxx
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

    // Get reference from query params
    const { reference } = req.query;

    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Reference parameter is required',
      });
    }

    console.log(`🔄 Fetching transaction detail for: ${reference}`);

    // Make request to Tripay API
    const response = await axios.get(
      `${TRIPAY_BASE_URL}/transaction/detail`,
      {
        params: { reference },
        headers: {
          Authorization: `Bearer ${TRIPAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ Transaction detail retrieved: ${response.data.data.status}`);

    // Return success response
    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: 'Transaction detail retrieved successfully',
    });
  } catch (error) {
    console.error('❌ Tripay transaction detail error:', error.response?.data || error.message);

    // Handle Tripay API errors
    if (error.response?.data) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: error.response.data.message || 'Failed to get transaction detail',
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
