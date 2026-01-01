import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { 
  CreditCard, 
  Building2, 
  Copy, 
  Check, 
  Loader2, 
  ChevronLeft,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Home
} from 'lucide-react';
import { useCreateBooking } from '../../services/transactionService';
import { useUpdateProfile } from '../../services/authService';
import { useAuthContext } from '../../context/AuthContext';
import api from '../../services/axios';

const BANK_OPTIONS = [
  { 
    id: 'bca', 
    name: 'BCA', 
    accountNumber: '1234567890',
    accountName: 'PT Haven Indonesia',
    logo: '🏦'
  },
  { 
    id: 'mandiri', 
    name: 'Mandiri', 
    accountNumber: '0987654321',
    accountName: 'PT Haven Indonesia',
    logo: '🏛️'
  },
  { 
    id: 'bni', 
    name: 'BNI', 
    accountNumber: '5678901234',
    accountName: 'PT Haven Indonesia',
    logo: '🏢'
  },
];

const PaymentStep = ({
  kamarData,
  kosData,
  bookingData,
  onBack,
  onComplete,
}) => {
  const { user, refreshAuth } = useAuthContext();
  const [selectedBank, setSelectedBank] = useState(BANK_OPTIONS[0]);
  const [copied, setCopied] = useState(false);
  const [adminPhone, setAdminPhone] = useState('');

  const createBookingMutation = useCreateBooking();
  const updateProfileMutation = useUpdateProfile();

  // Fetch admin phone number
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

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(selectedBank.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    try {
      // Update user profile first
      await updateProfileMutation.mutateAsync({
        nama: bookingData.guestName,
        email: bookingData.guestEmail,
        phone: bookingData.guestPhone,
      });

      // Create booking transaction
      const transactionPayload = {
        user_id: user.id,
        tanggal: format(new Date(), 'yyyy-MM-dd'),
        harga: bookingData.price || 0,
        quantity: 1,
        start_order_date: format(bookingData.checkInDate, 'yyyy-MM-dd'),
        end_order_date: format(bookingData.checkOutDate, 'yyyy-MM-dd'),
        kos_id: kosData?.id || kamarData?.kos_id || kamarData?.kos?.id,
        kamar_id: kamarData?.id,
        paket_id: kamarData?.paket_harga?.paket_id || kamarData?.paket_harga?.id || 1,
      };

      const result = await createBookingMutation.mutateAsync(transactionPayload);

      // Refresh auth to get updated user data
      refreshAuth();

      // Call onComplete with result
      onComplete({
        orderNumber: result.data?.no_order || result.no_order || 'N/A',
        transactionId: result.data?.id || result.id,
        ...bookingData,
      });

    } catch (err) {
      console.error('Booking error:', err);
      alert(err.response?.data?.message || 'Gagal membuat pemesanan. Silakan coba lagi.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Payment Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Kembali ke data booking</span>
        </button>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Metode Pembayaran
          </h3>

          {/* Bank Options */}
          <div className="space-y-3 mb-6">
            {BANK_OPTIONS.map((bank) => (
              <button
                key={bank.id}
                onClick={() => setSelectedBank(bank)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedBank.id === bank.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{bank.logo}</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{bank.name}</p>
                  <p className="text-sm text-gray-500">Transfer Bank</p>
                </div>
                {selectedBank.id === bank.id && (
                  <div className="ml-auto">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Bank Transfer Details */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Bank</p>
                <p className="font-semibold text-gray-900">{selectedBank.name}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Nomor Rekening</p>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {selectedBank.accountNumber}
                </p>
              </div>
              <button
                onClick={handleCopyAccountNumber}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm font-medium">Salin</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <p className="text-sm text-gray-500">Atas Nama</p>
              <p className="font-semibold text-gray-900">{selectedBank.accountName}</p>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Instruksi Pembayaran</h3>
          <ol className="space-y-3 text-gray-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
              <span>Transfer ke rekening {selectedBank.name} dengan nominal yang tertera</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
              <span>Simpan bukti transfer Anda</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
              <span>Konfirmasi pembayaran melalui WhatsApp admin</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
              <span>Tunggu konfirmasi dari admin (1x24 jam)</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Right Column - Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden border border-gray-100">
          {/* Price Header */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 p-6 text-white">
            <p className="text-sm font-medium opacity-90 mb-2">Total Pembayaran</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                Rp {bookingData?.price?.toLocaleString('id-ID') || '0'}
              </span>
              <span className="text-base font-medium opacity-90">{bookingData?.priceLabel}</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Room Info */}
            <div className="pb-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900">
                {kamarData?.nama_kamar || kamarData?.nama}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Home className="w-4 h-4" />
                {kosData?.nama || kamarData?.kos?.nama}
              </p>
            </div>

            {/* Booking Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-in
                </span>
                <span className="font-medium text-gray-900">
                  {format(bookingData?.checkInDate, 'd MMM yyyy', { locale: localeId })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-out
                </span>
                <span className="font-medium text-gray-900">
                  {format(bookingData?.checkOutDate, 'd MMM yyyy', { locale: localeId })}
                </span>
              </div>
            </div>

            {/* Guest Info */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                {bookingData?.guestName}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {bookingData?.guestEmail}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {bookingData?.guestPhone}
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={createBookingMutation.isPending || updateProfileMutation.isPending}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              {(createBookingMutation.isPending || updateProfileMutation.isPending) ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Konfirmasi Pemesanan'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Dengan mengklik tombol di atas, Anda menyetujui syarat dan ketentuan yang berlaku
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;