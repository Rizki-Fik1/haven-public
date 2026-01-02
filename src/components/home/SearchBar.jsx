import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { id } from 'date-fns/locale';
import { getTipeKos } from '../../services/kosService';
import { getLocations } from '../../services/locationService';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State management
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedTipe, setSelectedTipe] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('');

  // Data state
  const [locations, setLocations] = useState([]);
  const [tipeKosOptions, setTipeKosOptions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Duration options
  const durationOptions = [
    { value: '1-day', label: '1 Hari', days: 1 },
    { value: '1-month', label: '1 Bulan', days: 30 },
    { value: '3-months', label: '3 Bulan', days: 90 },
    { value: '6-months', label: '6 Bulan', days: 180 },
    { value: '1-year', label: '1 Tahun', days: 365 },
  ];

  const jenisKosOptions = ['Putra', 'Putri', 'Campur'];

  // Get selected location object
  const selectedLocation = locations.find((loc) => loc.id === selectedLocationId);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, tipeKosRes] = await Promise.allSettled([
          getLocations(),
          getTipeKos()
        ]);

        if (locationsRes.status === 'fulfilled' && locationsRes.value) {
          const locationData = Array.isArray(locationsRes.value.data) 
            ? locationsRes.value.data 
            : locationsRes.value.data?.data || locationsRes.value;
          
          if (Array.isArray(locationData) && locationData.length > 0) {
            setLocations(locationData);
          } else {
            setLocations([]);
          }
        } else {
          setLocations([]);
        }

        if (tipeKosRes.status === 'fulfilled' && tipeKosRes.value) {
          const tipeData = Array.isArray(tipeKosRes.value.data)
            ? tipeKosRes.value.data
            : tipeKosRes.value.data?.data || tipeKosRes.value;
          
          if (Array.isArray(tipeData) && tipeData.length > 0) {
            setTipeKosOptions(tipeData);
          } else {
            setTipeKosOptions([]);
          }
        } else {
          setTipeKosOptions([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLocations([]);
        setTipeKosOptions([]);
      }
    };

    fetchData();
  }, []);

  // Initialize from URL parameters
  useEffect(() => {
    const durationParam = searchParams.get('duration');
    if (durationParam) {
      setSelectedDuration(durationParam);
    } else {
      setSelectedDuration('');
    }

    const tipeParam = searchParams.get('tipe');
    if (tipeParam) {
      setSelectedTipe(tipeParam);
    } else {
      setSelectedTipe('');
    }

    const jenisParam = searchParams.get('jenis');
    if (jenisParam && jenisKosOptions.includes(jenisParam)) {
      setSelectedJenis(jenisParam);
    } else {
      setSelectedJenis('');
    }

    const checkInParam = searchParams.get('checkIn');
    if (checkInParam) {
      try {
        const checkInDate = parse(checkInParam, 'yyyy-MM-dd', new Date());
        if (!isNaN(checkInDate.getTime())) {
          setCheckIn(checkInDate);
        } else {
          setCheckIn(null);
        }
      } catch (error) {
        setCheckIn(null);
      }
    } else {
      setCheckIn(null);
    }

    const checkOutParam = searchParams.get('checkOut');
    if (checkOutParam) {
      try {
        const checkOutDate = parse(checkOutParam, 'yyyy-MM-dd', new Date());
        if (!isNaN(checkOutDate.getTime())) {
          setCheckOut(checkOutDate);
        } else {
          setCheckOut(null);
        }
      } catch (error) {
        setCheckOut(null);
      }
    } else {
      setCheckOut(null);
    }
  }, [searchParams]);

  // Separate effect for location initialization
  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam && locations.length > 0) {
      const location = locations.find((loc) => loc.nama.toLowerCase() === cityParam.toLowerCase());
      setSelectedLocationId(location?.id || null);
    } else {
      setSelectedLocationId(null);
    }
  }, [searchParams, locations]);

  // Handle duration selection and update checkout
  const handleDurationChange = (value) => {
    setSelectedDuration(value);
    const selectedOption = durationOptions.find((option) => option.value === value);
    if (selectedOption && checkIn) {
      const newCheckOut = new Date(checkIn);
      newCheckOut.setDate(checkIn.getDate() + selectedOption.days);
      setCheckOut(newCheckOut);
    }
  };

  // Handle check-in date selection
  const handleSelectCheckIn = (date) => {
    setCheckIn(date);
    if (date && selectedDuration) {
      const selectedOption = durationOptions.find((option) => option.value === selectedDuration);
      if (selectedOption) {
        const newCheckOut = new Date(date);
        newCheckOut.setDate(date.getDate() + selectedOption.days);
        setCheckOut(newCheckOut);
      }
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start from Sunday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedLocation) {
      params.append('city', selectedLocation.nama);
    }

    if (selectedDuration) {
      params.append('duration', selectedDuration);
    }

    if (selectedTipe) {
      params.append('tipe', selectedTipe);
    }

    if (selectedJenis) {
      params.append('jenis', selectedJenis);
    }

    if (checkIn) {
      params.append('checkIn', format(checkIn, 'yyyy-MM-dd'));
    }

    if (checkOut) {
      params.append('checkOut', format(checkOut, 'yyyy-MM-dd'));
    }

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="relative w-full flex justify-center z-10 -mt-20 mb-8">
      <div className="bg-white rounded-[16px] p-5 md:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex flex-col md:flex-row gap-4 items-stretch md:items-end max-w-[1200px] w-[calc(100%-48px)]">
        {/* Location Dropdown */}
        <div className="flex-1 md:flex-[1.2] flex flex-col gap-2.5 relative">
          <label className="text-md font-semibold text-gray-700 pl-1">Pilih Lokasi</label>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M10 10C11.1046 10 12 9.10457 12 8C12 6.89543 11.1046 6 10 6C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 18C10 18 16 13 16 8C16 4.68629 13.3137 2 10 2C6.68629 2 4 4.68629 4 8C4 13 10 18 10 18Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <button
              type="button"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="w-full py-3 md:py-[13px] px-11 md:px-12 pr-10 md:pr-11 border-[1.5px] border-gray-200 rounded-lg text-[15px] text-left transition-all duration-200 bg-white focus:outline-none focus:border-green-700 focus:shadow-[0_0_0_4px_rgba(21,128,61,0.1)]"
            >
              <span className={selectedLocation ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                {selectedLocation ? selectedLocation.nama : 'Pilih Lokasi'}
              </span>
            </button>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {showLocationDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLocationDropdown(false)} />
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-2 z-[100] max-h-[280px] overflow-y-auto">
                  {locations.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500 text-center">Tidak ada lokasi tersedia</div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLocationId(null);
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          !selectedLocationId ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Semua Lokasi
                      </button>
                      {locations.map((location) => (
                        <button
                          key={location.id}
                          type="button"
                          onClick={() => {
                            setSelectedLocationId(location.id);
                            setShowLocationDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                            selectedLocationId === location.id ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {location.nama}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Check In with Duration Dropdown */}
        <div className="flex-1 flex flex-col gap-2.5 relative">
          <label className="text-md font-semibold text-gray-700 pl-1">Check In</label>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" width="22" height="22" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <button
              type="button"
              onClick={() => setShowCheckInCalendar(!showCheckInCalendar)}
              className="w-full py-3 md:py-[13px] px-11 md:px-12 pr-10 md:pr-11 border-[1.5px] border-gray-200 rounded-lg text-[15px] text-left transition-all duration-200 bg-white focus:outline-none focus:border-green-700 focus:shadow-[0_0_0_4px_rgba(21,128,61,0.1)]"
            >
              <span className={checkIn ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                {checkIn ? format(checkIn, 'dd MMM yyyy', { locale: id }) : 'Check In'}
              </span>
            </button>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {showCheckInCalendar && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCheckInCalendar(false)} />
                <div className="absolute top-[calc(100%+8px)] left-0 w-auto min-w-[340px] bg-white border border-gray-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-4 z-[100]">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base text-gray-900">
                      {format(currentMonth, 'MMMM yyyy', { locale: id })}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="mb-4">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => {
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = checkIn && isSameDay(day, checkIn);
                        const isToday = isSameDay(day, today);
                        const isPast = day < today && !isSameDay(day, today);

                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              if (!isPast) {
                                handleSelectCheckIn(day);
                              }
                            }}
                            disabled={isPast}
                            className={`
                              aspect-square p-2 text-sm rounded-lg transition-all duration-200
                              ${!isCurrentMonth ? 'text-gray-300' : ''}
                              ${isSelected ? 'bg-green-700 text-white font-bold shadow-md' : ''}
                              ${isToday && !isSelected ? 'border-2 border-green-700 text-green-700 font-semibold' : ''}
                              ${!isSelected && !isToday && isCurrentMonth && !isPast ? 'hover:bg-green-50 text-gray-700' : ''}
                              ${isPast ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                          >
                            {format(day, 'd')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-4 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectCheckIn(today);
                      }}
                      className="flex-1 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      Hari ini
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckIn(null);
                        setCheckOut(null);
                      }}
                      className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <label className="text-md font-bold text-gray-700 mb-3 block">Pilih Durasi Sewa</label>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        type="button" 
                        onClick={() => {
                          setSelectedDuration('');
                          setShowCheckInCalendar(false);
                        }} 
                        className={`text-xs px-4 py-2 rounded-lg border-[1.5px] transition-all duration-200 font-medium ${
                          selectedDuration === '' 
                            ? 'bg-green-700 text-white border-green-700 shadow-sm' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-green-50'
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
                            setShowCheckInCalendar(false);
                          }} 
                          className={`text-xs px-4 py-2 rounded-lg border-[1.5px] transition-all duration-200 font-medium ${
                            selectedDuration === option.value 
                              ? 'bg-green-700 text-white border-green-700 shadow-sm' 
                              : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-green-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Check Out */}
        <div className="flex-1 flex flex-col gap-2.5">
          <label className="text-md font-semibold text-gray-700 pl-1">Check Out</label>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="22" height="22" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <button type="button" disabled className="w-full py-3 md:py-[13px] px-11 md:px-12 pr-10 md:pr-11 border-[1.5px] border-gray-200 rounded-lg text-[15px] text-left bg-gray-50 cursor-not-allowed">
              <span className={checkOut ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                {checkOut ? format(checkOut, 'dd MMM yyyy', { locale: id }) : 'Check Out'}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Button - Desktop */}
        <div 
          onClick={() => setShowSettings(!showSettings)} 
          className="hidden md:block py-[13px] px-5 border-[1.5px] border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-200 text-gray-500 text-[15px] font-medium hover:border-green-700 hover:bg-gray-50 hover:text-green-700 relative"
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path d="M4 6H16M6 10H14M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {showSettings && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
              <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-4 z-[100]">
                <div className="mb-4">
                  <label className="text-md font-semibold text-gray-700 mb-2 block">Tipe Kos</label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setSelectedTipe('')} className={`text-xs px-3 py-1.5 rounded-lg border-[1.5px] transition-all duration-200 ${selectedTipe === '' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-gray-50'}`}>Semua</button>
                    {tipeKosOptions.map((tipe) => (
                      <button key={tipe.id} type="button" onClick={() => setSelectedTipe(tipe.nama)} className={`text-xs px-3 py-1.5 rounded-lg border-[1.5px] transition-all duration-200 ${selectedTipe === tipe.nama ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-gray-50'}`}>{tipe.nama}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-md font-semibold text-gray-700 mb-2 block">Jenis Kos</label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setSelectedJenis('')} className={`text-xs px-3 py-1.5 rounded-lg border-[1.5px] transition-all duration-200 ${selectedJenis === '' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-gray-50'}`}>Semua</button>
                    {jenisKosOptions.map((jenis) => (
                      <button key={jenis} type="button" onClick={() => setSelectedJenis(jenis)} className={`text-xs px-3 py-1.5 rounded-lg border-[1.5px] transition-all duration-200 ${selectedJenis === jenis ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-gray-50'}`}>{jenis}</button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filter Button - Mobile */}
        <div 
          onClick={() => setShowSettings(!showSettings)} 
          className="md:hidden py-3.5 px-4 border-[1.5px] border-gray-200 rounded-lg bg-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 text-gray-500 text-[15px] font-medium hover:border-green-700 hover:bg-gray-50 hover:text-green-700 relative"
        >
          <span>Filter</span>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path d="M4 6H16M6 10H14M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {showSettings && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-4 z-[100]">
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Tipe Kos</label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setSelectedTipe('')} className={`text-xs px-3 py-1.5 rounded-lg border-[1.5px] transition-all duration-200 ${selectedTipe === '' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-gray-50'}`}>Semua</button>
                    {tipeKosOptions.map((tipe) => (
                      <button key={tipe.id} type="button" onClick={() => setSelectedTipe(tipe.nama)} className={`text-xs px-3 py-1.5 rounded-lg border-[1.5px] transition-all duration-200 ${selectedTipe === tipe.nama ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-gray-50'}`}>{tipe.nama}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Jenis Kos</label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setSelectedJenis('')} className={`text-xs px-3 py-1.5 rounded-lg border-[1.5px] transition-all duration-200 ${selectedJenis === '' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-gray-50'}`}>Semua</button>
                    {jenisKosOptions.map((jenis) => (
                      <button key={jenis} type="button" onClick={() => setSelectedJenis(jenis)} className={`text-xs px-3 py-1.5 rounded-lg border-[1.5px] transition-all duration-200 ${selectedJenis === jenis ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200 hover:border-green-700 hover:bg-gray-50'}`}>{jenis}</button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search Button */}
        <button onClick={handleSearch} className="w-full md:w-auto py-3.5 md:py-[13px] px-10 bg-gradient-to-br from-green-600 to-green-700 text-white border-none rounded-lg text-[16px] font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(21,128,61,0.3)] hover:bg-gradient-to-br hover:from-green-700 hover:to-green-800 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(21,128,61,0.4)] active:translate-y-0">
          Cari
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

