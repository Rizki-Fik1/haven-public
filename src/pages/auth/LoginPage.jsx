import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useLogin, useGoogleLogin } from '../../services/authService';
import { useAuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate(redirectUrl || '/', { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate, redirectUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    loginMutation.mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (data) => {
          if (data.success && data.token && data.user) {
            login(data.token, data.user);
            
            // Always redirect to a valid page after login
            // Use redirectUrl if it's not login/register, otherwise go to home
            if (redirectUrl && !redirectUrl.includes('/login') && !redirectUrl.includes('/register')) {
              navigate(redirectUrl, { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          } else {
            setErrors({ form: data.message || 'Login gagal. Silakan coba lagi.' });
          }
        },
        onError: (err) => {
          setErrors({ form: err.response?.data?.message || 'Terjadi kesalahan saat login' });
        },
      }
    );
  };

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      googleLoginMutation.mutate(
        { google_token: credentialResponse.credential },
        {
          onSuccess: (data) => {
            if (data.success && data.token && data.user) {
              login(data.token, data.user);
              // Redirect after successful Google login
              navigate('/', { replace: true });
            } else {
              setErrors({ form: data.message || 'Google login gagal. Silakan coba lagi.' });
            }
          },
          onError: (err) => {
            setErrors({ form: err.response?.data?.message || 'Google login gagal. Silakan coba lagi.' });
          },
        }
      );
    } else {
      setErrors({ form: 'Gagal mendapatkan kredensial Google' });
    }
  };

  const handleGoogleError = () => {
    setErrors({ form: 'Google login gagal' });
  };

  const isLoading = loginMutation.isPending || googleLoginMutation.isPending;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <Link to="/" className="inline-block mb-8">
              <h1 className="text-2xl font-bold text-green-700">Haven</h1>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Error */}
            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.form}
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
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
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="400"
            />
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-green-100 to-green-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Welcome Back!</h2>
            <p className="text-lg text-green-700">Find your perfect boarding house with Haven</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
