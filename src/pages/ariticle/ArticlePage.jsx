import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticles } from '../../services/articleService';
import ErrorAlert from '../../components/ui/ErrorAlert';

const ArticlePage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getArticles();
        
        // Transform API data
        const transformedData = (response.data || []).map(article => {
          let thumbnailUrl = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';
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
          <div className="mb-8">
            <ErrorAlert 
              message={error}
              onRetry={() => window.location.reload()}
              type="error"
            />
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Belum ada artikel tersedia</p>
          </div>
        )}

        {!loading && articles.length > 0 && (
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
