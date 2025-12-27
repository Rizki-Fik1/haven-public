import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getKamarDetail, getKosDetail } from '../../services/kosService';

const BASE_URL = 'https://admin.haven.co.id';

const getFullImageUrl = (relativeUrl) => {
  if (!relativeUrl || relativeUrl.startsWith('http')) return relativeUrl;
  if (relativeUrl.startsWith('/storage')) return `${BASE_URL}${relativeUrl}`;
  return `${BASE_URL}/storage/${relativeUrl}`;
};

const ApartmentDetail = () => {
  const { kamarId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [kamarData, setKamarData] = useState(null);
  const [kosDetail, setKosDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const kosId = searchParams.get('kosId');

  // Extract booking information from search parameters
  const bookingInfo = {
    checkIn: searchParams.get('checkIn'),
    checkOut: searchParams.get('checkOut'),
    duration: searchParams.get('duration'),
    city: searchParams.get('city'),
    tipe: searchParams.get('tipe'),
    jenis: searchParams.get('jenis'),
  };

  // Fetch kamar detail
  useEffect(() => {
    const fetchData = async () => {
      if (!kosId || !kamarId) {
        setError('Invalid parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [kamarResponse, kosResponse] = await Promise.allSettled([
          getKamarDetail(parseInt(kosId), parseInt(kamarId)),
          getKosDetail(parseInt(kosId))
        ]);

        if (kamarResponse.status === 'fulfilled') {
          setKamarData(kamarResponse.value.data);
        }

        if (kosResponse.status === 'fulfilled') {
          setKosDetail(kosResponse.value.data);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching detail:', err);
        setError('Gagal memuat detail kamar');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kosId, kamarId]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return null;
    }
  };

  // Get duration label
  const getDurationLabel = (duration) => {
    const durationOptions = [
      { value: '1-day', label: '1 Hari' },
      { value: '1-month', label: '1 Bulan' },
      { value: '3-months', label: '3 Bulan' },
      { value: '6-months', label: '6 Bulan' },
      { value: '1-year', label: '1 Tahun' },
    ];
    return durationOptions.find((d) => d.value === duration)?.label || null;
  };

  // Get display price based on duration
  const getDisplayPrice = () => {
    if (!kamarData?.paket_harga) {
      return { price: 'Harga belum tersedia', period: '' };
    }

    const pricing = kamarData.paket_harga;
    const prices = [
      { price: pricing.perharian_harga, label: '/hari', duration: '1-day' },
      { price: pricing.perbulan_harga, label: '/bulan', duration: '1-month' },
      { price: pricing.pertigabulan_harga, label: '/3 bulan', duration: '3-months' },
      { price: pricing.perenambulan_harga, label: '/6 bulan', duration: '6-months' },
      { price: pricing.pertahun_harga, label: '/tahun', duration: '1-year' },
    ].filter((p) => p.price !== null);

    if (prices.length === 0) {
      return { price: 'Harga belum tersedia', period: '' };
    }

    let targetPrice = prices[0];
    if (bookingInfo.duration) {
      const foundPrice = prices.find((p) => p.duration === bookingInfo.duration);
      if (foundPrice) targetPrice = foundPrice;
    }

    return {
      price: targetPrice.price?.toLocaleString('id-ID') || '0',
      period: targetPrice.label,
    };
  };

  const displayPrice = getDisplayPrice();

  // Parse availability data (same as Next.js version)
  const getAvailabilityDates = () => {
    if (!kamarData?.paket_harga?.ketersediaan) return [];

    // New API response has ketersediaan as array already
    if (Array.isArray(kamarData.paket_harga.ketersediaan)) {
      return kamarData.paket_harga.ketersediaan;
    }

    // Fallback for legacy string format
    try {
      const availabilityData = JSON.parse(kamarData.paket_harga.ketersediaan);
      return Array.isArray(availabilityData) ? availabilityData : [];
    } catch (error) {
      console.warn('Failed to parse ketersediaan data:', error);
      return [];
    }
  };

  const availabilityDates = getAvailabilityDates();

  // Get images
  const images = kamarData?.gallery?.length > 0
    ? kamarData.gallery.map(img => getFullImageUrl(img.url))
    : [getFullImageUrl(kamarData?.foto_kamar) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'];

  // Handle booking
  const handleBooking = () => {
    let url = `/booking?kamarId=${kamarId}&kosId=${kosId}`;
    if (bookingInfo.checkIn) url += `&checkIn=${bookingInfo.checkIn}`;
    if (bookingInfo.checkOut) url += `&checkOut=${bookingInfo.checkOut}`;
    if (bookingInfo.duration) url += `&duration=${bookingInfo.duration}`;
    navigate(url);
  };

  // Navigate to other room
  const handleRoomClick = (roomKamarId) => {
    const params = new URLSearchParams(searchParams);
    navigate(`/apartment/${roomKamarId}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail kamar...</p>
        </div>
      </div>
    );
  }

  if (error || !kamarData) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Gagal memuat detail kamar'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const otherRooms = kosDetail?.kamar?.filter(k => k.id !== parseInt(kamarId)) || [];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-200">
        <img
          src={images[0]}
          alt={kamarData.nama_kamar}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          ← Kembali
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative h-24 cursor-pointer rounded-lg overflow-hidden ${
                  currentImageIndex === idx ? 'ring-2 ring-emerald-600' : ''
                }`}
              >
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {kamarData.nama_kamar}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {kamarData.kos?.daerah || kamarData.lokasi_kos}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {kamarData.jenis_kos}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Tipe</p>
                  <p className="font-medium">{kamarData.tipe_kos?.nama || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lantai</p>
                  <p className="font-medium">Lt {kamarData.lantai || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kos</p>
                  <p className="font-medium text-sm">{kamarData.kos?.nama || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {kamarData.deskripsi && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h3>
                <div
                  className="prose prose-gray max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: kamarData.deskripsi }}
                />
              </div>
            )}

            {/* Facilities */}
            {kamarData.fasilitas && kamarData.fasilitas.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Fasilitas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {kamarData.fasilitas.map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span className="text-gray-700">{facility.nama || facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {kamarData.kos?.link_maps && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lokasi</h3>
                <p className="text-gray-600 mb-4">{kamarData.kos?.alamat || kamarData.kos?.daerah}</p>
                <a
                  href={kamarData.kos.link_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Lihat di Google Maps
                </a>
              </div>
            )}

            {/* Other Rooms */}
            {otherRooms.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Kamar Lain di {kamarData.kos?.nama}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherRooms.slice(0, 4).map((room) => (
                    <div
                      key={room.id}
                      onClick={() => handleRoomClick(room.id)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-emerald-600 cursor-pointer transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">{room.nama_kamar}</h4>
                      <p className="text-sm text-gray-500 mb-2">Lantai {room.lantai}</p>
                      <p className="text-emerald-600 font-semibold">
                        Rp {(room.harga || room.paket_harga?.perbulan_harga || 0).toLocaleString('id-ID')}/bln
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-right mb-6">
                  <span className="text-sm text-gray-500">Mulai dari </span>
                  <div className="text-3xl font-bold text-gray-900">
                    Rp {displayPrice.price}
                  </div>
                  <span className="text-sm text-gray-500">{displayPrice.period}</span>
                </div>

                {/* Booking Information */}
                {(bookingInfo.checkIn || bookingInfo.checkOut || bookingInfo.duration) && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-3">Detail Booking</h3>
                    <div className="space-y-2 text-sm">
                      {bookingInfo.checkIn && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check In:</span>
                          <span className="font-medium">{formatDate(bookingInfo.checkIn)}</span>
                        </div>
                      )}
                      {bookingInfo.checkOut && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check Out:</span>
                          <span className="font-medium">{formatDate(bookingInfo.checkOut)}</span>
                        </div>
                      )}
                      {bookingInfo.duration && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Durasi:</span>
                          <span className="font-medium">{getDurationLabel(bookingInfo.duration)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Available Duration */}
                {kamarData.paket_harga && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-3">Durasi Tersedia</h3>
                    <div className="flex flex-wrap gap-2">
                      {kamarData.paket_harga.perharian_harga && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          Harian
                        </span>
                      )}
                      {kamarData.paket_harga.perbulan_harga && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          Bulanan
                        </span>
                      )}
                      {kamarData.paket_harga.pertigabulan_harga && (
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          3 Bulan
                        </span>
                      )}
                      {kamarData.paket_harga.perenambulan_harga && (
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          6 Bulan
                        </span>
                      )}
                      {kamarData.paket_harga.pertahun_harga && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          Tahunan
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg mb-3 transition-colors"
                >
                  Booking Sekarang
                </button>

                <button className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Chat Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetail;
