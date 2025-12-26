import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (url) => {
  if (!url) {
    return "/placeholder.jpg";
  }

  if (!url.startsWith("http")) {
    return `${
      import.meta.env.VITE_APP_URL || "http://localhost:8000"
    }/${url}`;
  }
  return url;
};
