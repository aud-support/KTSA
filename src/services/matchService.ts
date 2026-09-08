import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export interface MatchResult {
  id: number;
  stage: string;
  scheduledAt: string | null;
  status: string;
  playerOne: string | null;
  playerTwo: string | null;
  teamOne: string | null;
  teamTwo: string | null;
  teamOneScore: number | null;
  teamTwoScore: number | null;
  winnerTeam: string | null;
  winnerPlayer: string | null;
  roundNumber: number;
  tournamentId: number;
}

export interface TournamentDetail {
  id: number;
  tournamentName: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  status: "UPCOMING" | "ACTIVE" | "LIVE" | "COMPLETED";
  format: string;
  bannerUrl: string;
  maxParticipants: number;
  pricePool: number;
  openSingleEnabled: boolean;
  openDoubleEnabled: boolean;
  mixedDoubleEnabled: boolean;
  womenSingleEnabled: boolean;
  registrationClosed: boolean;
  challongeUrl: string | null;
}

export const getTournamentById = async (
  id: string | number,
): Promise<TournamentDetail> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/tournament/${id}`,
  );
  // Backend wraps response in { data: ... }
  return response.data?.data ?? response.data;
};

export const getMatchesByTournament = async (
  tournamentId: string | number,
): Promise<MatchResult[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/matches/${tournamentId}`,
  );
  return response.data?.data ?? response.data;
};
