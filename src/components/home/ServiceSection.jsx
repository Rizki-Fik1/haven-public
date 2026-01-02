const ServiceSection = () => {
  const benefits = [
    'Konsultasi Gratis',
    'Properti Terverifikasi',
    'Proses Cepat & Mudah',
    'Harga Transparan'
  ];

  return (
    <section className="w-full px-6 py-16 md:py-20 lg:py-24 bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <p className="text-green-200 uppercase tracking-wider text-[13px] font-semibold m-0">
              KENAPA MEMILIH HAVEN
            </p>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight m-0 text-white">
              Temukan Hunian Impian dengan Layanan Terpercaya
            </h2>

            {/* Image with Play Button */}
            <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop" 
                alt="Co-living space" 
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
                <div className="bg-green-600 rounded-full p-1.5 flex-shrink-0 mt-1 text-white flex items-center justify-center shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold m-0 mb-1 text-white">Properti Terverifikasi</h3>
                  <p className="text-sm text-green-100 m-0">Semua kos dan apartemen telah melalui proses verifikasi ketat</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-600 rounded-full p-1.5 flex-shrink-0 mt-1 text-white flex items-center justify-center shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold m-0 mb-1 text-white">Booking Online Mudah</h3>
                  <p className="text-sm text-green-100 m-0">Proses booking cepat dan aman dengan sistem pembayaran terpercaya</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-600 rounded-full p-1.5 flex-shrink-0 mt-1 text-white flex items-center justify-center shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold m-0 mb-1 text-white">Konsultasi Gratis</h3>
                  <p className="text-sm text-green-100 m-0">Tim kami siap membantu menemukan hunian yang sesuai kebutuhan Anda</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <div className="text-7xl text-green-200 leading-none mb-4 font-serif">"</div>
            
            <blockquote className="text-lg sm:text-xl font-medium m-0 mb-4 leading-relaxed text-white">
              Pengalaman terbaik mencari kos di Indonesia
            </blockquote>
            
            <p className="text-sm text-green-100 leading-relaxed m-0 mb-6">
              Haven memudahkan saya menemukan kos yang nyaman dan sesuai budget. Prosesnya cepat, 
              transparan, dan customer service sangat responsif. Sangat recommended untuk yang 
              sedang mencari hunian di kota besar!
            </p>

            <div className="flex flex-col gap-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-green-300 flex-shrink-0">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  <span className="text-sm text-white font-medium">{benefit}</span>
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
