import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const isMissingBaseUrl = !API_BASE_URL || API_BASE_URL === "undefined";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const submitContactForm = async (data: ContactFormData): Promise<void> => {
  if (isMissingBaseUrl) throw new Error("Backend URL not configured");
  await axios.post(`${API_BASE_URL}/api/contact`, data);
};
