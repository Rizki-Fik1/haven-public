import { useState } from 'react';

const SearchPage = () => {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');

  // Static dummy data - no API fetch
  const properties = [
    {
      id: 1,
      nama: 'Kos Modern Dekat Kampus',
      lokasi: 'Jakarta Selatan',
      harga: 1500000,
      tipe: 'Kos',
      gambar: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
      fasilitas: ['WiFi', 'AC', 'Kamar Mandi Dalam']
    },
    {
      id: 2,
      nama: 'Apartemen Studio Furnished',
      lokasi: 'Tangerang',
      harga: 2500000,
      tipe: 'Apartemen',
      gambar: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'],
      fasilitas: ['WiFi', 'AC', 'Kitchen', 'Parkir']
    },
    {
      id: 3,
      nama: 'Co-Living Space Premium',
      lokasi: 'Bandung',
      harga: 1800000,
      tipe: 'Co-Living',
      gambar: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'],
      fasilitas: ['WiFi', 'AC', 'Coworking Space', 'Gym']
    }
  ];

  const handleSearch = () => {
    console.log('Search with:', { location, priceRange, propertyType });
    // TODO: Implement search logic when needed
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cari Kos & Apartemen</h1>
          <p className="text-gray-600">Temukan hunian impian Anda di sini</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lokasi
              </label>
              <input
                type="text"
                placeholder="Cari lokasi..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rentang Harga
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Semua Harga</option>
                <option value="0-1000000">&lt; 1 Juta</option>
                <option value="1000000-2000000">1 - 2 Juta</option>
                <option value="2000000-3000000">2 - 3 Juta</option>
                <option value="3000000+">&gt; 3 Juta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipe Properti
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Semua Tipe</option>
                <option value="kos">Kos</option>
                <option value="apartemen">Apartemen</option>
                <option value="co-living">Co-Living</option>
              </select>
            </div>
          </div>
          <button 
            className="mt-4 w-full md:w-auto bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            onClick={handleSearch}
          >
            Cari Sekarang
          </button>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">Menampilkan {properties.length} properti</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-48">
                <img
                  src={property.gambar?.[0] || fallbackProperties[0].gambar[0]}
                  alt={property.nama}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                    {property.tipe}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {property.nama}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path d="M8 8.5C8.82843 8.5 9.5 7.82843 9.5 7C9.5 6.17157 8.82843 5.5 8 5.5C7.17157 5.5 6.5 6.17157 6.5 7C6.5 7.82843 7.17157 8.5 8 8.5Z" strokeWidth="1.5"/>
                    <path d="M8 14C8 14 13 10.5 13 7C13 4.23858 10.7614 2 8 2C5.23858 2 3 4.23858 3 7C3 10.5 8 14 8 14Z" strokeWidth="1.5"/>
                  </svg>
                  {property.lokasi}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {property.fasilitas?.map((facility, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {facility}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-indigo-600">
                      Rp {(property.harga / 1000000).toFixed(1)}jt
                    </span>
                    <span className="text-gray-500 text-sm">/bulan</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
