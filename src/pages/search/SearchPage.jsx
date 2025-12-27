import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import HeroSection from '../../components/cari/HeroSection';
import { getKos } from '../../services/kosService';

const BASE_URL = 'https://admin.haven.co.id';

const getFullImageUrl = (relativeUrl) => {
  if (!relativeUrl || relativeUrl.startsWith('http')) return relativeUrl;
  if (relativeUrl.startsWith('/storage')) return `${BASE_URL}${relativeUrl}`;
  return `${BASE_URL}/storage/${relativeUrl}`;
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [kosData, setKosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [selectedKos, setSelectedKos] = useState(null);
  const [pageInput, setPageInput] = useState('1');

  // Extract search parameters from URL
  const searchParamsObj = useMemo(() => {
    const city = searchParams.get('city');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const tipe = searchParams.get('tipe');
    const jenis = searchParams.get('jenis');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '12', 10);

    return {
      search: city || undefined,
      start_date: checkIn || null,
      end_date: checkOut || null,
      per_page: perPage,
      page: page,
      tipe: tipe === '-' ? undefined : tipe || undefined,
      jenis: jenis === '-' ? undefined : jenis || undefined,
    };
  }, [searchParams]);

  // Fetch data based on URL parameters
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getKos(searchParamsObj);
        
        setKosData(response.data || []);
        setPagination(response.meta || response.pagination || null);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Gagal memuat data. Silakan coba lagi.');
        setKosData([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParamsObj]);

  // Update page input when pagination changes
  useEffect(() => {
    if (pagination?.current_page) {
      setPageInput(String(pagination.current_page));
    }
  }, [pagination]);

  // Extract unique kos from kamar data
  const uniqueKos = useMemo(() => {
    const kosMap = new Map();
    kosData.forEach((kamar) => {
      if (kamar?.kos && kamar.kos.id && kamar.kos.nama) {
        if (!kosMap.has(kamar.kos.id)) {
          kosMap.set(kamar.kos.id, kamar.kos);
        }
      }
    });
    return Array.from(kosMap.values());
  }, [kosData]);

  // Filter rooms for selected kos
  const roomsForKos = useMemo(() => {
    if (!selectedKos) return [];
    return kosData.filter((kamar) => kamar?.kos?.id === selectedKos?.id);
  }, [kosData, selectedKos]);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (!pagination || pagination.current_page <= 1) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pagination.current_page - 1));
    navigate(`/search?${params.toString()}`);
  };

  const handleNextPage = () => {
    if (!pagination || pagination.current_page >= pagination.last_page) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pagination.current_page + 1));
    navigate(`/search?${params.toString()}`);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    if (!pagination) return;
    let pageNum = parseInt(pageInput || '1', 10) || 1;
    if (pageNum < 1) pageNum = 1;
    if (pageNum > pagination.last_page) pageNum = pagination.last_page;
    
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pageNum));
    navigate(`/search?${params.toString()}`);
  };

  // Get image URL helper
  const getImageUrl = (kamar) => {
    if (kamar.foto_kamar) {
      return getFullImageUrl(kamar.foto_kamar);
    }
    if (kamar.gallery?.[0]?.url) {
      return getFullImageUrl(kamar.gallery[0].url);
    }
    if (kamar.kos?.gallery?.[0]?.url) {
      return getFullImageUrl(kamar.kos.gallery[0].url);
    }
    return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';
  };

  // Get kos image
  const getKosImageUrl = (kos) => {
    if (kos.gallery?.[0]?.url) {
      return getFullImageUrl(kos.gallery[0].url);
    }
    return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';
  };

  // Format price helper
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `Rp ${(price / 1000000).toFixed(1)}jt`;
  };

  // If showing rooms for selected kos
  if (selectedKos) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div
          className="relative h-80 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/apartment-hero.png')" }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Kamar di {selectedKos.nama}
              </h1>
              <p className="text-lg opacity-90">
                {roomsForKos.length} kamar tersedia
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl py-8">
          <button
            onClick={() => setSelectedKos(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            ← Kembali ke daftar kos
          </button>

          {/* Kos Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{selectedKos.nama}</h2>
            <p className="text-gray-600">{selectedKos.alamat_kota || selectedKos.daerah?.nama}</p>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsForKos.map((kamar) => {
              const params = new URLSearchParams(searchParams);
              params.set('kosId', selectedKos.id);
              const detailUrl = `/apartment/${kamar.id}?${params.toString()}`;

              return (
                <div
                  key={kamar.id}
                  onClick={() => navigate(detailUrl)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-48">
                    <img
                      src={getImageUrl(kamar)}
                      alt={kamar.nama_kamar || 'Kamar'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {kamar.tipe_kos?.nama || 'Kos'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {kamar.nama_kamar || 'Nama tidak tersedia'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Lantai {kamar.lantai || '-'}
                    </p>
                    
                    {kamar.fasilitas && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {kamar.fasilitas.slice(0, 3).map((facility, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {facility}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-bold text-indigo-600">
                          {formatPrice(kamar.harga || kamar.paket_harga?.[0]?.harga)}
                        </span>
                        <span className="text-gray-500 text-sm">/bulan</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Main search results view
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Search Results Container */}
      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Results Summary */}
        <div className="mb-6">
          {loading ? (
            <p className="text-gray-600">Memuat hasil pencarian...</p>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Hasil Pencarian Kos
                </h2>
                <p className="text-gray-600">
                  Ditemukan <span className="font-semibold">{uniqueKos.length}</span> kos yang tersedia
                </p>
              </div>
              
              {/* Active Filters Display */}
              {searchParams.toString() && (
                <div className="flex flex-wrap gap-2">
                  {searchParams.get('city') && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      📍 {searchParams.get('city')}
                    </span>
                  )}
                  {searchParams.get('tipe') && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                      🏠 {searchParams.get('tipe')}
                    </span>
                  )}
                  {searchParams.get('jenis') && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      👥 {searchParams.get('jenis')}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : uniqueKos.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada kos yang ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah kriteria pencarian atau tanggal untuk menemukan kos yang sesuai
            </p>
          </div>
        ) : (
          /* Kos Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueKos.map((kos) => (
                <div
                  key={kos.id}
                  onClick={() => setSelectedKos(kos)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-48">
                    <img
                      src={getKosImageUrl(kos)}
                      alt={kos.nama || 'Kos'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';
                      }}
                    />
                    {kos.link_maps && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(kos.link_maps, '_blank');
                        }}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Maps
                      </button>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {kos.nama || 'Nama tidak tersedia'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 min-h-[2.5rem]">
                      {kos.alamat_kota || kos.daerah?.nama || 'Lokasi tidak tersedia'}
                    </p>
                    {kos.keterangan && (
                      <p 
                        className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]"
                        dangerouslySetInnerHTML={{ __html: kos.keterangan }}
                      />
                    )}
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      Lihat Kamar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination || pagination.current_page <= 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Sebelumnya
                </button>

                <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm flex items-center gap-2">
                  <span className="text-gray-600">Halaman</span>
                  <form onSubmit={handlePageSubmit} className="inline">
                    <input
                      type="number"
                      min={1}
                      max={pagination.last_page}
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                      className="w-14 text-center px-1 bg-transparent outline-none border-b border-gray-300 focus:border-indigo-600"
                    />
                  </form>
                  <span className="text-gray-600">dari {pagination.last_page}</span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination || pagination.current_page >= pagination.last_page}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
