import { useState } from 'react';
import { createTransaksiWeb, getTransaksiByUser } from '../services/transaksiService';
import { useAuthContext } from '../context/AuthContext';
import ErrorAlert from '../components/ui/ErrorAlert';

const TestPaymentPage = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('transaction');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Form data for transaction test
  const [formData, setFormData] = useState({
    nama: 'John Doe',
    email: 'john@example.com',
    phone: '081234567890',
    payment_method: 'BRIVA',
    product_id: '1',
    quantity: '1',
    price: '50000'
  });

  // Test: Create Transaction
  const testCreateTransaction = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Testing POST /api/transaksi-produkweb...');
      
      const transactionData = {
        items: [{
          id_produk: parseInt(formData.product_id),
          quantity: parseInt(formData.quantity),
          harga: parseInt(formData.price)
        }],
        customer: {
          nama: formData.nama,
          email: formData.email,
          phone: formData.phone
        },
        payment_method: formData.payment_method,
        total_amount: parseInt(formData.price) * parseInt(formData.quantity)
      };

      console.log('📤 Request data:', transactionData);
      
      const response = await createTransaksiWeb(transactionData);
      console.log('✅ Response:', response);
      
      setResult({
        endpoint: 'POST /api/transaksi-produkweb',
        status: 'success',
        data: response
      });
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create transaction');
      setResult({
        endpoint: 'POST /api/transaksi-produkweb',
        status: 'error',
        error: err.response?.data || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Test: Get User Transactions
  const testGetUserTransactions = async () => {
    if (!user?.id) {
      setError('User not logged in. Please login first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Testing GET /api/transaksi-produk/user/${user.id}...`);
      
      const response = await getTransaksiByUser(user.id);
      console.log('✅ Response:', response);
      
      setResult({
        endpoint: `GET /api/transaksi-produk/user/${user.id}`,
        status: 'success',
        data: response
      });
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch transactions');
      setResult({
        endpoint: `GET /api/transaksi-produk/user/${user.id}`,
        status: 'error',
        error: err.response?.data || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Gateway Test</h1>
          <p className="text-gray-600">Test Tripay API endpoints dan transaksi</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('transaction')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'transaction'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1. Create Transaction
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2. Transaction History
            </button>
          </div>

          <div className="p-6">
            {/* Tab 1: Create Transaction */}
            {activeTab === 'transaction' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Test Create Transaction API</h2>
                <p className="text-gray-600 mb-4">
                  Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">POST /api/transaksi-produkweb</code>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Customer
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Pilih Metode Pembayaran</option>
                      <option value="BRIVA">BRI Virtual Account</option>
                      <option value="BNIVA">BNI Virtual Account</option>
                      <option value="MANDIRIVA">Mandiri Virtual Account</option>
                      <option value="PERMATAVA">Permata Virtual Account</option>
                      <option value="BCAVA">BCA Virtual Account</option>
                      <option value="QRIS">QRIS</option>
                      <option value="QRISC">QRIS (Customizable)</option>
                      <option value="ALFAMART">Alfamart</option>
                      <option value="INDOMARET">Indomaret</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product ID
                    </label>
                    <input
                      type="number"
                      name="product_id"
                      value={formData.product_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (per item)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Amount
                      </label>
                      <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-bold">
                        Rp {(parseInt(formData.price) * parseInt(formData.quantity)).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={testCreateTransaction}
                  disabled={loading || !formData.payment_method}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Transaction...' : 'Test Create Transaction'}
                </button>
              </div>
            )}

            {/* Tab 2: Transaction History */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Test Get User Transactions</h2>
                <p className="text-gray-600 mb-4">
                  Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">GET /api/transaksi-produk/user/{'{userId}'}</code>
                </p>

                {user ? (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Logged in as:</strong> {user.name || user.email}
                    </p>
                    <p className="text-sm text-blue-700">
                      User ID: {user.id}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900">
                      ⚠️ You need to login first to test this endpoint
                    </p>
                  </div>
                )}
                
                <button
                  onClick={testGetUserTransactions}
                  disabled={loading || !user}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Test Get User Transactions'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorAlert 
              message={error}
              onClose={() => setError(null)}
              type="error"
            />
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Response</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                result.status === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Endpoint:</p>
              <code className="block bg-gray-100 px-4 py-2 rounded text-sm">
                {result.endpoint}
              </code>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Data:</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(result.data || result.error, null, 2)}
              </pre>
            </div>

            {/* Payment URL if available */}
            {result.data?.data?.payment_url && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">Payment URL:</p>
                <a 
                  href={result.data.data.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline break-all"
                >
                  {result.data.data.payment_url}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📝 Testing Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>
              <strong>Test Create Transaction:</strong> Pilih payment method dari dropdown, isi form customer data, lalu klik "Test Create Transaction"
            </li>
            <li>
              <strong>Check Response:</strong> Lihat response di bawah, jika success akan ada payment_url untuk melakukan pembayaran
            </li>
            <li>
              <strong>Test Transaction History:</strong> Login terlebih dahulu, lalu klik tab "Transaction History" untuk melihat riwayat transaksi
            </li>
            <li>
              <strong>Open Console:</strong> Buka browser console (F12) untuk melihat detail request/response
            </li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <h4 className="font-bold text-yellow-900 mb-2">⚠️ Backend Requirements</h4>
            <p className="text-sm text-yellow-800 mb-2">Backend developer perlu membuat endpoint berikut:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
              <li><code className="bg-yellow-100 px-1 rounded">POST /api/transaksi-produkweb</code> - Create transaksi & call Tripay API</li>
              <li><code className="bg-yellow-100 px-1 rounded">GET /api/transaksi-produk/user/{'{userId}'}</code> - Get user transaction history</li>
              <li><code className="bg-yellow-100 px-1 rounded">POST /api/transaksi-produk/merchant-ref/{'{merchantRef}'}</code> - Update status dari Tripay callback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPaymentPage;
