import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import api from '../../services/axios';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  XCircle,
  Receipt,
  MapPin,
} from 'lucide-react';

const TagihanPage = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  // State for transactions
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for payment details
  const [pembayaranData, setPembayaranData] = useState(null);
  const [isPembayaranLoading, setIsPembayaranLoading] = useState(false);
  const [pembayaranError, setPembayaranError] = useState(null);

  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/user/${user.id}/transaksi`);
        setTransactions(response.data.data || response.data || []);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load bills');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.id]);

  // Fetch pembayaran details when transaction is selected
  useEffect(() => {
    const fetchPembayaranDetail = async () => {
      if (!selectedTransactionId) {
        setPembayaranData(null);
        return;
      }

      setIsPembayaranLoading(true);
      setPembayaranError(null);

      try {
        const response = await api.get(`/pembayaran/${selectedTransactionId}`);
        setPembayaranData(response.data.data || response.data);
      } catch (err) {
        console.error('Failed to fetch pembayaran details:', err);
        setPembayaranError('Failed to load payment details');
      } finally {
        setIsPembayaranLoading(false);
      }
    };

    fetchPembayaranDetail();
  }, [selectedTransactionId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'booked':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Booked
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
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
    return amount
      ? new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(amount)
      : 'Rp 0';
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '';
  };

  // Get selected transaction
  const selectedTransaction = transactions.find(
    (t) => t.id === selectedTransactionId
  );

  // Payment Detail View Component for Desktop
  const PaymentDetailView = () => {
    if (!selectedTransaction) return null;

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedTransactionId(null)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Tagihan
          </button>
        </div>

        {/* Transaction Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedTransaction.kos?.nama || '-'}
              </h2>
              <p className="text-gray-600 mt-1">
                Room: {selectedTransaction.kamar?.nama || selectedTransaction.kamar?.nama_kamar || '-'} •{' '}
                {selectedTransaction.kos?.alamat_kota || ''}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Order: {selectedTransaction.no_order || ''}
              </p>
            </div>
            {getStatusBadge(selectedTransaction.status)}
          </div>
        </div>

        {isPembayaranLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <span>Loading payment details...</span>
          </div>
        ) : pembayaranError ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Payment Details
            </h3>
            <p className="text-red-600">{pembayaranError}</p>
          </div>
        ) : pembayaranData ? (
          <div className="grid gap-6">
            {/* Transaction Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Info Transaksi</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(pembayaranData.transaksi?.harga || selectedTransaction.harga)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quantity</p>
                    <p className="font-semibold">
                      {pembayaranData.transaksi?.quantity || selectedTransaction.quantity || 1} room(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-in</p>
                    <p className="font-semibold">
                      {formatDate(pembayaranData.transaksi?.start_order_date || selectedTransaction.start_order_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-out</p>
                    <p className="font-semibold">
                      {formatDate(pembayaranData.transaksi?.end_order_date || selectedTransaction.end_order_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Daftar Tagihan ({pembayaranData.pembayarans?.length || selectedTransaction.pembayaran?.length || 0})
                </h3>
              </div>
              <div className="p-6">
                {(pembayaranData.pembayarans?.length || selectedTransaction.pembayaran?.length) === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No payment history available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(pembayaranData.pembayarans || selectedTransaction.pembayaran || []).map((payment) => (
                      <div
                        key={payment.pembayaran_id}
                        className="border border-gray-200 p-4 rounded-lg space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {payment.keterangan ||
                                `${payment.jenis_bayar} - ${payment.tipe_bayar}`}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">
                              {payment.jenis_bayar} • {payment.tipe_bayar}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(payment.tanggal)}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.status === 'lunas'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.status || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="font-bold text-xl text-green-600">
                            {formatCurrency(payment.nominal)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Code: {payment.kode_pembayaran || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Fallback: use transaction pembayaran data directly
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Daftar Tagihan ({selectedTransaction.pembayaran?.length || 0})
              </h3>
            </div>
            <div className="p-6">
              {!selectedTransaction.pembayaran?.length ? (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No payment history available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedTransaction.pembayaran.map((payment) => (
                    <div
                      key={payment.pembayaran_id}
                      className="border border-gray-200 p-4 rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            {payment.keterangan || `${payment.jenis_bayar} - ${payment.tipe_bayar}`}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {payment.jenis_bayar} • {payment.tipe_bayar}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(payment.tanggal)}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === 'lunas'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="font-bold text-xl text-green-600">
                          {formatCurrency(payment.nominal)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Code: {payment.kode_pembayaran || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
          <span className="text-gray-700">Loading bills...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Bills
          </h3>
          <p className="text-gray-600">Please try again later.</p>
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
          {selectedTransactionId ? (
            <button
              onClick={() => setSelectedTransactionId(null)}
              className="p-1"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          ) : (
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900">
            {selectedTransactionId ? 'Detail Tagihan' : 'Tagihan Saya'}
          </h1>
        </div>

        <div className="px-6 py-6">
          {selectedTransactionId ? (
            <div className="space-y-4">
              {/* Mobile Payment Detail View */}
              {isPembayaranLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading payment details...</span>
                </div>
              ) : pembayaranError ? (
                <div className="text-center py-12">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Error Loading Payment Details
                  </h3>
                  <p className="text-red-600">{pembayaranError}</p>
                </div>
              ) : (
                <>
                  {/* Transaction Info Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Info Transaksi
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-lg text-green-600">
                          {formatCurrency(
                            pembayaranData?.transaksi?.harga || selectedTransaction?.harga
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-semibold">
                          {pembayaranData?.transaksi?.quantity || selectedTransaction?.quantity || 1} room(s)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-semibold">
                          {formatDate(
                            pembayaranData?.transaksi?.start_order_date || selectedTransaction?.start_order_date
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-semibold">
                          {formatDate(
                            pembayaranData?.transaksi?.end_order_date || selectedTransaction?.end_order_date
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Daftar Tagihan (
                      {pembayaranData?.pembayarans?.length || selectedTransaction?.pembayaran?.length || 0}
                      )
                    </h3>
                    {(pembayaranData?.pembayarans?.length || selectedTransaction?.pembayaran?.length) === 0 ? (
                      <div className="text-center py-8">
                        <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          No payment history available
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(pembayaranData?.pembayarans || selectedTransaction?.pembayaran || []).map(
                          (payment) => (
                            <div
                              key={payment.pembayaran_id}
                              className="bg-gray-50 p-3 rounded-lg space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {payment.keterangan ||
                                      `${payment.jenis_bayar} - ${payment.tipe_bayar}`}
                                  </h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {payment.jenis_bayar} •{' '}
                                    {payment.tipe_bayar}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(payment.tanggal)}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    payment.status === 'lunas'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {payment.status || 'Unknown'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="text-sm text-gray-600">
                                  Amount:
                                </span>
                                <span className="font-bold text-lg text-green-600">
                                  {formatCurrency(payment.nominal)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">
                                Code: {payment.kode_pembayaran || 'N/A'}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Bills Found
                  </h3>
                  <p className="text-gray-600">
                    You don't have any bills at the moment.
                  </p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {transaction.kos?.nama || '-'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Room: {transaction.kamar?.nama || transaction.kamar?.nama_kamar || '-'}
                          </p>
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(transaction.start_order_date)} -{' '}
                            {formatDate(transaction.end_order_date)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>
                            Amount:{' '}
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(transaction.harga)}
                            </span>
                          </span>
                          <span className="text-xs text-gray-400">
                            {transaction.no_order}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setSelectedTransactionId(transaction.id)}
                          className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat Tagihan
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* -------------------- DESKTOP VIEW -------------------- */
  return (
    <DashboardLayout
      title={selectedTransactionId ? 'Detail Tagihan' : 'Tagihan Saya'}
      subtitle={
        selectedTransactionId
          ? 'Detail pembayaran dan tagihan'
          : 'Kelola tagihan dan riwayat pembayaran Anda'
      }
      activeItem="tagihan"
    >
      {selectedTransactionId ? (
        <PaymentDetailView />
      ) : (
        <div className="space-y-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Bills Found
              </h3>
              <p className="text-gray-600">
                You don't have any bills at the moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transaction.kos?.nama || '-'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Room: {transaction.kamar?.nama || transaction.kamar?.nama_kamar || '-'} •{' '}
                          {transaction.kos?.alamat_kota || ''}
                        </p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-green-600 text-lg">
                          {formatCurrency(transaction.harga)}
                        </span>
                        <span className="ml-2">• {transaction.no_order}</span>
                      </div>
                      <button
                        onClick={() => setSelectedTransactionId(transaction.id)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat Tagihan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
});

TagihanPage.displayName = 'TagihanPage';

// Wrapped with ProtectedRoute
const TagihanPageWrapper = () => {
  return (
    <ProtectedRoute>
      <TagihanPage />
    </ProtectedRoute>
  );
};

export default TagihanPageWrapper;
