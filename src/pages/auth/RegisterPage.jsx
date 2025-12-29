import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CreditCard, Loader2, FileImage, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useRegister } from '../../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    email: '',
    phone: '',
    alamat: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  
  // File states
  const [gambarktpFile, setGambarktpFile] = useState(null);
  const [fotoselfieFile, setFotoselfieFile] = useState(null);
  const [gambarktpPreview, setGambarktpPreview] = useState(null);
  const [fotoselfiePreview, setFotoselfiePreview] = useState(null);
  const [isDragOverKtp, setIsDragOverKtp] = useState(false);
  const [isDragOverSelfie, setIsDragOverSelfie] = useState(false);
  
  const gambarktpInputRef = useRef(null);
  const fotoselfieInputRef = useRef(null);
  
  const navigate = useNavigate();
  const registerMutation = useRegister();

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (gambarktpPreview) URL.revokeObjectURL(gambarktpPreview);
      if (fotoselfiePreview) URL.revokeObjectURL(fotoselfiePreview);
    };
  }, [gambarktpPreview, fotoselfiePreview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumericInput = (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedKeys.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.nama) {
      newErrors.nama = 'Nama lengkap harus diisi';
    }
    
    if (!formData.nik) {
      newErrors.nik = 'NIK harus diisi';
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus 16 digit angka';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Nomor telepon harus diisi';
    } else if (!/^\d{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Nomor telepon minimal 10 digit';
    }
    
    if (!formData.alamat) {
      newErrors.alamat = 'Alamat harus diisi';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'Anda harus menyetujui syarat dan ketentuan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      return 'Ukuran file maksimal 5MB';
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return 'Hanya file JPG dan PNG yang diperbolehkan';
    }
    return null;
  };

  const handleFileSelect = (file, type) => {
    const error = validateFile(file);
    if (error) {
      setErrors(prev => ({ ...prev, [type]: error }));
      return;
    }
    
    const url = URL.createObjectURL(file);
    if (type === 'gambarktp') {
      if (gambarktpPreview) URL.revokeObjectURL(gambarktpPreview);
      setGambarktpFile(file);
      setGambarktpPreview(url);
    } else {
      if (fotoselfiePreview) URL.revokeObjectURL(fotoselfiePreview);
      setFotoselfieFile(file);
      setFotoselfiePreview(url);
    }
    setErrors(prev => ({ ...prev, [type]: '' }));
  };

  const handleInputChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file, type);
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    if (type === 'gambarktp') setIsDragOverKtp(true);
    else setIsDragOverSelfie(true);
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    if (type === 'gambarktp') setIsDragOverKtp(false);
    else setIsDragOverSelfie(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (type === 'gambarktp') setIsDragOverKtp(false);
    else setIsDragOverSelfie(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files[0], type);
  };

  const removeFile = (type) => {
    if (type === 'gambarktp') {
      if (gambarktpPreview) URL.revokeObjectURL(gambarktpPreview);
      setGambarktpFile(null);
      setGambarktpPreview(null);
      if (gambarktpInputRef.current) gambarktpInputRef.current.value = '';
    } else {
      if (fotoselfiePreview) URL.revokeObjectURL(fotoselfiePreview);
      setFotoselfieFile(null);
      setFotoselfiePreview(null);
      if (fotoselfieInputRef.current) fotoselfieInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    registerMutation.mutate(
      {
        nama: formData.nama,
        nik: formData.nik,
        email: formData.email,
        phone: formData.phone,
        alamat: formData.alamat,
        password: formData.password,
        status: 'inactive',
        gambarktp: gambarktpFile || undefined,
        fotoselfie: fotoselfieFile || undefined,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            navigate('/login', { 
              state: { message: 'Registrasi berhasil! Silakan login.' } 
            });
          } else {
            setErrors({ form: data.message || 'Registrasi gagal' });
          }
        },
        onError: (err) => {
          setErrors({ form: err.response?.data?.message || 'Terjadi kesalahan saat registrasi' });
        },
      }
    );
  };

  // Decode Google JWT token to get user info
  const decodeGoogleToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding Google token:', error);
      return null;
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      const userInfo = decodeGoogleToken(credentialResponse.credential);
      if (userInfo) {
        // Auto-fill name and email from Google
        setFormData(prev => ({
          ...prev,
          nama: userInfo.name || '',
          email: userInfo.email || '',
        }));
        setIsGoogleUser(true);
        // Clear any existing errors for these fields
        setErrors(prev => ({ ...prev, nama: '', email: '' }));
      } else {
        setErrors({ form: 'Gagal membaca data Google' });
      }
    } else {
      setErrors({ form: 'Gagal mendapatkan kredensial Google' });
    }
  };

  const handleGoogleError = () => {
    setErrors({ form: 'Google authentication gagal' });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            {currentStep === 2 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <Link to="/" className="inline-block mb-2">
                <h1 className="text-2xl font-bold text-green-700">Haven</h1>
              </Link>
              <h2 className="text-3xl font-bold text-gray-900">Get Started Now</h2>
              <p className="text-sm text-gray-600">
                Step {currentStep} of 2: {currentStep === 1 ? 'Personal Information' : 'Document Upload'}
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'
            }`}>1</div>
            <div className={`h-1 w-12 ${currentStep >= 2 ? 'bg-green-700' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'
            }`}>2</div>
          </div>

          {/* Form Error */}
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {currentStep === 1 && (
              <>
                {/* Nama Field */}
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.nama ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                </div>

                {/* NIK Field */}
                <div>
                  <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-2">
                    NIK (16 digits)
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="nik"
                      name="nik"
                      type="text"
                      inputMode="numeric"
                      value={formData.nik}
                      onChange={handleChange}
                      onKeyDown={handleNumericInput}
                      placeholder="Enter your NIK"
                      maxLength={16}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.nik ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.nik && <p className="mt-1 text-sm text-red-600">{errors.nik}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={handleChange}
                      onKeyDown={handleNumericInput}
                      placeholder="Enter your phone number"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Alamat Field */}
                <div>
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      id="alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows={2}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                        errors.alamat ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.alamat && <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-2">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="h-4 w-4 mt-0.5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      terms & policy
                    </Link>
                  </label>
                </div>
                {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
                  <p className="text-sm text-gray-600">Please upload your ID card and a selfie photo</p>
                </div>

                {/* Gambar KTP Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Card (KTP) Photo
                  </label>
                  {gambarktpFile ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-4">
                        {gambarktpPreview && (
                          <img src={gambarktpPreview} alt="Preview KTP" className="w-20 h-20 object-cover rounded-lg" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{gambarktpFile.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatFileSize(gambarktpFile.size)}</p>
                          <p className="text-xs text-blue-600 mt-1">File selected</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('gambarktp')}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                        isDragOverKtp ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={(e) => handleDragOver(e, 'gambarktp')}
                      onDragLeave={(e) => handleDragLeave(e, 'gambarktp')}
                      onDrop={(e) => handleDrop(e, 'gambarktp')}
                      onClick={() => gambarktpInputRef.current?.click()}
                    >
                      <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-base text-gray-600 mb-2">
                        Drag and drop file here, or <span className="text-blue-600 font-medium">choose file</span>
                      </p>
                      <p className="text-sm text-gray-500">Supported formats: JPG, PNG (Max 5MB)</p>
                      <input
                        ref={gambarktpInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleInputChange(e, 'gambarktp')}
                        accept="image/jpeg,image/png,image/jpg"
                      />
                    </div>
                  )}
                  {errors.gambarktp && <p className="mt-1 text-sm text-red-600">{errors.gambarktp}</p>}
                </div>

                {/* Foto Selfie Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selfie Photo
                  </label>
                  {fotoselfieFile ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-4">
                        {fotoselfiePreview && (
                          <img src={fotoselfiePreview} alt="Preview Selfie" className="w-20 h-20 object-cover rounded-lg" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{fotoselfieFile.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatFileSize(fotoselfieFile.size)}</p>
                          <p className="text-xs text-blue-600 mt-1">File selected</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('fotoselfie')}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                        isDragOverSelfie ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={(e) => handleDragOver(e, 'fotoselfie')}
                      onDragLeave={(e) => handleDragLeave(e, 'fotoselfie')}
                      onDrop={(e) => handleDrop(e, 'fotoselfie')}
                      onClick={() => fotoselfieInputRef.current?.click()}
                    >
                      <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-base text-gray-600 mb-2">
                        Drag and drop file here, or <span className="text-blue-600 font-medium">choose file</span>
                      </p>
                      <p className="text-sm text-gray-500">Supported formats: JPG, PNG (Max 5MB)</p>
                      <input
                        ref={fotoselfieInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleInputChange(e, 'fotoselfie')}
                        accept="image/jpeg,image/png,image/jpg"
                      />
                    </div>
                  )}
                  {errors.fotoselfie && <p className="mt-1 text-sm text-red-600">{errors.fotoselfie}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </>
            )}
          </form>

          {/* Google Signup - Only on Step 1 */}
          {currentStep === 1 && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  width="400"
                />
              </div>
            </>
          )}

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-green-100 to-green-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Join Haven Today!</h2>
            <p className="text-lg text-green-700">Create your account and find your perfect boarding house</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
