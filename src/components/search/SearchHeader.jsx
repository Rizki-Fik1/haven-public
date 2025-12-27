const SearchHeader = () => {
  return (
    <div
      className="relative min-h-[400px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=600&fit=crop&q=80')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cari Kos atau Apartemen
          </h1>
          <p className="text-lg opacity-90">
            Segera cari tempat yang ingin anda inap, atur jadwal checkin dan checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
