import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const isMissingBaseUrl = !API_BASE_URL || API_BASE_URL === "undefined";

export interface ArticleLink {
  label: string;
  url: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  imageUrl?: string;
  category: string;
  featured: boolean;
  links?: ArticleLink[];
}

export const getArticles = async (): Promise<NewsArticle[]> => {
  if (isMissingBaseUrl) return [];
  try {
    const response = await axios.get<NewsArticle[]>(
      `${API_BASE_URL}/api/homepage/articles`,
    );
    const data = (response.data as any)?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
