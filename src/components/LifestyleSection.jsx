import React from 'react';
import './LifestyleSection.css';

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
    <section className="lifestyle-section-new">
      <div className="lifestyle-container-new">
        
        {/* Cards Grid - Left Side */}
        <div className="location-cards-grid">
          {locations.map((location) => (
            <div
              key={location.id}
              className="location-card"
              onClick={() => handleCardClick(location)}
            >
              <div className="location-image-wrapper">
                <img
                  src={location.image}
                  alt={location.nama}
                  className="location-image"
                />
              </div>
              <h4 className="location-name">{location.nama}</h4>
            </div>
          ))}
        </div>

        {/* Heading - Right Side */}
        <div className="lifestyle-heading-wrapper">
          <h2 className="lifestyle-heading-new">
            <span className="heading-light">the right</span>
            <br />
            <span className="heading-normal">match</span>
          </h2>
          <h3 className="lifestyle-subheading-new">
            for your
            <br />
            lifestyle
          </h3>
        </div>

      </div>
    </section>
  );
};

export default LifestyleSection;
