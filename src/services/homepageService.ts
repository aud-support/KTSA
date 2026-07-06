import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const getHomepageContent = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/homepage/content`);
  return response.data;
};
