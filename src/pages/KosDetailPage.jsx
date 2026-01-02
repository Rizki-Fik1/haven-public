import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, MapPin, ArrowLeft, Building } from 'lucide-react';
import { getKosDetail } from '../services/kosService';
import RoomCard from '../components/search/RoomCard';

const BASE_URL = 'https://admin.haven.co.id';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop';

// Helper function to get image URL
const getImageUrl = (img) => {
  if (!img) return null;
  
  if (typeof img === 'string') {
    if (img.startsWith('http')) return img;
    if (img.startsWith('/storage')) return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  }
  
  if (typeof img === 'object' && img !== null) {
    const imageUrl = img.url_gambar || img.url || img.path || img.gambar || img.image;
    
    if (imageUrl) {
      if (typeof imageUrl === 'string') {
        if (imageUrl.startsWith('http')) return imageUrl;
        if (imageUrl.startsWith('/storage')) return `${BASE_URL}${imageUrl}`;
        return `${BASE_URL}/${imageUrl}`;
      }
    }
  }
  
  return null;
};

const KosDetailPage = () => {
  const { kosId } = useParams();
  const navigate = useNavigate();
  
  const [kos, setKos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKosDetail = async () => {
      try {
        setLoading(true);
        const response = await getKosDetail(kosId);
        const kosData = response.data || response;
        setKos(kosData);
        setError(null);
      } catch (err) {
        console.error('Error fetching kos detail:', err);
        setError('Gagal memuat detail kos');
      } finally {
        setLoading(false);
      }
    };

    if (kosId) {
      fetchKosDetail();
    }
  }, [kosId]);

  const handleBack = () => {
    navigate('/');
  };

  // Get images
  const images = (() => {
    let imageUrls = [];
    
    if (kos?.gallery && Array.isArray(kos.gallery) && kos.gallery.length > 0) {
      imageUrls = kos.gallery.map(img => getImageUrl(img)).filter(Boolean);
    }
    
    if (imageUrls.length === 0) {
      imageUrls = [FALLBACK_IMAGE];
    }
    
    return imageUrls;
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Memuat detail kos...</p>
        </div>
      </div>
    );
  }

  if (error || !kos) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error || 'Kos tidak ditemukan'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 text-green-600 hover:text-green-700 font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke beranda</span>
        </button>

        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {kos.nama}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{kos.alamat_kota || kos.daerah?.nama}</span>
            </div>
            {kos.tipe_kos && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                <Building className="w-4 h-4" />
                {kos.tipe_kos}
              </span>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {images.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <img
                src={images[0]}
                alt={kos.nama}
                className="w-full h-[400px] object-cover"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {kos.keterangan && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Kos</h2>
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: kos.keterangan }}
                />
              </div>
            )}

            {/* Available Rooms */}
            {kos.kamar && kos.kamar.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Kamar Tersedia</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {kos.kamar.map((kamar) => (
                    <RoomCard
                      key={kamar.id}
                      kamar={kamar}
                      kosId={kos.id}
                      kosName={kos.nama}
                      kosLocation={kos.daerah?.nama}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Location Section */}
            {(kos.alamat || kos.link_maps) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lokasi</h2>
                <p className="text-gray-600 text-sm flex items-start gap-2 mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span>{kos.alamat || kos.alamat_kota || kos.daerah?.nama || 'Lokasi tidak tersedia'}</span>
                </p>
                
                {kos.link_maps && (
                  <button
                    onClick={() => window.open(kos.link_maps, '_blank')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <MapPin className="w-5 h-5" />
                    Buka di Google Maps
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-br from-green-600 via-green-600 to-green-700 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{kos.nama}</h3>
                <p className="text-sm opacity-90">{kos.alamat_kota || kos.daerah?.nama}</p>
              </div>

              <div className="p-6">
                {kos.kamar && kos.kamar.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-900 mb-2">Informasi</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">Jumlah Kamar</span>
                        <span className="font-bold text-gray-900">{kos.kamar.length} kamar</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                  <p className="text-xs text-green-900 font-medium leading-relaxed">
                    Hubungi kami untuk informasi lebih lanjut dan ketersediaan kamar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KosDetailPage;
