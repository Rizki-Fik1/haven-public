# Search Components

Komponen-komponen untuk halaman pencarian properti (kos, apartemen, co-living).

## Struktur Komponen

```
src/components/search/
├── SearchHeader.jsx      # Header halaman search
├── SearchFilters.jsx     # Form filter pencarian
├── SearchResults.jsx     # Grid hasil pencarian
├── PropertyCard.jsx      # Card individual properti
├── index.js             # Barrel export
└── README.md            # Dokumentasi
```

## Komponen

### 1. SearchHeader
Header halaman dengan judul dan deskripsi.

**Usage:**
```jsx
import { SearchHeader } from '../components/search';

<SearchHeader />
```

### 2. SearchFilters
Form filter untuk lokasi, harga, dan tipe properti.

**Props:**
- `location` (string) - Nilai input lokasi
- `setLocation` (function) - Setter untuk lokasi
- `priceRange` (string) - Nilai rentang harga
- `setPriceRange` (function) - Setter untuk rentang harga
- `propertyType` (string) - Nilai tipe properti
- `setPropertyType` (function) - Setter untuk tipe properti
- `onSearch` (function) - Callback saat tombol search diklik

**Usage:**
```jsx
<SearchFilters
  location={location}
  setLocation={setLocation}
  priceRange={priceRange}
  setPriceRange={setPriceRange}
  propertyType={propertyType}
  setPropertyType={setPropertyType}
  onSearch={handleSearch}
/>
```

### 3. SearchResults
Menampilkan grid hasil pencarian dengan loading dan empty state.

**Props:**
- `properties` (array) - Array properti yang akan ditampilkan
- `loading` (boolean) - Status loading

**Usage:**
```jsx
<SearchResults 
  properties={filteredProperties} 
  loading={loading}
/>
```

### 4. PropertyCard
Card individual untuk menampilkan detail properti.

**Props:**
- `property` (object) - Data properti
  - `id` (number) - ID properti
  - `nama` (string) - Nama properti
  - `lokasi` (string) - Lokasi properti
  - `harga` (number) - Harga per bulan
  - `tipe` (string) - Tipe properti (Kos/Apartemen/Co-Living)
  - `gambar` (array) - Array URL gambar
  - `fasilitas` (array) - Array nama fasilitas

**Usage:**
```jsx
<PropertyCard property={property} />
```

## Features

### ✅ Real-time Filtering
Filter otomatis menggunakan `useMemo` untuk performa optimal.

### ✅ Responsive Design
- Mobile: 1 kolom
- Tablet: 2 kolom
- Desktop: 3 kolom

### ✅ Loading State
Spinner animasi saat data loading.

### ✅ Empty State
Pesan friendly saat tidak ada hasil.

### ✅ Hover Effects
Smooth transition pada card hover.

## Integration dengan API

Untuk integrasi dengan backend API, ubah di `SearchPage.jsx`:

```jsx
import { useState, useEffect, useMemo } from 'react';
import { getKos } from '../services/kosService';

const SearchPage = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getKos();
        setAllProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Fallback to dummy data
        setAllProperties(dummyProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ... rest of the code
};
```

## Data Structure

Dummy data disimpan di `src/data/dummyProperties.js` untuk memudahkan maintenance.

**Property Object Structure:**
```javascript
{
  id: number,           // Unique ID
  nama: string,         // Property name
  lokasi: string,       // Location/city
  harga: number,        // Price per month (in Rupiah)
  tipe: string,         // Type: 'Kos' | 'Apartemen' | 'Co-Living'
  gambar: string[],     // Array of image URLs
  fasilitas: string[]   // Array of facility names
}
```

## Styling

Menggunakan Tailwind CSS dengan:
- Indigo color scheme untuk primary actions
- Gray scale untuk text dan backgrounds
- Shadow effects untuk depth
- Smooth transitions untuk interactivity

## Future Enhancements

- [ ] Pagination untuk hasil banyak
- [ ] Sort options (harga, lokasi, rating)
- [ ] Map view untuk lokasi
- [ ] Save/favorite properties
- [ ] Share property link
- [ ] Advanced filters (fasilitas, jarak, rating)
