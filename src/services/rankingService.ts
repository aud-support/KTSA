import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

/** Returns true when the env var is missing so we skip the request */
const isMissingBaseUrl = !API_BASE_URL || API_BASE_URL === "undefined";

export type RankingCategory =
  | "MENS_SINGLES"
  | "WOMENS_SINGLES"
  | "OPEN_SINGLES"
  | "UNDER_16"
  | "ABOVE_16"
  | "OPEN_DOUBLES"
  | "MIXED_DOUBLES";

export interface RankingCategoryMeta {
  key: RankingCategory;
  label: string;
}

export interface RankingResponse {
  id: number;
  points: number;
  wins: number;
  losses: number;
  matches: number;
  userName: string; // "Player Name" for singles, "P1 & P2" for doubles
  email: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  category: RankingCategory;
  teamId: number | null; // only set for doubles entries
  profilePictureUrl: string | null;
  /** Per-player picture URLs for doubles entries; null for singles. */
  player1PictureUrl: string | null;
  player2PictureUrl: string | null;
}

/** Fallback categories used when the API call fails */
export const FALLBACK_CATEGORIES: RankingCategoryMeta[] = [
  { key: "MENS_SINGLES", label: "Men's Singles" },
  { key: "WOMENS_SINGLES", label: "Women's Singles" },
  { key: "OPEN_SINGLES", label: "Open Singles" },
  { key: "UNDER_16", label: "Under 16" },
  { key: "ABOVE_16", label: "Above 16" },
  { key: "OPEN_DOUBLES", label: "Open Doubles" },
  { key: "MIXED_DOUBLES", label: "Mixed Doubles" },
];

export const getAllRankings = async (): Promise<RankingResponse[]> => {
  if (isMissingBaseUrl) return [];
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rankings`);
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

/**
 * Fetches the ordered list of ranking categories from the backend.
 * Falls back to the local FALLBACK_CATEGORIES constant on error.
 */
export const getRankingCategories = async (): Promise<
  RankingCategoryMeta[]
> => {
  if (isMissingBaseUrl) return FALLBACK_CATEGORIES;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rankings/categories`);
    const data: { key: string; label: string }[] =
      response.data?.data ?? response.data;
    if (Array.isArray(data) && data.length > 0) {
      return data as RankingCategoryMeta[];
    }
    return FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
};

/**
 * Fetches the distinct years that have tournaments.
 * Used to populate the year filter on the Rankings page.
 */
export const getAvailableYears = async (): Promise<number[]> => {
  if (isMissingBaseUrl) return [new Date().getFullYear()];
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/tournament/available-years`,
    );
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [new Date().getFullYear()];
  }
};

/**
 * Fetches a flat list of all tournaments (name + id) for the tournament filter dropdown.
 */
export interface TournamentOption {
  id: number;
  name: string;
}

export const getTournamentOptions = async (): Promise<TournamentOption[]> => {
  if (isMissingBaseUrl) return [];
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/tournament?page=0&size=100`,
    );
    const content =
      response.data?.data?.content ?? response.data?.content ?? [];
    return (content as { id: number; tournamentName: string }[]).map((t) => ({
      id: t.id,
      name: t.tournamentName,
    }));
  } catch {
    return [];
  }
};

export const getRankingByUserId = async (
  userId: number,
): Promise<RankingResponse | null> => {
  if (isMissingBaseUrl) return null;
  const response = await axios.get(
    `${API_BASE_URL}/api/rankings/user/${userId}`,
  );
  return response.data?.data ?? response.data;
};

/**
 * Returns top 3 spotlight players for the homepage:
 *   index 0 — #1 Men's Singles
 *   index 1 — #1 Women's Singles
 *   index 2 — #1 Open Doubles
 */
export const getTopSpotlightPlayers = async (): Promise<RankingResponse[]> => {
  if (isMissingBaseUrl) return [];
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rankings/top`);
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
