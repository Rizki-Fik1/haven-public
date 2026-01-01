import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { 
  CheckCircle2, 
  Calendar, 
  Home, 
  ArrowRight,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useTransactionDetail } from '../../services/transactionService';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import api from '../../services/axios';

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');
  
  const [adminPhone, setAdminPhone] = useState('6281234567890');

  // Fetch admin phone
  useEffect(() => {
    const fetchNomorWa = async () => {
      try {
        const response = await api.get('/get-nomor-wa');
        if (response.data.success && response.data.data) {
          setAdminPhone(response.data.data.nomor_wa);
        }
      } catch (err) {
        console.error('Error fetching nomor WA:', err);
      }
    };
    fetchNomorWa();
  }, []);

  // Generate WhatsApp link
  const getWhatsAppLink = () => {
    const message = `Halo admin, saya telah melakukan pemesanan dengan nomor order: ${orderNumber || orderId || 'N/A'}. Mohon konfirmasi pembayaran saya. Terima kasih!`;
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pemesanan Berhasil!</h2>
            <p className="text-green-100">
              Terima kasih telah melakukan pemesanan
            </p>
          </div>

          {/* Order Number */}
          {(orderNumber || orderId) && (
            <div className="p-6 border-b border-gray-100">
              <p className="text-sm text-gray-500 text-center mb-2">Nomor Pesanan</p>
              <p className="text-3xl font-bold text-gray-900 text-center font-mono">
                {orderNumber || orderId}
              </p>
            </div>
          )}

          {/* Important Notice */}
          <div className="p-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Penting:</strong> Silakan lakukan pembayaran sesuai instruksi dan konfirmasi melalui WhatsApp admin untuk proses verifikasi.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {/* WhatsApp Confirmation */}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Konfirmasi via WhatsApp
              </a>

              {/* View Transactions */}
              <Link
                to="/transaksi"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Lihat Transaksi Saya
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Back to Home */}
              <Link
                to="/"
                className="w-full bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl transition-colors border border-gray-200 flex items-center justify-center"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapped with ProtectedRoute
const BookingSuccessPageWrapper = () => {
  return (
    <ProtectedRoute>
      <BookingSuccessPage />
    </ProtectedRoute>
  );
};

export default BookingSuccessPageWrapper;   