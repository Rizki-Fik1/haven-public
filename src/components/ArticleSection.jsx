import React from 'react';
import './ArticleSection.css';

const ArticleSection = () => {
  // Placeholder data - replace with API call
  const articles = [
    {
      id: 1,
      judul: 'Tips Memilih Kos yang Tepat untuk Mahasiswa',
      thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
      isi: '<p>Memilih kos yang tepat sangat penting untuk kenyamanan selama kuliah. Berikut beberapa tips yang perlu diperhatikan...</p>',
      status: 'published',
      created_at: '2024-12-20T10:00:00'
    },
    {
      id: 2,
      judul: 'Panduan Lengkap Co-Living untuk Profesional Muda',
      thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop',
      isi: '<p>Co-living menjadi solusi hunian modern yang cocok untuk profesional muda. Simak panduan lengkapnya di sini...</p>',
      status: 'published',
      created_at: '2024-12-18T14:30:00'
    },
    {
      id: 3,
      judul: '5 Keuntungan Tinggal di Kos Dekat Kampus',
      thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=500&fit=crop',
      isi: '<p>Tinggal dekat kampus memberikan banyak keuntungan, mulai dari hemat waktu hingga hemat biaya transportasi...</p>',
      status: 'published',
      created_at: '2024-12-15T09:15:00'
    },
    {
      id: 4,
      judul: 'Cara Menghemat Biaya Kos Bulanan',
      thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
      isi: '<p>Menghemat biaya kos bulanan bisa dilakukan dengan beberapa trik sederhana. Yuk simak tipsnya...</p>',
      status: 'published',
      created_at: '2024-12-12T16:45:00'
    },
    {
      id: 5,
      judul: 'Tren Hunian Co-Living di Indonesia 2024',
      thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop',
      isi: '<p>Industri co-living di Indonesia terus berkembang. Berikut tren terbaru yang perlu Anda ketahui...</p>',
      status: 'published',
      created_at: '2024-12-10T11:20:00'
    },
    {
      id: 6,
      judul: 'Fasilitas Wajib yang Harus Ada di Kos Modern',
      thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop',
      isi: '<p>Kos modern harus dilengkapi dengan berbagai fasilitas untuk kenyamanan penghuninya. Ini dia daftar lengkapnya...</p>',
      status: 'published',
      created_at: '2024-12-08T13:00:00'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const handleArticleClick = (articleId) => {
    console.log('Navigate to article:', articleId);
    // TODO: Add navigation
    // navigate(`/article/${articleId}`);
  };

  const handleViewAll = () => {
    console.log('Navigate to all articles');
    // TODO: Add navigation
    // navigate('/article');
  };

  return (
    <section className="article-section">
      <div className="article-container">
        
        <div className="article-header">
          <h2 className="article-title">Artikel Terbaru</h2>
          <button className="view-all-btn" onClick={handleViewAll}>
            Lihat Semua
          </button>
        </div>

        <div className="articles-grid">
          {articles.slice(0, 6).map((article) => (
            <div
              key={article.id}
              className="article-card"
              onClick={() => handleArticleClick(article.id)}
            >
              <div className="article-image-wrapper">
                {article.thumbnail ? (
                  <img
                    src={article.thumbnail}
                    alt={article.judul}
                    className="article-image"
                  />
                ) : (
                  <div className="article-no-image">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <div className="article-content">
                <div className="article-meta">
                  <span className={`article-badge ${article.status}`}>
                    {article.status}
                  </span>
                  <span className="article-date">
                    {formatDate(article.created_at)}
                  </span>
                </div>

                <h3 className="article-card-title">
                  {article.judul}
                </h3>

                <p className="article-excerpt">
                  {stripHtml(article.isi).substring(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ArticleSection;
