import React from 'react';
import './ServiceSection.css';

const ServiceSection = () => {
  const benefits = [
    'Konsultasi Gratis',
    'Bersertifikat',
    'Layanan Terbaik',
    'Tempat Idaman'
  ];

  return (
    <section className="service-section">
      <div className="service-container">
        
        <div className="service-grid">
          
          {/* Left Content */}
          <div className="service-content">
            <p className="service-label">KENAPA HARUS GUNAKAN LAYANAN KAMI</p>
            
            <h2 className="service-title">
              Kami Memberikan Hasil Layanan Terbaik Untuk Penginapan Anda
            </h2>

            {/* Image with Play Button */}
            <div className="service-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop" 
                alt="Resort view" 
                className="service-image"
              />
              <button className="play-button">
                <div className="play-icon-wrapper">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M10 8L24 16L10 24V8Z" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Features List */}
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">Garansi Layanan</h3>
                  <p className="feature-desc">Mendapatkan keamanan</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">List Apartemen Terbaik</h3>
                  <p className="feature-desc">Apartemen terbaik di Indonesia</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">Gratis Konsultasi</h3>
                  <p className="feature-desc">Tersedia konsultasi terbaik</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Testimonial Card */}
          <div className="testimonial-card">
            <div className="quote-mark">"</div>
            
            <blockquote className="testimonial-quote">
              Lorem ipsum dolor sit amet consectetur adipiscing elit.
            </blockquote>
            
            <p className="testimonial-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>

            <div className="benefits-list">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="benefit-check">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  <span className="benefit-label">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
