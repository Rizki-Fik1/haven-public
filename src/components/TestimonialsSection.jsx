import React, { useState } from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Product Designer',
      location: 'Los Angeles',
      image: '/images/avatar-1.jpg',
      rating: 5,
      content: 'Moving to Cove was the best decision I made when relocating to LA. The community is amazing, and the facilities are top-notch. I\'ve made lifelong friends here!',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Engineer',
      location: 'San Francisco',
      image: '/images/avatar-2.jpg',
      rating: 5,
      content: 'As a remote worker, having access to great coworking spaces and fast WiFi is essential. Cove delivers on all fronts. Plus, the location is perfect!',
      verified: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      location: 'New York',
      image: '/images/avatar-3.jpg',
      rating: 5,
      content: 'The all-inclusive pricing and flexible contracts make budgeting so much easier. No surprise fees, just a great living experience in the heart of the city.',
      verified: true
    }
  ];

  const handlePrevious = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What our residents say</h2>
          <p className="testimonials-subtitle">
            Join thousands of happy residents who call Cove home
          </p>
        </div>

        <div className="testimonial-card">
          <div className="rating">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            ))}
          </div>
          
          <p className="testimonial-content">"{currentTestimonial.content}"</p>
          
          <div className="testimonial-author">
            <img 
              src={currentTestimonial.image} 
              alt={currentTestimonial.name}
              className="author-image"
            />
            <div className="author-info">
              <div className="author-name-wrapper">
                <h4 className="author-name">{currentTestimonial.name}</h4>
                {currentTestimonial.verified && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="verified-badge">
                    <circle cx="9" cy="9" r="9" fill="#4F46E5"/>
                    <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <p className="author-role">{currentTestimonial.role}</p>
              <p className="author-location">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 7.5C7.82843 7.5 8.5 6.82843 8.5 6C8.5 5.17157 7.82843 4.5 7 4.5C6.17157 4.5 5.5 5.17157 5.5 6C5.5 6.82843 6.17157 7.5 7 7.5Z" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M7 12C7 12 11 9 11 6C11 3.79086 9.20914 2 7 2C4.79086 2 3 3.79086 3 6C3 9 7 12 7 12Z" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                {currentTestimonial.location}
              </p>
            </div>
          </div>

          <div className="testimonial-navigation">
            <button className="nav-arrow" onClick={handlePrevious}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button className="nav-arrow" onClick={handleNext}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
