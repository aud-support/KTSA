import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

/**
 * Fetch About Us content from the backend (reads from S3).
 * Returns null if content has not been saved yet.
 */
export const getAboutUsContent = async (): Promise<any | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/about-us/content`);
    return response.data ?? null;
  } catch (error: any) {
    // 204 No Content = not saved yet → return null, frontend will use defaults
    if (error?.response?.status === 204 || error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
