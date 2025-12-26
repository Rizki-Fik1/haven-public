import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Homepage from './pages/Homepage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ShopPage from './pages/shop/ShopPage.jsx'
import ArticlePage from './pages/Ariticle/ArticlePage.jsx'
import ArticleDetail from './pages/Ariticle/ArticleDetail.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="article" element={<ArticlePage />} />
          <Route path="article/:id" element={<ArticleDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
