import { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import api from '../../services/axios';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  ArrowLeft,
  Calendar,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Loader2,
} from 'lucide-react';

const PembelianPage = memo(() => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // State for transactions
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch product transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/transaksi-produk/user/${user.id}`);
        setTransactions(response.data.data || response.data || []);
      } catch (err) {
        console.error('Failed to fetch product transactions:', err);
        setError('Failed to load purchases');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchTransactions();
    }
  }, [user?.id, isAuthenticated]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'lunas':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Lunas
          </span>
        );
      case 'belum_lunas':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Belum Lunas
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';
  };

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please login to view your purchases</p>
          <Link
            to="/login"
            className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
          <span className="text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  /* -------------------- MOBILE VIEW -------------------- */
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-50">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Daftar Pembelian
          </h1>
        </div>

        <div className="px-6 py-6 space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada pembelian
              </h3>
              <p className="text-gray-500">
                Mulai berbelanja produk kebutuhan harian Anda
              </p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id_transaksi}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {transaction.produk?.judul_produk || 'Produk'}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Package className="w-3 h-3" />
                        {transaction.jumlah} x{' '}
                        {formatCurrency(transaction.harga_satuan)}
                      </p>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(transaction.tanggal_transaksi)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        Total:{' '}
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(transaction.subtotal)}
                        </span>
                      </span>
                      <span className="text-xs text-gray-400">
                        #{transaction.no_order}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  /* -------------------- DESKTOP VIEW (with DashboardLayout) -------------------- */
  return (
    <DashboardLayout
      title="Daftar Pembelian"
      subtitle="Kelola dan lihat riwayat pembelian produk Anda"
      activeItem="pembelian"
    >
      <div className="space-y-6">
        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Belum ada pembelian
            </h3>
            <p className="text-gray-500 mb-6">
              Mulai berbelanja produk kebutuhan harian Anda
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id_transaksi}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {transaction.produk?.judul_produk || 'Produk'}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Package className="w-4 h-4" />
                        Jumlah: {transaction.jumlah} item
                      </p>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Tanggal Pembelian</p>
                      <p className="font-medium">
                        {formatDate(transaction.tanggal_transaksi)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Harga Satuan</p>
                      <p className="font-medium">
                        {formatCurrency(transaction.harga_satuan)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Amount</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(transaction.subtotal)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Order Number</p>
                      <p className="font-mono text-xs">
                        {transaction.no_order}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
});

PembelianPage.displayName = 'PembelianPage';

// Wrapped with ProtectedRoute
const PembelianPageWrapper = () => {
  return (
    <ProtectedRoute>
      <PembelianPage />
    </ProtectedRoute>
  );
};

export default PembelianPageWrapper;
