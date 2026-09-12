import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Shield,
  Layers,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { WinnerCard } from "../components/ui/WinnerCard";
import { CubePodium } from "../components/ui/CubePodium";
import malePlayer from "../../assets/male_avatar.jfif";
import doublePlayer from "../../assets/doubles_avatar.jfif";
import {
  getTournamentById,
  getMatchesByTournament,
  getEnabledCategories,
  type MatchResult,
  type TournamentDetail,
} from "../../services/matchService";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface StandingEntry {
  rank: number;
  name?: string;    // singles
  names?: string[]; // doubles
  image?: string;
  wins: number;
  losses: number;
  matches: number;
  winRate: number;  // 0–100
  pointsFor: number; // sum of match scores this player/team scored
  points: number;
  trend: string;
}

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Derive participant standings from completed matches.
 *
 *  Tiebreaker order:
 *   1. Wins DESC
 *   2. Losses ASC
 *   3. Points For DESC  ← total match score accumulated (tiebreak when W/L equal)
 *   4. Win-rate DESC
 *   5. Matches played DESC
 *   6. Name ASC  (stable alphabetical final tiebreak)
 */
function buildStandings(matches: MatchResult[]): StandingEntry[] {
  const map = new Map<
    string,
    { wins: number; losses: number; matches: number; pointsFor: number; isTeam: boolean }
  >();

  const ensure = (name: string, isTeam: boolean) => {
    if (!map.has(name))
      map.set(name, { wins: 0, losses: 0, matches: 0, pointsFor: 0, isTeam });
  };

  for (const m of matches) {
    if (m.status !== "COMPLETED") continue;

    const isTeam = !!m.teamOne;
    const score1 = m.teamOneScore ?? 0;
    const score2 = m.teamTwoScore ?? 0;

    if (isTeam) {
      const p1 = m.teamOne!;
      const p2 = m.teamTwo!;
      ensure(p1, true);
      ensure(p2, true);
      map.get(p1)!.matches++;
      map.get(p2)!.matches++;
      // Accumulate match scores
      map.get(p1)!.pointsFor += score1;
      map.get(p2)!.pointsFor += score2;
      if (m.winnerTeam) {
        const winner = m.winnerTeam;
        const loser = winner === p1 ? p2 : p1;
        map.get(winner)!.wins++;
        map.get(loser)!.losses++;
      }
    } else {
      const p1 = m.playerOne ?? "";
      const p2 = m.playerTwo ?? "";
      if (!p1 || !p2) continue;
      ensure(p1, false);
      ensure(p2, false);
      map.get(p1)!.matches++;
      map.get(p2)!.matches++;
      // Accumulate match scores
      map.get(p1)!.pointsFor += score1;
      map.get(p2)!.pointsFor += score2;
      if (m.winnerPlayer) {
        const winner = m.winnerPlayer;
        const loser = winner === p1 ? p2 : p1;
        map.get(winner)!.wins++;
        map.get(loser)!.losses++;
      }
    }
  }

  const sorted = [...map.entries()].sort(([nameA, a], [nameB, b]) => {
    // 1. wins DESC
    if (b.wins !== a.wins) return b.wins - a.wins;
    // 2. losses ASC
    if (a.losses !== b.losses) return a.losses - b.losses;
    // 3. points for DESC — sum of actual match scores (main tiebreak when W/L equal)
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
    // 4. win-rate DESC
    const rateA = a.matches > 0 ? a.wins / a.matches : 0;
    const rateB = b.matches > 0 ? b.wins / b.matches : 0;
    if (rateB !== rateA) return rateB - rateA;
    // 5. matches played DESC (more active)
    if (b.matches !== a.matches) return b.matches - a.matches;
    // 6. alphabetical ASC (stable final tiebreak)
    return nameA.localeCompare(nameB);
  });

  return sorted.map(([name, stat], idx) => {
    const isDoubles = name.includes(" & ") || stat.isTeam;
    const winRate = stat.matches > 0 ? Math.round((stat.wins / stat.matches) * 100) : 0;
    return {
      rank: idx + 1,
      ...(isDoubles
        ? { names: name.split(" & "), image: doublePlayer }
        : { name, image: malePlayer }),
      wins: stat.wins,
      losses: stat.losses,
      matches: stat.matches,
      winRate,
      pointsFor: stat.pointsFor,
      points: stat.wins * 3,
      trend: "same",
    };
  });
}

/** Group matches by round then stage */
function groupMatches(
  matches: MatchResult[],
): Map<number, Map<string, MatchResult[]>> {
  const byRound = new Map<number, Map<string, MatchResult[]>>();
  const sorted = [...matches].sort((a, b) => a.roundNumber - b.roundNumber);
  for (const m of sorted) {
    if (!byRound.has(m.roundNumber)) byRound.set(m.roundNumber, new Map());
    const byStage = byRound.get(m.roundNumber)!;
    const stage = m.stage ?? "UNKNOWN";
    if (!byStage.has(stage)) byStage.set(stage, []);
    byStage.get(stage)!.push(m);
  }
  return byRound;
}

function formatDate(iso: string) {
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateRange(start: string, end: string) {
  const s = formatDate(start);
  const e = formatDate(end);
  return start === end ? s : `${s} - ${e}`;
}

function statusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "ONGOING":
    case "LIVE":
      return "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse";
    default:
      return "bg-ktsa-accent/10 text-ktsa-accent/70 border-ktsa-accent/20";
  }
}

const rankMeta = {
  1: {
    icon: Trophy,
    gradient: "from-yellow-400 to-yellow-700",
    border: "border-yellow-400",
    glow: "rgba(255,215,0,0.45)",
    label: "Gold",
  },
  2: {
    icon: Medal,
    gradient: "from-gray-400 to-gray-600",
    border: "border-gray-400",
    glow: "rgba(192,192,192,0.35)",
    label: "Silver",
  },
  3: {
    icon: Award,
    gradient: "from-orange-500 to-orange-700",
    border: "border-orange-700",
    glow: "rgba(255,140,0,0.35)",
    label: "Bronze",
  },
};

const podiumOrder = [1, 0, 2]; // 2nd left, 1st centre, 3rd right

// â”€â”€ Match Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MatchCard({ match }: { match: MatchResult }) {
  const isTeam = !!match.teamOne;
  const p1 = isTeam ? match.teamOne : match.playerOne;
  const p2 = isTeam ? match.teamTwo : match.playerTwo;
  const winner = isTeam ? match.winnerTeam : match.winnerPlayer;

  const s1 = match.teamOneScore ?? "-";
  const s2 = match.teamTwoScore ?? "-";

  const w1 = winner && winner === p1;
  const w2 = winner && winner === p2;

  return (
    <div className="bg-ktsa-primary/10 border border-ktsa-accent/10 rounded-xl p-3 flex items-center gap-3">
      {/* Player 1 */}
      <div
        className={`flex-1 text-right text-sm font-bold leading-tight ${
          w1 ? "text-ktsa-accent" : "text-ktsa-text/80"
        }`}
      >
        {p1 ?? "TBD"}
        {w1 && (
          <Trophy size={12} className="inline ml-1 text-yellow-400 mb-0.5" />
        )}
      </div>

      {/* Score bubble */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-ktsa-bg border border-ktsa-accent/20 flex-shrink-0">
        <span
          className={`text-sm font-black tabular-nums ${w1 ? "text-ktsa-accent" : "text-ktsa-text/60"}`}
        >
          {s1}
        </span>
        <span className="text-ktsa-text/30 text-xs">-</span>
        <span
          className={`text-sm font-black tabular-nums ${w2 ? "text-ktsa-accent" : "text-ktsa-text/60"}`}
        >
          {s2}
        </span>
      </div>

      {/* Player 2 */}
      <div
        className={`flex-1 text-left text-sm font-bold leading-tight ${
          w2 ? "text-ktsa-accent" : "text-ktsa-text/80"
        }`}
      >
        {w2 && (
          <Trophy size={12} className="inline mr-1 text-yellow-400 mb-0.5" />
        )}
        {p2 ?? "TBD"}
      </div>

      {/* Status pill */}
      <span
        className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${statusBadge(match.status)}`}
      >
        {match.status}
      </span>
    </div>
  );
}

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function TournamentResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [allMatches, setAllMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // standings pagination + search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // selected category - read from ?category= query param
  const categoryParam = searchParams.get("category") ?? "ALL";
  const [selectedCategory, setSelectedCategory] =
    useState<string>(categoryParam);

  // Sync local state if URL param changes externally
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchQuery("");
    setCurrentPage(1);
  }, [categoryParam]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getTournamentById(id), getMatchesByTournament(id)])
      .then(([t, m]) => {
        setTournament(t);
        setAllMatches(m);
      })
      .catch(() => setError("Failed to load tournament results."))
      .finally(() => setLoading(false));
  }, [id]);

  // â”€â”€ Category tabs derived from tournament â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const enabledCategories = tournament ? getEnabledCategories(tournament) : [];
  const categoryTabs = [
    { label: "All", value: "ALL" },
    ...enabledCategories.map((c) => ({ label: c.label, value: c.label })),
  ];

  // Switch category: update URL param so back/forward works
  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setSearchQuery("");
    setCurrentPage(1);
    if (value === "ALL") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  // â”€â”€ Filtered matches for the selected category â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const matches =
    selectedCategory === "ALL"
      ? allMatches
      : allMatches.filter((m) => m.category === selectedCategory);

  // â”€â”€ Derived data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const standings = buildStandings(matches);
  const topThree = standings.slice(0, 3);

  const filteredStandings = standings.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (s.name) return s.name.toLowerCase().includes(q);
    return (s.names ?? []).some((n) => n.toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(filteredStandings.length / recordsPerPage);
  const startIdx = (currentPage - 1) * recordsPerPage;
  const paginatedStandings = filteredStandings.slice(
    startIdx,
    startIdx + recordsPerPage,
  );

  const groupedMatches = groupMatches(matches);
  const completedCount = matches.filter((m) => m.status === "COMPLETED").length;

  // â”€â”€ Loading / Error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-ktsa-bg">
        <div className="w-8 h-8 border-4 border-ktsa-accent/30 border-t-ktsa-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6 bg-ktsa-bg px-4">
        <h2 className="text-2xl font-black text-ktsa-text">
          {error ?? "Tournament not found"}
        </h2>
        <button
          onClick={() => navigate("/tournaments")}
          className="flex items-center gap-2 px-6 py-3 bg-ktsa-primary/70 text-ktsa-text font-bold rounded-full hover:bg-ktsa-accent transition-all"
        >
          <ArrowLeft size={18} />
          Back to Tournaments
        </button>
      </div>
    );
  }

  const categoryLabel =
    selectedCategory === "ALL" ? "Overall" : selectedCategory;

  return (
    <div className="min-h-screen bg-ktsa-bg">
      {/* â”€â”€ Hero Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-[420px] sm:min-h-[480px] overflow-hidden">
        <div className="absolute inset-0">
          {tournament.bannerUrl ? (
            <ImageWithFallback
              src={tournament.bannerUrl}
              alt={tournament.tournamentName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ktsa-primary/60 to-ktsa-secondary/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg via-ktsa-bg/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ktsa-accent/5 via-transparent to-ktsa-highlight/5" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-24 pb-8 flex flex-col min-h-[420px] sm:min-h-[480px] gap-8">
          {/* Back button */}
          <button
            onClick={() => navigate(`/tournaments/${id}`)}
            className="flex items-center gap-2 text-ktsa-text/80 hover:text-ktsa-accent transition-colors font-medium text-sm bg-black/40 backdrop-blur-sm self-start px-3 py-1.5 rounded-full"
          >
            <ArrowLeft size={16} />
            Back to Tournament
          </button>

          {/* Title + meta + stats */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge(tournament.status)}`}
              >
                {tournament.status}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ktsa-accent/10 border border-ktsa-accent/20 text-ktsa-accent/80">
                {tournament.format.replace(/_/g, " ")}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-1">
              {tournament.tournamentName}
            </h1>
            {selectedCategory !== "ALL" && (
              <p className="text-ktsa-accent font-bold text-lg mb-3">
                {selectedCategory}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-ktsa-text/70">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-ktsa-accent" />
                {formatDateRange(tournament.startDate, tournament.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-ktsa-accent" />
                {tournament.venue}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {[
                { label: "Matches", value: matches.length },
                { label: "Completed", value: completedCount },
                { label: "Participants", value: standings.length },
                ...(tournament.pricePool > 0
                  ? [
                      {
                        label: "Prize Pool",
                        value: `\u20B9${tournament.pricePool.toLocaleString("en-IN")}`,
                      },
                    ]
                  : []),
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="px-4 py-2 bg-ktsa-primary/30 border border-ktsa-accent/20 rounded-xl text-center"
                >
                  <p className="text-lg font-black text-ktsa-accent">{value}</p>
                  <p className="text-xs text-ktsa-text/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Category Tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {categoryTabs.length > 2 && (
        <section className="sticky top-20 z-30 bg-ktsa-bg/90 backdrop-blur-lg border-b border-ktsa-accent/10 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Layers size={14} className="text-ktsa-accent/50 flex-shrink-0" />
            <div className="flex items-center gap-2">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleCategorySelect(tab.value)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    selectedCategory === tab.value
                      ? "bg-ktsa-accent text-ktsa-bg shadow-md shadow-ktsa-accent/30"
                      : "bg-ktsa-primary/30 text-ktsa-text/70 border border-ktsa-accent/20 hover:border-ktsa-accent/50 hover:text-ktsa-text"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ Results body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {completedCount === 0 ? (
        <section className="py-20 px-4 text-center">
          <Shield size={48} className="text-ktsa-accent/30 mx-auto mb-4" />
          <h2 className="text-xl font-black text-ktsa-text mb-2">
            No results yet
          </h2>
          <p className="text-ktsa-text/50 text-sm">
            {selectedCategory === "ALL"
              ? "Results will appear here once matches are completed."
              : `No completed matches found for ${selectedCategory}.`}
          </p>
          {selectedCategory !== "ALL" && (
            <button
              onClick={() => handleCategorySelect("ALL")}
              className="mt-4 px-5 py-2 rounded-full border border-ktsa-accent/30 text-ktsa-accent text-sm font-bold hover:bg-ktsa-accent/10 transition-colors"
            >
              View All Categories
            </button>
          )}
        </section>
      ) : (
        <>
          {/* â”€â”€ Podium + WinnerCard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {topThree.length > 0 && (
            <section className="bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative overflow-hidden py-2">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 max-w-7xl mx-auto py-8 px-4">
                <div className="sm:hidden flex flex-col items-center py-8">
                  <CubePodium players={topThree} />
                </div>
                <div className="hidden sm:flex items-end justify-center gap-3 sm:gap-6 h-[420px] w-full">
                  <div className="max-w-full mx-auto relative z-10 sm:max-w-full w-full">
                    <div className="flex items-end justify-center gap-3 sm:gap-6 h-[420px] w-full">
                      {podiumOrder.map((playerIdx) => {
                        const player = topThree[playerIdx];
                        if (!player) return null;
                        const meta = rankMeta[player.rank as 1 | 2 | 3];
                        const cardHeight =
                          player.rank === 1
                            ? "320px"
                            : player.rank === 2
                              ? "280px"
                              : "250px";
                        const displayName =
                          player.name ?? (player.names ?? []).join(" & ");
                        return (
                          <motion.div
                            key={player.rank}
                            className="flex flex-col items-center"
                            style={{
                              width:
                                player.rank === 1
                                  ? "clamp(110px,30vw,220px)"
                                  : "clamp(95px,26vw,180px)",
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.6,
                              delay: 0.15 * playerIdx,
                            }}
                          >
                            <motion.div
                              className={`relative w-full rounded-2xl overflow-hidden border-2 ${meta.border} shadow-xl bg-black`}
                              initial={{ height: 0 }}
                              whileInView={{ height: cardHeight }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              whileHover={{
                                scale: 1.04,
                                y: -8,
                                boxShadow: "0 20px 40px rgba(255,255,255,0.5)",
                                transition: { duration: 0.25 },
                              }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <img
                                src={player.image ?? malePlayer}
                                alt={displayName}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                                <p className="text-white font-black text-sm sm:text-base leading-tight">
                                  {displayName}
                                </p>
                                <p className="text-ktsa-accent font-black text-lg">
                                  {player.wins}
                                </p>
                                <p className="text-white/70 text-[11px] mb-2">
                                  WINS
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-white">
                                  <div>
                                    <p className="font-black text-sm">
                                      {player.matches}
                                    </p>
                                    <p className="text-[10px] text-white/70">
                                      Played
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-black text-sm">
                                      {player.losses}
                                    </p>
                                    <p className="text-[10px] text-white/70">
                                      Losses
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                            <div
                              className={`mt-2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${meta.gradient} text-white shadow-md`}
                            >
                              #{player.rank}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="relative lg:top-20 top-0 py-3 px-2">
                  {standings[0] && (
                    <WinnerCard
                      player={standings[0]}
                      category={categoryLabel}
                    />
                  )}
                </div>
              </div>
            </section>
          )}

          {/* â”€â”€ Standings Table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="max-w-7xl mx-auto px-4 pb-4">
            <div className="flex justify-end mb-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={14} className="text-ktsa-text/50" />
                </div>
                <input
                  type="text"
                  placeholder="Search participant..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 pr-8 py-2 bg-ktsa-accent/10 text-ktsa-text text-sm font-semibold border border-ktsa-accent/30 rounded-lg focus:outline-none focus:border-ktsa-accent placeholder:text-ktsa-text/40 transition-colors w-64"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-ktsa-text/50 hover:text-ktsa-text"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            <div
              className="border border-ktsa-accent/30 rounded-xl overflow-hidden"
              style={{ boxShadow: "0 8px 40px rgba(0,229,255,0.1)" }}
            >
              <div className="grid grid-cols-7 gap-2 px-5 py-3 bg-ktsa-primary/75 border-b border-ktsa-accent/30 font-black text-ktsa-text text-sm">
                <div>Rank</div>
                <div className="col-span-2">Participant</div>
                <div className="text-right">Played</div>
                <div className="text-right">Wins</div>
                <div className="text-right">Losses</div>
                <div className="text-right" title="Total match points scored">Pts</div>
              </div>
              {paginatedStandings.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-ktsa-text/50 text-sm">
                  No participants found
                </div>
              ) : (
                paginatedStandings.map((entry, index) => {
                  const displayName =
                    entry.name ?? (entry.names ?? []).join(" & ");
                  return (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`grid grid-cols-7 gap-2 px-5 py-2.5 border-b border-ktsa-accent/10 hover:bg-ktsa-primary/50 transition-colors group ${entry.rank <= 3 ? "bg-ktsa-primary/20" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {entry.rank === 1 && (
                          <Trophy size={14} className="text-yellow-400" />
                        )}
                        {entry.rank === 2 && (
                          <Medal size={14} className="text-gray-400" />
                        )}
                        {entry.rank === 3 && (
                          <Award size={14} className="text-orange-500" />
                        )}
                        {entry.rank > 3 && (
                          <span className="text-sm text-ktsa-text group-hover:text-ktsa-highlight transition-colors">
                            {entry.rank}
                          </span>
                        )}
                      </div>
                      <div className="col-span-2 text-ktsa-text text-sm flex items-center font-medium">
                        {displayName}
                      </div>
                      <div className="text-right text-ktsa-text/80 font-semibold text-sm flex items-center justify-end">
                        {entry.matches}
                      </div>
                      <div className="text-right text-green-400 font-bold text-sm flex items-center justify-end">
                        {entry.wins}
                      </div>
                      <div className="text-right text-red-400/80 font-semibold text-sm flex items-center justify-end">
                        {entry.losses}
                      </div>
                      <div className="text-right text-ktsa-accent/80 font-semibold text-sm flex items-center justify-end" title="Total match points scored">
                        {entry.pointsFor}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
            <div className="flex items-center justify-between px-5 py-2 border border-t-0 border-ktsa-accent/20 rounded-b-xl bg-ktsa-primary/75">
              <div className="text-sm text-ktsa-text font-semibold">
                Showing {filteredStandings.length === 0 ? 0 : startIdx + 1}-
                {Math.min(startIdx + recordsPerPage, filteredStandings.length)}{" "}
                of {filteredStandings.length}
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="w-9 h-9 flex items-center justify-center text-ktsa-text rounded border border-ktsa-accent/20 disabled:opacity-40 enabled:hover:bg-ktsa-primary"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 2),
                    Math.min(totalPages, currentPage + 1),
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded font-bold text-sm transition ${currentPage === page ? "bg-ktsa-primary text-ktsa-text" : "border border-ktsa-accent/20 text-ktsa-text hover:bg-ktsa-primary"}`}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="w-9 h-9 flex items-center justify-center text-ktsa-text rounded border border-ktsa-accent/20 disabled:opacity-40 enabled:hover:bg-ktsa-primary"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* â”€â”€ Matches by Round â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="max-w-7xl mx-auto px-4 pb-16 pt-6">
            <h2 className="text-xl font-black text-ktsa-text mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-ktsa-accent" />
              Match Results{" "}
              {selectedCategory !== "ALL" && (
                <span className="text-ktsa-accent/60 text-base font-semibold">
                  - {selectedCategory}
                </span>
              )}
            </h2>
            {groupedMatches.size === 0 ? (
              <p className="text-ktsa-text/50 text-sm text-center py-8">
                No match data available.
              </p>
            ) : (
              <div className="space-y-8">
                {[...groupedMatches.entries()].map(([round, byStage]) => (
                  <div key={round}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1 bg-ktsa-accent/20" />
                      <span className="px-4 py-1 text-xs font-black text-ktsa-accent border border-ktsa-accent/30 rounded-full bg-ktsa-accent/5 tracking-widest uppercase">
                        Round {round}
                      </span>
                      <div className="h-px flex-1 bg-ktsa-accent/20" />
                    </div>
                    <div className="space-y-4">
                      {[...byStage.entries()].map(([stage, stageMatches]) => (
                        <div key={stage}>
                          {stage !== "UNKNOWN" && (
                            <p className="text-[10px] font-bold tracking-widest text-ktsa-accent/50 uppercase mb-2 pl-1">
                              {stage.replace(/_/g, " ")}
                            </p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {stageMatches.map((m) => (
                              <MatchCard key={m.id} match={m} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
