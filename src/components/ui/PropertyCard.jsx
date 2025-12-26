import { useState } from 'react';

const PropertyCard = ({ property }) => {
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

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
      {/* Availability Badge */}
      {property.availability && (
        <div className={`absolute top-3 left-3 z-[2] py-1.5 px-3 rounded-md text-[11px] font-semibold lowercase ${
          property.availability.type === 'available' 
            ? 'bg-emerald-500 text-white' 
            : property.availability.type === 'limited'
            ? 'bg-amber-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          {property.availability.text}
        </div>
      )}

      {/* Image Carousel */}
      <div className="relative w-full h-[220px] sm:h-[180px] overflow-hidden">
        <img 
          src={images[currentImageIndex]} 
          alt={property.name}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/50 border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 z-[2] hover:bg-black/70" onClick={prevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/50 border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 z-[2] hover:bg-black/70" onClick={nextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {/* Deal Badges */}
        {property.deal && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-[2]">
            <span className={`py-1 px-2.5 rounded text-[11px] font-semibold lowercase ${
              property.plan === 'basics' 
                ? 'bg-indigo-100 text-indigo-800' 
                : property.plan === 'classics'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-white text-gray-900'
            }`}>{property.plan}</span>
            {property.deal.discount && (
              <span className="py-1 px-2.5 rounded text-[11px] font-semibold lowercase bg-amber-100 text-amber-900">{property.deal.discount}</span>
            )}
            {property.deal.limited && (
              <span className="py-1 px-2.5 rounded text-[11px] font-semibold lowercase bg-red-100 text-red-900">{property.deal.limited}</span>
            )}
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="p-4">
        <h3 className="text-base sm:text-sm font-semibold text-gray-900 m-0 mb-2 leading-snug line-clamp-2 overflow-hidden">
          {property.name}
        </h3>
        <p className="flex items-center gap-1 text-[13px] text-gray-500 m-0 mb-3">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 7C7.55 7 8 6.55 8 6C8 5.45 7.55 5 7 5C6.45 5 6 5.45 6 6C6 6.55 6.45 7 7 7Z" fill="#6B7280"/>
            <path d="M7 12C7 12 10 9 10 6C10 4.34 8.66 3 7 3C5.34 3 4 4.34 4 6C4 9 7 12 7 12Z" stroke="#6B7280" strokeWidth="1.2"/>
          </svg>
          {property.location}
        </p>

        {/* Amenities */}
        {property.amenities && (
          <div className="flex flex-wrap gap-2 mb-3">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 py-1 px-2 rounded" title={amenity.label}>
                <span className="text-sm">{amenity.icon}</span>
                <span className="whitespace-nowrap">{amenity.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="flex flex-col gap-1">
          {property.originalPrice && (
            <span className="text-xs text-gray-400 line-through">IDR {property.originalPrice.toLocaleString()}</span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-base font-bold text-red-600">IDR {property.price.toLocaleString()}</span>
            <span className="text-xs text-gray-500">/month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
