import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  Swords,
  CheckCircle2,
  Timer,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Match {
  id: number;
  tournamentName: string;
  opponent: string;
  date: string;
  location: string;
  category: string;
  result?: "win" | "loss" | "draw";
  score?: string;
  status: "upcoming" | "past";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

/** Shape returned by GET /api/matches/user/{userId} */
interface UserMatchApiResponse {
  id: number;
  tournamentName: string;
  location: string;
  category: string;
  status: "upcoming" | "past";
  opponent: string;
  score?: string;
  result?: "win" | "loss";
  scheduledAt: string;
  tournamentId: number;
}

const PAGE_SIZE = 10;

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "" },
  { label: "Men's Singles", value: "MENS_SINGLES" },
  { label: "Women's Singles", value: "WOMENS_SINGLES" },
  { label: "Open Doubles", value: "OPEN_DOUBLES" },
  { label: "Mixed Doubles", value: "MIXED_DOUBLES" },
];

const RESULT_OPTIONS = [
  { label: "All Results", value: "" },
  { label: "Win", value: "win" },
  { label: "Loss", value: "loss" },
];

function buildTournamentOptions(matches: Match[]) {
  const seen = new Set<string>();
  const opts: { label: string; value: string }[] = [{ label: "All Tournaments", value: "" }];
  for (const m of matches) {
    if (m.tournamentName && !seen.has(m.tournamentName)) {
      seen.add(m.tournamentName);
      opts.push({ label: m.tournamentName, value: m.tournamentName });
    }
  }
  return opts;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function formatCategory(cat: string): string {
  const map: Record<string, string> = {
    MENS_SINGLES: "Men's Singles",
    WOMENS_SINGLES: "Women's Singles",
    OPEN_DOUBLES: "Open Doubles",
    MIXED_DOUBLES: "Mixed Doubles",
  };
  return map[cat?.toUpperCase()] ?? cat ?? "";
}

function ResultBadge({ result }: { result: "win" | "loss" | "draw" }) {
  const map = {
    win: "bg-green-500/15 border-green-500/30 text-green-400",
    loss: "bg-red-500/15 border-red-500/30 text-red-400",
    draw: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${map[result]}`}
    >
      {result}
    </span>
  );
}

function MatchCard({ match, index }: { match: Match; index: number }) {
  const isPast = match.status === "past";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-xl border p-4 transition-all duration-200 hover:border-ktsa-accent/50 group
        ${isPast ? "border-gray-700/50 bg-white/[0.02]" : "border-ktsa-accent/20 bg-ktsa-primary/10"}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-ktsa-accent font-bold truncate mb-0.5">
            {match.tournamentName}
          </p>
          <p className="text-xs text-gray-500">{formatCategory(match.category)}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isPast && match.result && <ResultBadge result={match.result} />}
          {!isPast && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-ktsa-highlight/10 border-ktsa-highlight/30 text-ktsa-highlight">
              <Timer size={10} />
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* VS row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-ktsa-primary/30 border border-ktsa-accent/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-ktsa-accent">YOU</span>
          </div>
          <Swords size={14} className="text-gray-600" />
          <div className="w-7 h-7 rounded-full bg-gray-700/40 border border-gray-600/30 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-400">
              {match.opponent.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-semibold text-white truncate max-w-[120px]">
            {match.opponent}
          </span>
        </div>
        {isPast && match.score && (
          <span className="ml-auto text-lg font-black text-white">
            {match.score}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1">
          <Calendar size={11} className="text-ktsa-accent/60" />
          {formatDate(match.date)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} className="text-ktsa-accent/60" />
          {formatTime(match.date)}
        </span>
        {match.location && (
          <span className="flex items-center gap-1 truncate">
            <MapPin size={11} className="text-ktsa-accent/60" />
            {match.location}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Small inline dropdown ─────────────────────────────────────────────────────
function FilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = options.find((o) => o.value === value)?.label ?? options[0].label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700/60 bg-white/[0.03] text-xs font-semibold text-gray-300 hover:border-ktsa-accent/40 hover:text-white transition-colors"
      >
        {label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="absolute top-full mt-1 left-0 z-[60] bg-[#0d0d0d] border border-ktsa-accent/30 rounded-lg overflow-hidden min-w-[160px]"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors ${
                value === opt.value
                  ? "bg-ktsa-accent/20 text-ktsa-accent"
                  : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pagination bar ────────────────────────────────────────────────────────────
function PaginationBar({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "…")[] => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, "…", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "…", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 pt-4 border-t border-gray-800/60">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </button>

      {getPages().map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-gray-600 text-xs">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-colors
              ${
                currentPage === p
                  ? "bg-ktsa-primary/70 text-ktsa-text"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
              }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function MyMatchesModal({ isOpen, onClose, userId }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [tournamentFilter, setTournamentFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch matches ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !userId) return;
    setLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/matches/user/${userId}`)
      .then((r) => r.json())
      .then((json) => {
        const raw: UserMatchApiResponse[] = json.data ?? [];
        const mapped: Match[] = raw.map((m) => ({
          id: m.id,
          tournamentName: m.tournamentName ?? "Unknown Tournament",
          opponent: m.opponent ?? "TBD",
          date: m.scheduledAt,
          location: m.location ?? "",
          category: m.category ?? "",
          status: m.status,
          result: m.result as "win" | "loss" | undefined,
          score: m.score,
        }));
        setMatches(mapped);
      })
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [isOpen, userId]);

  // Reset page + filters when tab changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
    setCategoryFilter("");
    setResultFilter("");
    setTournamentFilter("");
  }, [tab]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, resultFilter, tournamentFilter]);

  // ── Close handlers ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.button === 2) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const upcomingCount = matches.filter((m) => m.status === "upcoming").length;
  const pastCount = matches.filter((m) => m.status === "past").length;

  const tournamentOptions = useMemo(() => buildTournamentOptions(matches), [matches]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return matches.filter((m) => {
      if (m.status !== tab) return false;
      if (q && !(m.opponent ?? "").toLowerCase().includes(q) && !(m.tournamentName ?? "").toLowerCase().includes(q))
        return false;
      if (categoryFilter && m.category?.toUpperCase() !== categoryFilter) return false;
      if (resultFilter && m.result !== resultFilter) return false;
      if (tournamentFilter && m.tournamentName !== tournamentFilter) return false;
      return true;
    });
  }, [matches, tab, searchQuery, categoryFilter, resultFilter, tournamentFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasActiveFilters = !!(searchQuery || categoryFilter || resultFilter || tournamentFilter);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setResultFilter("");
    setTournamentFilter("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-20 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs px-4">
      <motion.div
        ref={modalRef}
        initial={{
          opacity: 0,
          y: window.innerWidth < 768 ? 100 : 40,
          scale: window.innerWidth < 768 ? 1 : 0.95,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: window.innerWidth < 768 ? 100 : 40 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="w-full max-w-md max-h-[85vh] flex flex-col bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl relative overflow-hidden"
      >
        {/* Header — fixed */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-ktsa-primary/20 flex items-center justify-center">
              <Trophy size={18} className="text-ktsa-accent" />
            </div>
            <h2 className="text-2xl font-bold text-ktsa-accent">My Matches</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Your tournament match history
          </p>

          {/* Tabs */}
          <div className="flex gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 mb-4">
            {(["upcoming", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${
                    tab === t
                      ? "bg-ktsa-primary/60 text-ktsa-text shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
              >
                {t === "upcoming" ? (
                  <Timer size={13} />
                ) : (
                  <CheckCircle2 size={13} />
                )}
                {t.charAt(0).toUpperCase() + t.slice(1)}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    tab === t
                      ? "bg-ktsa-accent/30 text-ktsa-accent"
                      : "bg-gray-700 text-gray-500"
                  }`}
                >
                  {t === "upcoming" ? upcomingCount : pastCount}
                </span>
              </button>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="space-y-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opponent or tournament…"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-700/60 bg-white/[0.03] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-ktsa-accent/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter row */}
            <div className="flex items-center gap-2 flex-wrap">
              <FilterDropdown
                value={categoryFilter}
                options={CATEGORY_OPTIONS}
                onChange={setCategoryFilter}
              />
              <FilterDropdown
                value={tournamentFilter}
                options={tournamentOptions}
                onChange={setTournamentFilter}
              />
              {tab === "past" && (
                <FilterDropdown
                  value={resultFilter}
                  options={RESULT_OPTIONS}
                  onChange={setResultFilter}
                />
              )}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                >
                  <X size={11} />
                  Clear
                </button>
              )}
              <span className="ml-auto text-xs text-gray-600">
                {filtered.length} match{filtered.length !== 1 ? "es" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-7 h-7 rounded-full border-2 border-ktsa-primary border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400">Loading matches…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-ktsa-primary/10 border border-ktsa-accent/20 flex items-center justify-center">
                {tab === "upcoming" ? (
                  <Timer size={24} className="text-ktsa-accent/50" />
                ) : (
                  <Trophy size={24} className="text-ktsa-accent/50" />
                )}
              </div>
              <p className="text-white font-semibold">
                {hasActiveFilters ? "No matches found" : `No ${tab} matches`}
              </p>
              <p className="text-gray-500 text-sm">
                {hasActiveFilters
                  ? "Try adjusting your filters."
                  : tab === "upcoming"
                  ? "Register for a tournament to see your upcoming matches here."
                  : "Your completed matches will appear here."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-ktsa-accent underline underline-offset-2 hover:text-white transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${tab}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {paginated.map((match, i) => (
                  <MatchCard key={match.id} match={match} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Pagination — fixed at bottom */}
        {!loading && totalPages > 1 && (
          <div className="flex-shrink-0 px-6 pb-5">
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
