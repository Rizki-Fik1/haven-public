const CommunitySection = () => {
  const handleJoinCommunity = () => {
    console.log('Join community clicked');
    // TODO: Navigate to community page or sign up
  };

  const handleLearnMore = () => {
    console.log('Learn more about community clicked');
    // TODO: Navigate to community details page
  };

  return (
    <section className="community-section">
      <div className="community-container">
        <div className="community-content">
          <div className="community-text">
            <span className="community-badge">Community</span>
            <h2 className="community-title">
              More than just a place to live
            </h2>
            <p className="community-description">
              Join a vibrant community of like-minded individuals. Participate in exclusive events,
              networking opportunities, and social gatherings. Build lasting friendships and
              professional connections in a supportive environment.
            </p>
            <ul className="community-features">
              <li className="community-feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 className="feature-title">Regular Events</h4>
                  <p className="feature-description">Weekly social activities and networking events</p>
                </div>
              </li>
              <li className="community-feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 className="feature-title">Community App</h4>
                  <p className="feature-description">Stay connected with residents 24/7</p>
                </div>
              </li>
              <li className="community-feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12H22" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 className="feature-title">Global Network</h4>
                  <p className="feature-description">Connect with residents across all locations</p>
                </div>
              </li>
            </ul>
            <div className="community-actions">
              <button className="community-button community-button-primary" onClick={handleJoinCommunity}>
                Join the community
              </button>
              <button className="community-button community-button-secondary" onClick={handleLearnMore}>
                Learn more
              </button>
            </div>
          </div>
          <div className="community-image">
            <img 
              src="/images/community.jpg" 
              alt="Community gathering"
              className="community-img"
            />
            <div className="community-stats-card">
              <div className="stat-item">
                <span className="stat-value">5K+</span>
                <span className="stat-label">Active members</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">200+</span>
                <span className="stat-label">Monthly events</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
