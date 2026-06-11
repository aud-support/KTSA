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
  startDate: string; // "2026-06-09"
  endDate: string; // "2026-06-12"
  venue: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
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
};

type ApiResponse = {
  data: ApiTournament[];
  success: boolean;
  message: string;
  status: number;
  errors: null | string;
};

// ─── Fetch Hook ───────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_BACKEND_BASE_URL ?? "";

export function useTournaments() {
  const [tournaments, setTournaments] = useState<ApiTournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/tournament`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json() as Promise<ApiResponse>;
      })
      .then((body) => {
        if (!cancelled) {
          if (body.success) {
            setTournaments(body.data ?? []);
          } else {
            setError(body.message ?? "Failed to load tournaments.");
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Network error.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { tournaments, loading, error };
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
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  if (start === end) return formatDate(start);
  const sDay = s.getDate();
  const eStr = e.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${sDay}–${eStr}`;
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

/** Normalise API status → display status */
function statusMeta(status: ApiTournament["status"]) {
  switch (status) {
    case "LIVE":
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
    if (!isoDate) return { d: 0, h: 0, m: 0, s: 0 };
    const diff = Math.max(
      0,
      new Date(isoDate + "T00:00:00").getTime() - Date.now(),
    );
    return {
      d: Math.floor(diff / 86_400_000),
      h: Math.floor((diff % 86_400_000) / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
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
    <div className="rounded-2xl overflow-hidden border border-ktsa-accent/20 bg-gradient-to-br from-ktsa-primary/30 to-ktsa-secondary/20 grid grid-cols-1 lg:grid-cols-2 min-h-[320px]">
      <Skeleton className="min-h-[220px] lg:min-h-[320px] rounded-none" />
      <div className="p-8 flex flex-col gap-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex gap-3 mt-auto">
          <Skeleton className="h-11 w-32 rounded-full" />
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-ktsa-accent/20 bg-gradient-to-br from-ktsa-primary/30 to-ktsa-secondary/20 flex flex-col">
      <Skeleton className="h-40 rounded-none" />
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
  const { d, h, m, s } = useCountdown(
    tournament.status === "UPCOMING" ? tournament.startDate : undefined,
  );
  const pad = (n: number) => String(n).padStart(2, "0");
  const [modalType, setModalType] = useState<"register" | "details" | null>(
    null,
  );
  const { label, cls } = statusMeta(tournament.status);
  const categories = getCategories(tournament);

  // Shape passed to modals (keeps existing modal API working)
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
        className="rounded-2xl overflow-hidden border border-ktsa-accent/30 bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 backdrop-blur-sm"
        style={{ boxShadow: "0 16px 48px rgba(0,229,255,0.15)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[320px]">
          {/* Image side */}
          <div className="relative min-h-[220px] lg:min-h-[320px] overflow-hidden">
            <ImageWithFallback
              src={tournament.bannerUrl}
              alt={tournament.tournamentName}
              className="w-full h-full object-cover absolute inset-0 scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg/80 via-ktsa-bg/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ktsa-bg/60 hidden lg:block" />

            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}
              >
                {label}
              </span>
            </div>

            {/* Format badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ktsa-bg/60 backdrop-blur-sm text-ktsa-text/80 border border-ktsa-accent/20">
                {tournament.format.replace("_", " ")}
              </span>
            </div>

            {/* Mobile title overlay */}
            <div className="absolute bottom-4 left-4 lg:hidden">
              <h3 className="text-2xl font-black text-white">
                {tournament.tournamentName}
              </h3>
              <p className="text-ktsa-text/70 text-sm mt-1">
                {formatDateRange(tournament.startDate, tournament.endDate)}
              </p>
            </div>
          </div>

          {/* Info side */}
          <div className="p-6 md:p-8 flex flex-col justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-ktsa-accent uppercase mb-2">
                Featured Tournament
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-ktsa-text mb-3 leading-tight hidden lg:block">
                {tournament.tournamentName}
              </h3>

              {tournament.description && (
                <p className="text-sm text-ktsa-text/80 leading-relaxed mb-4">
                  {tournament.description}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar
                    size={14}
                    className="text-ktsa-accent flex-shrink-0"
                  />
                  <span className="text-sm font-semibold text-ktsa-text">
                    {formatDateRange(tournament.startDate, tournament.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin
                    size={14}
                    className="text-ktsa-accent flex-shrink-0"
                  />
                  <span className="text-sm font-semibold text-ktsa-text">
                    {tournament.venue}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-ktsa-accent flex-shrink-0" />
                  <span className="text-sm font-semibold text-ktsa-text">
                    Max {tournament.maxParticipants} participants
                  </span>
                </div>
                {tournament.pricePool > 0 && (
                  <div className="flex items-center gap-2">
                    <Trophy
                      size={14}
                      className="text-ktsa-accent flex-shrink-0"
                    />
                    <span className="text-sm font-semibold text-ktsa-text">
                      Prize pool: ₹
                      {tournament.pricePool.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>

              {/* Category pills */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-ktsa-accent/10 border border-ktsa-accent/20 text-ktsa-accent/80"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Countdown */}
              {tournament.status === "UPCOMING" && (
                <div className="mb-2">
                  <p className="text-[11px] font-bold tracking-widest text-ktsa-accent/50 uppercase mb-2">
                    Starts in
                  </p>
                  <div className="flex gap-2">
                    {[
                      { val: d, label: "Days" },
                      { val: h, label: "Hrs" },
                      { val: m, label: "Min" },
                      { val: s, label: "Sec" },
                    ].map(({ val, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center justify-center rounded-xl border border-ktsa-accent/20 bg-ktsa-primary/30 px-3 py-2 min-w-[52px]"
                      >
                        <span className="text-xl font-black text-ktsa-text leading-none">
                          {label === "Days" ? val : pad(val)}
                        </span>
                        <span className="text-[10px] text-ktsa-text/70 uppercase tracking-wider mt-1">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setModalType("details")}
                className="px-6 py-3 rounded-full font-bold text-sm border-2 border-white text-white hover:border-ktsa-accent hover:text-ktsa-accent bg-transparent transition-all duration-300"
              >
                View Details
              </button>
              {tournament.status === "UPCOMING" && (
                <button
                  onClick={() => setModalType("register")}
                  className="px-6 py-3 rounded-full font-bold text-sm bg-ktsa-highlight text-white border-2 border-ktsa-highlight hover:bg-transparent hover:text-ktsa-highlight transition-all duration-300 flex items-center gap-2"
                >
                  Register Now <ArrowRight size={16} />
                </button>
              )}
              {tournament.status === "LIVE" && (
                <button
                  onClick={() => setModalType("details")}
                  className="px-6 py-3 rounded-full font-bold text-sm bg-red-500 text-white border-2 border-red-500 animate-pulse flex items-center gap-2"
                >
                  View Live
                </button>
              )}
            </div>
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

  const modalShape = {
    id: tournament.id,
    title: tournament.tournamentName,
    date: formatDateRange(tournament.startDate, tournament.endDate),
    location: tournament.venue,
    status: "Upcoming" as const,
    image: tournament.bannerUrl,
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        whileHover={{ y: -5 }}
        className="group bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 rounded-2xl overflow-hidden border border-ktsa-accent/30 hover:border-ktsa-accent backdrop-blur-sm transition-all duration-300 flex flex-col"
        style={{ boxShadow: "0 8px 30px rgba(0,229,255,0.10)" }}
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={tournament.bannerUrl}
            alt={tournament.tournamentName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg/70 to-transparent" />
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-ktsa-highlight text-ktsa-text">
              UPCOMING
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
            <button
              onClick={() => setModalType("register")}
              className="text-[12px] font-bold text-ktsa-highlight hover:text-white flex items-center gap-1 transition-colors"
            >
              Register <ChevronRight size={13} />
            </button>
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

  const upcoming = tournaments.filter((t) => t.status === "UPCOMING");

  // Featured: pinned id → first LIVE → first UPCOMING
  const featured =
    (featuredId != null
      ? tournaments.find((t) => t.id === featuredId)
      : undefined) ??
    tournaments.find((t) => t.status === "LIVE") ??
    upcoming[0];

  // Upcoming grid: exclude the featured card to avoid duplication
  const upcomingGrid = upcoming.filter((t) => t.id !== featured?.id);

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
            <div className="mb-10">
              <p className="text-[11px] font-bold tracking-widest text-ktsa-accent/60 uppercase mb-4">
                Featured Event
              </p>
              {loading || !featured ? (
                <FeaturedSkeleton />
              ) : (
                <FeaturedTournament tournament={featured} />
              )}
            </div>

            {/* ── Upcoming grid ── */}
            {(loading || upcomingGrid.length > 0) && (
              <div className="mb-8">
                <p className="text-[11px] font-bold tracking-widest text-ktsa-accent/60 uppercase mb-5">
                  Upcoming Events
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-sm hover:border-ktsa-highlight hover:bg-ktsa-highlight hover:text-white transition-all duration-300 inline-flex items-center gap-2"
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
