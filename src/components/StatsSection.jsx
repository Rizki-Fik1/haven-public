const StatsSection = () => {
  const stats = [
    {
      id: 1,
      value: '3,000+',
      label: 'Happy Residents',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M22.6667 28V25.3333C22.6667 23.9188 22.1048 22.5623 21.1046 21.5621C20.1044 20.5619 18.7478 20 17.3333 20H8C6.58551 20 5.22896 20.5619 4.22876 21.5621C3.22857 22.5623 2.66667 23.9188 2.66667 25.3333V28" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.6667 14.6667C15.6122 14.6667 18 12.2789 18 9.33333C18 6.38781 15.6122 4 12.6667 4C9.72115 4 7.33333 6.38781 7.33333 9.33333C7.33333 12.2789 9.72115 14.6667 12.6667 14.6667Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M29.3333 28V25.3333C29.3323 24.1503 28.9435 23.0009 28.2281 22.0583C27.5126 21.1156 26.5098 20.4306 25.3867 20.1067" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21.3333 4.10667C22.4599 4.42912 23.4661 5.11407 24.1841 6.05788C24.9021 7.00169 25.2923 8.15311 25.2923 9.33917C25.2923 10.5252 24.9021 11.6767 24.1841 12.6205C23.4661 13.5643 22.4599 14.2492 21.3333 14.5717" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 2,
      value: '50+',
      label: 'Premium Locations',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 18.6667C19.6819 18.6667 22.6667 15.6819 22.6667 12C22.6667 8.3181 19.6819 5.33333 16 5.33333C12.3181 5.33333 9.33333 8.3181 9.33333 12C9.33333 15.6819 12.3181 18.6667 16 18.6667Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 28C16 28 28 21.3333 28 12C28 9.87827 27.1571 7.84344 25.6569 6.34315C24.1566 4.84286 22.1217 4 20 4C17.8783 4 15.8434 4.84286 14.3431 6.34315C12.8429 7.84344 12 9.87827 12 12C12 21.3333 16 28 16 28Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 3,
      value: '98%',
      label: 'Satisfaction Rate',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.6667 18.6667C10.6667 18.6667 12.6667 21.3333 16 21.3333C19.3333 21.3333 21.3333 18.6667 21.3333 18.6667" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12H12.0133" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 12H20.0133" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 4,
      value: '24/7',
      label: 'Support Available',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 8V16L21.3333 18.6667" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <React.Fragment key={stat.id}>
              <div className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
              {index < stats.length - 1 && <div className="stat-divider"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
