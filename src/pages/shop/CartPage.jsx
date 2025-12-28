import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '../../lib/utils';
import { 
  getCartItems, 
  removeFromCart, 
  updateCartItemQuantity,
  clearCart,
  getCartTotal 
} from '../../lib/cartUtils';
import ConfirmModal from '../../components/ui/ConfirmModal';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [updating, setUpdating] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = getCartItems();
    setCartItems(items);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(productId);
      updateCartItemQuantity(productId, newQuantity);
      loadCart(); // Reload cart from localStorage
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Error updating quantity:', err);
      setErrorModal({ show: true, message: 'Gagal mengubah jumlah produk' });
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = (productId) => {
    setItemToRemove(productId);
    setShowRemoveModal(true);
  };

  const confirmRemoveItem = () => {
    if (!itemToRemove) return;
    
    try {
      setUpdating(itemToRemove);
      removeFromCart(itemToRemove);
      loadCart(); // Reload cart from localStorage
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Error removing item:', err);
      setErrorModal({ show: true, message: 'Gagal menghapus produk' });
    } finally {
      setUpdating(null);
      setItemToRemove(null);
    }
  };

  const getProductImage = (product) => {
    if (product.gambar && Array.isArray(product.gambar) && product.gambar.length > 0) {
      const imageObj = product.gambar[0];
      
      if (typeof imageObj === 'string') {
        return getImageUrl(imageObj);
      }
      
      if (typeof imageObj === 'object' && imageObj !== null) {
        const imageUrl = imageObj.url_gambar || imageObj.url || imageObj.path || '';
        if (imageUrl) {
          return getImageUrl(imageUrl);
        }
      }
    }
    
    if (typeof product.gambar === 'string') {
      return getImageUrl(product.gambar);
    }
    
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&q=80';
  };

  const calculateTotal = () => {
    return getCartTotal();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setShowEmptyCartModal(true);
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Remove Item Modal */}
      <ConfirmModal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setItemToRemove(null);
        }}
        onConfirm={confirmRemoveItem}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini dari keranjang?"
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />

      {/* Clear Cart Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClearCart}
        title="Kosongkan Keranjang"
        message="Apakah Anda yakin ingin menghapus semua produk dari keranjang?"
        confirmText="Hapus Semua"
        cancelText="Batal"
        type="danger"
      />

      {/* Checkout Modal */}
      <ConfirmModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={() => setShowCheckoutModal(false)}
        title="Segera Hadir"
        message="Fitur checkout akan segera hadir!"
        confirmText="OK"
        cancelText=""
        type="info"
      />

      {/* Empty Cart Modal */}
      <ConfirmModal
        isOpen={showEmptyCartModal}
        onClose={() => setShowEmptyCartModal(false)}
        onConfirm={() => setShowEmptyCartModal(false)}
        title="Keranjang Kosong"
        message="Keranjang masih kosong! Silakan tambahkan produk terlebih dahulu."
        confirmText="OK"
        cancelText=""
        type="warning"
      />

      {/* Error Modal */}
      <ConfirmModal
        isOpen={errorModal.show}
        onClose={() => setErrorModal({ show: false, message: '' })}
        onConfirm={() => setErrorModal({ show: false, message: '' })}
        title="Terjadi Kesalahan"
        message={errorModal.message}
        confirmText="OK"
        cancelText=""
        type="danger"
      />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/shop')}
            className="mb-4 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Toko</span>
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Keranjang Belanja</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'produk' : 'produk'} dalam keranjang
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-600 mb-6">Belum ada produk di keranjang Anda</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const quantity = parseInt(item.quantity || 1);
                const price = parseInt(item.harga || 0);
                const subtotal = price * quantity;

                return (
                  <div
                    key={item.id_produk}
                    className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={getProductImage(item)}
                        alt={item.judul_produk}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&q=80';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.judul_produk}
                      </h3>
                      <p className="text-indigo-600 font-semibold mb-3">
                        Rp {price.toLocaleString('id-ID')}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.id_produk, quantity - 1)}
                            disabled={updating === item.id_produk || quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id_produk, quantity + 1)}
                            disabled={updating === item.id_produk}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id_produk)}
                          disabled={updating === item.id_produk}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkir</span>
                    <span>Gratis</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Checkout
                </button>

                <button
                  onClick={() => navigate('/shop')}
                  className="w-full mt-3 bg-white text-indigo-600 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Lanjut Belanja
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
