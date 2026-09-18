import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;
const GALLERY_URL = `${API_BASE_URL}/api/gallery`;

function getToken(): string {
  return localStorage.getItem("adminToken") ?? "";
}

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  year: string;
  displayOrder: number;
}

export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const res = await axios.get(GALLERY_URL, { headers: authHeader() });
  const data = res.data?.data ?? res.data;
  return Array.isArray(data)
    ? [...data].sort((a: GalleryItem, b: GalleryItem) => a.displayOrder - b.displayOrder)
    : [];
};

/**
 * Upload a new gallery image.
 * Uses native fetch so we have full control over the Authorization header
 * without interfering with the multipart boundary that the browser sets.
 */
export const uploadGalleryImage = async (
  file: File,
  caption: string,
  year: string,
): Promise<GalleryItem> => {
  const formData = new FormData();
  formData.append("image", file);
  if (caption) formData.append("caption", caption);
  if (year)    formData.append("year", year);

  const token = getToken();
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // Do NOT set Content-Type — browser sets it automatically with the correct boundary

  const res = await fetch(GALLERY_URL, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json?.data ?? json;
};

export const updateGalleryItem = async (
  id: string,
  caption: string,
  year: string,
): Promise<GalleryItem> => {
  const params = new URLSearchParams();
  if (caption !== undefined) params.append("caption", caption);
  if (year    !== undefined) params.append("year", year);

  const res = await axios.put(`${GALLERY_URL}/${id}?${params.toString()}`, null, {
    headers: authHeader(),
  });
  return res.data?.data ?? res.data;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  await axios.delete(`${GALLERY_URL}/${id}`, { headers: authHeader() });
};
