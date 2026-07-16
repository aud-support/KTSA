import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  MapPin,
  IndianRupee,
  Users,
  AlertCircle,
  ChevronDown,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import RegistrationModal from "../components/ui/RegistrationModal";
import TournamentDetailsModal from "../components/ui/TournamentDetailsModal";
import {
  useTournaments,
  useAvailableYears,
  type ApiTournament,
} from "../components/Tournamentsections";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00");
  const date = d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const h = d.getHours();
  const min = d.getMinutes();
  // Only append time when it's not midnight (i.e. a real time was set)
  if (h === 0 && min === 0) return date;
  const time = d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} ${time}`;
}

function formatDateRange(start: string, end: string) {
  const s = formatDateTime(start);
  const e = formatDateTime(end);
  if (start === end) return s;
  return `${s} To ${e}`;
}

/** Compact version for card display — includes time if it was set.
 *  Single day:  "10 Jan '27, 11:35 am"
 *  Range:       "10–20 Jan '27"  /  "10 Jan – 2 Feb '27"
 */
function formatDateRangeShort(start: string, end: string): string {
  const s = new Date(start.includes("T") ? start : start + "T00:00:00");
  const e = new Date(end.includes("T") ? end : end + "T00:00:00");

  const hasTime = (d: Date) => !(d.getHours() === 0 && d.getMinutes() === 0);

  const fmtDay = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

  const year = `'${String(e.getFullYear()).slice(2)}`;
  const sameDay = s.toDateString() === e.toDateString();

  if (start === end || sameDay) {
    const base = `${fmtDay(s)} ${year}`;
    return hasTime(s) ? `${base}, ${fmtTime(s)}` : base;
  }

  // Multi-day range — show start date + time (if set), dash, end date
  const startPart = hasTime(s) ? `${fmtDay(s)}, ${fmtTime(s)}` : fmtDay(s);

  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${startPart} – ${e.getDate()} ${year}`;
  }
  return `${startPart} – ${fmtDay(e)} ${year}`;
}

function getCategories(t: ApiTournament) {
  const cats: string[] = [];
  if (t.openSingleEnabled) cats.push("Open Singles");
  if (t.openDoubleEnabled) cats.push("Open Doubles");
  if (t.mixedDoubleEnabled) cats.push("Mixed Doubles");
  if (t.womenSingleEnabled) cats.push("Women's Singles");
  return cats;
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

function isRegistrationOpen(t: ApiTournament): boolean {
  if (t.status !== "UPCOMING") return false;
  if (t.registrationClosed) return false;
  const start = new Date(
    t.startDate.includes("T") ? t.startDate : t.startDate + "T00:00:00",
  );
  return start.getTime() > Date.now();
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-ktsa-accent/20 bg-gradient-to-br from-ktsa-primary/30 to-ktsa-secondary/20 animate-pulse">
      <div className="h-24 sm:h-32 bg-ktsa-primary/30" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-ktsa-primary/40 rounded w-4/5" />
        <div className="h-2.5 bg-ktsa-primary/30 rounded w-3/5" />
        <div className="h-2.5 bg-ktsa-primary/30 rounded w-2/3" />
        <div className="h-2.5 bg-ktsa-primary/30 rounded w-1/2" />
        <div className="flex gap-1 mt-1">
          <div className="h-4 w-6 bg-ktsa-primary/30 rounded-full" />
          <div className="h-4 w-6 bg-ktsa-primary/30 rounded-full" />
          <div className="h-4 w-6 bg-ktsa-primary/30 rounded-full" />
        </div>
        <div className="h-7 bg-ktsa-primary/30 rounded-full mt-1" />
      </div>
    </div>
  );
}

// ─── Tournament Card ──────────────────────────────────────────────────────────

function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close image"
      >
        <X size={20} />
      </button>

      {/* Image — stop propagation so clicking the image itself doesn't close */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl border border-white/10"
      />
    </div>
  );
}

// ─── Detail Drawer (bottom-sheet on mobile, centered modal on desktop) ────────

function TournamentDrawer({
  tournament,
  onClose,
  onRegister,
  onDetails,
  onImageClick,
  lightboxOpen,
}: {
  tournament: ApiTournament;
  onClose: () => void;
  onRegister: () => void;
  onDetails: () => void;
  onImageClick: () => void;
  lightboxOpen: boolean;
}) {
  const { label, cls } = statusMeta(tournament.status);
  const categories = getCategories(tournament);
  const canRegister = isRegistrationOpen(tournament);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't close drawer when lightbox is handling Escape
      if (e.key === "Escape" && !lightboxOpen) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, lightboxOpen]);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => { if (!lightboxOpen) onClose(); }}
        className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm"
      />

      {/* Sheet — slides up from bottom on mobile, centered on md+ */}
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-[1000] md:inset-0 md:flex md:items-center md:justify-center md:pointer-events-none"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            w-full bg-[#0a1a19] border-t border-ktsa-accent/20 rounded-t-2xl
            max-h-[85vh] overflow-y-auto thin-scrollbar
            md:pointer-events-auto md:rounded-2xl md:border md:max-w-md md:max-h-[80vh] md:mx-4
          "
        >
          {/* Drag handle (mobile) */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

        {/* Banner */}
        <div
          className={`relative h-40 overflow-hidden flex-shrink-0 ${tournament.bannerUrl ? "cursor-zoom-in" : "cursor-default"}`}
          onClick={() => tournament.bannerUrl && onImageClick()}
        >
          {tournament.bannerUrl ? (
            <ImageWithFallback
              src={tournament.bannerUrl}
              alt={tournament.tournamentName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-ktsa-primary/30 border-b border-ktsa-accent/10 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ktsa-accent/30">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 16 5-5 4 4 3-3 4 4"/><circle cx="8.5" cy="8.5" r="1.5"/>
              </svg>
              <span className="text-xs text-ktsa-text/30 font-medium">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a19] via-[#0a1a19]/30 to-transparent pointer-events-none" />
            <div className="absolute top-3 left-3">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${cls}`}>{label}</span>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X size={16} />
            </button>
            {/* Title over banner bottom */}
            <div className="absolute bottom-3 left-4 right-12">
              <h2 className="text-base font-black text-white leading-tight line-clamp-2">
                {tournament.tournamentName}
              </h2>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 flex flex-col gap-3">

            {/* Format badge */}
            <span className="self-start px-2.5 py-1 rounded text-[10px] font-semibold bg-ktsa-accent/10 border border-ktsa-accent/20 text-ktsa-accent/80">
              {tournament.format.replace(/_/g, " ")}
            </span>

            {/* Info grid */}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-ktsa-primary/20 border border-ktsa-accent/10">
                <Calendar size={14} className="text-ktsa-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] text-ktsa-text/40 uppercase tracking-wider font-semibold mb-0.5">Date & Time</p>
                  <p className="text-xs font-semibold text-ktsa-text leading-snug">
                    {formatDateRange(tournament.startDate, tournament.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-ktsa-primary/20 border border-ktsa-accent/10">
                <MapPin size={14} className="text-ktsa-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] text-ktsa-text/40 uppercase tracking-wider font-semibold mb-0.5">Venue</p>
                  <p className="text-xs font-semibold text-ktsa-text">{tournament.venue}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 flex items-start gap-2 p-3 rounded-xl bg-ktsa-primary/20 border border-ktsa-accent/10">
                  <Users size={13} className="text-ktsa-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] text-ktsa-text/40 uppercase tracking-wider font-semibold mb-0.5">Max</p>
                    <p className="text-xs font-semibold text-ktsa-text">{tournament.maxParticipants}</p>
                  </div>
                </div>
                {tournament.pricePool > 0 && (
                  <div className="flex-1 flex items-start gap-2 p-3 rounded-xl bg-ktsa-primary/20 border border-ktsa-accent/10">
                    <IndianRupee size={13} className="text-ktsa-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-ktsa-text/40 uppercase tracking-wider font-semibold mb-0.5">Prize</p>
                      <p className="text-xs font-semibold text-ktsa-text">₹{tournament.pricePool.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <p className="text-[9px] text-ktsa-text/40 uppercase tracking-wider font-semibold mb-1.5">Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <span key={c} className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-ktsa-accent/10 border border-ktsa-accent/20 text-ktsa-accent/80">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Registration closed notice */}
            {tournament.status === "UPCOMING" && tournament.registrationClosed && (
              <p className="text-center text-xs text-amber-400/80 font-semibold py-1">
                Registration closed · contact admin
              </p>
            )}

            {/* CTA */}
            <div className="pt-1">
              {canRegister && (
                <button
                  onClick={onRegister}
                  className="w-full py-3 rounded-full font-bold text-sm border-2 border-white text-white hover:border-ktsa-highlight hover:bg-ktsa-highlight transition-all duration-300"
                >
                  Register Now
                </button>
              )}
              {tournament.status === "UPCOMING" && !canRegister && (
                <button
                  onClick={onDetails}
                  className="w-full py-3 rounded-full font-bold text-sm border border-white/40 text-white/70 hover:border-white hover:text-white transition-all duration-300"
                >
                  View Details
                </button>
              )}
              {(tournament.status === "LIVE" || tournament.status === "ACTIVE") && (
                <button
                  onClick={onDetails}
                  className="w-full py-3 rounded-full font-bold text-sm bg-red-500 text-white animate-pulse"
                >
                  View Live
                </button>
              )}
              {tournament.status === "COMPLETED" && (
                <button
                  onClick={onDetails}
                  className="w-full py-3 rounded-full font-bold text-sm border border-white/40 text-white/70 hover:border-white hover:text-white transition-all duration-300"
                >
                  View Results
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Tournament Card — minimal, tap to open drawer ────────────────────────────

function TournamentCard({
  tournament,
  index,
}: {
  tournament: ApiTournament;
  index: number;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalType, setModalType] = useState<"register" | "details" | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { label, cls } = statusMeta(tournament.status);
  const canRegister = isRegistrationOpen(tournament);

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
      {/* ── Minimal card — tap anywhere to open drawer ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 4) * 0.05 }}
        whileHover={{ y: -2 }}
        onClick={() => setDrawerOpen(true)}
        className="group cursor-pointer bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 rounded-xl overflow-hidden border border-ktsa-accent/30 hover:border-ktsa-accent transition-all duration-300"
        style={{ boxShadow: "0 4px 16px rgba(0,229,255,0.07)" }}
      >
        {/* Banner */}
        <div className="relative h-24 sm:h-28 overflow-hidden">
          {tournament.bannerUrl ? (
            <ImageWithFallback
              src={tournament.bannerUrl}
              alt={tournament.tournamentName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-ktsa-primary/30 gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ktsa-accent/30">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 16 5-5 4 4 3-3 4 4"/><circle cx="8.5" cy="8.5" r="1.5"/>
              </svg>
              <span className="text-[10px] text-ktsa-text/30 font-medium">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${cls}`}>
              {label}
            </span>
          </div>
        </div>

        {/* Compact info */}
        <div className="p-3 flex flex-col">
          <p className="text-sm font-black text-ktsa-accent leading-tight line-clamp-2 mb-2">
            {tournament.tournamentName}
          </p>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Calendar size={11} className="text-ktsa-accent/70 flex-shrink-0" />
            <span className="text-xs text-ktsa-text/70 leading-tight truncate">
              {formatDateRangeShort(tournament.startDate, tournament.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={11} className="text-ktsa-accent/70 flex-shrink-0" />
            <span className="text-xs text-ktsa-text/70 leading-tight truncate">
              {tournament.venue}
            </span>
          </div>

          {/* Register button / tap hint */}
          <div className="mt-3">
            {canRegister ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalType("register");
                }}
                className="w-full py-2 rounded-full text-[11px] font-bold border border-white/70 text-white hover:border-ktsa-highlight hover:bg-ktsa-highlight transition-all duration-300"
              >
                Register Now
              </button>
            ) : (
              <div className="flex items-center justify-end">
                <span className="text-[10px] text-ktsa-accent/50 font-medium tracking-wide">tap for details</span>
                <ChevronRight size={11} className="text-ktsa-accent/50 ml-0.5" />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Drawer */}
      {drawerOpen && (
        <TournamentDrawer
          tournament={tournament}
          onClose={() => setDrawerOpen(false)}
          onRegister={() => { setDrawerOpen(false); setModalType("register"); }}
          onDetails={() => { setDrawerOpen(false); setModalType("details"); }}
          onImageClick={() => { if (tournament.bannerUrl) { setLightboxOpen(true); } }}
          lightboxOpen={lightboxOpen}
        />
      )}

      {/* Lightbox */}
      {lightboxOpen && tournament.bannerUrl && (
        <ImageLightbox
          src={tournament.bannerUrl}
          alt={tournament.tournamentName}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {modalType === "register" && (
        <RegistrationModal tournament={modalShape} onClose={() => setModalType(null)} />
      )}
      {modalType === "details" && (
        <TournamentDetailsModal tournament={modalShape} onClose={() => setModalType(null)} />
      )}
    </>
  );
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

type StatusFilter = "ALL" | "UPCOMING" | "LIVE" | "COMPLETED";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Live", value: "LIVE" },
  { label: "Completed", value: "COMPLETED" },
];

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

// Dynamic years come from the backend — no hardcoded list needed.

export function Tournaments() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined,
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );

  const [statusOpen, setStatusOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // Sentinel ref at the bottom of the grid — triggers loadMore when visible
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch available years dynamically from the DB
  const availableYears = useAvailableYears();

  // useTournaments now supports infinite scroll
  const { tournaments, loading, loadingMore, hasNext, error, loadMore } =
    useTournaments(selectedMonth, selectedYear);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      )
        setStatusOpen(false);
      if (monthRef.current && !monthRef.current.contains(event.target as Node))
        setMonthOpen(false);
      if (yearRef.current && !yearRef.current.contains(event.target as Node))
        setYearOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // IntersectionObserver: when the sentinel enters the viewport, load the next page
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNext && !loadingMore) {
        loadMore();
      }
    },
    [hasNext, loadingMore, loadMore],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px", // start loading 200 px before hitting the bottom
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Status filter is applied client-side on top of the paginated results
  const filtered =
    statusFilter === "ALL"
      ? tournaments
      : statusFilter === "LIVE"
        ? tournaments.filter(
            (t) => t.status === "LIVE" || t.status === "ACTIVE",
          )
        : tournaments.filter((t) => t.status === statusFilter);

  const counts = {
    ALL: tournaments.length,
    UPCOMING: tournaments.filter((t) => t.status === "UPCOMING").length,
    LIVE: tournaments.filter(
      (t) => t.status === "LIVE" || t.status === "ACTIVE",
    ).length,
    COMPLETED: tournaments.filter((t) => t.status === "COMPLETED").length,
  };

  const hasDateFilter = selectedMonth != null || selectedYear != null;

  function clearDateFilter() {
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl md:text-5xl font-black text-ktsa-text mb-3">
            <span className="text-ktsa-accent">All</span> Tournaments
          </h1>
          <p className="text-ktsa-text/60 text-sm max-w-xl mx-auto">
            Every KTSA tournament — past results, live events, and upcoming
            competitions across Karnataka.
          </p>
        </motion.div>

        {/* ── Filters Row ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {/* ── Status dropdown ── */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => {
                setStatusOpen(!statusOpen);
                setMonthOpen(false);
                setYearOpen(false);
              }}
              className={`flex items-center gap-2 text-sm px-4 py-1.5 rounded-lg font-bold border transition-colors min-w-[130px] justify-between ${
                statusFilter !== "ALL"
                  ? "bg-ktsa-accent/15 border-ktsa-accent text-ktsa-accent"
                  : "bg-ktsa-primary/75 border-ktsa-accent/30 text-ktsa-text hover:border-ktsa-accent"
              }`}
            >
              <span>
                {STATUS_FILTERS.find((s) => s.value === statusFilter)?.label ??
                  "All"}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`}
              />
            </button>
            {statusOpen && (
              <div
                className="absolute top-full mt-1 left-0 z-50 bg-[#0d1f1e] border border-ktsa-accent/20 rounded-lg overflow-hidden min-w-[130px]"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}
              >
                {STATUS_FILTERS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setStatusFilter(value);
                      setStatusOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors flex items-center justify-between ${
                      statusFilter === value
                        ? "bg-ktsa-accent/20 text-ktsa-accent"
                        : "text-ktsa-text hover:bg-ktsa-primary/40"
                    }`}
                  >
                    {label}
                    {counts[value] > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                        {counts[value]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Month dropdown ── */}
          <div className="relative" ref={monthRef}>
            <button
              onClick={() => {
                setMonthOpen(!monthOpen);
                setStatusOpen(false);
                setYearOpen(false);
              }}
              className={`flex items-center gap-2 text-sm px-4 py-1.5 rounded-lg font-bold border transition-colors min-w-[150px] justify-between ${
                selectedMonth
                  ? "bg-ktsa-accent/15 border-ktsa-accent text-ktsa-accent"
                  : "bg-ktsa-primary/75 border-ktsa-accent/30 text-ktsa-text hover:border-ktsa-accent"
              }`}
            >
              <span>
                {selectedMonth
                  ? MONTHS.find((m) => m.value === selectedMonth)?.label
                  : "All Months"}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${monthOpen ? "rotate-180" : ""}`}
              />
            </button>
            {monthOpen && (
              <div
                className="absolute top-full mt-1 left-0 z-50 bg-[#0d1f1e] border border-ktsa-accent/20 rounded-lg min-w-[150px] max-h-64 overflow-y-auto thin-scrollbar"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}
              >
                <button
                  onClick={() => {
                    setSelectedMonth(undefined);
                    setMonthOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${!selectedMonth ? "bg-ktsa-accent/20 text-ktsa-accent" : "text-ktsa-text hover:bg-ktsa-primary/40"}`}
                >
                  All Months
                </button>
                {MONTHS.map((month) => (
                  <button
                    key={month.value}
                    onClick={() => {
                      setSelectedMonth(month.value);
                      setMonthOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${selectedMonth === month.value ? "bg-ktsa-accent/20 text-ktsa-accent" : "text-ktsa-text hover:bg-ktsa-primary/40"}`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Year dropdown ── */}
          <div className="relative" ref={yearRef}>
            <button
              onClick={() => {
                setYearOpen(!yearOpen);
                setStatusOpen(false);
                setMonthOpen(false);
              }}
              className={`flex items-center gap-2 text-sm px-4 py-1.5 rounded-lg font-bold border transition-colors min-w-[120px] justify-between ${
                selectedYear
                  ? "bg-ktsa-accent/15 border-ktsa-accent text-ktsa-accent"
                  : "bg-ktsa-primary/75 border-ktsa-accent/30 text-ktsa-text hover:border-ktsa-accent"
              }`}
            >
              <span>{selectedYear ?? "All Years"}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${yearOpen ? "rotate-180" : ""}`}
              />
            </button>
            {yearOpen && (
              <div
                className="absolute top-full mt-1 left-0 z-50 bg-[#0d1f1e] border border-ktsa-accent/20 rounded-lg overflow-hidden min-w-[120px]"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}
              >
                <button
                  onClick={() => {
                    setSelectedYear(undefined);
                    setYearOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${!selectedYear ? "bg-ktsa-accent/20 text-ktsa-accent" : "text-ktsa-text hover:bg-ktsa-primary/40"}`}
                >
                  All Years
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setYearOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${selectedYear === year ? "bg-ktsa-accent/20 text-ktsa-accent" : "text-ktsa-text hover:bg-ktsa-primary/40"}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear — only when any filter is active */}
          {(hasDateFilter || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                clearDateFilter();
                setStatusFilter("ALL");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-ktsa-accent/40 text-ktsa-accent hover:bg-ktsa-accent/10 transition-all"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-ktsa-text/50">
            <AlertCircle size={32} className="text-ktsa-highlight" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Grid */}
        {!error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {loading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              ) : filtered.length === 0 ? (
                <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-center py-20 text-ktsa-text/40 text-sm">
                  {hasDateFilter
                    ? "No tournaments found for the selected period."
                    : `No ${statusFilter.toLowerCase()} tournaments found.`}
                </div>
              ) : (
                filtered.map((t, i) => (
                  <TournamentCard key={t.id} tournament={t} index={i} />
                ))
              )}

              {/* Skeleton cards appended while loading more */}
              {loadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={`more-${i}`} />
                ))}
            </div>

            {/* Invisible sentinel — observed by IntersectionObserver */}
            <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

            {/* Spinner shown while fetching the next page */}
            {loadingMore && (
              <div className="flex justify-center mt-6">
                <Loader2 size={22} className="animate-spin text-ktsa-accent" />
              </div>
            )}

            {/* End-of-results message */}
            {!loading && !hasNext && filtered.length > 0 && (
              <p className="text-center text-xs text-ktsa-text/30 mt-8">
                You've seen all {filtered.length} tournament
                {filtered.length !== 1 ? "s" : ""}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
