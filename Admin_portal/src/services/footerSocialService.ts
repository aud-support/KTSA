import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;

/**
 * Fetch current footer & social content from the backend (S3).
 */
export const getFooterContent = async (): Promise<any> => {
  const response = await axios.get(`${API_BASE_URL}/api/footer/content`);
  return response.data;
};

/**
 * Save footer & social content to the backend.
 * No file upload — plain JSON POST.
 */
export const saveFooterContent = async (data: any): Promise<void> => {
  await axios.post(`${API_BASE_URL}/api/footer/content`, data);
};
