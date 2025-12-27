import { useState, useEffect } from 'react';
import { getProducts, addToCart } from '../../services/productService';
import { getImageUrl } from '../../lib/utils';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  const fallbackProducts = [
    {
      id_produk: 1,
      judul_produk: 'Kasur Lipat Premium',
      harga: '450000',
      id_kategori: 1,
      gambar: [{ url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop' }]
    },
    {
      id_produk: 2,
      judul_produk: 'Lemari Portable 2 Pintu',
      harga: '350000',
      id_kategori: 1,
      gambar: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' }]
    },
    {
      id_produk: 3,
      judul_produk: 'Meja Belajar Minimalis',
      harga: '280000',
      id_kategori: 1,
      gambar: [{ url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop' }]
    },
    {
      id_produk: 4,
      judul_produk: 'Lampu Meja LED',
      harga: '85000',
      id_kategori: 2,
      gambar: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop' }]
    },
    {
      id_produk: 5,
      judul_produk: 'Kipas Angin Mini USB',
      harga: '65000',
      id_kategori: 2,
      gambar: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' }]
    },
    {
      id_produk: 6,
      judul_produk: 'Rak Buku Dinding',
      harga: '120000',
      id_kategori: 1,
      gambar: [{ url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop' }]
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua Produk' },
    { id: 1, name: 'Furniture' },
    { id: 2, name: 'Elektronik' },
    { id: 3, name: 'Perlengkapan Tidur' },
    { id: 4, name: 'Dapur' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? { kategori: selectedCategory } : {};
      const data = await getProducts(params);
      setProducts(data.data || data || []);
      setError(null);
    } catch (err) {
      if (err.message !== 'API_NOT_FOUND') {
        setError('Gagal memuat produk');
      }
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId, 1);
      alert('Produk berhasil ditambahkan ke keranjang!');
    } catch (err) {
      alert('Gagal menambahkan ke keranjang. Silakan coba lagi.');
    } finally {
      setAddingToCart(null);
    }
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
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Toko Kami</h1>
          <p className="text-gray-600">Belanja kebutuhan kos Anda di sini</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">Menggunakan data contoh (API tidak tersedia)</p>
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
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="text-xl font-bold text-indigo-600">
                            Rp {parseInt(product.harga).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleAddToCart(product.id_produk)}
                          disabled={addingToCart === product.id_produk}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {addingToCart === product.id_produk ? 'Menambah...' : 'Beli'}
                        </button>
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
