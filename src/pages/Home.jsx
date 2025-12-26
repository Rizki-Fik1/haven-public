import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import FeaturedHomes from '../components/FeaturedHomes';
import LocationsSection from '../components/LocationsSection';
import PricingSection from '../components/PricingSection';
import CommunitySection from '../components/CommunitySection';
import BenefitsSection from '../components/BenefitsSection';
import GallerySection from '../components/GallerySection';
import TestimonialsSection from '../components/TestimonialsSection';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <main className="home-main">
        <HeroSection />
        <SearchBar />
        <FeaturedHomes />
        <LocationsSection />
        <PricingSection />
        <CommunitySection />
        <BenefitsSection />
        <GallerySection />
        <TestimonialsSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
