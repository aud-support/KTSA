import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { WinnerCard } from "../components/ui/WinnerCard";
import { CubePodium } from "../components/ui/CubePodium";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import malePlayer from "../../assets/male_avatar.jfif";
import femalePlayer from "../../assets/female_avatar.jfif";
import doublePlayer from "../../assets/doubles_avatar.jfif";
import { getAllRankings } from "../../services/rankingService";
import type { RankingResponse, RankingCategory } from "../../services/rankingService";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlayerEntry {
  rank: number;
  name?: string;
  names?: string[];
  image?: string;
  points: number;
  matches: number;
  wins: number;
  trend: string;
}

// ── Category config ────────────────────────────────────────────────────────────

const categories: { label: string; key: RankingCategory }[] = [
  { label: "Men's Singles",   key: "MENS_SINGLES"   },
  { label: "Women's Singles", key: "WOMENS_SINGLES" },
  { label: "Open Doubles",    key: "OPEN_DOUBLES"   },
  { label: "Mixed Doubles",   key: "MIXED_DOUBLES"  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function avatarForEntry(r: RankingResponse): string {
  if (r.teamId) return doublePlayer;
  if (r.gender === "FEMALE") return femalePlayer;
  return malePlayer;
}

function toPlayerEntries(data: RankingResponse[]): PlayerEntry[] {
  return [...data]
    .sort((a, b) => b.points - a.points)
    .map((r, i) => {
      const isDoubles = !!r.teamId;
      return {
        rank: i + 1,
        ...(isDoubles
          ? { names: r.userName.split(" & "), image: doublePlayer }
          : { name: r.userName, image: avatarForEntry(r) }),
        points: r.points,
        matches: r.matches,
        wins: r.wins,
        trend: "same",
      };
    });
}

// ── Podium meta ────────────────────────────────────────────────────────────────

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

// Podium order: 2nd left, 1st center, 3rd right
const podiumOrder = [1, 0, 2];

// ── Component ──────────────────────────────────────────────────────────────────

export function Rankings() {
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryKey, setSelectedCategoryKey] =
    useState<RankingCategory>("MENS_SINGLES");

  // API state
  const [allRankings, setAllRankings] = useState<RankingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllRankings()
      .then((data) => setAllRankings(data))
      .catch(() => setError("Failed to load rankings. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // Derive the current category's player list from API data
  const rankings: PlayerEntry[] = toPlayerEntries(
    allRankings.filter((r) => r.category === selectedCategoryKey)
  );

  const topThree = rankings.slice(0, 3);

  const restOfRankings = rankings.filter((player) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (player.name) return player.name.toLowerCase().includes(q);
    return (player.names ?? []).some((n) => n.toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(restOfRankings.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedRankings = restOfRankings.slice(startIndex, endIndex);

  const selectedCategoryLabel =
    categories.find((c) => c.key === selectedCategoryKey)?.label ?? "";

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (currentPage <= 2) {
      for (let i = 1; i <= Math.min(3, totalPages); i++) pages.push(i);
    } else if (currentPage >= totalPages) {
      for (let i = totalPages - 2; i <= totalPages; i++) {
        if (i > 0) pages.push(i);
      }
    } else {
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i <= totalPages) pages.push(i);
      }
    }
    if (pages[pages.length - 1] !== totalPages) {
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // Dropdown state
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedTournament, setSelectedTournament] = useState("All");
  const [yearOpen, setYearOpen] = useState(false);
  const [tournamentOpen, setTournamentOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  const tournamentRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node))
        setCategoryOpen(false);
      if (yearRef.current && !yearRef.current.contains(e.target as Node))
        setYearOpen(false);
      if (tournamentRef.current && !tournamentRef.current.contains(e.target as Node))
        setTournamentOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (key: RankingCategory) => {
    setSelectedCategoryKey(key);
    setCurrentPage(1);
    setSearchQuery("");
    setCategoryOpen(false);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <section className="relative h-[38vh] min-h-[220px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://www.bonziniusa.com/cdn/shop/articles/BonziniUSA-334538-Foosball-Table-Figurines-BlogBanner1.jpg?v=1728670624"
            alt="Rankings"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-ktsa-accent/20 via-transparent to-ktsa-highlight/20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-ktsa-accent mb-3">
              Ran<span className="text-ktsa-text">kings</span>
            </h1>
            <p className="text-sm md:text-base text-ktsa-text/80 font-semibold">
              Top performers in Karnataka table soccer
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs & Filters */}
      <section className="py-3 sticky top-20 z-40 border-b border-ktsa-accent/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex flex-row justify-around items-center gap-3">

            {/* Mobile: category dropdown */}
            <div className="relative md:hidden w-full max-w-[200px]" ref={categoryRef}>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-2 text-sm px-4 py-1.5 w-full bg-ktsa-primary/75 text-ktsa-text border border-ktsa-accent/30 rounded-lg font-bold hover:border-ktsa-accent transition-colors justify-between"
              >
                {selectedCategoryLabel}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                />
              </button>
              {categoryOpen && (
                <div
                  className="absolute top-full mt-1 left-0 z-50 bg-ktsa-bg border border-ktsa-accent/30 rounded-lg overflow-hidden w-full"
                  style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => handleCategorySelect(cat.key)}
                      className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                        selectedCategoryKey === cat.key
                          ? "bg-ktsa-accent/20 text-ktsa-accent"
                          : "text-ktsa-text hover:bg-ktsa-primary/40"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: pill tabs */}
            <div className="hidden md:flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategorySelect(cat.key)}
                  className={`px-5 py-1.5 rounded-full font-bold text-xs transition-all hover:-translate-y-0.5 duration-300 ${
                    selectedCategoryKey === cat.key
                      ? "bg-ktsa-highlight text-ktsa-text shadow-lg scale-105"
                      : "bg-ktsa-accent/20 text-ktsa-text border border-ktsa-accent/80 hover:border-ktsa-accent hover:bg-ktsa-accent/10 hover:text-ktsa-highlight hover:shadow-md"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Year & Tournament filters */}
            <div className="flex items-center gap-3">
              <div className="relative" ref={yearRef}>
                <button
                  onClick={() => { setYearOpen(!yearOpen); setTournamentOpen(false); }}
                  className="flex items-center gap-2 text-sm px-4 py-1.5 bg-ktsa-primary/75 text-ktsa-text border border-ktsa-accent/30 rounded-lg font-bold hover:border-ktsa-accent transition-colors min-w-[80px] justify-between"
                >
                  {selectedYear}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${yearOpen ? "rotate-180" : ""}`} />
                </button>
                {yearOpen && (
                  <div className="absolute top-full mt-1 left-0 z-50 bg-ktsa-bg border border-ktsa-accent/30 rounded-lg overflow-hidden min-w-[80px]" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                    {["2026", "2025", "2024"].map((year) => (
                      <button key={year} onClick={() => { setSelectedYear(year); setYearOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${selectedYear === year ? "bg-ktsa-accent/20 text-ktsa-accent" : "text-ktsa-text hover:bg-ktsa-primary/40"}`}>
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={tournamentRef}>
                <button
                  onClick={() => { setTournamentOpen(!tournamentOpen); setYearOpen(false); }}
                  className="flex items-center gap-2 text-sm px-4 py-1.5 bg-ktsa-primary/75 text-ktsa-text border border-ktsa-accent/30 rounded-lg font-bold hover:border-ktsa-accent transition-colors sm:min-w-[190px] min-w-[100px] justify-between"
                >
                  {selectedTournament}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${tournamentOpen ? "rotate-180" : ""}`} />
                </button>
                {tournamentOpen && (
                  <div className="absolute top-full mt-1 left-0 z-50 bg-ktsa-bg border border-ktsa-accent/30 rounded-lg overflow-hidden min-w-[60px]" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                    {["All", "State", "City"].map((t) => (
                      <button key={t} onClick={() => { setSelectedTournament(t); setTournamentOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${selectedTournament === t ? "bg-ktsa-accent/20 text-ktsa-accent" : "text-ktsa-text hover:bg-ktsa-primary/40"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podium section */}
      <section className="bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 max-w-7xl mx-auto py-8">

          {/* Mobile — cube view */}
          <div className="sm:hidden flex flex-col items-center py-8">
            <CubePodium players={topThree} />
          </div>

          {/* Desktop podium */}
          <div className="hidden sm:flex items-end justify-center gap-3 sm:gap-6 h-[420px] w-full -mr-0.5">
            <div className="max-w-full mx-auto relative z-10 sm:max-w-full">
              <div className="flex items-end justify-center gap-3 sm:gap-6 h-[420px] w-full -mr-0.5">
                {podiumOrder.map((playerIdx) => {
                  const player = topThree[playerIdx];
                  if (!player) return null;
                  const meta = rankMeta[player.rank as 1 | 2 | 3];
                  const cardHeight = player.rank === 1 ? "320px" : player.rank === 2 ? "280px" : "250px";
                  return (
                    <motion.div
                      key={player.rank}
                      className="flex flex-col items-center"
                      style={{ width: player.rank === 1 ? "clamp(110px, 30vw, 220px)" : "clamp(95px, 26vw, 180px)" }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.15 * playerIdx }}
                    >
                      <motion.div
                        className={`relative w-full rounded-2xl overflow-hidden border-2 ${meta.border} shadow-xl bg-black`}
                        initial={{ height: 0 }}
                        whileInView={{ height: cardHeight }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        whileHover={{ scale: 1.04, y: -8, boxShadow: "0 20px 40px rgba(255,255,255,0.5)", transition: { duration: 0.25 } }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <img
                          src={player.image ?? malePlayer}
                          alt={player.name ?? (player.names ?? []).join(" & ")}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                          <p className="text-white font-black text-sm sm:text-base leading-tight">
                            {player.name ?? (player.names ?? []).join(" & ")}
                          </p>
                          <p className="text-ktsa-accent font-black text-lg">{player.points}</p>
                          <p className="text-white/70 text-[11px] mb-2">PTS</p>
                          <div className="grid grid-cols-2 gap-2 text-white">
                            <div>
                              <p className="font-black text-sm">{player.matches}</p>
                              <p className="text-[10px] text-white/70">Played</p>
                            </div>
                            <div>
                              <p className="font-black text-sm">{player.wins}</p>
                              <p className="text-[10px] text-white/70">Wins</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <div className={`mt-2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${meta.gradient} text-white shadow-md`}>
                        #{player.rank}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Winner Card */}
          <div className="relative lg:top-20 top-0 py-3 px-2">
            {rankings[0] && (
              <WinnerCard player={rankings[0]} category={selectedCategoryLabel} />
            )}
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="bg-ktsa-bg px-4 pt-2 pb-2 max-w-7xl mx-auto w-full flex justify-end">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-ktsa-text" />
          </div>
          <input
            type="text"
            placeholder="Search player..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-100 pl-9 pr-4 py-2 bg-ktsa-accent/20 text-ktsa-text text-sm font-semibold border border-ktsa-accent/30 rounded-lg focus:outline-none focus:border-ktsa-accent placeholder:text-ktsa-text/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              className="absolute inset-y-0 right-3 flex items-center text-ktsa-text/80 hover:text-ktsa-text transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </section>

      {/* Rankings Table */}
      <section className="bg-ktsa-bg">
        <div
          className="border border-ktsa-accent/30 backdrop-blur-sm overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(0,229,255,0.15)" }}
        >
          {/* Header */}
          <div className="grid grid-cols-6 gap-2 px-5 py-3 bg-ktsa-primary/75 border-b border-ktsa-accent/30 font-black text-ktsa-text text-sm">
            <div>Rank</div>
            <div className="col-span-2">Player</div>
            <div className="text-right">Points</div>
            <div className="text-right">Matches</div>
            <div className="text-right">Wins</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-ktsa-text/70 text-sm gap-2">
              <svg className="animate-spin h-4 w-4 text-ktsa-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading rankings...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10 text-red-400 text-sm">{error}</div>
          ) : paginatedRankings.length > 0 ? (
            paginatedRankings.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-6 gap-2 px-5 py-2.5 border-b border-ktsa-accent/10 hover:bg-ktsa-primary/50 transition-colors duration-200 group"
              >
                <div className="flex items-center">
                  <span className="text-sm text-ktsa-text group-hover:text-ktsa-highlight transition-colors">
                    {player.rank}
                  </span>
                </div>
                <div className="col-span-2 text-ktsa-text text-sm flex items-center">
                  {player.name ?? (player.names ?? []).join(" & ")}
                </div>
                <div className="text-right text-ktsa-text font-semibold text-sm flex items-center justify-end">
                  {player.points}
                </div>
                <div className="text-right text-ktsa-text font-semibold text-sm flex items-center justify-end">
                  {player.matches}
                </div>
                <div className="text-right text-ktsa-text font-semibold text-sm flex items-center justify-end">
                  {player.wins}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center py-10 text-ktsa-text/70 text-sm">
              No players found
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-ktsa-accent/20 bg-ktsa-primary/75">
        <div className="text-sm text-ktsa-text font-semibold">
          Showing {restOfRankings.length === 0 ? 0 : startIndex + 1} –{" "}
          {Math.min(endIndex, restOfRankings.length)} of {restOfRankings.length}
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="w-9 h-9 flex items-center justify-center text-ktsa-text font-extrabold rounded border border-ktsa-accent/20 disabled:opacity-40 enabled:hover:bg-ktsa-primary"
          >
            <ChevronLeft size={16} />
          </button>
          {getVisiblePages().map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-2 text-ktsa-text">...</span>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(Number(page))}
                className={`w-6 h-6 rounded font-bold text-sm transition ${
                  currentPage === page
                    ? "bg-ktsa-primary text-ktsa-text"
                    : "border border-ktsa-accent/20 text-ktsa-text hover:bg-ktsa-primary"
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-9 h-9 flex items-center justify-center text-ktsa-text font-extrabold rounded border border-ktsa-accent/20 disabled:opacity-40 enabled:hover:bg-ktsa-primary"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
