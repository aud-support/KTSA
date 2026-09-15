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

/**
 * Maps every known backend category string → the display label used in the frontend.
 * The backend may store categories as enum-style strings (e.g. "MENS_SINGLES") or
 * as human-readable strings (e.g. "Men's Singles", "Mens Singles").
 * All comparisons should go through normaliseCategoryLabel().
 */
const CATEGORY_NORMALISE_MAP: Record<string, string> = {
  // enum-style (what the backend currently returns)
  mens_singles:   "Men's Singles",
  womens_singles: "Women's Singles",
  open_singles:   "Open Singles",
  open_doubles:   "Open Doubles",
  mixed_doubles:  "Mixed Doubles",
  under_16:       "Under 16",
  above_16:       "Above 16",
  under16:        "Under 16",
  above16:        "Above 16",
  // variations without apostrophe
  "mens singles":   "Men's Singles",
  "womens singles": "Women's Singles",
  "open singles":   "Open Singles",
  "open doubles":   "Open Doubles",
  "mixed doubles":  "Mixed Doubles",
  // already-correct labels (lowercase) — map to themselves
  "men's singles":   "Men's Singles",
  "women's singles": "Women's Singles",
};

/**
 * Normalises any category string (from backend or URL param) to the
 * canonical frontend display label.  Returns the original value if
 * no mapping exists, so unknown categories still pass through.
 */
export function normaliseCategoryLabel(raw: string | null | undefined): string {
  if (!raw) return "";
  const key = raw.trim().toLowerCase().replace(/-/g, "_");
  return CATEGORY_NORMALISE_MAP[key] ?? raw.trim();
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
 * Backend: GET /api/matches/{tournamentId}?category=Open+Singles
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
