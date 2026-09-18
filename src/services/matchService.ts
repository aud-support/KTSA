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
  /** Human display names built from player.name — "Player1 & Player2" */
  teamOneDisplayName: string | null;
  teamTwoDisplayName: string | null;
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

/**
 * Mirrors the backend's normalizeCategory() — converts a human label
 * (e.g. "Open Singles", "Women's Singles") OR an already-normalized key
 * (e.g. "OPEN_SINGLES") to the canonical DB key used in Matches.category.
 */
export function normalizeCategory(raw: string): string {
  if (!raw) return "";
  const key = raw
    .trim()
    .toUpperCase()
    .replace(/'/g, "")
    .replace(/\u2019/g, "")  // right single quotation mark
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

  switch (key) {
    case "MENS_SINGLES":
    case "MEN_SINGLES":
    case "MENS_SINGLE":
    case "MALE_SINGLES":
      return "MENS_SINGLES";
    case "OPEN_SINGLES":
    case "OPEN_SINGLE":
      return "OPEN_SINGLES";
    case "WOMENS_SINGLES":
    case "WOMEN_SINGLES":
    case "WOMENS_SINGLE":
    case "FEMALE_SINGLES":
      return "WOMENS_SINGLES";
    case "OPEN_DOUBLES":
    case "MENS_DOUBLES":
    case "MEN_DOUBLES":
    case "MALE_DOUBLES":
      return "OPEN_DOUBLES";
    case "MIXED_DOUBLES":
    case "MIXED":
      return "MIXED_DOUBLES";
    case "UNDER_16":
    case "UNDER16":
    case "U16":
    case "U_16":
    case "UNDER_SIXTEEN":
    case "UNDERSIXTEEN":
      return "UNDER_16";
    case "ABOVE_16":
    case "ABOVE16":
    case "A16":
    case "A_16":
    case "ABOVE_SIXTEEN":
    case "ABOVESIXTEEN":
      return "ABOVE_16";
    default:
      return key;
  }
}
export const ALL_CATEGORIES = [
  { label: "Open Singles",    normalizedKey: "OPEN_SINGLES",   enabledKey: "openSingleEnabled",    feeKey: "openSingleFee"   },
  { label: "Women's Singles", normalizedKey: "WOMENS_SINGLES", enabledKey: "womenSingleEnabled",   feeKey: "womenSingleFee"  },
  { label: "Men's Singles",   normalizedKey: "MENS_SINGLES",   enabledKey: "mensSingleEnabled",    feeKey: "mensSingleFee"   },
  { label: "Under 16",        normalizedKey: "UNDER_16",       enabledKey: "underSixteenEnabled",  feeKey: "underSixteenFee" },
  { label: "Above 16",        normalizedKey: "ABOVE_16",       enabledKey: "aboveSixteenEnabled",  feeKey: "aboveSixteenFee" },
  { label: "Open Doubles",    normalizedKey: "OPEN_DOUBLES",   enabledKey: "openDoubleEnabled",    feeKey: "openDoubleFee"   },
  { label: "Mixed Doubles",   normalizedKey: "MIXED_DOUBLES",  enabledKey: "mixedDoubleEnabled",   feeKey: "mixedDoubleFee"  },
] as const;

/** Returns only the categories that are enabled on a tournament */
export function getEnabledCategories(t: TournamentDetail) {
  return ALL_CATEGORIES.filter(
    (c) => t[c.enabledKey as keyof TournamentDetail],
  ).map((c) => ({
    label: c.label,
    normalizedKey: c.normalizedKey,
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
