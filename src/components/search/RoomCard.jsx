import { memo, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Home, Building, Layers, Users } from 'lucide-react';
import { getBackendUrl } from '../../lib/utils';

const BASE_URL = getBackendUrl();
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';

// Helper function to get image URL
const getImageUrl = (img) => {
  if (!img) return null;
  
  if (typeof img === 'string') {
    if (img.startsWith('http')) return img;
    if (img.startsWith('/storage')) return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  }
  
  if (typeof img === 'object' && img.url) {
    if (img.url.startsWith('http')) return img.url;
    if (img.url.startsWith('/storage')) return `${BASE_URL}${img.url}`;
    return `${BASE_URL}/${img.url}`;
  }
  
  return null;
};

const RoomCard = memo(({ kamar, kosId, kosName, kosLocation }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const imageUrl = useMemo(() => {
    if (kamar.gallery && Array.isArray(kamar.gallery) && kamar.gallery.length > 0) {
      const img = getImageUrl(kamar.gallery[0]);
      if (img) return img;
    }
    if (kamar.kos?.gallery && Array.isArray(kamar.kos.gallery) && kamar.kos.gallery.length > 0) {
      const img = getImageUrl(kamar.kos.gallery[0]);
      if (img) return img;
    }
    return FALLBACK_IMAGE;
  }, [kamar]);

  // Get display price based on duration parameter
  const getDisplayPrice = () => {
    if (!kamar.paket_harga) return { price: 'Harga belum tersedia', label: '' };

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
      price: Number(targetPrice.price)?.toLocaleString('id-ID'),
      label: targetPrice.label,
    };
  };

  const displayPrice = getDisplayPrice();

  // Generate amenities
  const amenities = [
    ...(kamar.jenis_kos ? [{ icon: Home, text: kamar.jenis_kos }] : []),
    ...(kamar.tipe_kos?.nama ? [{ icon: Building, text: kamar.tipe_kos.nama }] : []),
    ...(kamar.lantai ? [{ icon: Layers, text: `Lantai ${kamar.lantai}` }] : []),
    ...(kamar.fasilitas?.length > 0 ? [{ icon: Users, text: `${kamar.fasilitas.length} fasilitas` }] : []),
  ];

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    navigate(`/getKamar/${kosId}/kamar/${kamar.id}?${params.toString()}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative">
        <span className="absolute top-3 left-3 z-10 bg-green-700 text-white text-xs font-medium px-2 py-1 rounded">
          Tersedia
        </span>
        <div className="relative h-48 bg-gray-200">
          <img
            src={imageUrl}
            alt={kamar.nama_kamar || 'Kamar'}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {kamar.nama_kamar}
        </h3>
        {kosName && <p className="text-sm font-medium text-gray-700 mb-1">{kosName}</p>}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3 h-3" />
          <span>{kamar.lokasi_kos || kosLocation}</span>
        </div>

        {/* Amenities */}
        <div className="space-y-2 mb-4">
          {amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
              <amenity.icon className="w-3 h-3" />
              <span>{amenity.text}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="text-center mb-4">
          {displayPrice.price !== 'Harga belum tersedia' ? (
            <>
              <span className="text-xs text-gray-500">IDR </span>
              <span className="text-lg font-bold text-gray-900">{displayPrice.price}</span>
              <span className="text-xs text-gray-500">{displayPrice.label}</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">{displayPrice.price}</span>
          )}
        </div>

        {/* CTA Button */}
        <button className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-lg transition-colors">
          Lihat Detail Kamar
        </button>
      </div>
    </div>
  );
});

RoomCard.displayName = 'RoomCard';

export default RoomCard;

