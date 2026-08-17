import axios from "axios";

const BASE = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/sponsors`;

export interface Sponsor {
  id: string;
  name: string;
  imageUrl?: string;
}

export const getSponsors = async (): Promise<Sponsor[]> => {
  try {
    const r = await axios.get<Sponsor[]>(BASE);
    return r.data ?? [];
  } catch {
    return [];
  }
};
