import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { authApi } from '../../services/authService';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  ArrowLeft,
  Upload,
  X,
  FileImage,
  Loader2,
  CheckCircle,
  AlertCircle,
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

const ProfilePage = memo(() => {
  const navigate = useNavigate();
  const { user, updateUser, refreshAuth } = useAuthContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Form state
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    alamat: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // File upload state
  const gambarktpInputRef = useRef(null);
  const fotoselfieInputRef = useRef(null);
  const [gambarktpFile, setGambarktpFile] = useState(null);
  const [fotoselfieFile, setFotoselfieFile] = useState(null);
  const [gambarktpPreview, setGambarktpPreview] = useState(null);
  const [fotoselfiePreview, setFotoselfiePreview] = useState(null);
  const [isDragOverKtp, setIsDragOverKtp] = useState(false);
  const [isDragOverSelfie, setIsDragOverSelfie] = useState(false);

  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || '',
        nik: user.nik?.toString() || '',
        alamat: user.alamat || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (gambarktpPreview) URL.revokeObjectURL(gambarktpPreview);
      if (fotoselfiePreview) URL.revokeObjectURL(fotoselfiePreview);
    };
  }, [gambarktpPreview, fotoselfiePreview]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama || formData.nama.length < 2) {
      newErrors.nama = 'Nama minimal 2 karakter';
    }

    if (!formData.nik || formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus 16 digit angka';
    }

    if (!formData.alamat || formData.alamat.length < 10) {
      newErrors.alamat = 'Alamat minimal 10 karakter';
    }

    if (formData.phone && (formData.phone.length < 10 || formData.phone.length > 15 || !/^\d+$/.test(formData.phone))) {
      newErrors.phone = 'No. Handphone harus 10-15 digit angka';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB', 'error');
      return false;
    }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      showToast('Hanya JPG/PNG yang diizinkan', 'error');
      return false;
    }
    return true;
  };

  const handleFileSelect = (file, type) => {
    if (!validateFile(file)) return;

    if (type === 'gambarktp') {
      setGambarktpFile(file);
      setGambarktpPreview(URL.createObjectURL(file));
    } else {
      setFotoselfieFile(file);
      setFotoselfiePreview(URL.createObjectURL(file));
    }
  };

  const handleFileInputChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file, type);
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    type === 'gambarktp' ? setIsDragOverKtp(true) : setIsDragOverSelfie(true);
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    type === 'gambarktp' ? setIsDragOverKtp(false) : setIsDragOverSelfie(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    type === 'gambarktp' ? setIsDragOverKtp(false) : setIsDragOverSelfie(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file, type);
  };

  const removeFile = (type) => {
    if (type === 'gambarktp') {
      setGambarktpFile(null);
      if (gambarktpPreview) URL.revokeObjectURL(gambarktpPreview);
      setGambarktpPreview(null);
      if (gambarktpInputRef.current) gambarktpInputRef.current.value = '';
    } else {
      setFotoselfieFile(null);
      if (fotoselfiePreview) URL.revokeObjectURL(fotoselfiePreview);
      setFotoselfiePreview(null);
      if (fotoselfieInputRef.current) fotoselfieInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Use authApi.updateProfile which sends to /account/update
      const payload = {
        nama: formData.nama,
        nik: formData.nik,
        alamat: formData.alamat,
        phone: formData.phone,
        gambarktp: gambarktpFile || undefined,
        fotoselfie: fotoselfieFile || undefined,
      };

      const response = await authApi.updateProfile(payload);

      if (response.success || response.user) {
        showToast('Profil berhasil diperbarui');
        
        // Update user in context
        if (response.user) {
          updateUser(response.user);
        } else {
          // Refresh auth to get updated user data
          refreshAuth();
        }

        // Clear file selections after successful update
        setGambarktpFile(null);
        setFotoselfieFile(null);
        if (gambarktpPreview) URL.revokeObjectURL(gambarktpPreview);
        if (fotoselfiePreview) URL.revokeObjectURL(fotoselfiePreview);
        setGambarktpPreview(null);
        setFotoselfiePreview(null);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast(error.response?.data?.message || 'Gagal memperbarui profil', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const baseImageUrl = 'https://admin.haven.co.id';

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
          <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-40">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.nama ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nama && (
                <p className="text-sm text-red-600 mt-1">{errors.nama}</p>
              )}
            </div>

            {/* NIK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK
              </label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleInputChange}
                maxLength={16}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.nik ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nik && (
                <p className="text-sm text-red-600 mt-1">{errors.nik}</p>
              )}
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                  errors.alamat ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.alamat && (
                <p className="text-sm text-red-600 mt-1">{errors.alamat}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Handphone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Upload KTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar KTP
              </label>
              {gambarktpFile ? (
                <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-3">
                  {gambarktpPreview && (
                    <img src={gambarktpPreview} alt="KTP" className="w-16 h-16 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{gambarktpFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(gambarktpFile.size)}</p>
                  </div>
                  <button type="button" onClick={() => removeFile('gambarktp')} className="p-1 hover:bg-gray-200 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : user?.gambarktp ? (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={`${baseImageUrl}/img/user/${user.id}/gambarktp/${user.gambarktp}`}
                    alt="KTP"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <button
                    type="button"
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => gambarktpInputRef.current?.click()}
                  >
                    Ganti Gambar
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    isDragOverKtp ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={(e) => handleDragOver(e, 'gambarktp')}
                  onDragLeave={(e) => handleDragLeave(e, 'gambarktp')}
                  onDrop={(e) => handleDrop(e, 'gambarktp')}
                >
                  <FileImage className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm">
                    Seret file atau{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => gambarktpInputRef.current?.click()}
                    >
                      pilih file
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">JPG/PNG, max 5MB</p>
                </div>
              )}
              <input
                ref={gambarktpInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileInputChange(e, 'gambarktp')}
              />
            </div>

            {/* Upload Selfie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Selfie
              </label>
              {fotoselfieFile ? (
                <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-3">
                  {fotoselfiePreview && (
                    <img src={fotoselfiePreview} alt="Selfie" className="w-16 h-16 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{fotoselfieFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(fotoselfieFile.size)}</p>
                  </div>
                  <button type="button" onClick={() => removeFile('fotoselfie')} className="p-1 hover:bg-gray-200 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : user?.fotoselfie ? (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={`${baseImageUrl}/img/user/${user.id}/fotoselfie/${user.fotoselfie}`}
                    alt="Selfie"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <button
                    type="button"
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => fotoselfieInputRef.current?.click()}
                  >
                    Ganti Gambar
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    isDragOverSelfie ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={(e) => handleDragOver(e, 'fotoselfie')}
                  onDragLeave={(e) => handleDragLeave(e, 'fotoselfie')}
                  onDrop={(e) => handleDrop(e, 'fotoselfie')}
                >
                  <FileImage className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm">
                    Seret file atau{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => fotoselfieInputRef.current?.click()}
                    >
                      pilih file
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">JPG/PNG, max 5MB</p>
                </div>
              )}
              <input
                ref={fotoselfieInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileInputChange(e, 'fotoselfie')}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </form>
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
        title="Edit Profile"
        subtitle="Kelola informasi profil Anda"
        activeItem="profile"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informasi Pribadi */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Informasi Pribadi</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.nama ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nama && (
                  <p className="text-sm text-red-600 mt-1">{errors.nama}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIK
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  maxLength={16}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.nik ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nik && (
                  <p className="text-sm text-red-600 mt-1">{errors.nik}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                    errors.alamat ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.alamat && (
                  <p className="text-sm text-red-600 mt-1">{errors.alamat}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Handphone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dokumen Verifikasi */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Dokumen Verifikasi</h3>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* KTP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gambar KTP
                  </label>
                  {gambarktpFile ? (
                    <div className="border rounded-lg p-4 bg-gray-50 flex gap-4">
                      <img src={gambarktpPreview} alt="KTP" className="w-32 h-32 object-cover rounded" />
                      <div>
                        <p className="font-medium">{gambarktpFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(gambarktpFile.size)}</p>
                        <button
                          type="button"
                          onClick={() => removeFile('gambarktp')}
                          className="text-red-600 text-sm hover:underline mt-2"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : user?.gambarktp ? (
                    <div className="space-y-3">
                      <img
                        src={`${baseImageUrl}/img/user/${user.id}/gambarktp/${user.gambarktp}`}
                        alt="KTP"
                        className="w-full max-w-xs rounded"
                      />
                      <button
                        type="button"
                        onClick={() => gambarktpInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Ganti Gambar
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-xl p-10 text-center ${
                        isDragOverKtp ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onDragOver={(e) => handleDragOver(e, 'gambarktp')}
                      onDragLeave={(e) => handleDragLeave(e, 'gambarktp')}
                      onDrop={(e) => handleDrop(e, 'gambarktp')}
                    >
                      <FileImage className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p>
                        Seret file atau{' '}
                        <button
                          type="button"
                          className="text-blue-600 font-medium hover:underline"
                          onClick={() => gambarktpInputRef.current?.click()}
                        >
                          pilih file
                        </button>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">JPG/PNG, maksimal 5MB</p>
                    </div>
                  )}
                  <input
                    ref={gambarktpInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileInputChange(e, 'gambarktp')}
                  />
                </div>

                {/* Selfie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Foto Selfie
                  </label>
                  {fotoselfieFile ? (
                    <div className="border rounded-lg p-4 bg-gray-50 flex gap-4">
                      <img src={fotoselfiePreview} alt="Selfie" className="w-32 h-32 object-cover rounded" />
                      <div>
                        <p className="font-medium">{fotoselfieFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(fotoselfieFile.size)}</p>
                        <button
                          type="button"
                          onClick={() => removeFile('fotoselfie')}
                          className="text-red-600 text-sm hover:underline mt-2"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : user?.fotoselfie ? (
                    <div className="space-y-3">
                      <img
                        src={`${baseImageUrl}/img/user/${user.id}/fotoselfie/${user.fotoselfie}`}
                        alt="Selfie"
                        className="w-full max-w-xs rounded"
                      />
                      <button
                        type="button"
                        onClick={() => fotoselfieInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Ganti Gambar
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-xl p-10 text-center ${
                        isDragOverSelfie ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onDragOver={(e) => handleDragOver(e, 'fotoselfie')}
                      onDragLeave={(e) => handleDragLeave(e, 'fotoselfie')}
                      onDrop={(e) => handleDrop(e, 'fotoselfie')}
                    >
                      <FileImage className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p>
                        Seret file atau{' '}
                        <button
                          type="button"
                          className="text-blue-600 font-medium hover:underline"
                          onClick={() => fotoselfieInputRef.current?.click()}
                        >
                          pilih file
                        </button>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">JPG/PNG, maksimal 5MB</p>
                    </div>
                  )}
                  <input
                    ref={fotoselfieInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileInputChange(e, 'fotoselfie')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>
        </form>
      </DashboardLayout>
    </>
  );
});

ProfilePage.displayName = 'ProfilePage';

// Wrapped with ProtectedRoute
const ProfilePageWrapper = () => {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
};

export default ProfilePageWrapper;
