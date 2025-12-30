import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import api from '../../services/axios';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  ArrowLeft,
  User,
  BookOpen,
  Receipt,
  MessageSquare,
  LogOut,
  FileText,
  ShoppingBag,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [stats, setStats] = useState({
    totalTransaksi: 0,
    totalProduk: 0,
  });
  const [bookedTransaksi, setBookedTransaksi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch stats & booked transactions
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const [statsRes, transaksiRes] = await Promise.all([
          api.get(`/user/${user.id}/stats`),
          api.get(`/user/${user.id}/transaksi-booked`),
        ]);

        setStats(statsRes.data.data || statsRes.data);
        setBookedTransaksi(transaksiRes.data.data || transaksiRes.data);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleLogout = () => logout();

  const menuItems = [
    { icon: User, label: 'Edit Profile', href: '/profile' },
    { icon: BookOpen, label: 'Booking Saya', href: '/transaksi' },
    { icon: Receipt, label: 'Daftar Pembelian', href: '/pembelian' },
    { icon: FileText, label: 'Tagihan Saya', href: '/tagihan' },
    { icon: MessageSquare, label: 'Keluhan & Saran', href: '/keluhan' },
  ];

  /* -------------------- MOBILE VIEW -------------------- */
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-50">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Akun Saya</h1>
        </div>

        <div className="px-6 py-8">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 mx-auto border-4 border-white shadow-lg">
                {user?.fotoselfie ? (
                  <img
                    src={`https://admin.haven.co.id/img/user/${user.id}/fotoselfie/${user.fotoselfie}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <User className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {user?.nama || 'User'}
            </h2>
            <a
              href={`mailto:${user?.email}`}
              className="text-gray-500 text-sm hover:underline"
            >
              {user?.email || 'user@example.com'}
            </a>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-800">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-4 w-full hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-red-600">Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------- DESKTOP VIEW (with DashboardLayout) -------------------- */
  return (
    <DashboardLayout
      title="My Dashboard"
      subtitle={`Halo ${user?.nama || 'User'}, selamat datang kembali!`}
      activeItem="dashboard"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Transaksi */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-700 font-semibold">Total Transaksi</h3>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {isLoading ? '-' : stats.totalTransaksi}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Transaksi yang pernah dilakukan
          </p>
        </div>

        {/* Produk Dibeli */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-700 font-semibold">Produk Dibeli</h3>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {isLoading ? '-' : stats.totalProduk}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Jumlah produk yang sudah dibeli
          </p>
        </div>

        {/* Status Tagihan */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-700 font-semibold">Status Tagihan</h3>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">Lunas</p>
          <p className="text-sm text-gray-500 mt-1">
            Status pembayaran terakhir Anda
          </p>
        </div>
      </div>

      {/* Booked Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaksi yang Sedang Berjalan
          </h3>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Memuat data...</p>
          </div>
        ) : bookedTransaksi.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Belum ada transaksi yang sedang berjalan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    No. Order
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Kos / Kamar
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Durasi
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-600">
                    Total Harga
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookedTransaksi.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {trx.no_order}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {trx.tanggal}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {trx.kos?.nama} — {trx.kamar?.nama_kamar}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {trx.durasi ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      Rp{Number(trx.harga).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          trx.status === 'booked'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Wrapped with ProtectedRoute
const AccountPageWrapper = () => {
  return (
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  );
};

export default AccountPageWrapper;

