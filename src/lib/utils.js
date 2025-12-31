import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility untuk merge Tailwind CSS classes
 * Digunakan untuk conditional styling dengan Tailwind
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get backend base URL (tanpa /api suffix)
 * @returns {string} Backend base URL
 * @example getBackendUrl() // Returns: "https://haven.co.id"
 */
export const getBackendUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://haven.co.id/api';
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Get full image URL from backend
 * Handles berbagai format path dan URL
 * @param {string|object} url - Image path, URL, atau object dengan property url
 * @returns {string} Full image URL
 * @example 
 * getImageUrl('uploads/image.jpg') // Returns: "https://haven.co.id/uploads/image.jpg"
 * getImageUrl('https://example.com/image.jpg') // Returns: "https://example.com/image.jpg"
 * getImageUrl(null) // Returns: "/placeholder.jpg"
 */
export const getImageUrl = (url) => {
  // Handle null/undefined
  if (!url) {
    return "/placeholder.jpg";
  }

  // Handle object dengan property url atau path
  if (typeof url === 'object' && url !== null) {
    const imageUrl = url.url || url.path || url.url_gambar;
    if (imageUrl) {
      return getImageUrl(imageUrl); // Recursive call
    }
    return "/placeholder.jpg";
  }

  // Convert to string
  const urlString = typeof url === 'string' ? url : String(url);

  // If already full URL (starts with http/https), return as is
  if (urlString.startsWith("http://") || urlString.startsWith("https://")) {
    return urlString;
  }

  // Build full URL with backend base
  const backendUrl = getBackendUrl();
  const cleanPath = urlString.startsWith('/') ? urlString : `/${urlString}`;
  return `${backendUrl}${cleanPath}`;
};
