import { motion } from "motion/react";
import {
  Calendar,
  MapPin,
  ArrowRight,
  ChevronRight,
  IndianRupee,
  Users,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import RegistrationModal from "../components/ui/RegistrationModal";
import TournamentDetailsModal from "../components/ui/TournamentDetailsModal";

// ─── API Types (matches your backend response exactly) ────────────────────────

export type ApiTournament = {
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
  openSingleEnabled: boolean;
  openSingleFee: number;
  openDoubleEnabled: boolean;
  openDoubleFee: number;
  mixedDoubleEnabled: boolean;
  mixedDoubleFee: number;
  womenSingleEnabled: boolean;
  womenSingleFee: number;
  registrationClosed: boolean;
};

// ─── Fetch Hook ───────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_BACKEND_BASE_URL ?? "";

const PAGE_SIZE = 9;

/** Shape of the paginated envelope returned by the backend */
type PagedApiResponse = {
  success: boolean;
  message: string;
  status: number;
  errors: null | string;
  data: {
    content: ApiTournament[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    last: boolean;
  };
};

/**
 * Derive an effective display status from the backend status + current date.
 * - If the backend says ACTIVE or the start date has passed and end hasn't → LIVE
 * - If end date has passed → COMPLETED
 * - Otherwise respect the backend status (UPCOMING)
 */
// function deriveStatus(t: ApiTournament): ApiTournament["status"] {
//   const now = Date.now();
//   const start = new Date(
//     t.startDate.includes("T") ? t.startDate : t.startDate + "T00:00:00",
//   ).getTime();
//   const end = new Date(
//     t.endDate.includes("T") ? t.endDate : t.endDate + "T23:59:59",
//   ).getTime();

//   if (t.status === "ACTIVE" || t.status === "LIVE") return "LIVE";
//   if (t.status === "COMPLETED") return "COMPLETED";
//   if (now >= start && now <= end) return "LIVE";
//   if (now > end) return "COMPLETED";
//   return "UPCOMING";
// }

/**
 * Infinite-scroll hook for tournaments.
 * - Fetches page 0 immediately; resets when month/year filters change.
 * - Call `loadMore()` to append the next page.
 * - `loadingMore` is true only during subsequent page fetches (not the first).
 */
export function useTournaments(month?: number, year?: number) {
  const [tournaments, setTournaments] = useState<ApiTournament[]>([]);
  const [loading, setLoading] = useState(true); // first-page loading
  const [loadingMore, setLoadingMore] = useState(false); // subsequent pages
  const [hasNext, setHasNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /** Fetch a specific page and either replace or append results */
  const fetchPage = (page: number, replace: boolean) => {
    const controller = new AbortController();

    if (page === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    const params = new URLSearchParams();
    if (month != null) params.set("month", String(month));
    if (year != null) params.set("year", String(year));
    params.set("page", String(page));
    params.set("size", String(PAGE_SIZE));

    const hasFilter = month != null || year != null;
    const base = hasFilter
      ? `${API_BASE}/api/tournament/filter`
      : `${API_BASE}/api/tournament`;
    const url = `${base}?${params.toString()}`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json() as Promise<PagedApiResponse>;
      })
      .then((body) => {
        if (body.success) {
          const enriched = body.data.content ?? [];
          setTournaments((prev) =>
            replace ? enriched : [...prev, ...enriched],
          );
          setHasNext(body.data.hasNext);
          setCurrentPage(body.data.page);
        } else {
          setError(body.message ?? "Failed to load tournaments.");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message ?? "Network error.");
        }
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });

    return controller;
  };

  // Reset to page 0 whenever filters change
  useEffect(() => {
    const controller = fetchPage(0, true);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchPage(0, true);
  //   }, 60000); // Refresh every 60 seconds

  //   return () => clearInterval(interval);
  // }, [month, year]);

  const loadMore = () => {
    if (!loadingMore && hasNext) {
      fetchPage(currentPage + 1, false);
    }
  };

  return { tournaments, loading, loadingMore, hasNext, error, loadMore };
}

/** Fetches the distinct years that have at least one tournament — used for dynamic year dropdown. */
export function useAvailableYears() {
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/tournament/available-years`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((body) => {
        console.log("[useAvailableYears] Response:", body);
        if (body.success && Array.isArray(body.data)) {
          console.log("[useAvailableYears] Years from DB:", body.data);
          if (body.data.length > 0) {
            setYears(body.data as number[]);
          } else {
            // Fallback: if DB is empty, show a reasonable range centered on current year
            const currentYear = new Date().getFullYear();
            const fallback = Array.from(
              { length: 6 },
              (_, i) => currentYear - 3 + i,
            );
            console.warn(
              "[useAvailableYears] No tournaments found, using fallback:",
              fallback,
            );
            setYears(fallback);
          }
        } else {
          console.warn(
            "[useAvailableYears] Unexpected response structure:",
            body,
          );
        }
      })
      .catch((err) => {
        console.error("[useAvailableYears] Failed to fetch years:", err);
        // Fallback on error
        const currentYear = new Date().getFullYear();
        setYears(Array.from({ length: 6 }, (_, i) => currentYear - 3 + i));
      });
  }, []);

  return years;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format "2026-06-09" → "9 June 2026" */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "2026-06-09" → "9–12 June 2026" style range */
function formatDateRange(start: string, end: string) {
  // If already has time component (contains "T"), use as-is; otherwise append midnight
  const s = new Date(start.includes("T") ? start : start + "T00:00:00");
  const e = new Date(end.includes("T") ? end : end + "T00:00:00");
  if (start === end) return formatDate(start);
  // const sDay = s.getDate();

  // formatTime.start;

  const sStr = s.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const eStr = e.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${sStr} ${formatTime(start)} To ${eStr} ${formatTime(end)}`;
}

/**
 * Extract a human-readable time from an ISO date string.
 * Returns e.g. "9:00 AM" if the string contains a time component, otherwise null.
 */
function formatTime(iso: string): string | null {
  if (!iso.includes("T")) return null;
  const d = new Date(iso);
  const h = d.getHours();
  const min = d.getMinutes();
  // Don't show 00:00 — that's just a midnight placeholder, not a real time
  if (h === 0 && min === 0) return null;
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Build category pills from enabled flags */
function getCategories(t: ApiTournament) {
  const cats: string[] = [];
  if (t.openSingleEnabled) cats.push("Open Singles");
  if (t.openDoubleEnabled) cats.push("Open Doubles");
  if (t.mixedDoubleEnabled) cats.push("Mixed Doubles");
  if (t.womenSingleEnabled) cats.push("Women's Singles");
  return cats;
}

/** Returns true if the tournament's start date is still in the future (or it's live/active) */
function isVisibleOnHome(t: ApiTournament): boolean {
  // Always show LIVE / ACTIVE regardless of date
  if (t.status === "LIVE" || t.status === "ACTIVE") return true;
  // Never show COMPLETED
  if (t.status === "COMPLETED") return false;
  // For UPCOMING: only show if start date hasn't passed yet
  const start = new Date(
    t.startDate.includes("T") ? t.startDate : t.startDate + "T00:00:00",
  );
  return start.getTime() > Date.now();
}
function statusMeta(status: ApiTournament["status"]) {
  switch (status) {
    case "LIVE":
    case "ACTIVE":
      return { label: "LIVE", cls: "bg-red-500 text-white animate-pulse" };
    case "COMPLETED":
      return { label: "COMPLETED", cls: "bg-green-600 text-white" };
    default:
      return { label: "UPCOMING", cls: "bg-ktsa-highlight text-ktsa-text" };
  }
}

// ─── Countdown Hook ───────────────────────────────────────────────────────────

function useCountdown(isoDate?: string) {
  const calc = () => {
    if (!isoDate) return { d: 0, h: 0, m: 0, s: 0, expired: false };
    const diff = Math.max(
      0,
      new Date(
        isoDate.includes("T") ? isoDate : isoDate + "T00:00:00",
      ).getTime() - Date.now(),
    );
    return {
      d: Math.floor(diff / 86_400_000),
      h: Math.floor((diff % 86_400_000) / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
      expired: diff === 0,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    if (!isoDate) return;
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [isoDate]);
  return time;
}

// ─── Animated Countdown Digit ────────────────────────────────────────────────

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const [prevValue, setPrevValue] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setFlip(true);
      const t = setTimeout(() => {
        setPrevValue(value);
        setFlip(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [value, prevValue]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-ktsa-accent/40 bg-ktsa-accent/10 px-2.5 py-1.5 min-w-[46px] relative overflow-hidden"
      style={{ boxShadow: "0 0 12px rgba(0,229,255,0.08)" }}
    >
      {/* Shine sweep on change */}
      {flip && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-ktsa-accent/25 to-transparent pointer-events-none"
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeIn" }}
        />
      )}
      <motion.span
        key={value}
        initial={{ y: -12, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-base font-black text-ktsa-text leading-none tabular-nums"
      >
        {label === "Days" ? value : pad(value)}
      </motion.span>
      <span className="text-[9px] font-bold text-ktsa-text/70 uppercase tracking-wider mt-0.5">
        {label}
      </span>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-ktsa-primary/30 rounded-xl animate-pulse ${className ?? ""}`}
    />
  );
}

function FeaturedSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-ktsa-accent/20 bg-gradient-to-br from-ktsa-primary/30 to-ktsa-secondary/20 grid grid-cols-1 lg:grid-cols-2 min-h-[240px]">
      <Skeleton className="min-h-[160px] lg:min-h-[240px] rounded-none" />
      <div className="p-6 flex flex-col gap-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="flex gap-3 mt-auto">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Stay Tuned Empty State ───────────────────────────────────────────────────

function StayTuned() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden border border-ktsa-accent/30 bg-gradient-to-br from-ktsa-primary/30 to-ktsa-secondary/20 backdrop-blur-sm relative"
      style={{ boxShadow: "0 16px 48px rgba(0,229,255,0.10)" }}
    >
      {/* Animated background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-ktsa-accent/10"
            initial={{ width: 80, height: 80, opacity: 0.6 }}
            animate={{ width: 80 + i * 120, height: 80 + i * 120, opacity: 0 }}
            transition={{
              duration: 3,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center py-14 px-6 gap-4">
        {/* Trophy icon with pulse */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full bg-ktsa-accent/10 border border-ktsa-accent/20 flex items-center justify-center text-3xl"
        >
          🏆
        </motion.div>

        <div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-black text-ktsa-text mb-2"
          >
            Something exciting is coming
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-ktsa-text/60 text-sm max-w-sm mx-auto leading-relaxed"
          >
            Tournaments are being lined up. Stay tuned — Karnataka's next
            foosball showdown is just around the corner.
          </motion.p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-ktsa-accent"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-ktsa-accent/20 bg-gradient-to-br from-ktsa-primary/30 to-ktsa-secondary/20 flex flex-col">
      <Skeleton className="h-32 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <div className="mt-auto pt-3 border-t border-ktsa-accent/10 flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-ktsa-text/60">
      <AlertCircle size={32} className="text-ktsa-highlight" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── Featured Tournament ──────────────────────────────────────────────────────

function FeaturedTournament({ tournament }: { tournament: ApiTournament }) {
  const { d, h, m, s, expired } = useCountdown(
    tournament.status === "UPCOMING" ? tournament.startDate : undefined,
  );
  const [modalType, setModalType] = useState<"register" | "details" | null>(
    null,
  );
  const { label, cls } = statusMeta(tournament.status);
  const categories = getCategories(tournament);
  const registrationOpen = tournament.status === "UPCOMING" && !expired;

  const modalShape = {
    id: tournament.id,
    title: tournament.tournamentName,
    date: formatDateRange(tournament.startDate, tournament.endDate),
    location: tournament.venue,
    status: (tournament.status === "UPCOMING"
      ? "Upcoming"
      : tournament.status === "LIVE" || tournament.status === "ACTIVE"
        ? "Live"
        : "Completed") as "Upcoming" | "Live" | "Completed",
    image: tournament.bannerUrl,
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="rounded-2xl overflow-hidden border border-ktsa-accent/25 group"
        style={{ boxShadow: "0 16px 48px rgba(0,229,255,0.13)" }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* ── Left: Image panel ── */}
          <div className="relative lg:w-[38%] h-56 lg:h-auto lg:min-h-[280px] overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={tournament.bannerUrl}
              alt={tournament.tournamentName}
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1400ms] ease-out"
            />
            {/* Gradient fade into right panel on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ktsa-bg/90" />
            {/* Mobile bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg/60 to-transparent lg:hidden" />

            {/* Status + format badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${cls}`}
              >
                {label}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/40 backdrop-blur-sm text-white/80 border border-white/10">
                {tournament.format.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          {/* ── Right: Info panel ── */}
          <div className="flex-1 min-w-0 bg-gradient-to-br from-ktsa-primary/35 to-ktsa-secondary/25 backdrop-blur-md p-5 flex flex-col justify-between gap-3">
            {/* Top section */}
            <div>
              {/* Featured label */}
              <motion.p
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[10px] font-bold tracking-[0.2em] text-ktsa-accent/60 uppercase mb-2"
              >
                ✦ Featured Tournament
              </motion.p>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.18 }}
                className="text-xl md:text-2xl font-black text-white leading-tight mb-2"
              >
                {tournament.tournamentName}
              </motion.h3>

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.26 }}
                className="flex flex-col gap-1 mb-2"
              >
                <span className="flex items-center gap-1.5 text-xs text-ktsa-text">
                  <Calendar
                    size={12}
                    className="text-ktsa-accent flex-shrink-0"
                  />
                  {formatDateRange(tournament.startDate, tournament.endDate)}
                  {/* {formatTime(tournament.startDate) && (
                    <span className="text-ktsa-text">
                      {formatTime(tournament.startDate)}
                      {" to "}
                      {formatTime(tournament.endDate)}
                    </span>
                  )} */}
                </span>
                <span className="flex items-center gap-2 text-xs text-ktsa-text">
                  <MapPin
                    size={12}
                    className="text-ktsa-accent flex-shrink-0"
                  />
                  {tournament.venue}
                </span>
                <span className="flex items-center gap-2 text-xs text-ktsa-text">
                  <Users size={12} className="text-ktsa-accent flex-shrink-0" />
                  {tournament.maxParticipants} participants max
                </span>
                {tournament.pricePool > 0 && (
                  <span className="flex items-center gap-2 text-xs text-ktsa-text">
                    <Trophy
                      size={12}
                      className="text-ktsa-accent flex-shrink-0"
                    />
                    Prize pool: ₹{tournament.pricePool.toLocaleString("en-IN")}
                  </span>
                )}
              </motion.div>

              {/* Category pills */}
              {categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.32 }}
                  className="flex flex-wrap gap-1.5"
                >
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-ktsa-accent/10 border border-ktsa-accent/20 text-ktsa-accent/80"
                    >
                      {cat}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Bottom section — countdown + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.38 }}
              className="flex flex-col gap-2"
            >
              {/* Divider */}
              <div className="h-px bg-ktsa-accent/10" />

              {/* Countdown + CTAs row */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                {/* CTAs — left */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setModalType("details")}
                    className="px-5 py-2 rounded-full font-bold text-xs border border-white/20 text-white/70 hover:border-ktsa-accent hover:text-ktsa-accent bg-white/5 transition-all duration-300"
                  >
                    View Details
                  </button>
                  {registrationOpen && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setModalType("register")}
                      className="px-5 py-2 rounded-full font-bold text-xs bg-ktsa-highlight text-white border border-ktsa-highlight hover:bg-transparent hover:text-ktsa-highlight transition-all duration-300 flex items-center gap-1.5"
                    >
                      Register Now <ArrowRight size={13} />
                    </motion.button>
                  )}
                  {tournament.status === "UPCOMING" && expired && (
                    <span className="px-4 py-2 rounded-full text-xs font-bold border border-red-500/40 text-red-400 bg-red-500/10">
                      Registrations Closed
                    </span>
                  )}
                  {(tournament.status === "LIVE" ||
                    tournament.status === "ACTIVE") && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      onClick={() => setModalType("details")}
                      className="px-5 py-2 rounded-full font-bold text-xs bg-red-500 text-white animate-pulse flex items-center gap-1.5"
                    >
                      Live Now <ArrowRight size={13} />
                    </motion.button>
                  )}
                </div>

                {/* Countdown — right */}
                {tournament.status === "UPCOMING" && !expired && (
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[10px] font-bold tracking-widest text-ktsa-accent/70 uppercase">
                      Starts in
                    </p>
                    <div className="flex gap-1.5">
                      <CountdownDigit value={d} label="Days" />
                      <CountdownDigit value={h} label="Hrs" />
                      <CountdownDigit value={m} label="Min" />
                      <CountdownDigit value={s} label="Sec" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Glowing bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="h-px bg-gradient-to-r from-transparent via-ktsa-accent/60 to-transparent origin-center"
        />
      </motion.div>

      {modalType === "register" && (
        <RegistrationModal
          tournament={modalShape}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === "details" && (
        <TournamentDetailsModal
          tournament={modalShape}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}

// ─── Upcoming Event Card ──────────────────────────────────────────────────────

function EventCard({
  tournament,
  index,
}: {
  tournament: ApiTournament;
  index: number;
}) {
  const [modalType, setModalType] = useState<"register" | "details" | null>(
    null,
  );
  const categories = getCategories(tournament);
  // Hide register button if countdown has expired for an upcoming tournament
  const { expired } = useCountdown(
    tournament.status === "UPCOMING" ? tournament.startDate : undefined,
  );
  const canRegister = tournament.status === "UPCOMING" && !expired;

  const modalShape = {
    id: tournament.id,
    title: tournament.tournamentName,
    date: formatDateRange(tournament.startDate, tournament.endDate),
    location: tournament.venue,
    status: (tournament.status === "UPCOMING"
      ? "Upcoming"
      : tournament.status === "LIVE"
        ? "Live"
        : "Completed") as "Upcoming" | "Live" | "Completed",
    image: tournament.bannerUrl,
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.45, ease: "easeOut" }}
        whileHover={{ y: -6, scale: 1.01 }}
        className="group bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 rounded-2xl overflow-hidden border border-ktsa-accent/30 hover:border-ktsa-accent backdrop-blur-sm transition-all duration-300 flex flex-col"
        style={{ boxShadow: "0 8px 30px rgba(0,229,255,0.10)" }}
      >
        {/* Image */}
        <div className="relative h-32 overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={tournament.bannerUrl}
            alt={tournament.tournamentName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg/70 to-transparent" />
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusMeta(tournament.status).cls}`}
            >
              {statusMeta(tournament.status).label}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-base font-black text-ktsa-accent group-hover:text-ktsa-text transition-colors leading-snug">
            {tournament.tournamentName}
          </h3>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-ktsa-accent flex-shrink-0" />
              <span className="text-xs font-semibold text-ktsa-text">
                {formatDateRange(tournament.startDate, tournament.endDate)}
                {/* {formatTime(tournament.startDate) && (
                  <span className="ml-1.5 text-ktsa-text font-medium">
                    {" "}
                    {formatTime(tournament.startDate)}
                  </span>
                )} */}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-ktsa-accent flex-shrink-0" />
              <span className="text-xs font-semibold text-ktsa-text">
                {tournament.venue}
              </span>
            </div>
            {tournament.pricePool > 0 && (
              <div className="flex items-center gap-2">
                <IndianRupee
                  size={13}
                  className="text-ktsa-accent flex-shrink-0"
                />
                <span className="text-xs font-semibold text-ktsa-text">
                  Prize pool: ₹{tournament.pricePool.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* Category mini-pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {categories.slice(0, 2).map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-ktsa-accent/10 border border-ktsa-accent/15 text-ktsa-accent/70"
                >
                  {c}
                </span>
              ))}
              {categories.length > 2 && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-ktsa-accent/10 border border-ktsa-accent/15 text-ktsa-accent/70">
                  +{categories.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-ktsa-accent/10 flex items-center justify-between">
            {tournament.status === "LIVE" || tournament.status === "ACTIVE" ? (
              <button
                onClick={() => setModalType("details")}
                className="text-[12px] font-bold text-red-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                View Live <ChevronRight size={13} />
              </button>
            ) : canRegister ? (
              <button
                onClick={() => setModalType("register")}
                className="text-[12px] font-bold text-ktsa-highlight hover:text-white flex items-center gap-1 transition-colors"
              >
                Register <ChevronRight size={13} />
              </button>
            ) : (
              <span className="text-[11px] font-bold text-red-400/70">
                Registrations Closed
              </span>
            )}
            <button
              onClick={() => setModalType("details")}
              className="text-[11px] text-ktsa-text/40 hover:text-ktsa-text/70 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </motion.div>

      {modalType === "register" && (
        <RegistrationModal
          tournament={modalShape}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === "details" && (
        <TournamentDetailsModal
          tournament={modalShape}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}

// ─── Main Section (drop into Home.tsx) ───────────────────────────────────────
//
//  Usage in Home.tsx — replace the old tournaments section with:
//
//    <TournamentSection />
//
//  No props needed — it fetches data itself.
//  To pin a specific tournament as "featured", pass featuredId:
//
//    <TournamentSection featuredId={3} />
//
//  If featuredId is omitted, the first LIVE or UPCOMING tournament is used.

interface TournamentSectionProps {
  /** Pin a specific tournament id as featured. Defaults to first LIVE → first UPCOMING. */
  featuredId?: number;
}

export function TournamentSection({ featuredId }: TournamentSectionProps) {
  const { tournaments, loading, error } = useTournaments();

  // Re-evaluate visibility every 30 seconds so expired tournaments disappear
  // without needing a page reload
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Only tournaments whose start date is still in the future (or currently live)
  // COMPLETED and date-expired UPCOMING are excluded from the home page entirely
  const visibleOnHome = tournaments.filter(isVisibleOnHome);

  // Ordered queue of purely future UPCOMING tournaments (used for rotation)
  const upcomingQueue = visibleOnHome.filter((t) => t.status === "UPCOMING");

  // Track which tournament is currently pinned as featured (by id)
  const [pinnedId, setPinnedId] = useState<number | undefined>(featuredId);

  // Featured: pinned (if still visible) → first LIVE/ACTIVE → first UPCOMING
  // If nothing qualifies → undefined → renders StayTuned
  const featured =
    (pinnedId != null
      ? visibleOnHome.find((t) => t.id === pinnedId)
      : undefined) ??
    visibleOnHome.find((t) => t.status === "LIVE" || t.status === "ACTIVE") ??
    visibleOnHome.find((t) => t.status === "UPCOMING");

  // Countdown for the featured tournament
  const featuredStartDate =
    featured?.status === "UPCOMING" ? featured.startDate : undefined;
  const { expired } = useCountdown(featuredStartDate);

  // When countdown hits zero, promote the next upcoming tournament as featured
  useEffect(() => {
    if (!expired || !featured) return;
    const currentIdx = upcomingQueue.findIndex((t) => t.id === featured.id);
    const next = upcomingQueue[currentIdx + 1];
    if (next) setPinnedId(next.id);
    // No next → featured becomes undefined on next tick → StayTuned shows
  }, [expired]);

  // Grid: remaining visible tournaments except the featured one, capped at 3
  const upcomingGrid = visibleOnHome
    .filter((t) => t.id !== featured?.id)
    .slice(0, 3);

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img
          src="https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/11/foosball-table-techniques-jpg.webp"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-3">
              <span className="text-ktsa-accent">Tournaments</span> & Events
            </h2>
            <p className="text-ktsa-text/70 text-sm">
              Stay connected to KTSA tournaments and upcoming competitive
              opportunities across Karnataka.
            </p>
          </motion.div>
        </div>

        {error && <ErrorState message={error} />}

        {!error && (
          <>
            {/* ── Featured ── */}
            <div className="mb-8">
              <p className="text-[11px] font-bold tracking-widest text-ktsa-accent/60 uppercase mb-4">
                Featured Event
              </p>
              {loading ? (
                <FeaturedSkeleton />
              ) : !featured ? (
                <StayTuned />
              ) : (
                <FeaturedTournament tournament={featured} />
              )}
            </div>

            {/* ── Other tournaments grid ── */}
            {(loading || upcomingGrid.length > 0) && (
              <div className="mb-8">
                <p className="text-[11px] font-bold tracking-widest text-ktsa-accent/60 uppercase mb-5">
                  More Tournaments
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <CardSkeleton key={i} />
                      ))
                    : upcomingGrid.map((t, i) => (
                        <EventCard key={t.id} tournament={t} index={i} />
                      ))}
                </div>
              </div>
            )}

            {/* ── View all CTA ── */}
            <div className="text-center">
              <Link to="/tournaments">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-transparent border-2 border-white text-white rounded-full font-bold text-sm hover:border-ktsa-highlight hover:bg-ktsa-highlight hover:text-white transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                >
                  View all tournaments — past & upcoming
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
