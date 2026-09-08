import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  Calendar,
  MapPin,
  ExternalLink,
  Search,
  X,
  Shield,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { getTournamentById } from "../../services/tournamentService";
import {
  getMatchesByTournament,
  MatchResponseDto,
} from "../../services/matchService";

// ── Types ──────────────────────────────────────────────────────────────────────

interface StandingEntry {
  rank: number;
  name: string;
  wins: number;
  losses: number;
  matches: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildStandings(matches: MatchResponseDto[]): StandingEntry[] {
  const map = new Map<
    string,
    { wins: number; losses: number; matches: number }
  >();

  const ensure = (name: string) => {
    if (!map.has(name)) map.set(name, { wins: 0, losses: 0, matches: 0 });
  };

  for (const m of matches) {
    if (m.status !== "completed" && m.status !== "COMPLETED") continue;
    const isTeam = !!m.teamOne;
    const p1 = isTeam ? m.teamOne : m.playerOne;
    const p2 = isTeam ? m.teamTwo : m.playerTwo;
    if (!p1 || !p2) continue;

    ensure(p1);
    ensure(p2);
    map.get(p1)!.matches++;
    map.get(p2)!.matches++;

    const winner = isTeam ? m.winnerTeam : m.winnerPlayer;
    if (winner) {
      const loser = winner === p1 ? p2 : p1;
      map.get(winner)!.wins++;
      map.get(loser)!.losses++;
    }
  }

  return [...map.entries()]
    .sort((a, b) => {
      if (b[1].wins !== a[1].wins) return b[1].wins - a[1].wins;
      return a[1].losses - b[1].losses;
    })
    .map(([name, stat], idx) => ({ rank: idx + 1, name, ...stat }));
}

function groupMatches(
  matches: MatchResponseDto[],
): Map<number, Map<string, MatchResponseDto[]>> {
  const byRound = new Map<number, Map<string, MatchResponseDto[]>>();
  [...matches]
    .sort((a, b) => a.roundNumber - b.roundNumber)
    .forEach((m) => {
      if (!byRound.has(m.roundNumber)) byRound.set(m.roundNumber, new Map());
      const byStage = byRound.get(m.roundNumber)!;
      const stage = m.stage ?? "Match";
      if (!byStage.has(stage)) byStage.set(stage, []);
      byStage.get(stage)!.push(m);
    });
  return byRound;
}

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s === "completed")
    return "bg-green-500/15 text-green-400 border-green-500/25";
  if (s === "in_progress")
    return "bg-blue-500/15 text-blue-400 border-blue-500/25 animate-pulse";
  if (s === "cancelled") return "bg-red-500/15 text-red-400 border-red-500/25";
  return "bg-muted text-muted-foreground border-border";
}

const rankIcon = (rank: number) => {
  if (rank === 1) return <Trophy size={14} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={14} className="text-gray-400" />;
  if (rank === 3) return <Award size={14} className="text-orange-500" />;
  return <span className="text-sm text-muted-foreground">{rank}</span>;
};

// ── Match Row ──────────────────────────────────────────────────────────────────

function MatchRow({ match }: { match: MatchResponseDto }) {
  const isTeam = !!match.teamOne;
  const p1 = isTeam ? match.teamOne : match.playerOne;
  const p2 = isTeam ? match.teamTwo : match.playerTwo;
  const winner = isTeam ? match.winnerTeam : match.winnerPlayer;
  const s1 = match.teamOneScore ?? "–";
  const s2 = match.teamTwoScore ?? "–";
  const w1 = !!winner && winner === p1;
  const w2 = !!winner && winner === p2;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/10 border border-border hover:border-ktsa-accent/20 transition-colors">
      {/* P1 */}
      <div
        className={`flex-1 text-right text-sm font-semibold leading-tight truncate ${w1 ? "text-ktsa-accent" : "text-foreground"}`}
      >
        {w1 && (
          <Trophy size={11} className="inline mr-1 text-yellow-400 mb-0.5" />
        )}
        {p1 ?? "TBD"}
      </div>

      {/* Score */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-background border border-border flex-shrink-0">
        <span
          className={`text-sm font-black tabular-nums ${w1 ? "text-ktsa-accent" : "text-muted-foreground"}`}
        >
          {s1}
        </span>
        <span className="text-muted-foreground/40 text-xs">–</span>
        <span
          className={`text-sm font-black tabular-nums ${w2 ? "text-ktsa-accent" : "text-muted-foreground"}`}
        >
          {s2}
        </span>
      </div>

      {/* P2 */}
      <div
        className={`flex-1 text-left text-sm font-semibold leading-tight truncate ${w2 ? "text-ktsa-accent" : "text-foreground"}`}
      >
        {p2 ?? "TBD"}
        {w2 && (
          <Trophy size={11} className="inline ml-1 text-yellow-400 mb-0.5" />
        )}
      </div>

      {/* Status */}
      <span
        className={`hidden sm:inline-block flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(match.status)}`}
      >
        {match.status.replace("_", " ").toUpperCase()}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export const TournamentResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tournamentId = Number(id);

  const [tournament, setTournament] = useState<any>(null);
  const [matches, setMatches] = useState<MatchResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // search + pagination for standings
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    if (!tournamentId) return;
    Promise.all([
      getTournamentById(String(tournamentId)),
      getMatchesByTournament(tournamentId),
    ])
      .then(([t, m]) => {
        setTournament(t.data ?? t);
        setMatches(m);
      })
      .catch(() => toast.error("Failed to load results"))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-ktsa-accent" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="p-6 text-center">
        <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="mb-2">Tournament not found</h2>
        <Button onClick={() => navigate("/tournaments")}>
          Back to Tournaments
        </Button>
      </div>
    );
  }

  // ── Derived ──────────────────────────────────────────────────────
  const standings = buildStandings(matches);
  const completedCount = matches.filter(
    (m) => m.status === "completed" || m.status === "COMPLETED",
  ).length;
  const groupedMatches = groupMatches(matches);

  const filteredStandings = standings.filter((s) => {
    if (!searchQuery.trim()) return true;
    return s.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const totalPages = Math.ceil(filteredStandings.length / recordsPerPage);
  const startIdx = (currentPage - 1) * recordsPerPage;
  const paginatedStandings = filteredStandings.slice(
    startIdx,
    startIdx + recordsPerPage,
  );

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/tournaments/${id}/matches`)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Matches
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="mb-1 bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent">
              {tournament.tournamentName ?? tournament.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              Tournament Results & Standings
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate(`/tournaments/${id}/matches`)}
          >
            Manage Matches
          </Button>
        </div>

        {/* Info strip */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
          {tournament.startDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-ktsa-accent" />
              {new Date(tournament.startDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {tournament.venue && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-ktsa-accent" />
              {tournament.venue}
            </span>
          )}
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { label: "Total Matches", value: matches.length },
            { label: "Completed", value: completedCount },
            { label: "Participants", value: standings.length },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="px-4 py-2 bg-muted/20 border border-border rounded-xl text-center min-w-[90px]"
            >
              <p className="text-lg font-black text-ktsa-accent">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── No results yet ────────────────────────────────────────── */}
      {completedCount === 0 ? (
        <Card className="p-12 text-center">
          <Shield size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">No results yet</h3>
          <p className="text-muted-foreground mb-6">
            Results will appear here once matches are marked as completed.
          </p>
          <Button onClick={() => navigate(`/tournaments/${id}/matches`)}>
            Go to Matches
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* ── Podium (top 3) ──────────────────────────────────── */}
          {standings.length >= 1 && (
            <Card>
              <h2 className="mb-5 flex items-center gap-2 text-base font-bold">
                <Trophy size={18} className="text-ktsa-accent" />
                Top Finishers
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Render 2nd, 1st, 3rd for podium visual order */}
                {[standings[1], standings[0], standings[2]]
                  .filter(Boolean)
                  .map((entry) => {
                    if (!entry) return null;
                    const isFirst = entry.rank === 1;
                    const borderColors: Record<number, string> = {
                      1: "border-yellow-400 shadow-yellow-400/20",
                      2: "border-gray-400 shadow-gray-400/10",
                      3: "border-orange-500 shadow-orange-500/10",
                    };
                    const bgColors: Record<number, string> = {
                      1: "bg-yellow-500/5",
                      2: "bg-gray-500/5",
                      3: "bg-orange-500/5",
                    };
                    const medals: Record<number, React.ReactNode> = {
                      1: <Trophy size={20} className="text-yellow-400" />,
                      2: <Medal size={20} className="text-gray-400" />,
                      3: <Award size={20} className="text-orange-500" />,
                    };
                    return (
                      <div
                        key={entry.rank}
                        className={`flex-1 max-w-xs mx-auto sm:mx-0 border-2 rounded-2xl p-5 text-center shadow-lg ${
                          borderColors[entry.rank]
                        } ${bgColors[entry.rank]} ${
                          isFirst ? "sm:-mt-3 sm:scale-105" : ""
                        } transition-all`}
                      >
                        <div className="flex justify-center mb-2">
                          {medals[entry.rank]}
                        </div>
                        <p
                          className={`font-black text-lg text-foreground leading-snug ${isFirst ? "text-xl" : ""}`}
                        >
                          {entry.name}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3 mt-0.5">
                          Rank #{entry.rank}
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {[
                            { label: "Played", value: entry.matches },
                            { label: "Wins", value: entry.wins },
                            { label: "Losses", value: entry.losses },
                          ].map(({ label, value }) => (
                            <div
                              key={label}
                              className="rounded-lg bg-background/60 py-1.5"
                            >
                              <p className="text-sm font-black text-foreground">
                                {value}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>
          )}

          {/* ── Full Standings Table ─────────────────────────────── */}
          <Card className="overflow-hidden p-0">
            {/* Search bar */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-bold text-base flex items-center gap-2">
                <Shield size={16} className="text-ktsa-accent" />
                Full Standings
              </h2>
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search participant..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 pr-8 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ktsa-accent text-foreground placeholder:text-muted-foreground w-52"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-6 gap-2 px-5 py-2.5 bg-muted/20 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div>Rank</div>
              <div className="col-span-2">Participant</div>
              <div className="text-right">Played</div>
              <div className="text-right">Wins</div>
              <div className="text-right">Losses</div>
            </div>

            {paginatedStandings.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
                No participants found
              </div>
            ) : (
              paginatedStandings.map((entry, idx) => (
                <div
                  key={entry.rank}
                  className={`grid grid-cols-6 gap-2 px-5 py-2.5 border-b border-border hover:bg-muted/10 transition-colors ${
                    entry.rank <= 3 ? "bg-muted/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {rankIcon(entry.rank)}
                  </div>
                  <div className="col-span-2 text-sm font-medium text-foreground flex items-center">
                    {entry.name}
                  </div>
                  <div className="text-right text-sm text-muted-foreground flex items-center justify-end">
                    {entry.matches}
                  </div>
                  <div className="text-right text-sm font-bold text-green-400 flex items-center justify-end">
                    {entry.wins}
                  </div>
                  <div className="text-right text-sm text-red-400/70 flex items-center justify-end">
                    {entry.losses}
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/10">
                <p className="text-xs text-muted-foreground">
                  {filteredStandings.length === 0 ? 0 : startIdx + 1}–
                  {Math.min(
                    startIdx + recordsPerPage,
                    filteredStandings.length,
                  )}{" "}
                  of {filteredStandings.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                          p === currentPage
                            ? "bg-ktsa-accent/15 border border-ktsa-accent text-ktsa-accent"
                            : "border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </Card>

          {/* ── Match Results by Round ───────────────────────────── */}
          <Card>
            <h2 className="font-bold text-base mb-5 flex items-center gap-2">
              <Trophy size={16} className="text-ktsa-accent" />
              Match Results
            </h2>

            {groupedMatches.size === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No match data available.
              </p>
            ) : (
              <div className="space-y-6">
                {[...groupedMatches.entries()].map(([round, byStage]) => (
                  <div key={round}>
                    {/* Round divider */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="px-3 py-0.5 text-xs font-black text-ktsa-accent border border-ktsa-accent/30 rounded-full bg-ktsa-accent/5 uppercase tracking-widest">
                        Round {round}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="space-y-3">
                      {[...byStage.entries()].map(([stage, stageMatches]) => (
                        <div key={stage}>
                          {stage !== "Match" && (
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2 pl-1">
                              {stage.replace(/_/g, " ")}
                            </p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {stageMatches.map((m) => (
                              <MatchRow key={m.id} match={m} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
