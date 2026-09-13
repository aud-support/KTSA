import axios from "axios";
import { Article } from "../app/context/CMSContext";

const API_BASE_URL = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;
const ARTICLES_URL = `${API_BASE_URL}/api/homepage/articles`;

export const getArticles = async (): Promise<Article[]> => {
  const response = await axios.get<Article[]>(ARTICLES_URL);
  return response.data;
};

export const createArticle = async (
  article: Omit<Article, "id">,
): Promise<Article> => {
  const response = await axios.post<Article>(ARTICLES_URL, article);
  return response.data;
};

export const updateArticle = async (
  id: string,
  article: Partial<Article>,
): Promise<Article> => {
  const response = await axios.put<Article>(`${ARTICLES_URL}/${id}`, article);
  return response.data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  await axios.delete(`${ARTICLES_URL}/${id}`);
};
