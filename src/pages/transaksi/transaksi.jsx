import { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import api from '../../services/axios';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Receipt,
  MessageCircle,
  X,
} from 'lucide-react';

// Payment History Modal Component
const PaymentHistoryModal = ({
  isOpen,
  onClose,
  payments = [],
  kosName = 'Unknown',
  formatCurrency,
  formatDate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
            <p className="text-sm text-gray-600">{kosName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {payments?.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No payment history available</p>
            </div>
          ) : (
            payments?.map((payment) => (
              <div
                key={payment?.pembayaran_id}
                className="bg-gray-50 p-4 rounded-lg space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {payment?.keterangan || 'N/A'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {payment?.jenis_bayar || 'N/A'} • {payment?.tipe_bayar || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(payment?.tanggal)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment?.status === 'lunas'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment?.status || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(payment?.nominal)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Code: {payment?.kode_pembayaran || 'N/A'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TransaksiPage = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // State for transactions
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for admin phone number
  const [adminPhone, setAdminPhone] = useState('');

  // State for modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setError('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.id]);

  // Fetch nomor WA on component mount
  useEffect(() => {
    const fetchNomorWa = async () => {
      try {
        const response = await api.get('/get-nomor-wa');
        if (response.data.success && response.data.data) {
          setAdminPhone(response.data.data.nomor_wa);
        } else {
          console.warn('Failed to fetch nomor WA:', response.data.message);
          setAdminPhone('6281234567890');
        }
      } catch (err) {
        console.error('Error fetching nomor WA:', err);
        setAdminPhone('6281234567890');
      }
    };

    fetchNomorWa();
  }, []);

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

  // WhatsApp Admin Link Generator
  const getWhatsAppLink = (transaction) => {
    const phone = adminPhone || '6281234567890';
    const message = `Halo admin, saya ingin konfirmasi pembayaran untuk order ID: ${transaction.no_order}. Status: ${transaction.status}. Terima kasih!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Open payment history modal
  const openPaymentModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Close payment history modal
  const closePaymentModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
          <span className="text-gray-700">Loading transactions...</span>
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
            Error Loading Transactions
          </h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  /* -------------------- MOBILE VIEW -------------------- */
  if (isMobile) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-50">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Transaksi Saya
            </h1>
          </div>

          <div className="px-6 py-6 space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Transactions Found
                </h3>
                <p className="text-gray-600">
                  You haven't made any bookings yet.
                </p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction?.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {transaction?.kos?.nama || '-'}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {transaction?.kos?.alamat_kota || ''}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Room: {transaction?.kamar?.nama || transaction?.kamar?.nama_kamar || ''}
                        </p>
                      </div>
                      {getStatusBadge(transaction?.status)}
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(transaction?.start_order_date)} -{' '}
                          {formatDate(transaction?.end_order_date)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>
                          Total:{' '}
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(transaction?.harga)}
                          </span>
                        </span>
                        <span className="text-xs text-gray-400">
                          ID: {transaction?.no_order || ''}
                        </span>
                      </div>

                      {/* Payment History Button for Mobile */}
                      <div className="pt-2">
                        <button
                          onClick={() => openPaymentModal(transaction)}
                          className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Receipt className="w-4 h-4" />
                          View Payment History ({transaction?.pembayaran?.length || 0})
                        </button>
                      </div>

                      {/* Hubungi Admin Button for Pending Payments */}
                      {transaction?.status === 'pending' && (
                        <div className="pt-2">
                          <a
                            href={getWhatsAppLink(transaction)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Hubungi Admin
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment History Modal */}
        <PaymentHistoryModal
          isOpen={isModalOpen}
          onClose={closePaymentModal}
          payments={selectedTransaction?.pembayaran || []}
          kosName={selectedTransaction?.kos?.nama || 'Unknown'}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </>
    );
  }

  /* -------------------- DESKTOP VIEW (with DashboardLayout) -------------------- */
  return (
    <>
      <DashboardLayout
        title="Transaksi Saya"
        subtitle="Kelola dan lihat riwayat transaksi booking Anda"
        activeItem="transaksi"
      >
        <div className="space-y-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Transactions Found
              </h3>
              <p className="text-gray-600">You haven't made any bookings yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction?.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transaction?.kos?.nama || ''}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {transaction?.kos?.alamat_kota || ''}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Room: {transaction?.kamar?.nama || transaction?.kamar?.nama_kamar || ''} • Type:{' '}
                          {transaction?.kamar?.jenis_kos || ''}
                        </p>
                      </div>
                      {getStatusBadge(transaction?.status)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Check-in</p>
                        <p className="font-medium">
                          {formatDate(transaction?.start_order_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Check-out</p>
                        <p className="font-medium">
                          {formatDate(transaction?.end_order_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Quantity</p>
                        <p className="font-medium">
                          {transaction?.quantity || 1} room(s)
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Amount</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(transaction?.harga)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Order ID</p>
                        <p className="font-mono text-xs">
                          {transaction?.no_order || ''}
                        </p>
                      </div>
                    </div>

                    {/* Payment History Section */}
                    {transaction?.pembayaran?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Payment History:
                        </p>
                        <div className="space-y-2">
                          {transaction.pembayaran?.map((payment) => (
                            <div
                              key={payment?.pembayaran_id}
                              className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded"
                            >
                              <span>{payment?.keterangan || 'N/A'}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {formatCurrency(payment?.nominal)}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    payment?.status === 'lunas'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {payment?.status || 'Unknown'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hubungi Admin Button for Pending Payments */}
                    {transaction?.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <a
                          href={getWhatsAppLink(transaction)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Hubungi Admin
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>

      {/* Payment History Modal */}
      <PaymentHistoryModal
        isOpen={isModalOpen}
        onClose={closePaymentModal}
        payments={selectedTransaction?.pembayaran || []}
        kosName={selectedTransaction?.kos?.nama || 'Unknown'}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </>
  );
});

TransaksiPage.displayName = 'TransaksiPage';

// Wrapped with ProtectedRoute
const TransaksiPageWrapper = () => {
  return (
    <ProtectedRoute>
      <TransaksiPage />
    </ProtectedRoute>
  );
};

export default TransaksiPageWrapper;
