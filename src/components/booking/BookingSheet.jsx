import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, Loader2, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { format, addDays, addMonths, addYears } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useCreateBooking } from '../../services/transactionService';
import { useUpdateProfile } from '../../services/authService';
import { useAuthContext } from '../../context/AuthContext';
import { parseKetersediaan, isDateRangeAvailable, getNearestAvailablePeriod } from './AvailabilitySection';

const DURATION_OPTIONS = [
  { value: '1-day', label: 'Harian', days: 1 },
  { value: '1-month', label: '1 Bulan', months: 1 },
  { value: '3-months', label: '3 Bulan', months: 3 },
  { value: '6-months', label: '6 Bulan', months: 6 },
  { value: '1-year', label: '1 Tahun', years: 1 },
];

const BookingSheet = ({
  isOpen,
  onClose,
  kamarData,
  kosData,
  initialCheckIn,
  initialDuration = '1-month',
}) => {
  const { user, refreshAuth } = useAuthContext();
  const [checkInDate, setCheckInDate] = useState(initialCheckIn || new Date());
  const [duration, setDuration] = useState(initialDuration);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  
  // Form data
  const [guestName, setGuestName] = useState(user?.nama || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || user?.nomor_hp || '');
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');

  const createBookingMutation = useCreateBooking();
  const updateProfileMutation = useUpdateProfile();

  // Parse availability periods
  const availabilityPeriods = parseKetersediaan(kamarData?.paket_harga?.ketersediaan);
  const hasAvailabilityRestriction = availabilityPeriods.length > 0;

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setGuestName(user.nama || '');
      setGuestEmail(user.email || '');
      setGuestPhone(user.phone || user.nomor_hp || '');
    }
  }, [user]);

  // Calculate check-out date based on duration
  const getCheckOutDate = () => {
    const durationOption = DURATION_OPTIONS.find(d => d.value === duration);
    if (!durationOption) return checkInDate;

    if (durationOption.days) {
      return addDays(checkInDate, durationOption.days);
    } else if (durationOption.months) {
      return addMonths(checkInDate, durationOption.months);
    } else if (durationOption.years) {
      return addYears(checkInDate, durationOption.years);
    }
    return checkInDate;
  };

  const checkOutDate = getCheckOutDate();

  // Check if booking dates are valid
  const isBookingDatesValid = !hasAvailabilityRestriction || 
    isDateRangeAvailable(checkInDate, checkOutDate, availabilityPeriods);

  // Get price based on duration
  const getDisplayPrice = () => {
    if (!kamarData?.paket_harga) return { price: 0, label: '' };

    const pricing = kamarData.paket_harga;
    const priceMap = {
      '1-day': { price: pricing.perharian_harga, label: '/hari' },
      '1-month': { price: pricing.perbulan_harga, label: '/bulan' },
      '3-months': { price: pricing.pertigabulan_harga, label: '/3 bulan' },
      '6-months': { price: pricing.perenambulan_harga, label: '/6 bulan' },
      '1-year': { price: pricing.pertahun_harga, label: '/tahun' },
    };

    return priceMap[duration] || { price: 0, label: '' };
  };

  const displayPrice = getDisplayPrice();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!guestName || !guestEmail || !guestPhone) {
      alert('Mohon lengkapi semua data');
      return;
    }

    // Validate availability
    if (hasAvailabilityRestriction && !isBookingDatesValid) {
      setAvailabilityError('Tanggal yang dipilih tidak tersedia. Silakan pilih tanggal dalam periode ketersediaan.');
      return;
    }

    setAvailabilityError('');

    try {
      // Update user profile first
      await updateProfileMutation.mutateAsync({
        nama: guestName,
        email: guestEmail,
        phone: guestPhone,
      });

      // Create booking transaction
      const transactionPayload = {
        user_id: user.id,
        tanggal: format(new Date(), 'yyyy-MM-dd'),
        harga: displayPrice.price || 0,
        quantity: 1,
        start_order_date: format(checkInDate, 'yyyy-MM-dd'),
        end_order_date: format(checkOutDate, 'yyyy-MM-dd'),
        kos_id: kosData?.id || kamarData?.kos_id || kamarData?.kos?.id,
        kamar_id: kamarData?.id,
        paket_id: kamarData?.paket_harga?.paket_id || kamarData?.paket_harga?.id || 1,
      };

      const result = await createBookingMutation.mutateAsync(transactionPayload);

      // Show success
      setOrderNumber(result.data?.no_order || result.no_order || 'N/A');
      setBookingSuccess(true);

      // Refresh auth to get updated user data
      refreshAuth();

    } catch (err) {
      console.error('Booking error:', err);
      alert(err.response?.data?.message || 'Gagal membuat pemesanan. Silakan coba lagi.');
    }
  };

  const handleClose = () => {
    setBookingSuccess(false);
    setOrderNumber('');
    onClose();
  };

  if (!isOpen) return null;

  // Success view
  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
        
        {/* Sheet */}
        <div className="relative bg-white w-full md:max-w-md md:mx-4 rounded-t-3xl md:rounded-2xl max-h-[85vh] overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Pemesanan Berhasil!
            </h3>
            <p className="text-gray-600 mb-4">
              Nomor pesanan Anda:
            </p>
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-2xl font-bold text-green-600 font-mono">
                {orderNumber}
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Silakan simpan nomor pesanan ini dan lakukan pembayaran sesuai instruksi yang akan dikirimkan.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      
      {/* Sheet */}
      <div className="relative bg-white w-full md:max-w-md md:mx-4 rounded-t-3xl md:rounded-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Booking Kamar
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Room Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">
              {kamarData?.nama_kamar || kamarData?.nama || 'Kamar'}
            </h4>
            <p className="text-sm text-gray-600">
              {kosData?.nama || kamarData?.kos?.nama || 'Kos'}
            </p>
          </div>

          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Check-In
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-left hover:border-green-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">
                    {format(checkInDate, 'd MMMM yyyy', { locale: localeId })}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {showCalendar && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <input
                    type="date"
                    value={format(checkInDate, 'yyyy-MM-dd')}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      setCheckInDate(new Date(e.target.value));
                      setShowCalendar(false);
                    }}
                    className="w-full border border-gray-200 rounded-lg p-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durasi Sewa
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDurationPicker(!showDurationPicker)}
                className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-left hover:border-green-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">
                    {DURATION_OPTIONS.find(d => d.value === duration)?.label}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {showDurationPicker && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {DURATION_OPTIONS.map((option) => {
                    const priceForDuration = kamarData?.paket_harga?.[
                      option.value === '1-day' ? 'perharian_harga' :
                      option.value === '1-month' ? 'perbulan_harga' :
                      option.value === '3-months' ? 'pertigabulan_harga' :
                      option.value === '6-months' ? 'perenambulan_harga' :
                      'pertahun_harga'
                    ];
                    
                    if (!priceForDuration) return null;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setDuration(option.value);
                          setShowDurationPicker(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                          duration === option.value ? 'bg-green-50 text-green-600' : ''
                        }`}
                      >
                        <span>{option.label}</span>
                        <span className="text-sm text-gray-500">
                          Rp {Number(priceForDuration)?.toLocaleString('id-ID')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Check-out Date Display */}
          <div className={`rounded-xl p-4 ${isBookingDatesValid ? 'bg-green-50' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm font-medium mb-1 ${isBookingDatesValid ? 'text-green-600' : 'text-red-600'}`}>Check-Out:</p>
            <p className={`font-semibold ${isBookingDatesValid ? 'text-green-900' : 'text-red-900'}`}>
              {format(checkOutDate, 'd MMMM yyyy', { locale: localeId })}
            </p>
          </div>

          {/* Availability Warning */}
          {hasAvailabilityRestriction && !isBookingDatesValid && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Tanggal tidak tersedia</p>
                <p className="text-xs text-red-600 mt-1">
                  Kamar ini hanya tersedia pada periode tertentu. Silakan pilih tanggal yang sesuai dengan ketersediaan.
                </p>
              </div>
            </div>
          )}

          {availabilityError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700">{availabilityError}</p>
            </div>
          )}

          {/* Guest Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Data Penghuni</h4>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Nomor Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Masukkan nomor telepon"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-gray-200 p-4 bg-white">
          {/* Price Summary */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Pembayaran</span>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900">
                Rp {Number(displayPrice.price)?.toLocaleString('id-ID') || '0'}
              </span>
              <span className="text-sm text-gray-500">{displayPrice.label}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              createBookingMutation.isPending || 
              updateProfileMutation.isPending || 
              (hasAvailabilityRestriction && !isBookingDatesValid)
            }
            className={`w-full font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              hasAvailabilityRestriction && !isBookingDatesValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white'
            }`}
          >
            {(createBookingMutation.isPending || updateProfileMutation.isPending) ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </>
            ) : hasAvailabilityRestriction && !isBookingDatesValid ? (
              'Tanggal Tidak Tersedia'
            ) : (
              'Konfirmasi Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSheet;
