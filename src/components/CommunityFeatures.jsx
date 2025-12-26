import React from 'react';
import './CommunityFeatures.css';

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
    <section className="community-features-section">
      <div className="community-features-container">
        
        {/* Left Text */}
        <div className="community-text">
          <h2 className="community-subtitle">
            join the <br className="break-sm" /> community at
          </h2>
          <h1 className="community-title">
            Indonesia&apos;s <br className="break-md" />
            <span className="title-line">most hyped</span> <br className="break-lg" />
            <span className="title-line-last">co-living</span>
          </h1>
        </div>

        {/* Middle Features List */}
        <div className="community-features-list">
          {features.map((item, index) => (
            <div key={index} className="feature-item">
              <img 
                src={item.icon} 
                alt={item.label}
                className="feature-icon-img"
              />
              <span className="feature-label">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right Image */}
        <div className="community-image-wrapper">
          <div className="community-image-container">
            <img
              src="/src/assets/images/image.png"
              alt="Co-living community"
              className="community-image"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default CommunityFeatures;
