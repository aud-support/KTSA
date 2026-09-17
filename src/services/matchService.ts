import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const isMissingBaseUrl = !API_BASE_URL || API_BASE_URL === "undefined";

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
  /** Category exactly as stored in the backend e.g. "OPEN_SINGLE", "MENS_SINGLES" */
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

/**
 * All category definitions.
 * `label`      — display name shown in the UI tabs
 * `backendKey` — the exact string the backend stores in Matches.category
 * `enabledKey` — the boolean field on TournamentDetail that enables this category
 * `feeKey`     — the fee field on TournamentDetail for this category
 */
export const ALL_CATEGORIES = [
  { label: "Open Singles",    backendKey: "OPEN_SINGLE",    enabledKey: "openSingleEnabled",    feeKey: "openSingleFee"   },
  { label: "Women's Singles", backendKey: "WOMENS_SINGLES", enabledKey: "womenSingleEnabled",   feeKey: "womenSingleFee"  },
  { label: "Men's Singles",   backendKey: "MENS_SINGLES",   enabledKey: "mensSingleEnabled",    feeKey: "mensSingleFee"   },
  { label: "Under 16",        backendKey: "UNDER_16",        enabledKey: "underSixteenEnabled",  feeKey: "underSixteenFee" },
  { label: "Above 16",        backendKey: "ABOVE_16",        enabledKey: "aboveSixteenEnabled",  feeKey: "aboveSixteenFee" },
  { label: "Open Doubles",    backendKey: "OPEN_DOUBLE",    enabledKey: "openDoubleEnabled",    feeKey: "openDoubleFee"   },
  { label: "Mixed Doubles",   backendKey: "MIXED_DOUBLES",  enabledKey: "mixedDoubleEnabled",   feeKey: "mixedDoubleFee"  },
] as const;

/**
 * Converts a UI display label to the backend key stored in Matches.category.
 *
 * Example:  "Open Singles"    → "OPEN_SINGLE"
 *           "Men's Singles"   → "MENS_SINGLES"
 *           "Mixed Doubles"   → "MIXED_DOUBLES"
 *
 * If no mapping is found the original value is returned unchanged so unknown
 * categories still get through.
 */
export function toLabelFormat(displayLabel: string): string {
  const found = ALL_CATEGORIES.find(
    (c) => c.label.toLowerCase() === displayLabel.trim().toLowerCase(),
  );
  return found ? found.backendKey : displayLabel;
}

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
  if (isMissingBaseUrl) throw new Error("Backend URL not configured");
  const response = await axios.get(`${API_BASE_URL}/api/tournament/${id}`);
  return response.data?.data ?? response.data;
};

/**
 * Fetch matches for a tournament, optionally scoped to a single category.
 * The category param must be the backend key e.g. "OPEN_SINGLE".
 * Use toLabelFormat() to convert a display label before passing it here.
 */
export const getMatchesByTournament = async (
  tournamentId: string | number,
  category?: string,
): Promise<MatchResult[]> => {
  if (isMissingBaseUrl) return [];
  try {
    const url = category
      ? `${API_BASE_URL}/api/matches/${tournamentId}?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/api/matches/${tournamentId}`;
    const response = await axios.get(url);
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
