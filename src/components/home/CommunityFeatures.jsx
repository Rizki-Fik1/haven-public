import { useState, useEffect } from 'react';
import communityImage from '../../assets/images/image.png';
import { getFasilitas } from '../../services/fasilitasService';

const BASE_URL = 'https://admin.haven.co.id';

const CommunityFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFasilitas = async () => {
      try {
        setLoading(true);
        const response = await getFasilitas();
        
        let fasilitasData = null;
        
        if (Array.isArray(response)) {
          fasilitasData = response;
        } else if (response.data && Array.isArray(response.data)) {
          fasilitasData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          fasilitasData = response.data.data;
        }
        
        if (Array.isArray(fasilitasData) && fasilitasData.length > 0) {
          const transformedFeatures = fasilitasData.slice(0, 6).map(fasilitas => ({
            label: fasilitas.nama || 'Fasilitas'
          }));
          
          setFeatures(transformedFeatures);
        } else {
          setFeatures([]);
        }
      } catch (error) {
        console.error('Failed to fetch fasilitas:', error);
        setFeatures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFasilitas();
  }, []);

  return (
    <section className="w-full py-12 md:py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Left Text */}
        <div className="order-1 lg:col-span-1">
          <h2 className="text-gray-600 text-2xl sm:text-3xl md:text-[28px] lg:text-[32px] font-light leading-tight m-0 mb-3">
            join the <br className="sm:hidden" /> community at
          </h2>
          <h1 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold leading-tight m-0">
            Indonesia&apos;s <br className="hidden md:block lg:hidden" />
            <span className="block">most hyped</span>
            <span className="block">co-living</span>
          </h1>
        </div>

        {/* Right Image - Order 2 on mobile, 3 on tablet */}
        <div className="order-2 md:order-3 lg:order-3 lg:col-span-1 relative">
          <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-tr-[60px] rounded-bl-[60px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <img
              src={communityImage}
              alt="Co-living community"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>

        {/* Middle Features List - Order 3 on mobile, 2 on tablet */}
        <div className="order-3 md:order-2 lg:order-2 lg:col-span-1 flex flex-col gap-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            </div>
          ) : (
            features.map((item, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4">
                <div className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 mt-0.5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-600 text-base sm:text-lg leading-relaxed">{item.label}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default CommunityFeatures;
