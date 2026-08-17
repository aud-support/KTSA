import axios from "axios";

const BASE = `${import.meta.env.VITE_ADMIN_BACKEND_BASE_URL}/api/sponsors`;

export interface Sponsor {
  id: string;
  name: string;
  imageUrl?: string;
}

function buildFd(data: Omit<Sponsor, "id">, image: File | null): FormData {
  const fd = new FormData();
  fd.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
  if (image) fd.append("image", image);
  return fd;
}

export const getSponsors = async (): Promise<Sponsor[]> => {
  const r = await axios.get<Sponsor[]>(BASE);
  return r.data;
};

export const createSponsor = async (
  data: Omit<Sponsor, "id">,
  image: File | null = null,
): Promise<Sponsor> => {
  const r = await axios.post<Sponsor>(BASE, buildFd(data, image));
  return r.data;
};

export const updateSponsor = async (
  id: string,
  data: Omit<Sponsor, "id">,
  image: File | null = null,
): Promise<Sponsor> => {
  const r = await axios.put<Sponsor>(`${BASE}/${id}`, buildFd(data, image));
  return r.data;
};

export const deleteSponsor = async (id: string): Promise<void> => {
  await axios.delete(`${BASE}/${id}`);
};
