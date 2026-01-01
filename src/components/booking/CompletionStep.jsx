import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { 
  CheckCircle2, 
  Calendar, 
  Home, 
  MapPin,
  ArrowRight,
  Download,
  MessageCircle
} from 'lucide-react';

const CompletionStep = ({
  orderNumber,
  kamarData,
  kosData,
  bookingData,
  adminPhone = '6281234567890',
}) => {
  // Generate WhatsApp link for confirmation
  const getWhatsAppLink = () => {
    const message = `Halo admin, saya telah melakukan pemesanan dengan nomor order: ${orderNumber}. Mohon konfirmasi pembayaran saya. Terima kasih!`;
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
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
        <div className="p-6 border-b border-gray-100">
          <p className="text-sm text-gray-500 text-center mb-2">Nomor Pesanan</p>
          <p className="text-3xl font-bold text-gray-900 text-center font-mono">
            {orderNumber}
          </p>
        </div>

        {/* Booking Details */}
        <div className="p-6 space-y-4">
          {/* Room Info */}
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              {kamarData?.gallery?.[0] && (
                <img
                  src={typeof kamarData.gallery[0] === 'string' 
                    ? kamarData.gallery[0].startsWith('http') 
                      ? kamarData.gallery[0] 
                      : `https://admin.haven.co.id${kamarData.gallery[0]}`
                    : kamarData.gallery[0]?.url_gambar 
                      ? `https://admin.haven.co.id${kamarData.gallery[0].url_gambar}`
                      : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200'}
                  alt={kamarData?.nama_kamar}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {kamarData?.nama_kamar || kamarData?.nama}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Home className="w-4 h-4" />
                {kosData?.nama || kamarData?.kos?.nama}
              </p>
              {(kosData?.alamat || kamarData?.kos?.alamat) && (
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {kosData?.alamat || kamarData?.kos?.alamat}
                </p>
              )}
            </div>
          </div>

          {/* Date Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                Check-in
              </p>
              <p className="font-semibold text-gray-900">
                {bookingData?.checkInDate 
                  ? format(bookingData.checkInDate, 'd MMMM yyyy', { locale: localeId })
                  : '-'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                Check-out
              </p>
              <p className="font-semibold text-gray-900">
                {bookingData?.checkOutDate 
                  ? format(bookingData.checkOutDate, 'd MMMM yyyy', { locale: localeId })
                  : '-'}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="bg-indigo-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-indigo-600 font-medium">Total Pembayaran</span>
              <span className="text-xl font-bold text-indigo-700">
                Rp {bookingData?.price?.toLocaleString('id-ID') || '0'}
              </span>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <strong>Penting:</strong> Silakan lakukan pembayaran sesuai instruksi dan konfirmasi melalui WhatsApp admin untuk proses verifikasi.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 space-y-3">
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
  );
};

export default CompletionStep;