import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import api from '../../services/axios';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X,
  ImagePlus,
  Trash2,
} from 'lucide-react';

// Toast notification component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const KeluhanPage = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const imageInputRef = useRef(null);

  // State for tickets list
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('keluhan');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user tickets
  const fetchTickets = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tickets/user?user_id=${user.id}`);
      setTickets(response.data.data || response.data || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      if (err.response?.status !== 404) {
        setError('Failed to load tickets');
      }
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user?.id]);

  // Cleanup image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran gambar maksimal 5MB', 'error');
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        showToast('Hanya file JPG/PNG yang diizinkan', 'error');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      showToast('Judul dan deskripsi wajib diisi', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('user_id', user.id.toString());

      if (image) {
        formData.append('image', image);
      }

      const response = await api.post('/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success || response.data) {
        showToast('Keluhan/saran berhasil dikirim');
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('keluhan');
        removeImage();
        setShowForm(false);
        
        // Refresh tickets list
        fetchTickets();
      }
    } catch (err) {
      console.error('Failed to submit ticket:', err);
      showToast(err.response?.data?.message || 'Gagal mengirim keluhan', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTitle('');
    setDescription('');
    setCategory('keluhan');
    removeImage();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'closed':
      case 'selesai':
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </span>
        );
      case 'in_progress':
      case 'diproses':
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Diproses
          </span>
        );
      case 'open':
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
          <span className="text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  /* -------------------- MOBILE VIEW -------------------- */
  if (isMobile) {
    return (
      <>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-1">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                Keluhan & Saran
              </h1>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="p-2 bg-green-600 text-white rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="px-6 py-6 space-y-4">
            {showForm ? (
              /* Form */
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Buat Keluhan/Saran Baru</h3>
                  <button onClick={handleCloseForm} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="keluhan">Keluhan</option>
                      <option value="saran">Saran</option>
                      <option value="pertanyaan">Pertanyaan</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masukkan judul keluhan/saran"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Tuliskan keluhan atau saran Anda secara detail..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lampiran Gambar (Opsional)
                    </label>
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors flex flex-col items-center gap-2 text-gray-500"
                      >
                        <ImagePlus className="w-8 h-8" />
                        <span className="text-sm">Klik untuk upload gambar</span>
                        <span className="text-xs">JPG/PNG, max 5MB</span>
                      </button>
                    )}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Kirim
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Belum Ada Keluhan/Saran
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Anda belum mengirimkan keluhan atau saran apapun.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Buat Baru
                    </button>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {ticket.title || ticket.judul || 'Keluhan'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(ticket.created_at || ticket.tanggal)}
                          </p>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {ticket.description || ticket.pesan || ticket.isi}
                      </p>
                      {ticket.image && (
                        <img
                          src={ticket.image}
                          alt="Lampiran"
                          className="mt-3 w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      {(ticket.reply || ticket.balasan) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Balasan Admin:</p>
                          <p className="text-sm text-gray-700">{ticket.reply || ticket.balasan}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  /* -------------------- DESKTOP VIEW -------------------- */
  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <DashboardLayout
        title="Keluhan & Saran"
        subtitle="Sampaikan keluhan atau saran Anda untuk peningkatan layanan"
        activeItem="keluhan"
      >
        <div className="space-y-6">
          {/* New Ticket Button or Form */}
          {showForm ? (
            /* Form */
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Buat Keluhan/Saran Baru</h3>
                <button onClick={handleCloseForm} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="keluhan">Keluhan</option>
                      <option value="saran">Saran</option>
                      <option value="pertanyaan">Pertanyaan</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masukkan judul keluhan/saran"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Tuliskan keluhan atau saran Anda secara detail..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lampiran Gambar (Opsional)
                  </label>
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-xs h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="py-8 px-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors flex flex-col items-center gap-2 text-gray-500"
                    >
                      <ImagePlus className="w-8 h-8" />
                      <span className="text-sm">Klik untuk upload gambar</span>
                      <span className="text-xs">JPG/PNG, max 5MB</span>
                    </button>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="py-2 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Keluhan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Buat Keluhan/Saran Baru
            </button>
          )}

          {/* Tickets List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Riwayat Keluhan & Saran
              </h3>
            </div>
            <div className="p-6">
              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Belum Ada Keluhan/Saran
                  </h3>
                  <p className="text-gray-600">
                    Anda belum mengirimkan keluhan atau saran apapun.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {ticket.title || ticket.judul || 'Keluhan'}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(ticket.created_at || ticket.tanggal)}
                            {ticket.category && (
                              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                                {ticket.category}
                              </span>
                            )}
                          </p>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-gray-600 mt-2">
                        {ticket.description || ticket.pesan || ticket.isi}
                      </p>
                      {ticket.image && (
                        <img
                          src={ticket.image}
                          alt="Lampiran"
                          className="mt-3 max-w-xs h-32 object-cover rounded-lg"
                        />
                      )}
                      {(ticket.reply || ticket.balasan) && (
                        <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-4 -mb-4 p-4 rounded-b-lg">
                          <p className="text-sm text-gray-500 mb-1 font-medium">Balasan Admin:</p>
                          <p className="text-gray-700">{ticket.reply || ticket.balasan}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
});

KeluhanPage.displayName = 'KeluhanPage';

// Wrapped with ProtectedRoute
const KeluhanPageWrapper = () => {
  return (
    <ProtectedRoute>
      <KeluhanPage />
    </ProtectedRoute>
  );
};

export default KeluhanPageWrapper;
