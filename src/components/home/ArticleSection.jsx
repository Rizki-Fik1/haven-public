import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestArticles } from '../../services/articleService';
import ErrorAlert from '../ui/ErrorAlert';

const ArticleSection = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getLatestArticles(6);
        
        // Transform API data
        const transformedData = (response.data || []).map(article => {
          // Handle thumbnail URL
          let thumbnailUrl = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop';
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
        console.error('Failed to fetch articles:', err);
        setError('Gagal memuat artikel. Silakan coba lagi.');
        setArticles([]);
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

        {error && !loading && (
          <div className="mb-8">
            <ErrorAlert 
              message={error}
              onRetry={() => window.location.reload()}
              type="error"
            />
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada artikel tersedia</p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
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
                      ? 'bg-green-100 text-green-800' 
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
