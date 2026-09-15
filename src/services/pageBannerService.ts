import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const isMissingBaseUrl = !API_BASE_URL || API_BASE_URL === "undefined";

export interface PageBanner {
  page?: string;
  heroBannerUrl?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
}

/**
 * Fetch the hero banner config for a given page ("news" | "services").
 * Returns null if not yet configured — callers should fall back to defaults.
 */
export const getPageBanner = async (page: "news" | "services"): Promise<PageBanner | null> => {
  if (isMissingBaseUrl) return null;
  try {
    const res = await axios.get(`${API_BASE_URL}/api/page-banners/${page}`);
    return (res.data?.data as PageBanner) ?? null;
  } catch {
    return null;
  }
};
