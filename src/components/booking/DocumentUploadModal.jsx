import { useState } from 'react';
import { X, Upload, Camera, Check, Loader2 } from 'lucide-react';
import { useUpdateProfile } from '../../services/authService';
import { useAuthContext } from '../../context/AuthContext';

const DocumentUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, refreshAuth } = useAuthContext();
  const [ktpFile, setKtpFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [ktpPreview, setKtpPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [error, setError] = useState('');

  const updateProfileMutation = useUpdateProfile();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, dll)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'ktp') {
        setKtpFile(file);
        setKtpPreview(reader.result);
      } else {
        setSelfieFile(file);
        setSelfiePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!ktpFile || !selfieFile) {
      setError('Silakan upload kedua dokumen');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        gambarktp: ktpFile,
        fotoselfie: selfieFile,
      });

      // Refresh auth to get updated user data
      refreshAuth();

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengupload dokumen');
    }
  };

  const handleClose = () => {
    setKtpFile(null);
    setSelfieFile(null);
    setKtpPreview(null);
    setSelfiePreview(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Upload Dokumen
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Untuk melanjutkan pemesanan, silakan upload foto KTP dan foto selfie Anda.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* KTP Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto KTP
            </label>
            <div className="relative">
              {ktpPreview ? (
                <div className="relative h-40 rounded-lg overflow-hidden border-2 border-indigo-500">
                  <img
                    src={ktpPreview}
                    alt="KTP Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setKtpFile(null);
                      setKtpPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1.5 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Klik untuk upload KTP</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'ktp')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Selfie Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Selfie
            </label>
            <div className="relative">
              {selfiePreview ? (
                <div className="relative h-40 rounded-lg overflow-hidden border-2 border-indigo-500">
                  <img
                    src={selfiePreview}
                    alt="Selfie Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setSelfieFile(null);
                      setSelfiePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1.5 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Klik untuk upload Selfie</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'selfie')}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={!ktpFile || !selfieFile || updateProfileMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengupload...
              </>
            ) : (
              'Upload & Lanjutkan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
