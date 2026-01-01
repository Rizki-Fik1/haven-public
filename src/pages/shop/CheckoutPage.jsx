import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import checkoutService from '../../services/checkoutService';
import { getProducts } from '../../services/products';
import { getCartItems, getCartTotal, clearCart } from '../../lib/cartUtils';
import { getImageUrl } from '../../lib/utils';
import { useAuthContext } from '../../context/AuthContext';

/**
 * Checkout Page - Integrated with API
 * Layout: Left (Customer Info) | Right (Products + Payment + Summary)
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [paymentChannels, setPaymentChannels] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPaymentChannels, setLoadingPaymentChannels] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Auto-fill customer info from logged in user
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.nama || user.name || '',
        email: user.email || '',
        phone: user.no_telp || user.phone || user.no_hp || ''
      });
    }
  }, [user]);

  // Load data saat component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load cart items
      const items = getCartItems();
      if (items.length === 0) {
        alert('Keranjang kosong! Silakan tambahkan produk terlebih dahulu.');
        navigate('/cart');
        return;
      }
      setCartItems(items);

      // Load products (optional, untuk validasi)
      try {
        const productsData = await getProducts();
        setProducts(productsData.data || []);
      } catch (err) {
        console.error('Error loading products:', err);
      }

      // Load payment channels
      setLoadingPaymentChannels(true);
      setPaymentError(null);
      try {
        const channelsData = await checkoutService.getPaymentChannels();
        console.log('Payment channels response:', channelsData);
        
        if (channelsData.success && channelsData.data) {
          setPaymentChannels(channelsData.data);
        } else {
          setPaymentError('Format response payment channels tidak sesuai');
          console.error('Invalid payment channels response:', channelsData);
        }
      } catch (err) {
        console.error('Error loading payment channels:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Gagal memuat metode pembayaran';
        setPaymentError(errorMsg);
        
        // Jika endpoint tidak tersedia, gunakan fallback dengan lebih banyak metode
        console.warn('Using fallback payment methods');
        setPaymentChannels([
          // Virtual Account
          {
            code: 'BRIVA',
            name: 'BRI Virtual Account',
            group: 'Virtual Account',
            fee_customer: { flat: 4000, percent: 0 },
            icon_url: 'https://tripay.co.id/images/payment_icon/BRIVA.png',
            active: true
          },
          {
            code: 'BNIVA',
            name: 'BNI Virtual Account',
            group: 'Virtual Account',
            fee_customer: { flat: 4000, percent: 0 },
            icon_url: 'https://tripay.co.id/images/payment_icon/BNIVA.png',
            active: true
          },
          {
            code: 'MANDIRIVA',
            name: 'Mandiri Virtual Account',
            group: 'Virtual Account',
            fee_customer: { flat: 4000, percent: 0 },
            icon_url: 'https://tripay.co.id/images/payment_icon/MANDIRIVA.png',
            active: true
          },
          {
            code: 'BCAVA',
            name: 'BCA Virtual Account',
            group: 'Virtual Account',
            fee_customer: { flat: 4000, percent: 0 },
            icon_url: 'https://tripay.co.id/images/payment_icon/BCAVA.png',
            active: true
          },
          {
            code: 'PERMATAVA',
            name: 'Permata Virtual Account',
            group: 'Virtual Account',
            fee_customer: { flat: 4000, percent: 0 },
            icon_url: 'https://tripay.co.id/images/payment_icon/PERMATAVA.png',
            active: true
          },
          {
            code: 'CIMBVA',
            name: 'CIMB Niaga Virtual Account',
            group: 'Virtual Account',
            fee_customer: { flat: 4000, percent: 0 },
            icon_url: 'https://tripay.co.id/images/payment_icon/CIMBVA.png',
            active: true
          },
          // E-Wallet
          {
            code: 'QRIS',
            name: 'QRIS (Semua E-Wallet)',
            group: 'QRIS',
            fee_customer: { flat: 0, percent: 0.7 },
            icon_url: 'https://tripay.co.id/images/payment_icon/QRIS.png',
            active: true
          },
          {
            code: 'SHOPEEPAY',
            name: 'ShopeePay',
            group: 'E-Wallet',
            fee_customer: { flat: 0, percent: 2 },
            icon_url: 'https://tripay.co.id/images/payment_icon/SHOPEEPAY.png',
            active: true
          },
          {
            code: 'OVO',
            name: 'OVO',
            group: 'E-Wallet',
            fee_customer: { flat: 0, percent: 2 },
            icon_url: 'https://tripay.co.id/images/payment_icon/OVO.png',
            active: true
          },
          {
            code: 'DANA',
            name: 'DANA',
            group: 'E-Wallet',
            fee_customer: { flat: 0, percent: 1.5 },
            icon_url: 'https://tripay.co.id/images/payment_icon/DANA.png',
            active: true
          },
          // Convenience Store
          {
            code: 'ALFAMART',
            name: 'Alfamart',
            group: 'Convenience Store',
            fee_customer: { flat: 2500, percent: 0 },
            icon_url: 'https://tripay.co.id/images/payment_icon/ALFAMART.png',
            active: true
          },
          {
            code: 'INDOMARET',
            name: 'Indomaret',
            group: 'Convenience Store',
            fee_customer: { flat: 2500, percent: 0 },
            icon_url: 'https://tripay.co.id/images/payment_icon/INDOMARET.png',
            active: true
          }
        ]);
      } finally {
        setLoadingPaymentChannels(false);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    // Validasi
    if (cartItems.length === 0) {
      alert('Keranjang kosong!');
      return;
    }
    
    if (!selectedPayment) {
      alert('Pilih metode pembayaran terlebih dahulu');
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      alert('Nama dan email harus diisi');
      return;
    }

    if (!user || !user.id) {
      alert('User ID tidak ditemukan. Silakan login ulang.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Hitung subtotal dari semua items
      const subtotal = cartItems.reduce((sum, item) => sum + (parseInt(item.harga) * item.quantity), 0);
      const paymentFee = getSelectedPaymentFee();
      const grandTotal = subtotal + paymentFee;
      
      // Untuk setiap item di cart, buat checkout
      const checkoutPromises = cartItems.map(item => {
        const checkoutData = {
          id_user: user.id,
          id_produk: item.id_produk,
          jumlah: item.quantity, // ✅ Backend expect "jumlah" (bukan "quantity")
          harga_satuan: parseInt(item.harga), // ✅ Backend expect "harga_satuan"
          total_harga: parseInt(item.harga) * item.quantity, // ✅ Backend expect "total_harga"
          subtotal: subtotal, // ✅ Backend expect "subtotal" (total semua items)
          biaya_admin: paymentFee, // ✅ Backend expect "biaya_admin" (payment fee)
          total_bayar: grandTotal, // ✅ Backend expect "total_bayar" (subtotal + biaya_admin)
          metode_pembayaran: selectedPayment, // ✅ Backend expect "metode_pembayaran"
          nama_customer: customerInfo.name, // ✅ Backend expect "nama_customer"
          email_customer: customerInfo.email, // ✅ Backend expect "email_customer"
          no_hp_customer: customerInfo.phone || '', // ✅ Backend expect "no_hp_customer"
          tripay_merchant_ref: `ORDER-${Date.now()}-${item.id_produk}`,
          callback_url: `${window.location.origin}/api/tripay/callback`,
          return_url: `${window.location.origin}/transaksi`,
          expired_time: 24,
        };
        
        console.log('Checkout data:', checkoutData); // Debug
        return checkoutService.createCheckout(checkoutData);
      });

      const results = await Promise.all(checkoutPromises);
      
      console.log('Checkout results:', results);
      
      // Ambil checkout URL dari result pertama
      const firstResult = results[0];
      
      // Clear cart setelah berhasil
      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Redirect ke halaman pembayaran
      if (firstResult.data?.checkout_url) {
        window.location.href = firstResult.data.checkout_url;
      } else if (firstResult.data?.pay_url) {
        window.location.href = firstResult.data.pay_url;
      } else {
        alert('Checkout berhasil! Reference: ' + firstResult.data?.reference);
        navigate('/shop');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Checkout gagal, silakan coba lagi';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return getCartTotal();
  };

  const getSelectedPaymentFee = () => {
    if (!selectedPayment) return 0;
    const channel = paymentChannels.find(ch => ch.code === selectedPayment);
    return channel?.fee_customer?.flat || 0;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + getSelectedPaymentFee();
  };

  const getProductImage = (item) => {
    if (item.gambar && Array.isArray(item.gambar) && item.gambar.length > 0) {
      return getImageUrl(item.gambar[0]);
    }
    if (typeof item.gambar === 'string') {
      return getImageUrl(item.gambar);
    }
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&q=80';
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <button
          onClick={() => navigate('/cart')}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Keranjang</span>
        </button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Flex Layout: Left (Customer Info) | Right (Products + Payment + Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN - Customer Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Customer</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                    placeholder="Masukkan nama lengkap"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Data dari akun Anda</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                    placeholder="email@example.com"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Data dari akun Anda</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Telepon (Opsional)
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="081234567890"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Products + Payment + Summary */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Produk yang Dibeli</h2>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id_produk} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={getProductImage(item)}
                        alt={item.judul_produk}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.judul_produk}</h3>
                      <p className="text-gray-500 text-sm mb-1">
                        {item.quantity} x Rp {parseInt(item.harga).toLocaleString('id-ID')}
                      </p>
                      <p className="text-indigo-600 font-bold">
                        Rp {(parseInt(item.harga) * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Pilih Metode Pembayaran</h2>
              
              {loadingPaymentChannels ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading payment methods...</p>
                </div>
              ) : paymentError ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ {paymentError}
                  </p>
                  <p className="text-yellow-700 text-xs mt-1">
                    Menggunakan metode pembayaran default. Silakan hubungi admin jika ada masalah.
                  </p>
                </div>
              ) : paymentChannels.length === 0 ? (
                <p className="text-gray-500">Tidak ada metode pembayaran tersedia</p>
              ) : null}
              
              {paymentChannels.length > 0 && (
                <>
                  {/* Group by payment type */}
                  {['Virtual Account', 'E-Wallet', 'Convenience Store', 'QRIS'].map(group => {
                    const groupChannels = paymentChannels.filter(ch => ch.group === group);
                    if (groupChannels.length === 0) return null;

                    return (
                      <div key={group} className="mb-6 last:mb-0">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">{group}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {groupChannels.map(channel => (
                            <div
                              key={channel.code}
                              onClick={() => setSelectedPayment(channel.code)}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                                selectedPayment === channel.code
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-indigo-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {channel.icon_url && (
                                  <img
                                    src={channel.icon_url}
                                    alt={channel.name}
                                    className="w-12 h-12 object-contain"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{channel.name}</p>
                                  <p className="text-sm text-gray-500">
                                    Fee: Rp {channel.fee_customer?.flat?.toLocaleString('id-ID') || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                </div>
                {selectedPayment && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Admin</span>
                    <span>Rp {getSelectedPaymentFee().toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">
                      Rp {calculateGrandTotal().toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0 || !selectedPayment}
                className={`w-full mt-6 py-4 rounded-lg font-semibold text-white transition-all ${
                  loading || cartItems.length === 0 || !selectedPayment
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? 'Processing...' : 'Checkout Sekarang'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
