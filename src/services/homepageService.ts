import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const isMissingBaseUrl = !API_BASE_URL || API_BASE_URL === "undefined";

export const getHomepageContent = async (): Promise<any | null> => {
  if (isMissingBaseUrl) return null;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/homepage/content`);
    return response.data ?? null;
  } catch {
    return null;
  }
};
