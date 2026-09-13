import axios from "axios";
import { Service } from "../app/context/CMSContext";

const API_BASE_URL = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;
const SERVICES_URL = `${API_BASE_URL}/api/homepage/services`;

export const getServices = async (): Promise<Service[]> => {
  const response = await axios.get<Service[]>(SERVICES_URL);
  return response.data;
};

export const createService = async (
  service: Omit<Service, "id">,
): Promise<Service> => {
  const response = await axios.post<Service>(SERVICES_URL, service);
  return response.data;
};

export const updateService = async (
  id: string,
  service: Partial<Service>,
): Promise<Service> => {
  const response = await axios.put<Service>(`${SERVICES_URL}/${id}`, service);
  return response.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await axios.delete(`${SERVICES_URL}/${id}`);
};
