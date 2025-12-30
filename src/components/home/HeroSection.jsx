import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Array gambar banner - menggunakan gambar lokal
  const banners = [
    {
      id: 1,
      image: '/images/banner1.png'
    },
    {
      id: 2,
      image: '/images/banner2.png'
    }
  ];

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

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] md:min-h-[450px] md:h-[60vh] sm:min-h-[350px] sm:h-[50vh] xs:min-h-[300px] xs:h-[45vh] flex items-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100 z-[1]' 
                : 'opacity-0 scale-110'
            }`}
            style={{ backgroundImage: `url(${banner.image})` }}
          >
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
