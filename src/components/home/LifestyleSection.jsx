const LifestyleSection = () => {
  // Data lokasi - nanti bisa diganti dengan API call
  const locations = [
    {
      id: 1,
      nama: 'Jakarta Selatan',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      nama: 'Bandung',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      nama: 'Tangerang',
      image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      nama: 'Bekasi',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=400&fit=crop'
    }
  ];

  const handleCardClick = (location) => {
    console.log('Navigate to:', location.nama);
    // TODO: Add navigation to city page
    // navigate(`/city?daerah=${encodeURIComponent(location.nama)}`);
  };

  return (
    <section className="w-full bg-[#fff9f2] py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-12">
        
        {/* Heading - Order 1 on mobile, Order 2 on desktop (right side) */}
        <div className="text-center lg:text-left order-1 lg:order-2 lg:col-span-2">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] leading-tight m-0 mb-2">
            <span className="font-light text-gray-600">the right</span>
            <br />
            <span className="font-normal text-gray-600">match</span>
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-[36px] lg:text-[40px] font-extrabold text-gray-900 leading-tight m-0">
            for your
            <br />
            lifestyle
          </h3>
        </div>

        {/* Cards Grid - Order 2 on mobile, Order 1 on desktop (left side, 10 cols) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 order-2 lg:order-1 lg:col-span-10">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-[#fff2e0] rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1"
              onClick={() => handleCardClick(location)}
            >
              <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-3 sm:mb-4 rounded-xl overflow-hidden">
                <img
                  src={location.image}
                  alt={location.nama}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 m-0">{location.nama}</h4>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LifestyleSection;
