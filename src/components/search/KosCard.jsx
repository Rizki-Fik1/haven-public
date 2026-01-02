import { memo, useMemo } from 'react';
import { MapPin } from 'lucide-react';

const BASE_URL = 'https://admin.haven.co.id';
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

const KosCard = memo(({ kos, onClick }) => {
  const handleMapClick = (e) => {
    e.stopPropagation();
    if (kos.link_maps) {
      window.open(kos.link_maps, '_blank');
    }
  };

  const imageUrl = useMemo(() => {
    if (kos.gallery && Array.isArray(kos.gallery) && kos.gallery.length > 0) {
      const img = getImageUrl(kos.gallery[0]);
      if (img) return img;
    }
    return FALLBACK_IMAGE;
  }, [kos.gallery]);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-200">
        <img
          src={imageUrl}
          alt={kos.nama || 'Kos image'}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />
        {kos.link_maps && (
          <button
            onClick={handleMapClick}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md transition-colors flex items-center gap-1"
          >
            <MapPin className="h-4 w-4" />
            Maps
          </button>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {kos.nama}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {kos.alamat_kota || kos.daerah?.nama}
        </p>
        {kos.keterangan && (
          <p
            className="text-xs text-gray-500 mb-4 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: kos.keterangan }}
          />
        )}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Lihat Kamar
        </button>
      </div>
    </div>
  );
});

KosCard.displayName = 'KosCard';

export default KosCard;
