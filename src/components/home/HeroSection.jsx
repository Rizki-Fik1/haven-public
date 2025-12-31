import { useState, useEffect } from 'react';
import { getBanners } from '../../services/bannerService';
import { getImageUrl } from '../../lib/utils';
import ErrorAlert from '../ui/ErrorAlert';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await getBanners();
        
        // Filter only active banners and transform data
        const activeBanners = (response.data || [])
          .filter(banner => {
            const isActive = banner.is_active === 1 || 
                           banner.is_active === '1' || 
                           banner.is_active === true || 
                           banner.is_active === 'true';
            return isActive;
          })
          .map(banner => ({
            id: banner.id,
            title: banner.title,
            description: banner.description,
            image: getImageUrl(banner.image, 'banners')
          }));
        
        setBanners(activeBanners);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch banners:', err);
        
        // Use fallback banners if API fails
        const fallbackBanners = [
          {
            id: 1,
            title: 'Welcome to Haven',
            description: 'Find your perfect co-living space',
            image: '/images/banner1.jpg'
          },
          {
            id: 2,
            title: 'Modern Living',
            description: 'Experience comfort and community',
            image: '/images/banner2.jpg'
          }
        ];
        
        setBanners(fallbackBanners);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-slide setiap 5 detik
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] md:min-h-[450px] md:h-[60vh] sm:min-h-[350px] sm:h-[50vh] xs:min-h-[300px] xs:h-[45vh] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat banner...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] md:min-h-[450px] md:h-[60vh] sm:min-h-[350px] sm:h-[50vh] xs:min-h-[300px] xs:h-[45vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <ErrorAlert 
            message={error}
            onRetry={() => window.location.reload()}
            type="error"
          />
        </div>
      </section>
    );
  }

  // No banners available
  if (banners.length === 0) {
    return (
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] md:min-h-[450px] md:h-[60vh] sm:min-h-[350px] sm:h-[50vh] xs:min-h-[300px] xs:h-[45vh] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Haven</h1>
          <p className="text-xl md:text-2xl">Find your perfect co-living space</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] md:min-h-[450px] md:h-[60vh] sm:min-h-[350px] sm:h-[50vh] xs:min-h-[300px] xs:h-[45vh] flex items-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100 z-[1]' 
                : 'opacity-0 scale-110'
            }`}
          >
            {/* Use img tag instead of background-image for better error handling */}
            <img
              src={banner.image}
              alt={banner.title || 'Banner'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }}
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        className="absolute top-1/2 -translate-y-1/2 left-8 md:left-4 z-[3] w-14 h-14 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-lg border-2 border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 text-white hover:bg-white/30 hover:border-white hover:scale-110" 
        onClick={handlePrevSlide}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button 
        className="absolute top-1/2 -translate-y-1/2 right-8 md:right-4 z-[3] w-14 h-14 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-lg border-2 border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 text-white hover:bg-white/30 hover:border-white hover:scale-110" 
        onClick={handleNextSlide}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 md:bottom-5 left-1/2 -translate-x-1/2 z-[3] flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`h-3 rounded-full border-none cursor-pointer transition-all duration-300 p-0 hover:bg-white/60 hover:scale-110 ${
              index === currentSlide 
                ? 'w-9 bg-white rounded-md' 
                : 'w-3 bg-white/40'
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;