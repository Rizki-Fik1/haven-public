const GallerySection = () => {
  const galleryImages = [
    { id: 1, src: '/images/gallery-1.jpg', alt: 'Modern living room', large: true },
    { id: 2, src: '/images/gallery-2.jpg', alt: 'Cozy bedroom' },
    { id: 3, src: '/images/gallery-3.jpg', alt: 'Shared kitchen' },
    { id: 4, src: '/images/gallery-4.jpg', alt: 'Rooftop terrace' },
    { id: 5, src: '/images/gallery-5.jpg', alt: 'Coworking space', large: true }
  ];

  const handleImageClick = (imageId) => {
    console.log('Gallery image clicked:', imageId);
    // TODO: Open lightbox or full image view
  };

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        <div className="gallery-header">
          <h2 className="gallery-title">Explore our spaces</h2>
          <p className="gallery-subtitle">
            Take a peek at beautifully designed co-living environments
          </p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <div 
              key={image.id} 
              className={`gallery-item ${image.large ? 'large' : ''}`}
              onClick={() => handleImageClick(image.id)}
            >
              <img src={image.src} alt={image.alt} className="gallery-image" />
              <div className="gallery-overlay">
                <button className="gallery-zoom">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/>
                    <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M11 8V14M8 11H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
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

export default GallerySection;
