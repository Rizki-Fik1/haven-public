import React, { useState } from 'react';
import './SearchBar.css';

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
    <div className="search-bar-wrapper">
      <div className="search-bar">
        {/* Location Field */}
        <div className="search-field location-field">
          <label className="search-label">Pilih Lokasi</label>
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 10C11.1046 10 12 9.10457 12 8C12 6.89543 11.1046 6 10 6C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 18C10 18 16 13 16 8C16 4.68629 13.3137 2 10 2C6.68629 2 4 4.68629 4 8C4 13 10 18 10 18Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Pilih Lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
              onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
            />
            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            
            {showLocationDropdown && (
              <div className="location-dropdown">
                {locations.map((loc, index) => (
                  <button
                    key={index}
                    className="location-option"
                    onMouseDown={() => handleLocationSelect(loc)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
        <div className="search-field">
          <label className="search-label">Check In</label>
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="date"
              className="search-input date-input"
              placeholder="Check In"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Check Out Field */}
        <div className="search-field">
          <label className="search-label">Check Out</label>
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="date"
              className="search-input date-input"
              placeholder="Check Out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Filter Button */}
        <button className="filter-button" onClick={handleFilter}>
          <span className="filter-label">Filter</span>
          <svg className="filter-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 6H16M6 10H14M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Search Button */}
        <button className="search-button" onClick={handleSearch}>
          Cari
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
