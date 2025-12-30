import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import {
  Home,
  CreditCard,
  FileText,
  User,
  MessageSquare,
  LogOut,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const DashboardLayout = ({ children, title, subtitle, activeItem }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { href: '/account', label: 'Dashboard', icon: Home, key: 'dashboard' },
    { href: '/transaksi', label: 'Booking Saya', icon: Calendar, key: 'transaksi' },
    { href: '/pembelian', label: 'Daftar Pembelian', icon: CreditCard, key: 'pembelian' },
    { href: '/tagihan', label: 'Tagihan Saya', icon: FileText, key: 'tagihan' },
    { href: '/profile', label: 'Edit Profile', icon: User, key: 'profile' },
    { href: '/keluhan', label: 'Keluhan & Saran', icon: MessageSquare, key: 'keluhan' },
  ];

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <svg
                width="100"
                height="40"
                viewBox="0 0 100 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="0"
                  y="30"
                  fill="#15803d"
                  fontSize="28"
                  fontWeight="600"
                  fontFamily="Arial, sans-serif"
                >
                  HAVEN
                </text>
              </svg>
            </Link>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {user?.fotoselfie ? (
                    <img
                      src={`https://admin.haven.co.id/img/user/${user.id}/fotoselfie/${user.fotoselfie}`}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{user?.nama || 'User'}</div>
                  <div className="text-xs text-gray-500">Customer</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.nama}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <div className="p-6">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.key;

                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'font-medium text-green-700 bg-green-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : ''}`} />
                    {item.label}
                    {isActive && (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                    )}
                  </Link>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left mt-4"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
