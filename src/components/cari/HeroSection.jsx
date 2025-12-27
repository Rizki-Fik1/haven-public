import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTipeKos } from '../../services/kosService';
import { getLocations } from '../../services/locationService';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State management
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedTipe, setSelectedTipe] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('');
  
  // Data state
  const [locations, setLocations] = useState([]);
  const [tipeKosOptions, setTipeKosOptions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showCheckInDuration, setShowCheckInDuration] = useState(false);

  // Duration options
  const durationOptions = [
    { value: '1-day', label: '1 Hari', days: 1 },
    { value: '1-month', label: '1 Bulan', days: 30 },
    { value: '3-months', label: '3 Bulan', days: 90 },
    { value: '6-months', label: '6 Bulan', days: 180 },
    { value: '1-year', label: '1 Tahun', days: 365 },
  ];

  const jenisKosOptions = ['Putra', 'Putri', 'Campur'];

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both location and tipe kos data
        const [locationsRes, tipeKosRes] = await Promise.allSettled([
          getLocations(),
          getTipeKos()
        ]);
        
        // Handle locations with fallback
        if (locationsRes.status === 'fulfilled' && locationsRes.value?.data) {
          setLocations(locationsRes.value.data);
        } else {
          console.warn('Failed to fetch locations:', locationsRes.reason);
          setLocations([]); // Use empty array as fallback
        }

        // Handle tipe kos with fallback
        if (tipeKosRes.status === 'fulfilled' && tipeKosRes.value?.data) {
          setTipeKosOptions(tipeKosRes.value.data);
        } else {
          console.warn('Failed to fetch tipe kos:', tipeKosRes.reason);
          setTipeKosOptions([]); // Use empty array as fallback
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set fallback data even on catch
        setLocations([]);
        setTipeKosOptions([]);
      }
    };

    fetchData();
  }, []);

  // Initialize from URL parameters
  useEffect(() => {
    const city = searchParams.get('city');
    const duration = searchParams.get('duration');
    const tipe = searchParams.get('tipe');
    const jenis = searchParams.get('jenis');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');

    if (city && locations.length > 0) {
      const location = locations.find(loc => loc.nama.toLowerCase() === city.toLowerCase());
      if (location) setSelectedLocationId(location.id.toString());
    }

    if (duration) setSelectedDuration(duration);
    if (tipe) setSelectedTipe(tipe);
    if (jenis) setSelectedJenis(jenis);
    if (checkInParam) setCheckIn(checkInParam);
    if (checkOutParam) setCheckOut(checkOutParam);
  }, [searchParams, locations]);

  // Handle duration selection
  const handleDurationChange = (value) => {
    setSelectedDuration(value);
    if (checkIn && value) {
      const selectedOption = durationOptions.find(opt => opt.value === value);
      if (selectedOption) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + selectedOption.days);
        setCheckOut(checkOutDate.toISOString().split('T')[0]);
      }
    }
  };

  // Handle check-in change
  const handleCheckInChange = (date) => {
    setCheckIn(date);
    if (date && selectedDuration) {
      const selectedOption = durationOptions.find(opt => opt.value === selectedDuration);
      if (selectedOption) {
        const checkInDate = new Date(date);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + selectedOption.days);
        setCheckOut(checkOutDate.toISOString().split('T')[0]);
      }
    }
  };

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    const selectedLocation = locations.find(loc => loc.id.toString() === selectedLocationId);
    if (selectedLocation) params.append('city', selectedLocation.nama);
    if (selectedDuration) params.append('duration', selectedDuration);
    if (selectedTipe) params.append('tipe', selectedTipe);
    if (selectedJenis) params.append('jenis', selectedJenis);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div
      className="relative min-h-[400px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/apartment-hero.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cari Kos atau Apartemen
          </h1>
          <p className="text-lg opacity-90">
            Segera cari tempat yang ingin anda inap, atur jadwal checkin dan checkout
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_3rem_1fr] gap-4 items-end">
            {/* Location Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block text-left">
                Pilih Lokasi
              </label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full h-12 px-3 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="">Pilih Lokasi</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Check In */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700 block text-left">
                Check In
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  onFocus={() => setShowCheckInDuration(true)}
                  onBlur={() => setTimeout(() => setShowCheckInDuration(false), 200)}
                  className="w-full h-12 px-3 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
                
                {/* Duration Selection Dropdown */}
                {showCheckInDuration && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
                    <h3 className="font-semibold mb-3 text-sm">Pilih Durasi</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDuration('');
                          setShowCheckInDuration(false);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          selectedDuration === ''
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Semua
                      </button>
                      {durationOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            handleDurationChange(option.value);
                            setShowCheckInDuration(false);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            selectedDuration === option.value
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Check Out */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block text-left">
                Check Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full h-12 px-3 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            {/* Settings Dropdown */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-transparent block text-left">
                Settings
              </label>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                onBlur={() => setTimeout(() => setShowSettings(false), 200)}
                className="w-12 h-12 border border-gray-200 rounded-lg bg-white flex items-center justify-center hover:border-emerald-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
                  <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M17.5 10C17.5 10.3333 17.4667 10.6583 17.4083 10.975L15.1417 11.6917C15.025 12.1167 14.8583 12.525 14.65 12.9083L15.7167 14.9583C15.4583 15.3 15.1667 15.6167 14.8417 15.9083L12.7917 14.8417C12.4083 15.05 12 15.2167 11.575 15.3333L10.8583 17.6C10.575 17.65 10.2833 17.675 10 17.675C9.71667 17.675 9.425 17.65 9.14167 17.6L8.425 15.3333C8 15.2167 7.59167 15.05 7.20833 14.8417L5.15833 15.9083C4.83333 15.6167 4.54167 15.3 4.28333 14.9583L5.35 12.9083C5.14167 12.525 4.975 12.1167 4.85833 11.6917L2.59167 10.975C2.53333 10.6583 2.5 10.3333 2.5 10C2.5 9.66667 2.53333 9.34167 2.59167 9.025L4.85833 8.30833C4.975 7.88333 5.14167 7.475 5.35 7.09167L4.28333 5.04167C4.54167 4.7 4.83333 4.38333 5.15833 4.09167L7.20833 5.15833C7.59167 4.95 8 4.78333 8.425 4.66667L9.14167 2.4C9.425 2.35 9.71667 2.325 10 2.325C10.2833 2.325 10.575 2.35 10.8583 2.4L11.575 4.66667C12 4.78333 12.4083 4.95 12.7917 5.15833L14.8417 4.09167C15.1667 4.38333 15.4583 4.7 15.7167 5.04167L14.65 7.09167C14.8583 7.475 15.025 7.88333 15.1417 8.30833L17.4083 9.025C17.4667 9.34167 17.5 9.66667 17.5 10Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>

              {/* Settings Dropdown Content */}
              {showSettings && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
                  {/* Tipe Kos */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Tipe Kos
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTipe('')}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          selectedTipe === ''
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Semua
                      </button>
                      {tipeKosOptions.map((tipe) => (
                        <button
                          key={tipe.id}
                          type="button"
                          onClick={() => setSelectedTipe(tipe.nama)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            selectedTipe === tipe.nama
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {tipe.nama}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Jenis Kos */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Jenis Kos
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedJenis('')}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          selectedJenis === ''
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Semua
                      </button>
                      {jenisKosOptions.map((jenis) => (
                        <button
                          key={jenis}
                          type="button"
                          onClick={() => setSelectedJenis(jenis)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            selectedJenis === jenis
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {jenis}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-transparent block text-left">
                Action
              </label>
              <button
                onClick={handleSearch}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
