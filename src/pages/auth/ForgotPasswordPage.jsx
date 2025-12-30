import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useForgotPassword } from '../../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();

  const validate = () => {
    if (!email) {
      setError('Email harus diisi');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Format email tidak valid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          if (data.success) {
            setIsSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          } else {
            setError(data.message || 'Gagal mengirim link reset password');
          }
        },
        onError: (err) => {
          setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
        },
      }
    );
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>

          {/* Header */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-2xl font-bold text-green-700">Haven</h1>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Forgot Password</h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Success Message */}
          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Email Terkirim!</h3>
                <p className="text-green-700 mt-2">
                  Link reset password telah dikirim ke <strong>{email}</strong>. 
                  Silakan cek inbox atau folder spam Anda.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Anda akan dialihkan ke halaman login dalam beberapa detik...
              </p>
            </div>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={forgotPasswordMutation.isPending}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {forgotPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-green-100 to-green-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Reset Your Password</h2>
            <p className="text-lg text-green-700">We'll help you get back into your account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
