import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (url) => {
  if (!url) {
    return "/placeholder.jpg";
  }

  // Convert to string if it's not already
  const urlString = typeof url === 'string' ? url : String(url);

  if (!urlString.startsWith("http")) {
    return `${
      import.meta.env.VITE_APP_URL || "http://localhost:8000"
    }/${urlString}`;
  }
  return urlString;
};
