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
  /** Category / sub-tournament label this match belongs to */
  category: string | null;
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
  registrationClosed: boolean;
  challongeUrl: string | null;
  // ── Category flags + fees (all 7 sub-tournament types) ──
  openSingleEnabled: boolean;
  openSingleFee: number;
  openDoubleEnabled: boolean;
  openDoubleFee: number;
  mixedDoubleEnabled: boolean;
  mixedDoubleFee: number;
  womenSingleEnabled: boolean;
  womenSingleFee: number;
  mensSingleEnabled: boolean;
  mensSingleFee: number;
  underSixteenEnabled: boolean;
  underSixteenFee: number;
  aboveSixteenEnabled: boolean;
  aboveSixteenFee: number;
}

/** All category definitions — label must match the string stored in Matches.category */
export const ALL_CATEGORIES = [
  { label: "Open Singles",    enabledKey: "openSingleEnabled",    feeKey: "openSingleFee"   },
  { label: "Women's Singles", enabledKey: "womenSingleEnabled",   feeKey: "womenSingleFee"  },
  { label: "Men's Singles",   enabledKey: "mensSingleEnabled",    feeKey: "mensSingleFee"   },
  { label: "Under 16",        enabledKey: "underSixteenEnabled",  feeKey: "underSixteenFee" },
  { label: "Above 16",        enabledKey: "aboveSixteenEnabled",  feeKey: "aboveSixteenFee" },
  { label: "Open Doubles",    enabledKey: "openDoubleEnabled",    feeKey: "openDoubleFee"   },
  { label: "Mixed Doubles",   enabledKey: "mixedDoubleEnabled",   feeKey: "mixedDoubleFee"  },
] as const;

/** Returns only the categories that are enabled on a tournament */
export function getEnabledCategories(t: TournamentDetail) {
  return ALL_CATEGORIES.filter(
    (c) => t[c.enabledKey as keyof TournamentDetail],
  ).map((c) => ({
    label: c.label,
    fee: (t[c.feeKey as keyof TournamentDetail] as number) ?? 0,
  }));
}

export const getTournamentById = async (
  id: string | number,
): Promise<TournamentDetail> => {
  const response = await axios.get(`${API_BASE_URL}/api/tournament/${id}`);
  return response.data?.data ?? response.data;
};

/**
 * Fetch matches for a tournament, optionally scoped to a single category.
 * Backend: GET /api/matches/{tournamentId}?category=Open+Singles
 */
export const getMatchesByTournament = async (
  tournamentId: string | number,
  category?: string,
): Promise<MatchResult[]> => {
  const url = category
    ? `${API_BASE_URL}/api/matches/${tournamentId}?category=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/api/matches/${tournamentId}`;
  const response = await axios.get(url);
  return response.data?.data ?? response.data;
};
