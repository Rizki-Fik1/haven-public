import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Share2, 
  X, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Link as LinkIcon,
  Check
} from 'lucide-react';
import { getArticleById } from '../../services/articleService';
import ErrorAlert from '../../components/ui/ErrorAlert';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        console.error('Failed to fetch article:', err);
        setError('Gagal memuat artikel. Silakan coba lagi.');
        setArticle(null);
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

  // Get current page URL
  const getArticleUrl = () => {
    return window.location.href;
  };

  // Generate share text
  const getShareText = () => {
    return `${article?.judul || 'Artikel Menarik'} - Haven`;
  };

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getArticleUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share handlers
  const shareToFacebook = () => {
    const url = encodeURIComponent(getArticleUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(getArticleUrl());
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(getArticleUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(getArticleUrl());
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  // Native share API (for mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.judul || 'Artikel Haven',
          text: getShareText(),
          url: getArticleUrl(),
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      setShowShareModal(true);
    }
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

  if (!article && !loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {error ? (
          <ErrorAlert 
            message={error}
            onRetry={() => window.location.reload()}
            type="error"
          />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel tidak ditemukan</h2>
            <button 
              onClick={() => navigate('/article')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Kembali ke Artikel
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        {/* Header with Title and Share Button */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.judul}</h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 text-gray-500">
              <span>{formatDate(article.created_at)}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                article.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {article.status}
              </span>
            </div>

            {/* Share Button */}
            <button
              onClick={isMobile ? handleNativeShare : () => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium">Bagikan</span>
            </button>
          </div>
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

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 text-center">Bagikan Artikel</h3>
              <p className="text-sm text-gray-500 text-center mt-1 line-clamp-1">
                {article.judul}
              </p>
            </div>

            {/* Modal Content - Grid Layout */}
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {/* WhatsApp */}
                <button
                  onClick={shareToWhatsApp}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={shareToFacebook}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Facebook className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>

                {/* X (Twitter) */}
                <button
                  onClick={shareToTwitter}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">X</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareToLinkedIn}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Linkedin className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                </button>

                {/* Copy Link */}
                <button
                  onClick={copyToClipboard}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-xl transition-colors group col-span-2 sm:col-span-1"
                >
                  <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    {copied ? (
                      <Check className="w-7 h-7 text-white" />
                    ) : (
                      <LinkIcon className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {copied ? 'Tersalin!' : 'Salin Link'}
                  </span>
                </button>
              </div>

              {/* URL Preview */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 text-center truncate">
                  {getArticleUrl()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
