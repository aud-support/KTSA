import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  ChevronRight,
  Swords,
  CheckCircle2,
  Timer,
} from "lucide-react";

interface Match {
  id: number;
  tournamentName: string;
  opponent: string;
  date: string;
  location: string;
  category: string;
  result?: "win" | "loss" | "draw"; // only for past
  score?: string; // e.g. "3-1"
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
      transition={{ delay: index * 0.06 }}
      className={`rounded-xl border p-4 transition-all duration-200 hover:border-ktsa-accent/50 group
        ${isPast ? "border-gray-700/50 bg-white/[0.02]" : "border-ktsa-accent/20 bg-ktsa-primary/10"}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-ktsa-accent font-bold truncate mb-0.5">
            {match.tournamentName}
          </p>
          <p className="text-xs text-gray-500">{match.category}</p>
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
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={11} className="text-ktsa-accent/60" />
          {formatDate(match.date)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} className="text-ktsa-accent/60" />
          {formatTime(match.date)}
        </span>
        <span className="flex items-center gap-1 truncate">
          <MapPin size={11} className="text-ktsa-accent/60" />
          {match.location}
        </span>
      </div>
    </motion.div>
  );
}

export default function MyMatchesModal({ isOpen, onClose, userId }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

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

  if (!isOpen) return null;

  const filtered = matches.filter((m) => m.status === tab);
  const upcomingCount = matches.filter((m) => m.status === "upcoming").length;
  const pastCount = matches.filter((m) => m.status === "past").length;

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
        <div className="flex-shrink-0 px-8 pt-8 pb-4">
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
          <p className="text-sm text-gray-400 mb-5">
            Your tournament match history
          </p>

          {/* Tabs */}
          <div className="flex gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/10">
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
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-7 h-7 rounded-full border-2 border-ktsa-primary border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400">Loading matches…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-ktsa-primary/10 border border-ktsa-accent/20 flex items-center justify-center">
                {tab === "upcoming" ? (
                  <Timer size={24} className="text-ktsa-accent/50" />
                ) : (
                  <Trophy size={24} className="text-ktsa-accent/50" />
                )}
              </div>
              <p className="text-white font-semibold">No {tab} matches</p>
              <p className="text-gray-500 text-sm">
                {tab === "upcoming"
                  ? "Register for a tournament to see your upcoming matches here."
                  : "Your completed matches will appear here."}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filtered.map((match, i) => (
                  <MatchCard key={match.id} match={match} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
