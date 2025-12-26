import React, { useState } from 'react';
import './PropertyCard.css';

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
    <div className="property-card-item">
      {/* Availability Badge */}
      {property.availability && (
        <div className={`availability-badge ${property.availability.type}`}>
          {property.availability.text}
        </div>
      )}

      {/* Image Carousel */}
      <div className="property-image-section">
        <img 
          src={images[currentImageIndex]} 
          alt={property.name}
          className="property-main-image"
        />
        
        {images.length > 1 && (
          <>
            <button className="image-nav prev" onClick={prevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="image-nav next" onClick={nextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {/* Deal Badges */}
        {property.deal && (
          <div className="deal-badges">
            <span className={`badge-plan ${property.plan}`}>{property.plan}</span>
            {property.deal.discount && (
              <span className="badge-discount">{property.deal.discount}</span>
            )}
            {property.deal.limited && (
              <span className="badge-limited">{property.deal.limited}</span>
            )}
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="property-info">
        <h3 className="property-title">{property.name}</h3>
        <p className="property-location">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 7C7.55 7 8 6.55 8 6C8 5.45 7.55 5 7 5C6.45 5 6 5.45 6 6C6 6.55 6.45 7 7 7Z" fill="#6B7280"/>
            <path d="M7 12C7 12 10 9 10 6C10 4.34 8.66 3 7 3C5.34 3 4 4.34 4 6C4 9 7 12 7 12Z" stroke="#6B7280" strokeWidth="1.2"/>
          </svg>
          {property.location}
        </p>

        {/* Amenities */}
        {property.amenities && (
          <div className="property-amenities">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="amenity-item" title={amenity.label}>
                <span className="amenity-icon">{amenity.icon}</span>
                <span className="amenity-label">{amenity.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="property-pricing">
          {property.originalPrice && (
            <span className="price-original">IDR {property.originalPrice.toLocaleString()}</span>
          )}
          <div className="price-current">
            <span className="price-amount">IDR {property.price.toLocaleString()}</span>
            <span className="price-period">/month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
