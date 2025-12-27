import { useState, useEffect, useMemo } from 'react';
import { SearchHeader, AdvancedSearchFilters, SearchResults } from '../components/search';
import { getKosList } from '../services/kosService';

const SearchPage = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedTipe, setSelectedTipe] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('');
  const [loading, setLoading] = useState(true);
  const [allProperties, setAllProperties] = useState([]);

  // Fetch kos data from API
  useEffect(() => {
    const fetchKos = async () => {
      try {
        setLoading(true);
        const response = await getKosList(100); // Get more data for search
        
        // Transform API data to match component structure
        const transformedData = (response.data || []).map(kos => {
          // Get image URL with proper handling
          let imageUrl = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';
          
          // Helper function to get image URL
          const getImageUrl = (img) => {
            if (!img) return null;
            
            // Handle object with url property
            if (typeof img === 'object' && img.url) {
              const url = img.url;
              return url.startsWith('http') ? url : `https://admin.haven.co.id/${url}`;
            }
            
            // Handle object with path property
            if (typeof img === 'object' && img.path) {
              const path = img.path;
              return path.startsWith('http') ? path : `https://admin.haven.co.id/${path}`;
            }
            
            // Handle string
            if (typeof img === 'string') {
              return img.startsWith('http') ? img : `https://admin.haven.co.id/${img}`;
            }
            
            return null;
          };
          
          // Try to get image from gallery
          if (kos.gallery && Array.isArray(kos.gallery) && kos.gallery.length > 0) {
            const img = getImageUrl(kos.gallery[0]);
            if (img) imageUrl = img;
          }
          
          // Also try image property if gallery is empty
          if (kos.image && Array.isArray(kos.image) && kos.image.length > 0) {
            const img = getImageUrl(kos.image[0]);
            if (img) imageUrl = img;
          }
          
          return {
            id: kos.id,
            nama: kos.nama,
            lokasi: kos.alamat_kota || 'Lokasi tidak tersedia',
            tipe: 'Kos',
            gambar: [imageUrl],
            keterangan: kos.keterangan,
            link_maps: kos.link_maps
          };
        });
        
        setAllProperties(transformedData);
      } catch (error) {
        console.error('Failed to fetch kos:', error);
        // Keep empty array on error
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKos();
  }, []);

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // Filter by location
      if (location && !property.lokasi.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [location, allProperties]);

  const handleSearch = () => {
    // Filtering is done automatically via useMemo
    // This function can be used for analytics or additional actions
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <SearchHeader />
      
      <div className="container mx-auto px-4 max-w-7xl -mt-20 relative z-20">
        <AdvancedSearchFilters
          location={location}
          setLocation={setLocation}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          selectedTipe={selectedTipe}
          setSelectedTipe={setSelectedTipe}
          selectedJenis={selectedJenis}
          setSelectedJenis={setSelectedJenis}
          onSearch={handleSearch}
        />

        <SearchResults 
          properties={filteredProperties} 
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SearchPage;
