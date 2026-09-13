import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const isMissingBaseUrl = !API_BASE_URL || API_BASE_URL === "undefined";

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  pricing: string;
  imageUrl?: string;
  displayOrder: number;
}

export const getServices = async (): Promise<Service[]> => {
  if (isMissingBaseUrl) return [];
  try {
    const response = await axios.get<Service[]>(
      `${API_BASE_URL}/api/homepage/services`,
    );
    const data = (response.data as any)?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
