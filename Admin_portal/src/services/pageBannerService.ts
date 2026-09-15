import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;

export interface PageBanner {
  page?: string;
  heroBannerUrl?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getPageBanner = async (page: "news" | "services"): Promise<PageBanner | null> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/page-banners/${page}`);
    return (res.data?.data as PageBanner) ?? null;
  } catch {
    return null;
  }
};

export const savePageBanner = async (
  page: "news" | "services",
  data: Omit<PageBanner, "page">,
  image: File | null,
): Promise<void> => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (image) formData.append("image", image);
  await axios.post(`${API_BASE_URL}/api/page-banners/${page}`, formData, {
    headers: { ...authHeader() },
  });
};
