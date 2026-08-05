import axios from "axios";

const API_BASE = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;

/** Returns the Authorization header using the stored admin JWT. */
function authHeader(): { Authorization: string } | Record<string, never> {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface MatchResponseDto {
  id: number;
  stage: string;
  scheduledAt: string;
  status: string;
  playerOne: string | null;
  playerTwo: string | null;
  teamOne: string | null;
  teamTwo: string | null;
  teamOneChallongeName: string | null;
  teamTwoChallongeName: string | null;
  teamOneScore: number | null;
  teamTwoScore: number | null;
  winnerTeam: string | null;
  winnerPlayer: string | null;
  createdAt: string;
  roundNumber: number;
  tournamentId: number;
}

export interface MatchRequestDto {
  stage: string;
  scheduledAt: string | null;
  status: string;
  playerOne?: number | null;
  playerTwo?: number | null;
  teamOne?: number | null;
  teamTwo?: number | null;
  roundNumber: number;
}

export interface MatchUpdateDto {
  teamOneScore?: number;
  teamTwoScore?: number;
  winnerTeam?: number | null;
  winnerPlayer?: number | null;
  status?: string;
}

export interface PlayerDto {
  id: number;
  name: string;
  email: string;
}

export interface TeamDto {
  teamId: number;
  teamName: string;
  challongeTeamName: string | null;
}

// Get all matches for a tournament
export const getMatchesByTournament = async (
  tournamentId: number,
): Promise<MatchResponseDto[]> => {
  const response = await axios.get(`${API_BASE}/api/matches/${tournamentId}`, {
    headers: authHeader(),
  });
  return response.data.data;
};

// Create a new match
export const createMatch = async (
  tournamentId: number,
  data: MatchRequestDto,
): Promise<MatchResponseDto> => {
  const response = await axios.post(
    `${API_BASE}/api/matches/${tournamentId}`,
    data,
    { headers: authHeader() },
  );
  return response.data.data;
};

// Update a match (scores, winner, status)
export const updateMatch = async (
  matchId: number,
  data: MatchUpdateDto,
): Promise<MatchResponseDto> => {
  const response = await axios.put(
    `${API_BASE}/api/matches/${matchId}`,
    data,
    { headers: authHeader() },
  );
  return response.data.data;
};

// Search players in a tournament
export const searchPlayers = async (
  tournamentId: number,
  query: string,
): Promise<PlayerDto[]> => {
  const response = await axios.get(
    `${API_BASE}/api/tournament/${tournamentId}/players/search?q=${query}`,
    { headers: authHeader() },
  );
  return response.data.data;
};

// Search teams
export const searchTeams = async (query: string): Promise<TeamDto[]> => {
  const response = await axios.get(
    `${API_BASE}/api/team/search?q=${query}`,
    { headers: authHeader() },
  );
  return response.data.data;
};

export interface ChallongeSyncResult {
  totalFromChallonge: number;
  created: number;
  updated: number;
  unmatchedParticipants: string[];
}

// Sync matches from Challonge into the local DB for a tournament.
// The tournament must have challongeUrl set.
export const syncFromChallonge = async (
  tournamentId: number,
): Promise<ChallongeSyncResult> => {
  const response = await axios.post(
    `${API_BASE}/api/matches/${tournamentId}/sync-challonge`,
    null,
    { headers: authHeader() },
  );
  return response.data.data;
};
