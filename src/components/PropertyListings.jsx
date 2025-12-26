import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import './PropertyListings.css';

const PropertyListings = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numVisible, setNumVisible] = useState(1);

  // Placeholder data - replace with API call later
  const properties = [
    {
      id: 1,
      name: 'Cove Tanavila Living',
      location: 'Karawaci',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
      ],
      availability: {
        type: 'available',
        text: 'available'
      },
      plan: 'basics',
      deal: {
        discount: 'up to 20% off',
        limited: 'limited rooms'
      },
      amenities: [
        { icon: '🚆', label: '16 mins to train' },
        { icon: '📶', label: 'shariah' },
        { icon: '👔', label: 'professionals' },
        { icon: '🚹', label: 'male only' },
        { icon: '🏠', label: 'kost' }
      ],
      originalPrice: 1900000,
      price: 1500000
    },
    {
      id: 2,
      name: 'Cove Ashwood',
      location: 'Karawaci',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'
      ],
      availability: {
        type: 'limited',
        text: 'only 1 unit left'
      },
      plan: 'classics',
      deal: {
        discount: 'up to 20% off',
        limited: 'limited rooms'
      },
      amenities: [
        { icon: '🚆', label: '9 mins to bus' },
        { icon: '📶', label: 'shariah' },
        { icon: '👨‍🎓', label: 'students' },
        { icon: '🚹', label: 'male only' },
        { icon: '🏠', label: 'kost' }
      ],
      originalPrice: 1900000,
      price: 1700000
    },
    {
      id: 3,
      name: 'Cove Aora',
      location: 'Meruya',
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop'
      ],
      availability: {
        type: 'available',
        text: '4 units available'
      },
      plan: 'classics',
      deal: {
        discount: 'up to 20% off',
        limited: 'limited rooms'
      },
      amenities: [
        { icon: '🚆', label: '5 mins to bus' },
        { icon: '🏢', label: 'umb' },
        { icon: '👔', label: 'professionals' },
        { icon: '🏠', label: 'kost' }
      ],
      originalPrice: 2000000,
      price: 1700000
    },
    {
      id: 4,
      name: 'Cove Premium Suite',
      location: 'Tangerang',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'
      ],
      availability: {
        type: 'limited',
        text: 'only 2 units left'
      },
      plan: 'classics',
      deal: {
        discount: 'up to 25% off',
        limited: 'limited rooms'
      },
      amenities: [
        { icon: '🚆', label: '10 mins to train' },
        { icon: '👔', label: 'professionals' },
        { icon: '🚹', label: 'male only' },
        { icon: '🏠', label: 'kost' }
      ],
      originalPrice: 2200000,
      price: 1650000
    },
    {
      id: 5,
      name: 'Cove Downtown',
      location: 'Jakarta',
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'
      ],
      availability: {
        type: 'available',
        text: '3 units available'
      },
      plan: 'basics',
      deal: {
        discount: 'up to 15% off',
        limited: 'limited rooms'
      },
      amenities: [
        { icon: '🚆', label: '5 mins to train' },
        { icon: '👔', label: 'professionals' },
        { icon: '🏠', label: 'kost' }
      ],
      originalPrice: 1800000,
      price: 1530000
    },
    {
      id: 6,
      name: 'Cove Urban Living',
      location: 'Bekasi',
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop'
      ],
      availability: {
        type: 'available',
        text: 'available'
      },
      plan: 'classics',
      deal: {
        discount: 'up to 20% off',
        limited: 'limited rooms'
      },
      amenities: [
        { icon: '🚆', label: '12 mins to bus' },
        { icon: '👨‍🎓', label: 'students' },
        { icon: '🏠', label: 'kost' }
      ],
      originalPrice: 1600000,
      price: 1280000
    }
  ];

  // Responsive numVisible based on screen width
  useEffect(() => {
    const updateNumVisible = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setNumVisible(3);
      } else if (width >= 1024) {
        setNumVisible(2);
      } else if (width >= 768) {
        setNumVisible(2);
      } else {
        setNumVisible(1);
      }
    };

    updateNumVisible();
    window.addEventListener('resize', updateNumVisible);
    return () => window.removeEventListener('resize', updateNumVisible);
  }, []);

  // Reset currentIndex if it exceeds bounds
  useEffect(() => {
    const maxIndex = Math.max(0, properties.length - numVisible);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [numVisible, currentIndex, properties.length]);

  const maxIndex = Math.max(0, properties.length - numVisible);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Calculate card width and gap
  const cardWidth = 280;
  const gap = 20;
  const isMobile = numVisible === 1;
  const translateX = isMobile 
    ? currentIndex * 100
    : currentIndex * (cardWidth + gap);

  return (
    <section className="property-listings-section">
      <div className="property-listings-container">
        
        {/* Left: Text Content */}
        <div className="listings-text-content">
          <h2 className="listings-title">
            come discover <br />
            <span className="listings-title-bold">our best deals</span>
          </h2>
          <div className="listings-divider"></div>
          <p className="listings-description">
            Browse our co-living spaces at special rates to find your ideal home in Indonesia
          </p>

          {/* Navigation Arrows */}
          {maxIndex > 0 && (
            <div className="listings-controls">
              <button
                className="listings-arrow"
                onClick={prevSlide}
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className="listings-arrow"
                onClick={nextSlide}
                aria-label="Next"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Right: Carousel */}
        <div className="listings-carousel-wrapper">
          <div 
            className="listings-carousel-viewport"
            style={{
              width: isMobile ? '100%' : `${numVisible * cardWidth + (numVisible - 1) * gap}px`
            }}
          >
            <div 
              className="listings-carousel-track"
              style={{
                transform: isMobile 
                  ? `translateX(-${translateX}%)`
                  : `translateX(-${translateX}px)`
              }}
            >
              {properties.map((property) => (
                <div key={property.id} className="listings-card-wrapper">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PropertyListings;
