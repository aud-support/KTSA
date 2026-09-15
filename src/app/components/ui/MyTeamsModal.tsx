import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Users,
  Shield,
  Swords,
  Zap,
  Trophy,
  Calendar,
  ChevronRight,
  Star,
  Search,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

interface TeamMember {
  name: string;
  email: string;
  role?: string;
}

interface Team {
  id: number;
  teamName: string;
  category: string;
  role: "Defender" | "Attacker" | "All-rounder" | "Solo";
  partner?: TeamMember;
  tournaments: {
    id: number;
    name: string;
    date: string;
    status: "Upcoming" | "Completed" | "Live";
  }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

/** Shape returned by GET /api/team/user/{userId} */
interface UserTeamApiResponse {
  id: number;
  teamName: string;
  userRole: "playerOne" | "playerTwo";
  partner?: {
    id: number;
    name: string;
    email: string;
  } | null;
  tournaments: {
    tournamentId: number;
    tournamentName: string;
    category: string;
    status: string;
    startDate: string;
  }[];
}

const PAGE_SIZE = 10;

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "" },
  { label: "Men's Singles", value: "Men's Singles" },
  { label: "Women's Singles", value: "Women's Singles" },
  { label: "Open Doubles", value: "Open Doubles" },
  { label: "Mixed Doubles", value: "Mixed Doubles" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Live", value: "Live" },
  { label: "Completed", value: "Completed" },
];

function buildTournamentOptions(teams: Team[]) {
  const seen = new Set<string>();
  const opts: { label: string; value: string }[] = [{ label: "All Tournaments", value: "" }];
  for (const team of teams) {
    for (const t of team.tournaments) {
      if (t.name && !seen.has(t.name)) {
        seen.add(t.name);
        opts.push({ label: t.name, value: t.name });
      }
    }
  }
  return opts;
}

/** Maps backend tournament status to the UI status values */
function mapTournamentStatus(
  status: string,
): "Upcoming" | "Completed" | "Live" {
  const s = status?.toUpperCase();
  if (s === "COMPLETED" || s === "DONE") return "Completed";
  if (s === "ONGOING" || s === "LIVE" || s === "IN_PROGRESS") return "Live";
  return "Upcoming";
}

/** Formats backend category enum to display label */
function formatCategory(category: string): string {
  const map: Record<string, string> = {
    MENS_SINGLES: "Men's Singles",
    WOMENS_SINGLES: "Women's Singles",
    OPEN_DOUBLES: "Open Doubles",
    MIXED_DOUBLES: "Mixed Doubles",
  };
  return map[category?.toUpperCase()] ?? category ?? "Doubles";
}

const ROLE_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  Defender: {
    icon: Shield,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/25",
  },
  Attacker: {
    icon: Swords,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/25",
  },
  "All-rounder": {
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/25",
  },
  Solo: {
    icon: Star,
    color: "text-ktsa-accent",
    bg: "bg-ktsa-accent/10 border-ktsa-accent/25",
  },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG["Solo"];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}
    >
      <Icon size={11} />
      {role}
    </span>
  );
}

function StatusDot({ status }: { status: "Upcoming" | "Completed" | "Live" }) {
  const map = {
    Upcoming: "bg-ktsa-highlight text-ktsa-text",
    Completed: "bg-green-600 text-white",
    Live: "bg-red-500 text-white animate-pulse",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${map[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

function TeamCard({ team, index }: { team: Team; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-gray-700/50 bg-white/[0.02] overflow-hidden"
    >
      {/* Card header */}
      <div className="p-4">
        {/* Team name + category */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-white font-bold text-base">{team.teamName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{team.category}</p>
          </div>
          <RoleBadge role={team.role} />
        </div>

        {/* Partner or Solo */}
        {team.partner ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-gray-700/40">
            <div className="flex -space-x-2">
              {/* You */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ktsa-primary to-ktsa-accent border-2 border-black flex items-center justify-center text-[10px] font-bold text-ktsa-text z-10">
                YOU
              </div>
              {/* Partner */}
              <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-black flex items-center justify-center text-[10px] font-bold text-gray-300">
                {team.partner.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {team.partner.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {team.partner.email}
              </p>
            </div>
            {team.partner.role && <RoleBadge role={team.partner.role} />}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-gray-700/40">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ktsa-primary to-ktsa-accent flex items-center justify-center text-[10px] font-bold text-ktsa-text">
              YOU
            </div>
            <p className="text-sm text-gray-400">Solo registration</p>
          </div>
        )}
      </div>

      {/* Tournaments accordion */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 border-t border-gray-700/40 text-xs font-semibold text-gray-400 hover:text-ktsa-accent hover:bg-white/[0.02] transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Trophy size={12} className="text-ktsa-accent/60" />
          {team.tournaments.length} Tournament
          {team.tournaments.length !== 1 ? "s" : ""}
        </span>
        <ChevronRight
          size={13}
          className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {team.tournaments.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-2 py-2 border-b border-gray-800/60 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar size={10} />
                      {t.date
                        ? new Date(t.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "TBD"}
                    </p>
                  </div>
                  <StatusDot status={t.status} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
export default function MyTeamsModal({ isOpen, onClose, userId }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tournamentFilter, setTournamentFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch teams ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !userId) return;
    setLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/team/user/${userId}`)
      .then((r) => r.json())
      .then((json) => {
        const raw: UserTeamApiResponse[] = json.data ?? [];
        const mapped: Team[] = raw.map((t) => ({
          id: t.id,
          teamName: t.teamName,
          category:
            t.tournaments.length > 0
              ? formatCategory(t.tournaments[0].category)
              : "Doubles",
          role: t.partner ? "All-rounder" : "Solo",
          partner: t.partner
            ? { name: t.partner.name, email: t.partner.email }
            : undefined,
          tournaments: t.tournaments.map((tr) => ({
            id: tr.tournamentId,
            name: tr.tournamentName ?? "Unknown",
            date: tr.startDate ?? "",
            status: mapTournamentStatus(tr.status),
          })),
        }));
        setTeams(mapped);
      })
      .catch(() => setTeams([]))
      .finally(() => setLoading(false));
  }, [isOpen, userId]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, tournamentFilter]);

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
  const tournamentOptions = useMemo(() => buildTournamentOptions(teams), [teams]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return teams.filter((team) => {
      if (q && !team.teamName.toLowerCase().includes(q) &&
          !team.partner?.name.toLowerCase().includes(q)) return false;
      if (categoryFilter && team.category !== categoryFilter) return false;
      if (statusFilter) {
        const hasMatchingTournament = team.tournaments.some(
          (t) => t.status === statusFilter,
        );
        if (!hasMatchingTournament) return false;
      }
      if (tournamentFilter) {
        const hasMatchingTournament = team.tournaments.some(
          (t) => t.name === tournamentFilter,
        );
        if (!hasMatchingTournament) return false;
      }
      return true;
    });
  }, [teams, searchQuery, categoryFilter, statusFilter, tournamentFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const hasActiveFilters = !!(searchQuery || categoryFilter || statusFilter || tournamentFilter);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setStatusFilter("");
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
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-ktsa-primary/20 flex items-center justify-center">
              <Users size={18} className="text-ktsa-accent" />
            </div>
            <h2 className="text-2xl font-bold text-ktsa-accent">My Teams</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Teams and registrations you're part of
          </p>

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
                placeholder="Search team or partner name…"
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
              <FilterDropdown
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={setStatusFilter}
              />
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
                {filtered.length} team{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-7 h-7 rounded-full border-2 border-ktsa-primary border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400">Loading teams…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-ktsa-primary/10 border border-ktsa-accent/20 flex items-center justify-center">
                <Users size={24} className="text-ktsa-accent/50" />
              </div>
              <p className="text-white font-semibold">
                {hasActiveFilters ? "No teams found" : "No teams yet"}
              </p>
              <p className="text-gray-500 text-sm">
                {hasActiveFilters
                  ? "Try adjusting your filters."
                  : "Register for a tournament to see your teams here."}
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
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {paginated.map((team, i) => (
                <TeamCard key={team.id} team={team} index={i} />
              ))}
            </motion.div>
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
