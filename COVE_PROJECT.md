# Cove - Modern Co-Living Platform

Website homepage untuk platform co-living modern yang dibangun dengan React + Vite.

## 🚀 Fitur Utama

- **Header Navigation** - Header responsif dengan menu navigasi dan dropdown
- **Hero Section** - Section hero dengan CTA buttons dan statistics
- **Featured Homes** - Grid card properti unggulan
- **Locations** - Showcase lokasi premium
- **Pricing Plans** - Tiga tier pricing dengan feature comparison
- **Community** - Highlight fitur komunitas dan social events
- **Benefits** - 6 keuntungan utama dengan icon
- **Gallery** - Masonry-style gallery untuk showcase ruangan
- **Testimonials** - Carousel testimonial dengan rating
- **Stats** - Section statistik dengan dark theme
- **Footer** - Comprehensive footer dengan links dan social media

## 📁 Struktur File

```
src/
├── App.jsx                 # Main app component
├── App.css                 # Global styles
├── pages/
│   ├── Home.jsx           # Home page
│   └── Home.css           # Home page styles
├── components/
│   ├── Header.jsx         # Navigation header
│   ├── Header.css
│   ├── HeroSection.jsx    # Hero banner
│   ├── HeroSection.css
│   ├── FeaturedHomes.jsx  # Property cards
│   ├── FeaturedHomes.css
│   ├── LocationsSection.jsx
│   ├── LocationsSection.css
│   ├── PricingSection.jsx
│   ├── PricingSection.css
│   ├── CommunitySection.jsx
│   ├── CommunitySection.css
│   ├── BenefitsSection.jsx
│   ├── BenefitsSection.css
│   ├── GallerySection.jsx
│   ├── GallerySection.css
│   ├── TestimonialsSection.jsx
│   ├── TestimonialsSection.css
│   ├── StatsSection.jsx
│   ├── StatsSection.css
│   ├── Footer.jsx
│   └── Footer.css
```

## 🎨 Design Features

- **Modern UI/UX** - Desain clean dan premium
- **Responsive** - Mobile, tablet, dan desktop friendly
- **Smooth Animations** - Hover effects dan transitions
- **Custom Icons** - SVG icons untuk performa optimal
- **Gradient Backgrounds** - Modern gradient styling
- **Card-based Layout** - Modular dan reusable components

## 🔧 Placeholder Functions

Semua fungsi interaktif sudah disiapkan dengan placeholder:

```javascript
// Contoh fungsi yang perlu diisi
handleViewHomes();
handleSearchHomes();
handleSelectPlan();
handleLocationClick();
// ... dan banyak lagi
```

Tinggal tambahkan logika navigasi dan API calls sesuai kebutuhan.

## 📝 TODO: Tambahkan Gambar

Pastikan folder `/public/images/` berisi gambar-gambar berikut:

- hero-main.jpg
- home-1.jpg, home-2.jpg, home-3.jpg
- location-la.jpg, location-ny.jpg, location-sf.jpg, location-seattle.jpg
- community.jpg
- gallery-1.jpg hingga gallery-5.jpg
- avatar-1.jpg, avatar-2.jpg, avatar-3.jpg

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎯 Next Steps

1. Tambahkan gambar-gambar di folder `/public/images/`
2. Implementasikan fungsi navigasi (React Router)
3. Integrasikan dengan backend API
4. Tambahkan state management (Redux/Context API)
5. Implementasikan mobile menu (hamburger)
6. Tambahkan SEO meta tags
7. Implementasikan lightbox untuk gallery
8. Tambahkan form validation untuk booking

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

Dibuat dengan ❤️ menggunakan React + Vite
