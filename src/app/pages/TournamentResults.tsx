import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  X,
  Shield,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { WinnerCard } from "../components/ui/WinnerCard";
import { CubePodium } from "../components/ui/CubePodium";
import malePlayer from "../../assets/male_avatar.jfif";
import doublePlayer from "../../assets/doubles_avatar.jfif";
import {
  getTournamentById,
  getMatchesByTournament,
  type MatchResult,
  type TournamentDetail,
} from "../../services/matchService";

// ── Types ──────────────────────────────────────────────────────────────────────

interface StandingEntry {
  rank: number;
  name?: string; // singles
  names?: string[]; // doubles
  image?: string;
  wins: number;
  losses: number;
  matches: number;
  points: number;
  trend: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Derive participant standings from completed matches */
function buildStandings(matches: MatchResult[]): StandingEntry[] {
  const map = new Map<
    string,
    { wins: number; losses: number; matches: number; isTeam: boolean }
  >();

  const ensure = (name: string, isTeam: boolean) => {
    if (!map.has(name))
      map.set(name, { wins: 0, losses: 0, matches: 0, isTeam });
  };

  for (const m of matches) {
    if (m.status !== "COMPLETED") continue;

    const isTeam = !!m.teamOne;

    if (isTeam) {
      const p1 = m.teamOne!;
      const p2 = m.teamTwo!;
      ensure(p1, true);
      ensure(p2, true);
      map.get(p1)!.matches++;
      map.get(p2)!.matches++;
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
      if (m.winnerPlayer) {
        const winner = m.winnerPlayer;
        const loser = winner === p1 ? p2 : p1;
        map.get(winner)!.wins++;
        map.get(loser)!.losses++;
      }
    }
  }

  const sorted = [...map.entries()].sort((a, b) => {
    // Sort by wins desc, then losses asc
    if (b[1].wins !== a[1].wins) return b[1].wins - a[1].wins;
    return a[1].losses - b[1].losses;
  });

  return sorted.map(([name, stat], idx) => {
    const isDoubles = name.includes(" & ") || stat.isTeam;
    return {
      rank: idx + 1,
      ...(isDoubles
        ? { names: name.split(" & "), image: doublePlayer }
        : { name, image: malePlayer }),
      wins: stat.wins,
      losses: stat.losses,
      matches: stat.matches,
      // Simple points: 3 per win, 1 per draw (no draw logic here)
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
  return start === end ? s : `${s} – ${e}`;
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

// ── Match Card ─────────────────────────────────────────────────────────────────

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
        <span className="text-ktsa-text/30 text-xs">–</span>
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

// ── Main Component ─────────────────────────────────────────────────────────────

export function TournamentResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // standings pagination + search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getTournamentById(id), getMatchesByTournament(id)])
      .then(([t, m]) => {
        setTournament(t);
        setMatches(m);
      })
      .catch(() => setError("Failed to load tournament results."))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Derived data ─────────────────────────────────────────────
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

  // ── Loading / Error ──────────────────────────────────────────
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

  return (
    <div className="min-h-screen bg-ktsa-bg">
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className="relative h-[calc(38vh+5rem)] min-h-[320px] flex items-end justify-center overflow-hidden">
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

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-8">
          {/* Back button */}
          <button
            onClick={() => navigate("/tournaments")}
            className="flex items-center gap-2 text-ktsa-text/60 hover:text-ktsa-accent transition-colors mb-4 font-medium text-sm"
          >
            <ArrowLeft size={16} />
            All Tournaments
          </button>

          {/* Status + format */}
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

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3">
            {tournament.tournamentName}
          </h1>

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

          {/* Stats strip */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="px-4 py-2 bg-ktsa-primary/30 border border-ktsa-accent/20 rounded-xl text-center">
              <p className="text-lg font-black text-ktsa-accent">
                {matches.length}
              </p>
              <p className="text-xs text-ktsa-text/60">Total Matches</p>
            </div>
            <div className="px-4 py-2 bg-ktsa-primary/30 border border-ktsa-accent/20 rounded-xl text-center">
              <p className="text-lg font-black text-ktsa-accent">
                {completedCount}
              </p>
              <p className="text-xs text-ktsa-text/60">Completed</p>
            </div>
            <div className="px-4 py-2 bg-ktsa-primary/30 border border-ktsa-accent/20 rounded-xl text-center">
              <p className="text-lg font-black text-ktsa-accent">
                {standings.length}
              </p>
              <p className="text-xs text-ktsa-text/60">Participants</p>
            </div>
            {tournament.pricePool > 0 && (
              <div className="px-4 py-2 bg-ktsa-primary/30 border border-ktsa-accent/20 rounded-xl text-center">
                <p className="text-lg font-black text-ktsa-accent">
                  ₹{tournament.pricePool.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-ktsa-text/60">Prize Pool</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Only show results when there are completed matches ────── */}
      {completedCount === 0 ? (
        <section className="py-20 px-4 text-center">
          <Shield size={48} className="text-ktsa-accent/30 mx-auto mb-4" />
          <h2 className="text-xl font-black text-ktsa-text mb-2">
            No results yet
          </h2>
          <p className="text-ktsa-text/50 text-sm">
            Results will appear here once matches are completed.
          </p>
        </section>
      ) : (
        <>
          {/* ── Podium + WinnerCard — same layout as Rankings.tsx ────── */}
          {topThree.length > 0 && (
            <section className="bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative overflow-hidden py-2">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 max-w-7xl mx-auto py-8 px-4">
                {/* Mobile: cube podium */}
                <div className="sm:hidden flex flex-col items-center py-8">
                  <CubePodium players={topThree} />
                </div>

                {/* Desktop: animated card towers — 2nd left, 1st centre, 3rd right */}
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
                              transition={{
                                duration: 0.8,
                                ease: "easeOut",
                              }}
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

                {/* Winner card — right column */}
                <div className="relative lg:top-20 top-0 py-3 px-2">
                  {standings[0] && (
                    <WinnerCard
                      player={standings[0]}
                      category={tournament.tournamentName}
                    />
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ── Standings Table ───────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 pb-4">
            {/* Search */}
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

            {/* Table */}
            <div
              className="border border-ktsa-accent/30 rounded-xl overflow-hidden"
              style={{ boxShadow: "0 8px 40px rgba(0,229,255,0.1)" }}
            >
              {/* Header */}
              <div className="grid grid-cols-6 gap-2 px-5 py-3 bg-ktsa-primary/75 border-b border-ktsa-accent/30 font-black text-ktsa-text text-sm">
                <div>Rank</div>
                <div className="col-span-2">Participant</div>
                <div className="text-right">Played</div>
                <div className="text-right">Wins</div>
                <div className="text-right">Losses</div>
              </div>

              {paginatedStandings.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-ktsa-text/50 text-sm">
                  No participants found
                </div>
              ) : (
                paginatedStandings.map((entry, index) => {
                  const displayName =
                    entry.name ?? (entry.names ?? []).join(" & ");
                  const isTop3 = entry.rank <= 3;
                  return (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`grid grid-cols-6 gap-2 px-5 py-2.5 border-b border-ktsa-accent/10 hover:bg-ktsa-primary/50 transition-colors group ${
                        isTop3 ? "bg-ktsa-primary/20" : ""
                      }`}
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
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-2 border border-t-0 border-ktsa-accent/20 rounded-b-xl bg-ktsa-primary/75">
              <div className="text-sm text-ktsa-text font-semibold">
                Showing {filteredStandings.length === 0 ? 0 : startIdx + 1}–
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
                      className={`w-7 h-7 rounded font-bold text-sm transition ${
                        currentPage === page
                          ? "bg-ktsa-primary text-ktsa-text"
                          : "border border-ktsa-accent/20 text-ktsa-text hover:bg-ktsa-primary"
                      }`}
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

          {/* ── Match Results by Round ────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 pb-16 pt-6">
            <h2 className="text-xl font-black text-ktsa-text mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-ktsa-accent" />
              Match Results
            </h2>

            {groupedMatches.size === 0 ? (
              <p className="text-ktsa-text/50 text-sm text-center py-8">
                No match data available.
              </p>
            ) : (
              <div className="space-y-8">
                {[...groupedMatches.entries()].map(([round, byStage]) => (
                  <div key={round}>
                    {/* Round header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1 bg-ktsa-accent/20" />
                      <span className="px-4 py-1 text-xs font-black text-ktsa-accent border border-ktsa-accent/30 rounded-full bg-ktsa-accent/5 tracking-widest uppercase">
                        Round {round}
                      </span>
                      <div className="h-px flex-1 bg-ktsa-accent/20" />
                    </div>

                    {/* Stages within round */}
                    <div className="space-y-4">
                      {[...byStage.entries()].map(([stage, stageMatches]) => (
                        <div key={stage}>
                          {/* Stage label (only if not just "UNKNOWN") */}
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
