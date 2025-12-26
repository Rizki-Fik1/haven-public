import {
  HeroSection,
  SearchBar,
  CommunityFeatures,
  FeaturedProperties,
  PropertyListings,
  LifestyleSection,
  ArticleSection,
  ServiceSection
} from '../components/home';

const Homepage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <SearchBar />
      <CommunityFeatures />
      <FeaturedProperties />
      <PropertyListings />
      <LifestyleSection />
      <ArticleSection />
      <ServiceSection />
    </div>
  );
};

export default Homepage;
