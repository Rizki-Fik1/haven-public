const LocationsSection = () => {
  const locations = [
    {
      id: 1,
      city: 'Los Angeles',
      state: 'California',
      properties: 12,
      image: '/images/location-la.jpg'
    },
    {
      id: 2,
      city: 'New York',
      state: 'New York',
      properties: 18,
      image: '/images/location-ny.jpg'
    },
    {
      id: 3,
      city: 'San Francisco',
      state: 'California',
      properties: 10,
      image: '/images/location-sf.jpg'
    },
    {
      id: 4,
      city: 'Seattle',
      state: 'Washington',
      properties: 8,
      image: '/images/location-seattle.jpg'
    }
  ];

  const handleLocationClick = (locationId) => {
    console.log('Location clicked:', locationId);
    // TODO: Navigate to location-specific page
  };

  return (
    <section className="locations-section">
      <div className="locations-container">
        <div className="locations-header">
          <h2 className="locations-title">Explore our locations</h2>
          <p className="locations-subtitle">
            Find your perfect home in prime locations across the country
          </p>
        </div>

        <div className="locations-grid">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className="location-card"
              onClick={() => handleLocationClick(location.id)}
            >
              <img src={location.image} alt={location.city} className="location-image" />
              <div className="location-overlay">
                <div className="location-content">
                  <h3 className="location-city">{location.city}</h3>
                  <p className="location-state">{location.state}</p>
                  <span className="location-properties">
                    {location.properties} properties
                  </span>
                </div>
                <button className="location-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
