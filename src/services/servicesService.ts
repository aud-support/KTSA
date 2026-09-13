import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

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
  const response = await axios.get<Service[]>(
    `${API_BASE_URL}/api/homepage/services`,
  );
  return response.data;
};
