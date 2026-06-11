import { motion } from "motion/react";
import {
  Calendar,
  MapPin,
  IndianRupee,
  Trophy,
  Users,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import RegistrationModal from "../components/ui/RegistrationModal";
import TournamentDetailsModal from "../components/ui/TournamentDetailsModal";
import {
  useTournaments,
  type ApiTournament,
} from "../components/Tournamentsections";

// ─── Helpers (same as TournamentSections) ────────────────────────────────────

function formatDateRange(start: string, end: string) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  if (start === end)
    return s.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  return `${s.getDate()}–${e.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
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
      return { label: "LIVE", cls: "bg-red-500 text-white animate-pulse" };
    case "COMPLETED":
      return { label: "COMPLETED", cls: "bg-green-600 text-white" };
    default:
      return { label: "UPCOMING", cls: "bg-ktsa-highlight text-ktsa-text" };
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-ktsa-accent/20 bg-gradient-to-br from-ktsa-primary/30 to-ktsa-secondary/20 flex flex-col animate-pulse">
      <div className="h-48 bg-ktsa-primary/30" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-ktsa-primary/40 rounded w-3/4" />
        <div className="h-3 bg-ktsa-primary/30 rounded w-1/2" />
        <div className="h-3 bg-ktsa-primary/30 rounded w-2/3" />
        <div className="h-9 bg-ktsa-primary/30 rounded-full mt-2" />
      </div>
    </div>
  );
}

// ─── Tournament Card ──────────────────────────────────────────────────────────

function TournamentCard({
  tournament,
  index,
}: {
  tournament: ApiTournament;
  index: number;
}) {
  const [modalType, setModalType] = useState<"register" | "details" | null>(
    null,
  );
  const { label, cls } = statusMeta(tournament.status);
  const categories = getCategories(tournament);

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 3) * 0.08 }}
        whileHover={{ y: -5 }}
        className="group bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 rounded-2xl overflow-hidden border border-ktsa-accent/30 hover:border-ktsa-accent backdrop-blur-sm transition-all duration-300 flex flex-col"
        style={{ boxShadow: "0 8px 30px rgba(0,229,255,0.10)" }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={tournament.bannerUrl}
            alt={tournament.tournamentName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg/70 to-transparent" />
          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${cls}`}
            >
              {label}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-ktsa-bg/60 backdrop-blur-sm text-ktsa-text/80 border border-ktsa-accent/20">
              {tournament.format.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          <h3 className="text-lg font-black text-ktsa-accent group-hover:text-ktsa-text transition-colors leading-snug">
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
            <div className="flex items-center gap-2">
              <Users size={13} className="text-ktsa-accent flex-shrink-0" />
              <span className="text-xs font-semibold text-ktsa-text">
                Max {tournament.maxParticipants} participants
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

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-ktsa-accent/10 border border-ktsa-accent/15 text-ktsa-accent/70"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto pt-3 border-t border-ktsa-accent/10">
            {tournament.status === "UPCOMING" && (
              <button
                onClick={() => setModalType("register")}
                className="w-full py-2.5 rounded-full font-bold text-sm border-2 border-white text-white hover:border-ktsa-highlight hover:bg-ktsa-highlight transition-all duration-300"
              >
                Register
              </button>
            )}
            {tournament.status === "LIVE" && (
              <button
                onClick={() => setModalType("details")}
                className="w-full py-2.5 rounded-full font-bold text-sm bg-red-500 text-white animate-pulse"
              >
                View Live
              </button>
            )}
            {tournament.status === "COMPLETED" && (
              <button
                onClick={() => setModalType("details")}
                className="w-full py-2.5 rounded-full font-bold text-sm border-2 border-white/40 text-white/60 hover:border-white hover:text-white transition-all duration-300"
              >
                View Results
              </button>
            )}
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

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

type Filter = "ALL" | "UPCOMING" | "LIVE" | "COMPLETED";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "ALL" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Live", value: "LIVE" },
  { label: "Completed", value: "COMPLETED" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Tournaments() {
  const { tournaments, loading, error } = useTournaments();
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered =
    filter === "ALL"
      ? tournaments
      : tournaments.filter((t) => t.status === filter);

  const counts = {
    ALL: tournaments.length,
    UPCOMING: tournaments.filter((t) => t.status === "UPCOMING").length,
    LIVE: tournaments.filter((t) => t.status === "LIVE").length,
    COMPLETED: tournaments.filter((t) => t.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 py-10 px-4">
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

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 ${
                filter === value
                  ? "bg-ktsa-accent border-ktsa-accent text-ktsa-text"
                  : "bg-transparent border-white/30 text-white/60 hover:border-white hover:text-white"
              }`}
            >
              {label}
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === value
                    ? "bg-ktsa-text/20 text-ktsa-text"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {counts[value]}
              </span>
            </button>
          ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            ) : filtered.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-ktsa-text/40 text-sm">
                No {filter.toLowerCase()} tournaments found.
              </div>
            ) : (
              filtered.map((t, i) => (
                <TournamentCard key={t.id} tournament={t} index={i} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
