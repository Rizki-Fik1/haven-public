import React, { useState, useEffect } from 'react';
import './FeaturedProperties.css';

const FeaturedProperties = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numVisible, setNumVisible] = useState(1);

  // Placeholder data - replace with API call later
  const properties = [
    {
      id: 1,
      name: 'Modern Living Space',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Cozy Urban Studio',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Bright City Room',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'Stylish Co-Living',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'Premium Suite',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'Downtown Apartment',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop'
    }
  ];

  // Responsive numVisible based on screen width
  useEffect(() => {
    const updateNumVisible = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setNumVisible(3);
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

  // Calculate transform based on screen size
  const isMobile = numVisible === 1;
  const itemWidth = 300;
  const gap = 24;
  const translateX = isMobile 
    ? currentIndex * 100
    : currentIndex * (itemWidth + gap);

  return (
    <section className="featured-properties-section">
      <div className="featured-properties-container">
        
        {/* Left: Carousel */}
        <div className="carousel-wrapper">
          <div 
            className="carousel-viewport"
            style={{
              width: isMobile ? '100%' : `${numVisible * itemWidth + (numVisible - 1) * gap}px`
            }}
          >
            <div 
              className="carousel-track"
              style={{
                transform: isMobile 
                  ? `translateX(-${translateX}%)`
                  : `translateX(-${translateX}px)`
              }}
            >
              {properties.map((property) => (
                <div key={property.id} className="property-card">
                  <div className="property-image-wrapper">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="property-image"
                    />
                  </div>
                  <h3 className="property-name">{property.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Static Text */}
        <div className="featured-text-content">
          <h2 className="featured-title">
            love where <br />
            <span className="featured-title-bold">you live</span>
          </h2>
          <div className="featured-divider"></div>
          <p className="featured-description">
            Discover our carefully curated selection of award-winning co-living spaces
          </p>

          {/* Navigation Arrows */}
          {maxIndex > 0 && (
            <div className="carousel-controls">
              <button
                className="carousel-arrow"
                onClick={prevSlide}
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className="carousel-arrow"
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

      </div>
    </section>
  );
};

export default FeaturedProperties;
