import { useState } from 'react';

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Placeholder locations - bisa diambil dari API
  const locations = [
    'Los Angeles, CA',
    'New York, NY',
    'San Francisco, CA',
    'Seattle, WA',
    'Austin, TX',
    'Boston, MA'
  ];

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setShowLocationDropdown(false);
  };

  const handleSearch = () => {
    console.log('Search:', { location, checkIn, checkOut });
    // TODO: Implement search functionality
    // Navigate to search results page or filter homes
  };

  const handleFilter = () => {
    console.log('Filter clicked');
    // TODO: Open filter modal/sidebar
  };

  return (
    <div className="relative w-full flex justify-center z-10 -mt-15 mb-15 md:-mt-15 md:mb-10 sm:-mt-10 sm:mb-10">
      <div className="bg-white rounded-[14px] p-4 md:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex flex-col md:flex-row gap-3 items-stretch md:items-end max-w-[1100px] w-[calc(100%-48px)]">
        {/* Filter Button - Mobile First */}
        <button className="md:hidden py-3 px-4 border-[1.5px] border-gray-200 rounded-lg bg-white flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 text-gray-500 text-sm font-medium hover:border-indigo-600 hover:bg-gray-50 hover:text-indigo-600" onClick={handleFilter}>
          <span>Filter</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 6H16M6 10H14M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Location Field */}
        <div className="flex-1 md:flex-[1.2] flex flex-col gap-2 relative">
          <label className="text-xs font-semibold text-gray-700 pl-1">Pilih Lokasi</label>
          <div className="relative flex items-center">
            <svg className="absolute left-3.5 text-gray-400 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 10C11.1046 10 12 9.10457 12 8C12 6.89543 11.1046 6 10 6C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 18C10 18 16 13 16 8C16 4.68629 13.3137 2 10 2C6.68629 2 4 4.68629 4 8C4 13 10 18 10 18Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <input
              type="text"
              className="w-full py-2.5 md:py-[11px] px-9 md:px-10 pr-9 md:pr-10 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-900 transition-all duration-200 bg-white focus:outline-none focus:border-indigo-600 focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)] placeholder:text-gray-400"
              placeholder="Pilih Lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
              onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
            />
            <svg className="absolute right-3.5 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            
            {showLocationDropdown && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-h-[250px] overflow-y-auto z-[100] p-2">
                {locations.map((loc, index) => (
                  <button
                    key={index}
                    className="w-full py-3 px-4 text-left bg-transparent border-none rounded-lg text-sm text-gray-700 cursor-pointer transition-colors duration-200 flex items-center gap-2.5 hover:bg-gray-100"
                    onMouseDown={() => handleLocationSelect(loc)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-500 flex-shrink-0">
                      <path d="M8 8C8.82843 8 9.5 7.32843 9.5 6.5C9.5 5.67157 8.82843 5 8 5C7.17157 5 6.5 5.67157 6.5 6.5C6.5 7.32843 7.17157 8 8 8Z" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M8 14C8 14 12 10.5 12 6.5C12 4.01472 9.98528 2 7.5 2C5.01472 2 3 4.01472 3 6.5C3 10.5 8 14 8 14Z" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Check In Field */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-700 pl-1">Check In</label>
          <div className="relative flex items-center">
            <svg className="absolute left-3.5 text-gray-400 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="date"
              className="w-full py-2.5 md:py-[11px] px-9 md:px-10 pr-9 md:pr-10 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-600 transition-all duration-200 bg-white focus:outline-none focus:border-indigo-600 focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)] placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:hidden"
              placeholder="Check In"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <svg className="absolute right-3.5 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Check Out Field */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-700 pl-1">Check Out</label>
          <div className="relative flex items-center">
            <svg className="absolute left-3.5 text-gray-400 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="date"
              className="w-full py-2.5 md:py-[11px] px-9 md:px-10 pr-9 md:pr-10 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-600 transition-all duration-200 bg-white focus:outline-none focus:border-indigo-600 focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)] placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:hidden"
              placeholder="Check Out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
            <svg className="absolute right-3.5 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Filter Button - Desktop */}
        <button className="hidden md:block py-[11px] px-4 border-[1.5px] border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-200 text-gray-500 text-sm font-medium hover:border-indigo-600 hover:bg-gray-50 hover:text-indigo-600" onClick={handleFilter}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 6H16M6 10H14M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Search Button */}
        <button className="w-full md:w-auto py-3 md:py-[11px] px-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:bg-gradient-to-br hover:from-emerald-600 hover:to-emerald-700 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] active:translate-y-0" onClick={handleSearch}>
          Cari
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
