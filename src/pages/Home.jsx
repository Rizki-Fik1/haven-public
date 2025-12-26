import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import CommunityFeatures from '../components/CommunityFeatures';
import FeaturedProperties from '../components/FeaturedProperties';
import PropertyListings from '../components/PropertyListings';
import LifestyleSection from '../components/LifestyleSection';
import ArticleSection from '../components/ArticleSection';
import ServiceSection from '../components/ServiceSection';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <main className="home-main">
        <HeroSection />
        <SearchBar />
        <CommunityFeatures />
        <FeaturedProperties />
        <PropertyListings />
        <LifestyleSection />
        <ArticleSection />
        <ServiceSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
