import axios from "axios";

const BASE = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/sponsors`;

export interface Sponsor {
  id: string;
  name: string;
  imageUrl?: string;
}

export const getSponsors = async (): Promise<Sponsor[]> => {
  try {
    if (!BASE || BASE.includes("undefined")) return [];
    const r = await axios.get<Sponsor[]>(BASE);
    const data = (r.data as any)?.data ?? r.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
