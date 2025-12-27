const PropertyCard = ({ property }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';

  const handleViewRooms = () => {
    // TODO: Navigate to room detail page
    console.log('View rooms for kos:', property.id);
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  // Get image with fallback
  const imageUrl = property.gambar?.[0] || fallbackImage;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 bg-gray-200">
        <img
          src={imageUrl}
          alt={property.nama}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.target.src = fallbackImage;
          }}
        />
        {property.tipe && (
          <div className="absolute top-4 right-4">
            <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
              {property.tipe}
            </span>
          </div>
        )}
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

        {/* Description */}
        {property.keterangan && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {stripHtml(property.keterangan)}
          </p>
        )}

        {/* Facilities */}
        {property.fasilitas && property.fasilitas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {property.fasilitas.map((facility, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {facility}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleViewRooms}
            className="w-full bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Lihat Kamar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
