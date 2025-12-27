import PropertyCard from './PropertyCard';

const SearchResults = ({ properties, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tidak ada properti ditemukan
        </h3>
        <p className="text-gray-600">
          Coba ubah filter pencarian Anda
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-gray-600">Menampilkan {properties.length} properti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </>
  );
};

export default SearchResults;
