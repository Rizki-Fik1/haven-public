import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticles } from '../../services/articleService';

const ArticlePage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackArticles = [
    {
      id: 1,
      judul: 'Tips Memilih Kos yang Tepat untuk Mahasiswa',
      isi: '<p>Memilih kos yang tepat sangat penting untuk kenyamanan selama kuliah...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      created_at: '2024-12-26T10:00:00',
      status: 'published'
    },
    {
      id: 2,
      judul: 'Panduan Lengkap Co-Living untuk Profesional Muda',
      isi: '<p>Co-living menjadi solusi hunian modern yang cocok untuk profesional muda...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      created_at: '2024-12-25T14:30:00',
      status: 'published'
    },
    {
      id: 3,
      judul: '5 Keuntungan Tinggal di Kos Dekat Kampus',
      isi: '<p>Tinggal dekat kampus memberikan banyak keuntungan, mulai dari hemat waktu...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
      created_at: '2024-12-24T09:15:00',
      status: 'published'
    },
    {
      id: 4,
      judul: 'Cara Menghemat Biaya Kos Bulanan',
      isi: '<p>Menghemat biaya kos bulanan bisa dilakukan dengan beberapa trik sederhana...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      created_at: '2024-12-23T16:45:00',
      status: 'published'
    },
    {
      id: 5,
      judul: 'Tren Hunian Co-Living di Indonesia 2024',
      isi: '<p>Industri co-living di Indonesia terus berkembang dengan berbagai inovasi...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      created_at: '2024-12-22T11:20:00',
      status: 'published'
    },
    {
      id: 6,
      judul: 'Fasilitas Wajib yang Harus Ada di Kos Modern',
      isi: '<p>Kos modern harus dilengkapi dengan berbagai fasilitas untuk kenyamanan...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
      created_at: '2024-12-21T13:00:00',
      status: 'published'
    }
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getArticles();
        
        // Transform API data
        const transformedData = (response.data || []).map(article => {
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
        setError(null);
      } catch (err) {
        if (!err.isNotFound) {
          console.error('Failed to fetch articles:', err);
        }
        setError('API belum tersedia');
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const getCategoryFromStatus = (status) => {
    return status === 'published' ? 'Artikel' : 'Draft';
  };

  const handleArticleClick = (id) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Artikel Terbaru</h1>
          <p className="text-lg text-gray-600">
            Baca artikel menarik seputar kos dan kehidupan mahasiswa
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-4 text-gray-500 mb-6">
            <p>Menggunakan data contoh (API tidak tersedia)</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt={article.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {getCategoryFromStatus(article.status)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{formatDate(article.created_at)}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.judul}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {stripHtml(article.isi).substring(0, 150)}...
                </p>
                <button className="mt-4 text-indigo-600 font-semibold text-sm hover:text-indigo-700">
                  Baca Selengkapnya →
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
