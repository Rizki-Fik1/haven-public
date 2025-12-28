import { useState, useEffect } from 'react';
import PropertyCard from '../ui/PropertyCard';
import ErrorAlert from '../ui/ErrorAlert';
import { getFeaturedKos } from '../../services/kosService';

const PropertyListings = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numVisible, setNumVisible] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedKos(6);
        
        // Transform API data to match component structure
        // Note: API returns kamar (rooms) data, not kos data directly
        const transformedData = response.data?.map(kamar => {
          // Get image from kamar gallery, kos gallery, or use placeholder
          let imageUrl = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop';
          
          // Helper function to get image URL
          const getImageUrl = (img) => {
            if (!img) return null;
            if (typeof img === 'string') {
              return img.startsWith('http') ? img : `https://admin.haven.co.id/${img}`;
            }
            if (typeof img === 'object' && img.url) {
              return img.url.startsWith('http') ? img.url : `https://admin.haven.co.id/${img.url}`;
            }
            if (typeof img === 'object' && img.path) {
              return img.path.startsWith('http') ? img.path : `https://admin.haven.co.id/${img.path}`;
            }
            return null;
          };
          
          // Try to get image from various sources
          if (kamar.gallery && Array.isArray(kamar.gallery) && kamar.gallery.length > 0) {
            const img = getImageUrl(kamar.gallery[0]);
            if (img) imageUrl = img;
          } else if (kamar.kos?.gallery && Array.isArray(kamar.kos.gallery) && kamar.kos.gallery.length > 0) {
            const img = getImageUrl(kamar.kos.gallery[0]);
            if (img) imageUrl = img;
          }
          
          return {
            id: kamar.id,
            kosId: kamar.kos?.id || kosId,
            roomName: kamar.nama_kamar || 'Kamar',
            name: kamar.kos?.nama || 'Kos Tanpa Nama',
            location: kamar.lokasi_kos || kamar.kos?.daerah?.nama || 'Lokasi tidak tersedia',
            gender: kamar.jenis_kos || 'Campur',
            floor: kamar.lantai ? `Lantai ${kamar.lantai}` : 'Lantai 1',
            facilitiesCount: kamar.fasilitas ? `${kamar.fasilitas.length} fasilitas` : '0 fasilitas',
            images: [imageUrl],
            availability: {
              type: 'available',
              text: kamar.nama_kamar || 'Kamar tersedia'
            },
            amenities: (kamar.fasilitas || []).map(f => ({
              icon: '✓',
              label: f.nama || f
            })).slice(0, 5),
            originalPrice: kamar.paket_harga?.perbulan_harga ? kamar.paket_harga.perbulan_harga * 1.2 : 1800000,
            price: kamar.paket_harga?.perbulan_harga || 1500000
          };
        }) || [];
        
        setProperties(transformedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
        setError('Gagal memuat data properti. Silakan coba lagi.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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

  if (loading) {
    return (
      <section className="w-full py-16 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat properti...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-[36px] lg:text-[40px] font-light text-gray-600 leading-tight m-0 mb-3">
              come discover <br />
              <span className="font-bold text-gray-900">our best deals</span>
            </h2>
          </div>
          <ErrorAlert 
            message={error}
            onRetry={() => window.location.reload()}
            type="error"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 md:py-16 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left: Text Content */}
        <div className="text-center lg:text-left max-w-md w-full flex-shrink-0">
          <h2 className="text-3xl sm:text-4xl md:text-[36px] lg:text-[40px] font-light text-gray-600 leading-tight m-0 mb-3">
            come discover <br />
            <span className="font-bold text-gray-900">our best deals</span>
          </h2>
          <div className="w-10 h-0.5 bg-gray-400 my-3 mx-auto lg:mx-0"></div>
          <p className="text-gray-500 text-sm leading-relaxed m-0 mb-6">
            Browse our co-living spaces at special rates to find your ideal home in Indonesia
          </p>

          {/* Navigation Arrows */}
          {maxIndex > 0 && (
            <div className="flex justify-center lg:justify-start gap-3">
              <button
                className="w-11 h-11 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-200 text-gray-500 hover:bg-gray-200 hover:border-gray-400 active:scale-95"
                onClick={prevSlide}
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className="w-11 h-11 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-200 text-gray-500 hover:bg-gray-200 hover:border-gray-400 active:scale-95"
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
        <div className="w-full lg:w-auto flex justify-center">
          <div 
            className="overflow-hidden relative w-full"
            style={{
              width: isMobile ? '100%' : `${numVisible * cardWidth + (numVisible - 1) * gap}px`
            }}
          >
            <div 
              className="flex gap-0 md:gap-5 transition-transform duration-300 ease-in-out"
              style={{
                transform: isMobile 
                  ? `translateX(-${translateX}%)`
                  : `translateX(-${translateX}px)`
              }}
            >
              {properties.map((property) => (
                <div key={property.id} className="flex-shrink-0 w-full md:w-[280px]">
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
