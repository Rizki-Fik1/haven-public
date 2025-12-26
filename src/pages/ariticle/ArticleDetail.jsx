import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../../services/articleService';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackArticle = {
    id: id,
    judul: 'Tips Memilih Kos yang Tepat untuk Mahasiswa',
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=400&fit=crop',
    isi: `
      <p>Memilih kos yang tepat sangat penting untuk kenyamanan selama kuliah. Berikut beberapa tips yang perlu diperhatikan saat mencari kos yang sesuai dengan kebutuhan Anda.</p>
      
      <h2>1. Lokasi Strategis</h2>
      <p>Pilih kos yang dekat dengan kampus atau memiliki akses transportasi yang mudah. Ini akan menghemat waktu dan biaya transportasi Anda sehari-hari.</p>
      
      <h2>2. Fasilitas Lengkap</h2>
      <p>Pastikan kos memiliki fasilitas dasar seperti kamar mandi dalam, WiFi, AC, dan tempat parkir. Fasilitas tambahan seperti laundry dan dapur bersama juga bisa menjadi nilai plus.</p>
      
      <h2>3. Keamanan Terjamin</h2>
      <p>Perhatikan sistem keamanan kos seperti CCTV, satpam, dan akses masuk yang terkontrol. Keamanan adalah prioritas utama dalam memilih tempat tinggal.</p>
      
      <h2>4. Harga Sesuai Budget</h2>
      <p>Sesuaikan harga kos dengan budget bulanan Anda. Jangan lupa untuk menanyakan apa saja yang sudah termasuk dalam harga sewa seperti listrik, air, dan internet.</p>
      
      <h2>5. Lingkungan Kondusif</h2>
      <p>Pilih kos dengan lingkungan yang kondusif untuk belajar. Perhatikan juga kebersihan dan kenyamanan area sekitar kos.</p>
    `,
    status: 'published',
    created_at: '2024-12-26T10:00:00'
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await getArticleById(id);
        const articleData = response.data || response;
        
        // Transform thumbnail URL
        if (articleData.thumbnail) {
          articleData.thumbnail = articleData.thumbnail.startsWith('http')
            ? articleData.thumbnail
            : `https://admin.haven.co.id/${articleData.thumbnail}`;
        }
        
        setArticle(articleData);
        setError(null);
      } catch (err) {
        if (!err.isNotFound) {
          console.error('Failed to fetch article:', err);
        }
        setError('API belum tersedia');
        setArticle(fallbackArticle);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel tidak ditemukan</h2>
          <button 
            onClick={() => navigate('/article')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Kembali ke Artikel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
          <p className="text-sm">Menggunakan data contoh (API tidak tersedia)</p>
        </div>
      )}

      <button 
        onClick={() => navigate('/article')}
        className="mb-6 text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M12.5 15L7.5 10L12.5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Kembali ke Artikel
      </button>

      <article>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.judul}</h1>
        
        <div className="flex items-center gap-4 text-gray-500 mb-6">
          <span>{formatDate(article.created_at)}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            article.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {article.status}
          </span>
        </div>

        {article.thumbnail && (
          <div className="mb-8">
            <img 
              src={article.thumbnail}
              alt={article.judul}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.isi }}
        />
      </article>
    </div>
  );
};

export default ArticleDetail;
