import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Layers, Users } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Placeholder images - replace with actual gallery
  const images = property.images || [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleViewRoom = () => {
    // Navigate to kamar detail page
    // Assuming property has kosId and kamarId (id)
    if (property.kosId && property.id) {
      navigate(`/getKamar/${property.kosId}/kamar/${property.id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="relative">
        {/* Availability Badge */}
        {property.availability && (
          <span className="absolute top-3 left-3 z-10 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
            Tersedia
          </span>
        )}

        {/* Image Carousel */}
        <div className="relative h-48 bg-gray-200">
          <img 
            src={images[currentImageIndex]} 
            alt={property.name}
            className="w-full h-full object-cover"
          />
          
          {images.length > 1 && (
            <>
              <button className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/50 border-none w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 z-[2] hover:bg-black/70" onClick={prevImage}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/50 border-none w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 z-[2] hover:bg-black/70" onClick={nextImage}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Room Name (Nama Kamar) */}
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {property.roomName || property.name}
        </h3>
        
        {/* Kos Name (Nama Kos) */}
        {property.roomName && (
          <p className="text-sm font-medium text-gray-700 mb-1">{property.name}</p>
        )}

        {/* Location */}
        {property.location && (
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="w-3 h-3" />
            <span>{property.location}</span>
          </div>
        )}

        {/* Amenities */}
        <div className="space-y-2 mb-4">
          {property.gender && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Home className="w-3 h-3" />
              <span>{property.gender}</span>
            </div>
          )}
          {property.floor && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Layers className="w-3 h-3" />
              <span>{property.floor}</span>
            </div>
          )}
          {property.facilitiesCount && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Users className="w-3 h-3" />
              <span>{property.facilitiesCount}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="text-center mb-4">
          {property.originalPrice && (
            <div className="text-xs text-gray-400 line-through mb-1">
              IDR {property.originalPrice.toLocaleString('id-ID')}
            </div>
          )}
          <div>
            <span className="text-xs text-gray-500">IDR </span>
            <span className="text-lg font-bold text-gray-900">{property.price.toLocaleString('id-ID')}</span>
            <span className="text-xs text-gray-500">/bulan</span>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleViewRoom}
          className="w-full bg-green-600 hover:bg-green-800 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
        >
          Lihat Kamar
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
