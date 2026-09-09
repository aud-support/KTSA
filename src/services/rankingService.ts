import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export type RankingCategory =
  | "MENS_SINGLES"
  | "WOMENS_SINGLES"
  | "OPEN_DOUBLES"
  | "MIXED_DOUBLES";

export interface RankingResponse {
  id: number;
  points: number;
  wins: number;
  losses: number;
  matches: number;
  userName: string;       // "Player Name" for singles, "P1 & P2" for doubles
  email: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  category: RankingCategory;
  teamId: number | null;  // only set for doubles entries
  profilePictureUrl: string | null;
}

export const getAllRankings = async (): Promise<RankingResponse[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/rankings`);
  return response.data;
};

export const getRankingByUserId = async (userId: number): Promise<RankingResponse> => {
  const response = await axios.get(`${API_BASE_URL}/api/rankings/user/${userId}`);
  return response.data;
};

/**
 * Returns top 3 spotlight players for the homepage:
 *   index 0 — #1 Men's Singles
 *   index 1 — #1 Women's Singles
 *   index 2 — #1 Open Doubles
 */
export const getTopSpotlightPlayers = async (): Promise<RankingResponse[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/rankings/top`);
  return response.data;
};
