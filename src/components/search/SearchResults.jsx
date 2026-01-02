import { memo, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { getKos } from '../../services/kosService';
import KosCard from './KosCard';

const SearchResults = memo(() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [kosData, setKosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [pageInput, setPageInput] = useState('1');

  // Extract search parameters from URL
  const searchParamsObj = useMemo(() => {
    return {
      search: searchParams.get('city') || undefined,
      start_date: searchParams.get('checkIn') || null,
      end_date: searchParams.get('checkOut') || null,
      per_page: parseInt(searchParams.get('perPage') || '12', 10),
      page: parseInt(searchParams.get('page') || '1', 10),
      tipe: searchParams.get('tipe') === '-' ? undefined : searchParams.get('tipe') || undefined,
      jenis: searchParams.get('jenis') === '-' ? undefined : searchParams.get('jenis') || undefined,
    };
  }, [searchParams]);

  // Fetch data
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getKos(searchParamsObj);
        setKosData(response.data || []);
        setPagination(response.meta || response.pagination || null);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Gagal memuat data. Silakan coba lagi.');
        setKosData([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParamsObj]);

  useEffect(() => {
    if (pagination?.current_page) {
      setPageInput(String(pagination.current_page));
    }
  }, [pagination]);

  // Extract unique kos
  const uniqueKos = useMemo(() => {
    const kosMap = new Map();
    kosData.forEach((kamar) => {
      if (kamar?.kos && kamar.kos.id && kamar.kos.nama) {
        if (!kosMap.has(kamar.kos.id)) {
          kosMap.set(kamar.kos.id, kamar.kos);
        }
      }
    });
    return Array.from(kosMap.values());
  }, [kosData]);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (!pagination || pagination.current_page <= 1) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pagination.current_page - 1));
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleNextPage = () => {
    if (!pagination || pagination.current_page >= pagination.last_page) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pagination.current_page + 1));
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    if (!pagination) return;

    let pageNum = parseInt(pageInput || '1', 10) || 1;
    if (pageNum < 1) pageNum = 1;
    if (pageNum > pagination.last_page) pageNum = pagination.last_page;

    const params = new URLSearchParams(searchParams);
    params.set('page', String(pageNum));
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-700" />
          <p className="text-gray-600">Mencari kos yang tersedia...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p>Terjadi kesalahan saat memuat data kos. {error}</p>
      </div>
    );
  }

  // Show Kos list
  return (
    <div className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hasil Pencarian Kos</h2>
        <p className="text-gray-600">
          Ditemukan <span className="font-semibold">{uniqueKos.length}</span> kos yang tersedia
        </p>
      </div>

      {uniqueKos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueKos.map((kos) => (
              <KosCard 
                key={kos.id} 
                kos={kos} 
                onClick={() => navigate(`/getKos/${kos.id}`)} 
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={pagination.current_page <= 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Sebelumnya
              </button>

              <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm flex items-center gap-2">
                <span className="text-gray-600">Halaman</span>
                <form onSubmit={handlePageSubmit} className="inline">
                  <input
                    type="number"
                    min={1}
                    max={pagination.last_page}
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    className="w-14 text-center px-1 bg-transparent outline-none border-b border-gray-300 focus:border-green-700"
                  />
                </form>
                <span className="text-gray-600">dari {pagination.last_page}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={pagination.current_page >= pagination.last_page}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada kos yang ditemukan</h3>
          <p className="text-gray-600">Coba ubah kriteria pencarian untuk menemukan kos yang sesuai</p>
        </div>
      )}
    </div>
  );
});

SearchResults.displayName = 'SearchResults';

export default SearchResults;

