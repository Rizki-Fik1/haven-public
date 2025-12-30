import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthContext.jsx'
import Homepage from './pages/Homepage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ShopPage from './pages/shop/ShopPage.jsx'
import CartPage from './pages/shop/CartPage.jsx'
import CheckoutPage from './pages/shop/CheckoutPage.jsx'
import ArticlePage from './pages/ariticle/ArticlePage.jsx'
import ArticleDetail from './pages/ariticle/ArticleDetail.jsx'
import KamarDetailPage from './pages/KamarDetailPage.jsx'
import KosDetailPage from './pages/KosDetailPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import AccountPage from './pages/account/AccountPage.jsx'
import TransaksiPage from './pages/transaksi/transaksi.jsx'
import PembelianPage from './pages/pembelian/pembelian.jsx'
import ProfilePage from './pages/profile/profile.jsx'
import TagihanPage from './pages/tagihan/tagihan.jsx'
import KeluhanPage from './pages/keluhan/keluhan.jsx';
import BookingPage from './pages/booking/BookingPage.jsx';
import BookingSuccessPage from './pages/booking/BookingSuccessPage.jsx';

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '765052662516-j1jda1d7pf0o9b5b6kkp4eog3o3cnaov.apps.googleusercontent.com'

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth Routes (no layout) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Protected Routes (own layout) */}
              <Route path="/account" element={<AccountPage />} />
              <Route path="/transaksi" element={<TransaksiPage />} />
              <Route path="/pembelian" element={<PembelianPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/tagihan" element={<TagihanPage />} />
              <Route path="/keluhan" element={<KeluhanPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/success" element={<BookingSuccessPage />} />
              
              {/* Main App Routes (with layout) */}
              <Route path="/" element={<App />}>
                <Route index element={<Homepage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="article" element={<ArticlePage />} />
                <Route path="article/:id" element={<ArticleDetail />} />
                <Route path="getKos/:kosId" element={<KosDetailPage />} />
                <Route path="getKamar/:kosId/kamar/:kamarId" element={<KamarDetailPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)

