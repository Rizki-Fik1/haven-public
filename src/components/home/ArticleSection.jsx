import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestArticles } from '../../services/articleService';

const ArticleSection = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback dummy data
  const fallbackArticles = [
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

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getLatestArticles(6);
        
        // Transform API data
        const transformedData = (response.data || []).map(article => {
          // Handle thumbnail URL
          let thumbnailUrl = fallbackArticles[0].thumbnail;
          if (article.thumbnail) {
            thumbnailUrl = article.thumbnail.startsWith('http')
              ? article.thumbnail
              : `https://admin.haven.co.id/${article.thumbnail}`;
          }
          
          return {
            id: article.id,
            judul: article.judul,
            thumbnail: thumbnailUrl,
            isi: article.isi,
            status: article.status,
            created_at: article.created_at
          };
        });
        
        setArticles(transformedData);
      } catch (err) {
        if (!err.isNotFound) {
          console.error('Failed to fetch articles:', err);
        }
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const handleViewAll = () => {
    navigate('/article');
  };

  return (
    <section className="w-full py-16 md:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-[36px] font-bold text-gray-900 m-0 mb-4">
            Artikel Terbaru
          </h2>
          <button className="py-2.5 px-6 border-[1.5px] border-gray-300 rounded-lg bg-white text-gray-700 text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400" onClick={handleViewAll}>
            Lihat Semua
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((article) => (
            <div
              key={article.id}
              className="cursor-pointer rounded-xl overflow-hidden bg-white transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
              onClick={() => handleArticleClick(article.id)}
            >
              <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                {article.thumbnail ? (
                  <img
                    src={article.thumbnail}
                    alt={article.judul}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 text-sm">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`py-1 px-2.5 rounded-md text-xs font-semibold capitalize ${
                    article.status === 'published' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {article.status}
                  </span>
                  <span className="text-[13px] text-gray-500">
                    {formatDate(article.created_at)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 m-0 mb-2 leading-snug line-clamp-2 min-h-[50px] max-h-[50px] overflow-hidden">
                  {article.judul}
                </h3>

                <p className="text-sm text-gray-500 m-0 leading-relaxed line-clamp-2 overflow-hidden">
                  {stripHtml(article.isi).substring(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>
        )}

      </div>
    </section>
  );
};

export default ArticleSection;
