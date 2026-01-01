import { Calendar, CheckCircle, XCircle, Info } from 'lucide-react';
import { format, parseISO, isWithinInterval, isBefore, isAfter, addDays } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

/**
 * Parse ketersediaan data - handles both array and JSON string formats
 */
export const parseKetersediaan = (ketersediaan) => {
  if (!ketersediaan) return [];
  
  // If already an array, return it
  if (Array.isArray(ketersediaan)) {
    return ketersediaan.filter(k => k.start_date && k.end_date);
  }
  
  // If it's a string, try to parse as JSON
  if (typeof ketersediaan === 'string') {
    try {
      const parsed = JSON.parse(ketersediaan);
      if (Array.isArray(parsed)) {
        return parsed.filter(k => k.start_date && k.end_date);
      }
    } catch (e) {
      console.error('Error parsing ketersediaan:', e);
    }
  }
  
  return [];
};

/**
 * Check if a date is within any availability period
 */
export const isDateAvailable = (date, availabilityPeriods) => {
  if (!availabilityPeriods || availabilityPeriods.length === 0) return true; // No restrictions
  
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  
  return availabilityPeriods.some(period => {
    const startDate = parseISO(period.start_date);
    const endDate = parseISO(period.end_date);
    
    return isWithinInterval(checkDate, { start: startDate, end: endDate });
  });
};

/**
 * Check if a date range is fully within any availability period
 */
export const isDateRangeAvailable = (startDate, endDate, availabilityPeriods) => {
  if (!availabilityPeriods || availabilityPeriods.length === 0) return true;
  
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  return availabilityPeriods.some(period => {
    const periodStart = parseISO(period.start_date);
    const periodEnd = parseISO(period.end_date);
    
    // Check if the entire booking range is within this availability period
    return (
      (isWithinInterval(start, { start: periodStart, end: periodEnd }) || 
       start.getTime() === periodStart.getTime()) &&
      (isWithinInterval(end, { start: periodStart, end: periodEnd }) || 
       end.getTime() === periodEnd.getTime())
    );
  });
};

/**
 * Get the nearest available period from today
 */
export const getNearestAvailablePeriod = (availabilityPeriods) => {
  if (!availabilityPeriods || availabilityPeriods.length === 0) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter periods that haven't ended yet and sort by start date
  const validPeriods = availabilityPeriods
    .filter(period => {
      const endDate = parseISO(period.end_date);
      return !isBefore(endDate, today);
    })
    .sort((a, b) => {
      return parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime();
    });
  
  return validPeriods[0] || null;
};

const AvailabilitySection = ({ ketersediaan, className = '' }) => {
  const availabilityPeriods = parseKetersediaan(ketersediaan);
  
  if (!availabilityPeriods || availabilityPeriods.length === 0) {
    return (
      <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Ketersediaan Kamar
        </h2>
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
          <Info className="w-5 h-5 text-gray-400" />
          <p className="text-gray-600 text-sm">
            Informasi ketersediaan belum tersedia. Silakan hubungi kami untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-600" />
        Ketersediaan Kamar
      </h2>
      
      <div className="space-y-3">
        {availabilityPeriods.map((period, index) => {
          const startDate = parseISO(period.start_date);
          const endDate = parseISO(period.end_date);
          const isExpired = isBefore(endDate, today);
          const isCurrentlyActive = isWithinInterval(today, { start: startDate, end: endDate });
          const isFuture = isAfter(startDate, today);
          
          return (
            <div 
              key={index}
              className={`rounded-xl p-4 border-2 transition-all ${
                isExpired 
                  ? 'bg-gray-50 border-gray-200 opacity-60' 
                  : isCurrentlyActive 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isExpired ? (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  ) : (
                    <CheckCircle className={`w-5 h-5 ${isCurrentlyActive ? 'text-green-600' : 'text-blue-600'}`} />
                  )}
                  <div>
                    <p className={`font-semibold ${isExpired ? 'text-gray-500' : 'text-gray-900'}`}>
                      {format(startDate, 'd MMMM yyyy', { locale: localeId })} - {format(endDate, 'd MMMM yyyy', { locale: localeId })}
                    </p>
                    <p className={`text-sm ${
                      isExpired 
                        ? 'text-gray-400' 
                        : isCurrentlyActive 
                          ? 'text-green-600' 
                          : 'text-blue-600'
                    }`}>
                      {isExpired 
                        ? 'Periode telah berakhir' 
                        : isCurrentlyActive 
                          ? 'Tersedia sekarang' 
                          : 'Tersedia mulai tanggal tersebut'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isExpired 
                    ? 'bg-gray-200 text-gray-600' 
                    : isCurrentlyActive 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-blue-200 text-blue-800'
                }`}>
                  {isExpired ? 'Berakhir' : isCurrentlyActive ? 'Aktif' : 'Mendatang'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Catatan:</strong> Anda hanya dapat melakukan pemesanan pada periode ketersediaan yang aktif atau mendatang.
        </p>
      </div>
    </div>
  );
};

export default AvailabilitySection;