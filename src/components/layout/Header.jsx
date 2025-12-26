import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleDisabledNav = () => {
    // Close mobile menu but don't navigate
    setIsMobileMenuOpen(false);
  };

  const handleCart = () => {
    console.log("Cart clicked");
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    console.log("Login clicked");
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
            <svg
              width="80"
              height="32"
              viewBox="0 0 100 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:w-[100px] sm:h-[40px]"
            >
              <text
                x="0"
                y="30"
                fill="#4F46E5"
                fontSize="28"
                fontWeight="600"
                fontFamily="Arial, sans-serif"
              >
                HAVEN
              </text>
            </svg>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              className={`bg-transparent border-none text-[15px] font-medium py-2.5 px-4 xl:px-5 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap ${
                isActive('/') 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleNavigation("/")}
            >
              Home
            </button>

            <button 
              className="bg-transparent border-none text-[15px] font-medium py-2.5 px-4 xl:px-5 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={handleDisabledNav}
            >
              Cari
            </button>

            <button 
              className="bg-transparent border-none text-[15px] font-medium py-2.5 px-4 xl:px-5 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={handleDisabledNav}
            >
              Toko Kami
            </button>

            <button 
              className={`bg-transparent border-none text-[15px] font-medium py-2.5 px-4 xl:px-5 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap ${
                isActive('/article') 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleNavigation("/article")}
            >
              Artikel
            </button>

            {/* Cart Icon */}
            <button
              className="relative bg-transparent border-none text-gray-700 p-2.5 cursor-pointer rounded-full transition-all duration-200 hover:bg-gray-100"
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Login Button */}
            <button
              className="bg-indigo-600 text-white text-[15px] font-semibold py-2.5 px-5 xl:px-6 cursor-pointer rounded-3xl transition-all duration-200 whitespace-nowrap hover:bg-indigo-700 ml-2"
              onClick={handleLogin}
            >
              Login
            </button>
          </nav>

          {/* Mobile Right Side (Cart + Menu) */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Cart Icon Mobile */}
            <button
              className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
              <button
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleNavigation("/")}
              >
                Home
              </button>
              <button
                className="text-left px-4 py-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-100"
                onClick={handleDisabledNav}
              >
                Cari
              </button>
              <button
                className="text-left px-4 py-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-100"
                onClick={handleDisabledNav}
              >
                Toko Kami
              </button>
              <button
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/article') 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleNavigation("/article")}
              >
                Artikel
              </button>
              <button
                className="text-left px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-2"
                onClick={handleLogin}
              >
                Login
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
