import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, ChevronDown, MapPin, Home, AlertCircle } from 'lucide-react';
import { format, addDays, addMonths, addYears } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useAuthContext } from '../../context/AuthContext';
import { parseKetersediaan, isDateRangeAvailable } from './AvailabilitySection';

const DURATION_OPTIONS = [
  { value: '1-day', label: 'Harian', days: 1 },
  { value: '1-month', label: '1 Bulan', months: 1 },
  { value: '3-months', label: '3 Bulan', months: 3 },
  { value: '6-months', label: '6 Bulan', months: 6 },
  { value: '1-year', label: '1 Tahun', years: 1 },
];

const BookingInformation = ({
  kamarData,
  kosData,
  initialCheckIn,
  initialDuration = '1-month',
  onNext,
  onDataChange,
}) => {
  const { user } = useAuthContext();
  const [checkInDate, setCheckInDate] = useState(initialCheckIn || new Date());
  const [duration, setDuration] = useState(initialDuration);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  
  // Form data
  const [guestName, setGuestName] = useState(user?.nama || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || user?.nomor_hp || '');

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

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        checkInDate,
        checkOutDate,
        duration,
        guestName,
        guestEmail,
        guestPhone,
        price: displayPrice.price,
        priceLabel: displayPrice.label,
        isValid: isBookingDatesValid,
      });
    }
  }, [checkInDate, duration, guestName, guestEmail, guestPhone, isBookingDatesValid]);

  const handleNext = () => {
    if (!guestName || !guestEmail || !guestPhone) {
      alert('Mohon lengkapi semua data');
      return;
    }

    if (hasAvailabilityRestriction && !isBookingDatesValid) {
      alert('Tanggal yang dipilih tidak tersedia. Silakan pilih tanggal dalam periode ketersediaan.');
      return;
    }

    onNext({
      checkInDate,
      checkOutDate,
      duration,
      guestName,
      guestEmail,
      guestPhone,
      price: displayPrice.price,
      priceLabel: displayPrice.label,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Room Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
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
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {kamarData?.nama_kamar || kamarData?.nama || 'Kamar'}
              </h3>
              <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">
                <Home className="w-4 h-4" />
                {kosData?.nama || kamarData?.kos?.nama || 'Kos'}
              </p>
              {(kosData?.alamat || kamarData?.kos?.alamat) && (
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {kosData?.alamat || kamarData?.kos?.alamat}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Detail Booking</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Check-In
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={format(checkInDate, 'yyyy-MM-dd')}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setCheckInDate(new Date(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
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
                  className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-left hover:border-indigo-500 transition-colors"
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
                            duration === option.value ? 'bg-indigo-50 text-indigo-600' : ''
                          }`}
                        >
                          <span>{option.label}</span>
                          <span className="text-sm text-gray-500">
                            Rp {priceForDuration?.toLocaleString('id-ID')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Check-out Display */}
          <div className={`mt-4 rounded-xl p-4 ${isBookingDatesValid ? 'bg-indigo-50' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-medium ${isBookingDatesValid ? 'text-indigo-600' : 'text-red-600'}`}>Check-Out</p>
                <p className={`font-semibold ${isBookingDatesValid ? 'text-indigo-900' : 'text-red-900'}`}>
                  {format(checkOutDate, 'd MMMM yyyy', { locale: localeId })}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${isBookingDatesValid ? 'text-indigo-600' : 'text-red-600'}`}>Durasi</p>
                <p className={`font-semibold ${isBookingDatesValid ? 'text-indigo-900' : 'text-red-900'}`}>
                  {DURATION_OPTIONS.find(d => d.value === duration)?.label}
                </p>
              </div>
            </div>
          </div>

          {/* Availability Warning */}
          {hasAvailabilityRestriction && !isBookingDatesValid && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Tanggal tidak tersedia</p>
                <p className="text-xs text-red-600 mt-1">
                  Kamar ini hanya tersedia pada periode tertentu. Silakan pilih tanggal yang sesuai dengan ketersediaan.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Guest Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Penghuni</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Masukkan email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Masukkan nomor telepon"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
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
                Rp {displayPrice.price?.toLocaleString('id-ID') || '0'}
              </span>
              <span className="text-base font-medium opacity-90">{displayPrice.label}</span>
            </div>
          </div>

          <div className="p-6">
            {/* Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-in</span>
                <span className="font-medium text-gray-900">
                  {format(checkInDate, 'd MMM yyyy', { locale: localeId })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-out</span>
                <span className="font-medium text-gray-900">
                  {format(checkOutDate, 'd MMM yyyy', { locale: localeId })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Durasi</span>
                <span className="font-medium text-gray-900">
                  {DURATION_OPTIONS.find(d => d.value === duration)?.label}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleNext}
              disabled={hasAvailabilityRestriction && !isBookingDatesValid}
              className={`w-full font-bold py-4 rounded-xl transition-all duration-300 shadow-md ${
                hasAvailabilityRestriction && !isBookingDatesValid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white hover:shadow-lg'
              }`}
            >
              {hasAvailabilityRestriction && !isBookingDatesValid 
                ? 'Tanggal Tidak Tersedia' 
                : 'Lanjutkan Pembayaran'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInformation;