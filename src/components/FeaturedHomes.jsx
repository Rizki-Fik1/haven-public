const FeaturedHomes = () => {
  const homes = [
    {
      id: 1,
      title: 'Modern Studio',
      location: 'Downtown LA',
      price: '$850/mo',
      beds: '1 bed',
      baths: '1 bath',
      image: '/images/home-1.jpg',
      badge: 'Available Now',
      badgeType: 'success'
    },
    {
      id: 2,
      title: 'Cozy Apartment',
      location: 'Brooklyn, NY',
      price: '$950/mo',
      beds: '2 beds',
      baths: '1 bath',
      image: '/images/home-2.jpg',
      badge: 'Popular',
      badgeType: 'popular'
    },
    {
      id: 3,
      title: 'Luxury Suite',
      location: 'San Francisco',
      price: '$1,200/mo',
      beds: '1 bed',
      baths: '1 bath',
      image: '/images/home-3.jpg',
      badge: 'Premium',
      badgeType: 'premium'
    }
  ];

  const handleViewHome = (homeId) => {
    console.log('View home:', homeId);
    // TODO: Navigate to home details page
  };

  const handleViewAll = () => {
    console.log('View all homes');
    // TODO: Navigate to browse all homes page
  };

  return (
    <section className="featured-homes">
      <div className="featured-homes-container">
        <div className="featured-homes-header">
          <div>
            <h2 className="featured-homes-title">Featured homes</h2>
            <p className="featured-homes-subtitle">
              Discover our most popular co-living spaces
            </p>
          </div>
          <button className="view-all-button" onClick={handleViewAll}>
            View all
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="homes-grid">
          {homes.map((home) => (
            <div key={home.id} className="home-card" onClick={() => handleViewHome(home.id)}>
              <div className="home-card-image-wrapper">
                <img src={home.image} alt={home.title} className="home-card-image" />
                <span className={`home-badge ${home.badgeType}`}>{home.badge}</span>
                <button className="favorite-button">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 17.5L8.75 16.375C4.5 12.5 1.875 10.125 1.875 7.1875C1.875 4.8125 3.6875 3 6.0625 3C7.4375 3 8.75 3.625 10 4.6875C11.25 3.625 12.5625 3 13.9375 3C16.3125 3 18.125 4.8125 18.125 7.1875C18.125 10.125 15.5 12.5 11.25 16.375L10 17.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </div>
              <div className="home-card-content">
                <div className="home-card-header">
                  <h3 className="home-card-title">{home.title}</h3>
                  <span className="home-card-price">{home.price}</span>
                </div>
                <p className="home-card-location">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8.5C8.82843 8.5 9.5 7.82843 9.5 7C9.5 6.17157 8.82843 5.5 8 5.5C7.17157 5.5 6.5 6.17157 6.5 7C6.5 7.82843 7.17157 8.5 8 8.5Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 14C8 14 13 10.5 13 7C13 4.23858 10.7614 2 8 2C5.23858 2 3 4.23858 3 7C3 10.5 8 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {home.location}
                </p>
                <div className="home-card-details">
                  <span className="home-detail">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 14V6M14 14V6M2 6L8 2L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {home.beds}
                  </span>
                  <span className="home-detail">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 10V14M13 10V14M3 7C3 5.89543 3.89543 5 5 5H11C12.1046 5 13 5.89543 13 7V10H3V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {home.baths}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedHomes;
