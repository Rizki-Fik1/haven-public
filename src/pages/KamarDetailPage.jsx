import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, MapPin, ArrowLeft, Building, Layers, Maximize2, Users, ChevronRight, Check, X, ChevronLeft } from 'lucide-react';
import { getKamarDetail, getKosDetail } from '../services/kosService';
import { useAuthContext } from '../context/AuthContext';
import BookingSheet from '../components/booking/BookingSheet';
import DocumentUploadModal from '../components/booking/DocumentUploadModal';
import AvailabilitySection from '../components/booking/AvailabilitySection';

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

const KamarDetailPage = () => {
  const { kosId, kamarId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [kamar, setKamar] = useState(null);
  const [kosDetail, setKosDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Booking states
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const { user, isAuthenticated } = useAuthContext();
  
  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchKamarDetail = async () => {
      try {
        setLoading(true);
        const response = await getKamarDetail(kosId, kamarId);
        const kamarData = response.data || response;
        setKamar(kamarData);
        
        // Also fetch kos detail for more complete information (including maps)
        try {
          const kosResponse = await getKosDetail(kosId);
          const kosData = kosResponse.data || kosResponse;
          setKosDetail(kosData);
        } catch (kosErr) {
          console.error('Error fetching kos detail:', kosErr);
          // Continue even if kos detail fails
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching kamar detail:', err);
        setError('Gagal memuat detail kamar');
      } finally {
        setLoading(false);
      }
    };

    if (kosId && kamarId) {
      fetchKamarDetail();
    }
  }, [kosId, kamarId]);

  const handleBack = () => {
    navigate(`/search?${searchParams.toString()}`);
  };

  // Handle booking click
  const handleBookingClick = () => {
    // 1. Check authentication
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // 2. Check documents (KTP & Selfie)
    const hasKtp = user?.gambarktp && user.gambarktp.trim() !== '';
    const hasSelfie = user?.fotoselfie && user.fotoselfie.trim() !== '';
    
    if (!hasKtp || !hasSelfie) {
      setIsDocumentModalOpen(true);
      return;
    }
    
    // 3. Open BookingSheet (mobile) or redirect to /booking (desktop)
    const duration = searchParams.get('duration') || '1-month';
    const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
    const checkOut = searchParams.get('checkOut') || '';
    
    if (isMobile) {
      setIsBookingSheetOpen(true);
    } else {
      navigate(`/booking?kosId=${kosId}&kamarId=${kamarId}&checkIn=${checkIn}&checkOut=${checkOut}&duration=${duration}`);
    }
  };
  
  const handleDocumentUploadSuccess = () => {
    // After successful document upload, open booking
    const duration = searchParams.get('duration') || '1-month';
    const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
    const checkOut = searchParams.get('checkOut') || '';
    
    if (isMobile) {
      setIsBookingSheetOpen(true);
    } else {
      navigate(`/booking?kosId=${kosId}&kamarId=${kamarId}&checkIn=${checkIn}&checkOut=${checkOut}&duration=${duration}`);
    }
  };

  // Get images
  const images = (() => {
    let imageUrls = [];
    
    if (kamar?.gallery && Array.isArray(kamar.gallery) && kamar.gallery.length > 0) {
      imageUrls = kamar.gallery.map(img => getImageUrl(img)).filter(Boolean);
    }
    
    if (imageUrls.length === 0 && kamar?.kos?.gallery && Array.isArray(kamar.kos.gallery) && kamar.kos.gallery.length > 0) {
      imageUrls = kamar.kos.gallery.map(img => getImageUrl(img)).filter(Boolean);
    }
    
    if (imageUrls.length === 0) {
      imageUrls = [FALLBACK_IMAGE];
    }
    
    // If only 1 image, duplicate it to fill the grid (4 images total)
    if (imageUrls.length === 1) {
      imageUrls = Array(4).fill(imageUrls[0]);
    }
    
    return imageUrls;
  })();

  // Handle preview navigation
  const openPreview = (index) => {
    setSelectedImage(index);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPreviewOpen) return;
      
      if (e.key === 'Escape') closePreview();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen, images.length]);

  // Get display price
  const getDisplayPrice = () => {
    if (!kamar?.paket_harga) return { price: 'Harga belum tersedia', label: '' };

    const pricing = kamar.paket_harga;
    const duration = searchParams.get('duration');

    const prices = [
      { price: pricing.perharian_harga, label: '/hari', duration: '1-day' },
      { price: pricing.perbulan_harga, label: '/bulan', duration: '1-month' },
      { price: pricing.pertigabulan_harga, label: '/3 bulan', duration: '3-months' },
      { price: pricing.perenambulan_harga, label: '/6 bulan', duration: '6-months' },
      { price: pricing.pertahun_harga, label: '/tahun', duration: '1-year' },
    ].filter((p) => p.price !== null);

    if (prices.length === 0) return { price: 'Harga belum tersedia', label: '' };

    let targetPrice = prices[0];
    if (duration) {
      const foundPrice = prices.find((p) => p.duration === duration);
      if (foundPrice) targetPrice = foundPrice;
    }

    return {
      price: targetPrice.price?.toLocaleString('id-ID'),
      label: targetPrice.label,
    };
  };

  const displayPrice = getDisplayPrice();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Memuat detail kamar...</p>
        </div>
      </div>
    );
  }

  if (error || !kamar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error || 'Kamar tidak ditemukan'}</p>
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
          className="mb-4 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke hasil pencarian</span>
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <span className="text-indigo-600 font-semibold hover:underline cursor-pointer">
            {kamar.kos?.daerah?.nama || 'Lokasi'}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{kamar.kos?.nama || 'Kos'}</span>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {kamar.nama_kamar}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {kamar.jenis_kos && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
                <Users className="w-4 h-4" />
                {kamar.jenis_kos}
              </span>
            )}
            {kamar.tipe_kos?.nama && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                <Building className="w-4 h-4" />
                {kamar.tipe_kos.nama}
              </span>
            )}
            {kamar.lantai && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                <Layers className="w-4 h-4" />
                Lantai {kamar.lantai}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {/* Main large image - Left side */}
                <div 
                  className="relative h-[300px] md:h-[500px] cursor-pointer group"
                  onClick={() => openPreview(selectedImage)}
                >
                  <img
                    src={images[selectedImage]}
                    alt={kamar.nama_kamar}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                      <Maximize2 className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail grid - Right side (2x2 = 4 images) */}
                <div className="grid grid-cols-2 gap-2">
                  {images.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      className={`relative h-[145px] md:h-[246px] cursor-pointer rounded-xl overflow-hidden transition-all group ${
                        selectedImage === index ? 'ring-2 ring-indigo-500' : 'hover:opacity-80'
                      }`}
                      onClick={() => openPreview(index)}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      />
                      {index === 3 && images.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-bold text-lg">+{images.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kamar.jenis_kos && (
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Jenis Kos</p>
                  <p className="font-bold text-gray-900 text-sm">{kamar.jenis_kos}</p>
                </div>
              )}
              {kamar.tipe_kos?.nama && (
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                    <Building className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Tipe Kos</p>
                  <p className="font-bold text-gray-900 text-sm">{kamar.tipe_kos.nama}</p>
                </div>
              )}
              {kamar.lantai && (
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Lantai</p>
                  <p className="font-bold text-gray-900 text-sm">Lantai {kamar.lantai}</p>
                </div>
              )}
              {kamar.luas_kamar && (
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                    <Maximize2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Luas Kamar</p>
                  <p className="font-bold text-gray-900 text-sm">{kamar.luas_kamar} m²</p>
                </div>
              )}
            </div>

            {/* Description */}
            {kamar.keterangan && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Deskripsi</h2>
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: kamar.keterangan }}
                />
              </div>
            )}

            {/* Facilities */}
            {kamar.fasilitas && kamar.fasilitas.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Fasilitas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {kamar.fasilitas.map((fasilitas, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm">{fasilitas.nama || fasilitas}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Section */}
            <AvailabilitySection ketersediaan={kamar?.paket_harga?.ketersediaan} />

            {/* Location Section */}
            {(kamar.lokasi_kos || kamar.kos?.daerah?.nama || kosDetail?.link_maps || kamar.kos?.link_maps) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lokasi</h2>
                <p className="text-gray-600 text-sm flex items-start gap-2 mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span>{kamar.lokasi_kos || kosDetail?.alamat || kamar.kos?.daerah?.nama || 'Lokasi tidak tersedia'}</span>
                </p>
                
                {(kosDetail?.link_maps || kamar.kos?.link_maps) && (
                  <button
                    onClick={() => window.open(kosDetail?.link_maps || kamar.kos?.link_maps, '_blank')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <MapPin className="w-5 h-5" />
                    Buka di Google Maps
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden border border-gray-100">
              {/* Price Header */}
              <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 p-6 text-white">
                <p className="text-sm font-medium opacity-90 mb-2">Harga Sewa</p>
                {displayPrice.price !== 'Harga belum tersedia' ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">Rp {displayPrice.price}</span>
                    <span className="text-base font-medium opacity-90">{displayPrice.label}</span>
                  </div>
                ) : (
                  <p className="text-xl font-semibold">{displayPrice.price}</p>
                )}
              </div>

              <div className="p-6">
                {/* All Prices */}
                {kamar.paket_harga && (
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-900 mb-4">Paket Harga Lainnya</p>
                    <div className="space-y-3">
                      {kamar.paket_harga.perharian_harga && (
                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                          <span className="text-sm text-gray-600 font-medium">Per Hari</span>
                          <span className="font-bold text-gray-900">Rp {kamar.paket_harga.perharian_harga.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      {kamar.paket_harga.perbulan_harga && (
                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                          <span className="text-sm text-gray-600 font-medium">Per Bulan</span>
                          <span className="font-bold text-gray-900">Rp {kamar.paket_harga.perbulan_harga.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      {kamar.paket_harga.pertigabulan_harga && (
                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                          <span className="text-sm text-gray-600 font-medium">Per 3 Bulan</span>
                          <span className="font-bold text-gray-900">Rp {kamar.paket_harga.pertigabulan_harga.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      {kamar.paket_harga.perenambulan_harga && (
                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                          <span className="text-sm text-gray-600 font-medium">Per 6 Bulan</span>
                          <span className="font-bold text-gray-900">Rp {kamar.paket_harga.perenambulan_harga.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      {kamar.paket_harga.pertahun_harga && (
                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                          <span className="text-sm text-gray-600 font-medium">Per Tahun</span>
                          <span className="font-bold text-gray-900">Rp {kamar.paket_harga.pertahun_harga.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button 
                  onClick={handleBookingClick}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-4"
                >
                  Pesan Sekarang
                </button>

                {/* Info */}
                <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
                  <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                    Hubungi kami untuk informasi lebih lanjut dan ketersediaan kamar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closePreview}
            className="absolute top-4 right-4 z-[10000] bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 z-[10000] bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <img
              src={images[selectedImage]}
              alt={`${kamar.nama_kamar} - Image ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
            />
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 z-[10000] bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Booking Sheet (Mobile) */}
      <BookingSheet
        isOpen={isBookingSheetOpen}
        onClose={() => setIsBookingSheetOpen(false)}
        kamarData={kamar}
        kosData={kosDetail}
        initialCheckIn={searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')) : new Date()}
        initialDuration={searchParams.get('duration') || '1-month'}
      />

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onSuccess={handleDocumentUploadSuccess}
      />
    </div>
  );
};

export default KamarDetailPage;