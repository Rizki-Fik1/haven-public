const CommunityFeatures = () => {
  const features = [
    { icon: '/icons/sofa.svg', label: 'fully furnished' },
    { icon: '/icons/spray.svg', label: 'housekeeping' },
    { icon: '/icons/paper.svg', label: 'flexible contracts' },
    { icon: '/icons/wifi.svg', label: 'super fast wifi' },
    { icon: '/icons/maintenance.svg', label: 'maintenance' },
    { icon: '/icons/events.svg', label: 'events & perks' },
  ];

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
          <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-tr-[60px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <img
              src="/src/assets/images/image.png"
              alt="Co-living community"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>

        {/* Middle Features List - Order 3 on mobile, 2 on tablet */}
        <div className="order-3 md:order-2 lg:order-2 lg:col-span-1 flex flex-col gap-4">
          {features.map((item, index) => (
            <div key={index} className="flex items-start gap-3 sm:gap-4">
              <img 
                src={item.icon} 
                alt={item.label}
                className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 mt-0.5 object-contain"
              />
              <span className="text-gray-600 text-base sm:text-lg leading-relaxed">{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CommunityFeatures;
