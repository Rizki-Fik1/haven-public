const ServiceSection = () => {
  const benefits = [
    'Konsultasi Gratis',
    'Bersertifikat',
    'Layanan Terbaik',
    'Tempat Idaman'
  ];

  return (
    <section className="w-full px-6 py-16 md:py-20 lg:py-24 bg-gradient-to-br from-blue-900 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <p className="text-blue-300 uppercase tracking-wider text-[13px] font-semibold m-0">
              KENAPA HARUS GUNAKAN LAYANAN KAMI
            </p>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight m-0 text-white">
              Kami Memberikan Hasil Layanan Terbaik Untuk Penginapan Anda
            </h2>

            {/* Image with Play Button */}
            <div className="relative w-full max-w-md rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop" 
                alt="Resort view" 
                className="w-full h-auto block rounded-xl"
              />
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0">
                <div className="bg-white/20 backdrop-blur-md rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/30 hover:scale-110">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M10 8L24 16L10 24V8Z" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Features List */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 rounded-full p-1.5 flex-shrink-0 mt-1 text-white flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold m-0 mb-1 text-white">Garansi Layanan</h3>
                  <p className="text-sm text-blue-200 m-0">Mendapatkan keamanan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600 rounded-full p-1.5 flex-shrink-0 mt-1 text-white flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold m-0 mb-1 text-white">List Apartemen Terbaik</h3>
                  <p className="text-sm text-blue-200 m-0">Apartemen terbaik di Indonesia</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600 rounded-full p-1.5 flex-shrink-0 mt-1 text-white flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold m-0 mb-1 text-white">Gratis Konsultasi</h3>
                  <p className="text-sm text-blue-200 m-0">Tersedia konsultasi terbaik</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20">
            <div className="text-7xl text-blue-300 leading-none mb-4 font-serif">"</div>
            
            <blockquote className="text-lg sm:text-xl font-medium m-0 mb-4 leading-relaxed text-white">
              Lorem ipsum dolor sit amet consectetur adipiscing elit.
            </blockquote>
            
            <p className="text-sm text-blue-200 leading-relaxed m-0 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>

            <div className="flex flex-col gap-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-blue-300 flex-shrink-0">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  <span className="text-sm text-white">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
