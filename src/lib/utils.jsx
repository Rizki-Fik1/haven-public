import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get backend base URL
 * @returns {string} Backend base URL
 */
export const getBackendUrl = () => {
  // Remove /api suffix if exists
  const apiUrl = import.meta.env.VITE_API_URL || 'https://haven.co.id/api';
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Get full image URL from backend
 * @param {string} url - Image path or URL
 * @returns {string} Full image URL
 */
export const getImageUrl = (url) => {
  if (!url) {
    return "/placeholder.jpg";
  }

  // Convert to string if it's not already
  const urlString = typeof url === 'string' ? url : String(url);

  // If already full URL, return as is
  if (urlString.startsWith("http")) {
    return urlString;
  }

  // Build full URL with backend base
  const backendUrl = getBackendUrl();
  const cleanPath = urlString.startsWith('/') ? urlString : `/${urlString}`;
  return `${backendUrl}${cleanPath}`;
};
