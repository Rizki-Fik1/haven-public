import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getImageUrl } from '../../lib/utils';
import { addToCart, getCartItems } from '../../lib/cartUtils';
import Toast from '../../components/ui/Toast';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ErrorAlert from '../../components/ui/ErrorAlert';

const ShopPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { id: 'all', name: 'Semua Produk' },
    { id: 1, name: 'Furniture' },
    { id: 2, name: 'Elektronik' },
    { id: 3, name: 'Perlengkapan Tidur' },
    { id: 4, name: 'Dapur' }
  ];

  useEffect(() => {
    fetchProducts();
    updateCartItems();
  }, [selectedCategory]);

  const updateCartItems = () => {
    const items = getCartItems();
    setCartItems(items);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? { kategori: selectedCategory } : {};
      const data = await getProducts(params);
      setProducts(data.data || data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Gagal memuat produk. Silakan coba lagi.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    try {
      setAddingToCart(product.id_produk);
      
      // Add to localStorage cart
      addToCart(product, 1);
      
      // Update local cart items state
      updateCartItems();
      
      // Dispatch custom event to update cart count in header
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Show toast notification
      setToastMessage(`${product.judul_produk} ditambahkan ke keranjang`);
      setShowToast(true);
    } catch (err) {
      setErrorMessage('Gagal menambahkan ke keranjang. Silakan coba lagi.');
      setShowErrorModal(true);
    } finally {
      setAddingToCart(null);
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id_produk === productId);
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const getProductImage = (product) => {
    // Check if gambar exists and is an array
    if (product.gambar && Array.isArray(product.gambar) && product.gambar.length > 0) {
      const imageObj = product.gambar[0];
      
      // Handle different image formats
      if (typeof imageObj === 'string') {
        return getImageUrl(imageObj);
      }
      
      if (typeof imageObj === 'object' && imageObj !== null) {
        // Backend uses 'url_gambar' field
        const imageUrl = imageObj.url_gambar || imageObj.url || imageObj.path || imageObj.gambar || imageObj.image || '';
        if (imageUrl) {
          return getImageUrl(imageUrl);
        }
      }
    }
    
    // Check if gambar is a string directly
    if (typeof product.gambar === 'string') {
      return getImageUrl(product.gambar);
    }
    
    // Fallback to a generic product icon/placeholder
    return 'https://plus.unsplash.com/premium_photo-1681487832308-7c6b2fee405f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.id_kategori === selectedCategory);

  return (
    <div className="w-full bg-gray-50 min-h-screen py-8">
      {/* Toast Notification */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
        />
      )}

      {/* Error Modal */}
      <ConfirmModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onConfirm={() => setShowErrorModal(false)}
        title="Gagal Menambahkan"
        message={errorMessage}
        confirmText="OK"
        cancelText=""
        type="danger"
      />
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Toko Kami</h1>
          <p className="text-gray-600">Belanja kebutuhan kos Anda di sini</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorAlert 
              message={error}
              onRetry={fetchProducts}
              type="error"
            />
          </div>
        )}

        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Products Count */}
            <div className="mb-4">
              <p className="text-gray-600">Menampilkan {filteredProducts.length} produk</p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Tidak ada produk tersedia</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id_produk}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-48">
                      <img
                        src={getProductImage(product)}
                        alt={product.judul_produk}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.judul_produk}
                      </h3>
                      {product.deskripsi && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.deskripsi}
                        </p>
                      )}
                      
                      <div className="flex flex-col gap-3 mt-4">
                        <div className="text-xl font-bold text-gray-900">
                          Rp {parseInt(product.harga).toLocaleString('id-ID')}
                        </div>
                        
                        {isInCart(product.id_produk) ? (
                          <button 
                            onClick={handleViewCart}
                            className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Lihat Keranjang
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart === product.id_produk}
                            className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {addingToCart === product.id_produk ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Menambahkan...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                Tambah Keranjang
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
