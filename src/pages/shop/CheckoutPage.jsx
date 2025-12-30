import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, CreditCard, User, Mail, Phone } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { getCartItems, clearCart, getCartTotal } from '../../lib/cartUtils';
import { getImageUrl } from '../../lib/utils';
import { useCreatePayment, usePaymentChannels, useCalculateFee } from '../../hooks/useTripay';
import { createTransaksiProduk } from '../../services/transaksiService';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ErrorAlert from '../../components/ui/ErrorAlert';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    phone: '',
    payment_method: ''
  });

  // Helper functions - defined first
  const calculateSubtotal = () => getCartTotal();

  // Use Tripay hooks
  const { data: channelsData, isLoading: channelsLoading } = usePaymentChannels();
  const createPaymentMutation = useCreatePayment();

  // Calculate fee based on selected payment method
  const subtotal = calculateSubtotal();
  const { fee, total } = useCalculateFee(subtotal, formData.payment_method);
  const calculateGrandTotal = () => total || subtotal;

  const paymentChannels = channelsData?.data || [];

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    const items = getCartItems();
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(items);

    if (user) {
      setFormData({
        nama: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        payment_method: ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getProductImage = (product) => {
    if (product.gambar && Array.isArray(product.gambar) && product.gambar.length > 0) {
      const imageObj = product.gambar[0];
      if (typeof imageObj === 'string') return getImageUrl(imageObj);
      if (typeof imageObj === 'object' && imageObj !== null) {
        const imageUrl = imageObj.url_gambar || imageObj.url || imageObj.path || '';
        if (imageUrl) return getImageUrl(imageUrl);
      }
    }
    if (typeof product.gambar === 'string') return getImageUrl(product.gambar);
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&q=80';
  };

  const handleCheckout = async () => {
    if (!formData.nama || !formData.email || !formData.phone) {
      setError('Mohon lengkapi data customer');
      return;
    }

    if (!formData.payment_method) {
      setError('Mohon pilih metode pembayaran');
      return;
    }

    if (cartItems.length === 0) {
      setError('Keranjang belanja kosong');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Cart items:', cartItems);

      // Validate cart items have required fields
      const invalidItems = cartItems.filter(item => 
        (!item.id_produk && !item.id) || 
        (!item.judul_produk && !item.nama) || 
        !item.harga
      );
      if (invalidItems.length > 0) {
        console.error('Invalid cart items:', invalidItems);
        throw new Error('Beberapa produk di keranjang tidak valid. Silakan refresh halaman.');
      }

      const tripayPayload = {
        method: formData.payment_method,
        customerName: formData.nama,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        orderItems: cartItems.map(item => ({
          sku: String(item.id_produk || item.id || ''),
          name: item.judul_produk || item.nama || item.name || 'Product',
          price: parseInt(item.harga || item.price || 0),
          quantity: parseInt(item.quantity || 1)
        })),
        amount: calculateGrandTotal(),
        merchantRef: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expiryHours: 24
      };

      console.log('Creating Tripay payment...', tripayPayload);
      const tripayResponse = await createTripayPayment(tripayPayload);
      
      if (!tripayResponse.success) {
        throw new Error(tripayResponse.message || 'Gagal membuat pembayaran');
      }

      const tripayData = tripayResponse.data;
      console.log('Tripay response:', tripayData);

      const transaksiPromises = cartItems.map(item => {
        const transaksiData = {
          id_user: user.id,
          id_produk: item.id || item.id_produk,
          tripay_merchant_ref: tripayData.merchant_ref || tripayPayload.merchantRef,
          link_payment: tripayData.checkout_url || tripayData.payment_url || '',
          jumlah: parseInt(item.quantity || 1),
          harga_satuan: parseInt(item.harga || item.price || 0),
          subtotal: parseInt(item.harga || item.price || 0) * parseInt(item.quantity || 1),
          tanggal_transaksi: new Date().toISOString().split('T')[0],
          status: 'belum_lunas'
        };

        console.log('Creating transaksi:', transaksiData);
        return createTransaksiProduk(transaksiData);
      });

      await Promise.all(transaksiPromises);

      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));

      if (tripayData.checkout_url || tripayData.payment_url) {
        window.location.href = tripayData.checkout_url || tripayData.payment_url;
      } else {
        navigate('/pembelian');
      }

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || err.message || 'Gagal melakukan checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: '/checkout' } });
  };

  if (!isAuthenticated) {
    return (
      <ConfirmModal
        isOpen={showLoginModal}
        title="Login Required"
        message="Anda harus login terlebih dahulu untuk melakukan checkout"
        confirmText="Login"
        cancelText="Kembali"
        onConfirm={handleLoginRedirect}
        onCancel={() => navigate('/cart')}
        type="info"
      />
    );
  }

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Kembali ke Keranjang</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Lengkapi data dan pilih metode pembayaran</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Informasi Customer</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Telepon *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="08123456789"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Metode Pembayaran</h2>
              </div>

              {channelsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Memuat metode pembayaran...</p>
                </div>
              ) : paymentChannels.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <p>Tidak ada metode pembayaran tersedia</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentChannels.map((method) => (
                    <label
                      key={method.code}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.payment_method === method.code
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.code}
                          checked={formData.payment_method === method.code}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <div>
                          <span className="font-medium text-gray-900 block">{method.name}</span>
                          <span className="text-xs text-gray-500">{method.group}</span>
                        </div>
                      </div>
                      {method.total_fee && (method.total_fee.flat > 0 || method.total_fee.percent > 0) && (
                        <span className="text-sm text-gray-600">
                          Fee: Rp {method.total_fee.flat.toLocaleString('id-ID')}
                          {method.total_fee.percent > 0 && ` + ${method.total_fee.percent}%`}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Ringkasan Pesanan</h2>
              </div>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id_produk || item.id} className="flex gap-3">
                    <img
                      src={getProductImage(item)}
                      alt={item.judul_produk || item.nama}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.judul_produk || item.nama}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x Rp {parseInt(item.harga).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>

                {fee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Biaya Admin</span>
                    <span>Rp {fee.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>Rp {calculateGrandTotal().toLocaleString('id-ID')}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4">
                  <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                    type="error"
                  />
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={createPaymentMutation.isPending || !formData.payment_method}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {createPaymentMutation.isPending ? 'Memproses...' : 'Bayar Sekarang'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
