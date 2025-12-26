const BenefitsSection = () => {
  const benefits = [
    {
      id: 1,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M28 13.3333V9.33333C28 8.62609 27.719 7.94781 27.219 7.44772C26.7189 6.94762 26.0406 6.66667 25.3333 6.66667H6.66667C5.95942 6.66667 5.28115 6.94762 4.78105 7.44772C4.28095 7.94781 4 8.62609 4 9.33333V13.3333M28 13.3333V22.6667C28 23.3739 27.719 24.0522 27.219 24.5523C26.7189 25.0524 26.0406 25.3333 25.3333 25.3333H6.66667C5.95942 25.3333 5.28115 25.0524 4.78105 24.5523C4.28095 24.0522 4 23.3739 4 22.6667V13.3333M28 13.3333H20C19.2928 13.3333 18.6145 13.6143 18.1144 14.1144C17.6143 14.6145 17.3333 15.2928 17.3333 16C17.3333 16.7072 17.6143 17.3855 18.1144 17.8856C18.6145 18.3857 19.2928 18.6667 20 18.6667H28M4 13.3333H12C12.7072 13.3333 13.3855 13.6143 13.8856 14.1144C14.3857 14.6145 14.6667 15.2928 14.6667 16C14.6667 16.7072 14.3857 17.3855 13.8856 17.8856C13.3855 18.3857 12.7072 18.6667 12 18.6667H4" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'All-inclusive pricing',
      description: 'No hidden fees. Utilities, WiFi, and amenities all included in one simple monthly payment.'
    },
    {
      id: 2,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12L14 19L11 16" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Flexible contracts',
      description: 'Month-to-month leases with no long-term commitment. Move in or out on your schedule.'
    },
    {
      id: 3,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 4V16M16 16L22.6667 9.33333M16 16L9.33333 9.33333" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26.6667 20V25.3333C26.6667 25.687 26.5262 26.0261 26.2761 26.2761C26.0261 26.5262 25.687 26.6667 25.3333 26.6667H6.66667C6.31304 26.6667 5.97391 26.5262 5.72386 26.2761C5.47381 26.0261 5.33333 25.687 5.33333 25.3333V20" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Fast move-in',
      description: 'Book online and move in within 48 hours. Fully furnished and ready for you.'
    },
    {
      id: 4,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26 16C25.0933 18.4 23.4 20.4 21.2 21.7333C19 23.0667 16.4667 23.6667 14 23.4667C11.5333 23.2667 9.2 22.2667 7.46667 20.6C5.73333 18.9333 4.66667 16.7333 4.4 14.4" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 16C6.90667 13.6 8.6 11.6 10.8 10.2667C13 8.93333 15.5333 8.33333 18 8.53333C20.4667 8.73333 22.8 9.73333 24.5333 11.4C26.2667 13.0667 27.3333 15.2667 27.6 17.6" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: '24/7 Support',
      description: 'Our dedicated team is always available to help with any questions or concerns.'
    },
    {
      id: 5,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M4 12L16 4L28 12V26.6667C28 27.0203 27.8595 27.3594 27.6095 27.6095C27.3594 27.8595 27.0203 28 26.6667 28H5.33333C4.97971 28 4.64057 27.8595 4.39052 27.6095C4.14048 27.3594 4 27.0203 4 26.6667V12Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 28V16H20V28" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Prime locations',
      description: 'Live in the heart of the city near public transport, restaurants, and entertainment.'
    },
    {
      id: 6,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 2.66667L3.33334 10.6667L16 18.6667L28.6667 10.6667L16 2.66667Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.33334 21.3333L16 29.3333L28.6667 21.3333" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.33334 16L16 24L28.6667 16" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Premium amenities',
      description: 'Enjoy gym access, coworking spaces, rooftop terraces, and more exclusive perks.'
    }
  ];

  return (
    <section className="w-full py-16 md:py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why choose Cove</h2>
          <p className="text-lg text-gray-600">
            Everything you need for a hassle-free living experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
