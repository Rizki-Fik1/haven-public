import { useState } from 'react';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Kasur Lipat Premium',
      price: 450000,
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
      rating: 4.5,
      sold: 120
    },
    {
      id: 2,
      name: 'Lemari Portable 2 Pintu',
      price: 350000,
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.8,
      sold: 89
    },
    {
      id: 3,
      name: 'Meja Belajar Minimalis',
      price: 280000,
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
      rating: 4.6,
      sold: 156
    },
    {
      id: 4,
      name: 'Lampu Meja LED',
      price: 85000,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
      rating: 4.7,
      sold: 234
    },
    {
      id: 5,
      name: 'Kipas Angin Mini USB',
      price: 65000,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.3,
      sold: 178
    },
    {
      id: 6,
      name: 'Rak Buku Dinding',
      price: 120000,
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop',
      rating: 4.4,
      sold: 92
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua Produk' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'electronics', name: 'Elektronik' },
    { id: 'bedding', name: 'Perlengkapan Tidur' },
    { id: 'kitchen', name: 'Dapur' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="w-full bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Toko Kami</h1>
          <p className="text-gray-600">Belanja kebutuhan kos Anda di sini</p>
        </div>

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

        {/* Products Grid */}
        <div className="mb-4">
          <p className="text-gray-600">Menampilkan {filteredProducts.length} produk</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-700 ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    | {product.sold} terjual
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-indigo-600">
                      Rp {(product.price / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    Beli
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
