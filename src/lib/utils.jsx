import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (url, folder = null) => {
  if (!url) {
    return "/placeholder.jpg";
  }

  // Convert to string if it's not already
  const urlString = typeof url === 'string' ? url : String(url);

  // If already full URL, return as is
  if (urlString.startsWith("http")) {
    return urlString;
  }

  const baseUrl = import.meta.env.VITE_APP_URL || "http://localhost:8000";
  
  // Check if URL already has a path prefix
  if (urlString.startsWith('storage/') || 
      urlString.startsWith('/storage/') ||
      urlString.startsWith('banners/') ||
      urlString.startsWith('/banners/') ||
      urlString.startsWith('uploads/') ||
      urlString.startsWith('/uploads/')) {
    return `${baseUrl}/${urlString.replace(/^\//, '')}`;
  }
  
  // If folder is specified, use it
  if (folder) {
    return `${baseUrl}/${folder}/${urlString}`;
  }
  
  // Default: try to detect folder from filename or use root
  // For banner images, they're in /banners/
  // For other images, they might be in root or other folders
  return `${baseUrl}/${urlString}`;
};