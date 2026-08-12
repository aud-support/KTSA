import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

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
}

export const getArticles = async (): Promise<NewsArticle[]> => {
  const response = await axios.get<NewsArticle[]>(
    `${API_BASE_URL}/api/homepage/articles`,
  );
  return response.data;
};
