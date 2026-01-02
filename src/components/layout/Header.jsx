import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getCartItemCount } from "../../lib/cartUtils";
import { useAuthContext } from "../../context/AuthContext";
import { User, LogOut, ChevronDown, Calendar, CreditCard } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update cart count on mount and when location changes
  useEffect(() => {
    updateCartCount();
  }, [location]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      updateCartCount();
      // Trigger bounce animation
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateCartCount = () => {
    const count = getCartItemCount();
    setCartItemCount(count);
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleCart = () => {
    navigate("/cart");
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-[1000]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div 
            className="cursor-pointer flex items-center transition-opacity duration-200 hover:opacity-80" 
            onClick={handleLogoClick}
          >
            <img 
              src="src/assets/images/haven.png" 
              alt="Haven Logo" 
              className="h-16 sm:h-16 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              className={`bg-transparent border-none text-[15px] font-medium py-2.5 px-4 xl:px-5 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap ${
                isActive('/') 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleNavigation("/")}
            >
              Home
            </button>

            <button 
              className={`bg-transparent border-none text-[15px] font-medium py-2.5 px-4 xl:px-5 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap ${
                isActive('/search') 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleNavigation("/search")}
            >
              Cari
            </button>

            <button 
              className={`bg-transparent border-none text-[15px] font-medium py-2.5 px-4 xl:px-5 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap ${
                isActive('/shop') 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleNavigation("/shop")}
            >
              Toko Kami
            </button>

            <button 
              className={`bg-transparent border-none text-[15px] font-medium py-2.5 px-4 xl:px-5 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap ${
                isActive('/article') 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleNavigation("/article")}
            >
              Artikel
            </button>

            {/* Cart Icon */}
            <button
              className={`relative bg-transparent border-none text-gray-700 p-2.5 cursor-pointer rounded-full transition-all duration-200 hover:bg-gray-100 ${cartBounce ? 'animate-bounce-scale' : ''}`}
              onClick={handleCart}
              aria-label="Shopping Cart"
            >
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in duration-200">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu / Login Button */}
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse ml-2"></div>
            ) : isAuthenticated && user ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-1.5 px-3 rounded-full transition-all duration-200"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {/* Profile Photo */}
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {user.fotoselfie ? (
                      <img
                        src={`https://admin.haven.co.id/img/user/${user.id}/fotoselfie/${user.fotoselfie}`}
                        alt="User Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  {/* User Info */}
                  <div className="hidden xl:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-800 max-w-[100px] truncate">
                      {user.nama || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">Customer</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.nama}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <Link
                      to="/account"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/transaksi"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Booking Saya</span>
                    </Link>
                    <Link
                      to="/pembelian"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Daftar Pembelian</span>
                    </Link>
                    
                    {/* Separator */}
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    {/* Logout */}
                    <button
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="bg-green-700 text-white text-[15px] font-semibold py-2.5 px-5 xl:px-6 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap hover:bg-green-800 ml-2"
                onClick={handleLogin}
              >
                Login
              </button>
            )}
          </nav>

          {/* Mobile Right Side (Cart + Menu) */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Cart Icon Mobile */}
            <button
              className={`relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${cartBounce ? 'animate-bounce-scale' : ''}`}
              onClick={handleCart}
              aria-label="Shopping Cart"
            >
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in duration-200">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-1">
              {/* User Info (if logged in) */}
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-semibold">
                    {user.nama?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.nama}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <button
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleNavigation("/")}
              >
                Home
              </button>
              <button
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/search') 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleNavigation("/search")}
              >
                Cari
              </button>
              <button
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/shop') 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleNavigation("/shop")}
              >
                Toko Kami
              </button>
              <button
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/article') 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleNavigation("/article")}
              >
                Artikel
              </button>

              {/* Login/Logout Button */}
              {isAuthenticated ? (
                <button
                  className="text-left px-4 py-3 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors mt-2 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <button
                  className="text-left px-4 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors mt-2"
                  onClick={handleLogin}
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

