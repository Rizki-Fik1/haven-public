import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { getKamarDetail, getKosDetail } from '../../services/kosService';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import BookingInformation from '../../components/booking/BookingInformation';
import PaymentStep from '../../components/booking/PaymentStep';
import CompletionStep from '../../components/booking/CompletionStep';
import api from '../../services/axios';

const STEPS = [
  { id: 1, name: 'Informasi Booking', description: 'Data penghuni dan jadwal' },
  { id: 2, name: 'Pembayaran', description: 'Konfirmasi pembayaran' },
  { id: 3, name: 'Selesai', description: 'Booking berhasil' },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  
  // URL params
  const kamarId = parseInt(searchParams.get('kamarId') || '0');
  const kosId = parseInt(searchParams.get('kosId') || '0');
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const durationParam = searchParams.get('duration') || '1-month';

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [kamarData, setKamarData] = useState(null);
  const [kosData, setKosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [completionData, setCompletionData] = useState(null);
  const [adminPhone, setAdminPhone] = useState('6281234567890');

  // Fetch room and kos data
  useEffect(() => {
    const fetchData = async () => {
      if (!kamarId || !kosId) {
        setError('Parameter tidak lengkap. Silakan kembali ke halaman detail kamar.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch kamar detail
        const kamarResponse = await getKamarDetail(kosId, kamarId);
        setKamarData(kamarResponse.data || kamarResponse);

        // Fetch kos detail
        try {
          const kosResponse = await getKosDetail(kosId);
          setKosData(kosResponse.data || kosResponse);
        } catch (kosErr) {
          console.error('Error fetching kos detail:', kosErr);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data kamar. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kamarId, kosId]);

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

  // Parse initial check-in date
  const initialCheckIn = checkInParam ? new Date(checkInParam) : new Date();

  // Handlers
  const handleInformationNext = (data) => {
    setBookingData(data);
    setCurrentStep(2);
  };

  const handlePaymentBack = () => {
    setCurrentStep(1);
  };

  const handlePaymentComplete = (data) => {
    setCompletionData(data);
    setCurrentStep(3);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Memuat data booking...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">Booking Kamar</h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-center">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep >= step.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`font-medium ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
                
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 md:w-24 h-1 mx-4 rounded transition-colors ${
                      currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {currentStep === 1 && (
          <BookingInformation
            kamarData={kamarData}
            kosData={kosData}
            initialCheckIn={initialCheckIn}
            initialDuration={durationParam}
            onNext={handleInformationNext}
          />
        )}

        {currentStep === 2 && (
          <PaymentStep
            kamarData={kamarData}
            kosData={kosData}
            bookingData={bookingData}
            onBack={handlePaymentBack}
            onComplete={handlePaymentComplete}
          />
        )}

        {currentStep === 3 && (
          <CompletionStep
            orderNumber={completionData?.orderNumber}
            kamarData={kamarData}
            kosData={kosData}
            bookingData={bookingData}
            adminPhone={adminPhone}
          />
        )}
      </div>
    </div>
  );
};

// Wrapped with ProtectedRoute
const BookingPageWrapper = () => {
  return (
    <ProtectedRoute>
      <BookingPage />
    </ProtectedRoute>
  );
};

export default BookingPageWrapper;