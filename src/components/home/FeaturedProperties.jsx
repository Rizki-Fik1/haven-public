import { useState, useEffect } from 'react';
import { getKosList } from '../../services/kosService';

const FeaturedProperties = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numVisible, setNumVisible] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback dummy data
  const fallbackProperties = [
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

  // Fetch kos data from API
  useEffect(() => {
    const fetchKos = async () => {
      try {
        setLoading(true);
        const response = await getKosList(6);
        
        // Transform API data
        const transformedData = (response.data || []).map(kos => {
          // Get image URL
          let imageUrl = fallbackProperties[0].image;
          if (kos.image && Array.isArray(kos.image) && kos.image.length > 0) {
            const img = kos.image[0];
            if (typeof img === 'object' && img.url) {
              imageUrl = img.url.startsWith('http') 
                ? img.url 
                : `https://admin.haven.co.id/${img.url}`;
            } else if (typeof img === 'string') {
              imageUrl = img.startsWith('http') 
                ? img 
                : `https://admin.haven.co.id/${img}`;
            }
          }
          
          return {
            id: kos.id,
            name: kos.nama || 'Kos',
            image: imageUrl
          };
        });
        
        setProperties(transformedData);
      } catch (err) {
        if (!err.isNotFound) {
          console.error('Failed to fetch kos:', err);
        }
        setProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchKos();
  }, []);

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

  if (loading) {
    return (
      <section className="w-full bg-[#FFF8F0] py-12 md:py-12 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#FFF8F0] py-12 md:py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left: Carousel */}
        <div className="w-full lg:w-auto flex justify-center">
          <div 
            className="overflow-hidden relative w-full"
            style={{
              width: isMobile ? '100%' : `${numVisible * itemWidth + (numVisible - 1) * gap}px`
            }}
          >
            <div 
              className="flex gap-0 md:gap-6 transition-transform duration-300 ease-in-out"
              style={{
                transform: isMobile 
                  ? `translateX(-${translateX}%)`
                  : `translateX(-${translateX}px)`
              }}
            >
              {properties.map((property) => (
                <div key={property.id} className="flex-shrink-0 w-full md:w-[300px]">
                  <div className="rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-[200px] object-cover block"
                    />
                  </div>
                  <h3 className="mt-3 px-0 md:px-0 text-base font-semibold text-gray-900">{property.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Static Text */}
        <div className="text-center lg:text-left max-w-md w-full">
          <h2 className="text-3xl sm:text-4xl md:text-[36px] lg:text-[40px] font-light text-gray-600 leading-tight m-0 mb-3">
            love where <br />
            <span className="font-bold text-gray-900">you live</span>
          </h2>
          <div className="w-10 h-0.5 bg-gray-400 my-3 mx-auto lg:mx-0"></div>
          <p className="text-gray-500 text-sm leading-relaxed m-0 mb-6">
            Discover our carefully curated selection of award-winning co-living spaces
          </p>

          {/* Navigation Arrows */}
          {maxIndex > 0 && (
            <div className="flex justify-center lg:justify-start gap-3">
              <button
                className="w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:border-gray-400 active:scale-95"
                onClick={prevSlide}
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className="w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:border-gray-400 active:scale-95"
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
