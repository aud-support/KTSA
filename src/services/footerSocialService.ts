import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

/**
 * Fetch footer & social content from the backend (reads from S3).
 * Returns null if content has not been saved yet (first run).
 */
export const getFooterContent = async (): Promise<any | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/footer/content`);
    return response.data ?? null;
  } catch (error: any) {
    if (error?.response?.status === 204 || error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
