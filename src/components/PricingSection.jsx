const PricingSection = () => {
  const plans = [
    {
      id: 1,
      name: 'Essentials',
      price: '$800',
      period: 'per month',
      description: 'Perfect for getting started',
      features: [
        'Shared bedroom',
        'Shared bathroom',
        'Common areas access',
        'Basic amenities',
        'WiFi included',
        'Utilities included'
      ],
      highlighted: false
    },
    {
      id: 2,
      name: 'Premium',
      price: '$1,200',
      period: 'per month',
      description: 'Most popular choice',
      features: [
        'Private bedroom',
        'Shared bathroom',
        'Full common areas access',
        'Premium amenities',
        'High-speed WiFi',
        'All utilities included',
        'Weekly housekeeping',
        'Priority support'
      ],
      highlighted: true,
      badge: 'Popular'
    },
    {
      id: 3,
      name: 'Elite',
      price: '$1,800',
      period: 'per month',
      description: 'Ultimate comfort & privacy',
      features: [
        'Private bedroom',
        'Private bathroom',
        'Full amenities access',
        'Luxury furnishings',
        'Dedicated workspace',
        'All utilities included',
        'Daily housekeeping',
        '24/7 concierge',
        'Exclusive events'
      ],
      highlighted: false
    }
  ];

  const handleSelectPlan = (planId) => {
    console.log('Plan selected:', planId);
    // TODO: Navigate to booking page
  };

  return (
    <section className="pricing-section">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2 className="pricing-title">Simple, transparent pricing</h2>
          <p className="pricing-subtitle">
            Choose the perfect plan for your lifestyle
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
            >
              {plan.badge && (
                <span className="pricing-badge">{plan.badge}</span>
              )}
              <div className="pricing-card-header">
                <h3 className="pricing-plan-name">{plan.name}</h3>
                <p className="pricing-plan-description">{plan.description}</p>
                <div className="pricing-amount">
                  <span className="pricing-price">{plan.price}</span>
                  <span className="pricing-period">/{plan.period.replace('per ', '')}</span>
                </div>
              </div>
              
              <ul className="pricing-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="pricing-feature">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill="#d1fae5"/>
                      <path d="M6 10L9 13L14 7" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`pricing-button ${plan.highlighted ? 'primary' : 'secondary'}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
