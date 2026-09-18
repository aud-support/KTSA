import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const isMissingBaseUrl = !API_BASE_URL || API_BASE_URL === "undefined";

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  year: string;
  displayOrder: number;
}

export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  if (isMissingBaseUrl) return [];
  try {
    const response = await axios.get(`${API_BASE_URL}/api/gallery`);
    const data = response.data?.data ?? response.data;
    return Array.isArray(data)
      ? [...data].sort((a, b) => a.displayOrder - b.displayOrder)
      : [];
  } catch {
    return [];
  }
};
