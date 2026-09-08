import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Trophy,
  CheckCircle2,
  Clock,
  ZoomIn,
  X,
  Shield,
  Swords,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import RegistrationModal from "../components/ui/RegistrationModal";
import { type ApiTournament } from "../components/Tournamentsections";
import { getMatchesByTournament } from "../../services/matchService";

// ── Helpers ────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_BACKEND_BASE_URL ?? "";

function formatDateRange(start: string, end: string) {
  const parse = (s: string) =>
    new Date(s.includes("T") ? s : s + "T00:00:00");
  const s = parse(start);
  const e = parse(end);
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  if (start === end || s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString("en-IN", opts);
  }
  return `${s.toLocaleDateString("en-IN", opts)} — ${e.toLocaleDateString("en-IN", opts)}`;
}

function formatTime(iso: string) {
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00");
  if (d.getHours() === 0 && d.getMinutes() === 0) return null;
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function statusMeta(status: ApiTournament["status"]) {
  switch (status) {
    case "LIVE":
    case "ACTIVE":
      return {
        label: "LIVE",
        cls: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
      };
    case "COMPLETED":
      return {
        label: "COMPLETED",
        cls: "bg-green-600/20 text-green-400 border-green-600/30",
      };
    default:
      return {
        label: "UPCOMING",
        cls: "bg-ktsa-highlight/20 text-ktsa-highlight border-ktsa-highlight/30",
      };
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

// ── Category row component ──────────────────────────────────────────────────
function CategoryRow({
  label,
  enabled,
  fee,
}: {
  label: string;
  enabled: boolean;
  fee: number;
}) {
  if (!enabled) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-ktsa-primary/20 border border-ktsa-accent/10">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={15} className="text-ktsa-accent flex-shrink-0" />
        <span className="text-sm font-semibold text-ktsa-text">{label}</span>
      </div>
      {fee > 0 && (
        <span className="text-sm font-bold text-ktsa-accent">₹{fee}</span>
      )}
    </div>
  );
}

// ── Stat tile ──────────────────────────────────────────────────────────────
function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-ktsa-primary/20 border border-ktsa-accent/10">
      <div className="mt-0.5 text-ktsa-accent flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] text-ktsa-text/40 uppercase tracking-widest font-semibold mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-ktsa-text leading-snug">{value}</p>
      </div>
    </div>
  );
}

// ── Lightbox ───────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X size={20} />
      </button>
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-[88vh] rounded-xl object-contain shadow-2xl border border-white/10"
      />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export function TournamentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<ApiTournament | null>(null);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Fetch tournament detail
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`${API_BASE}/api/tournament/${id}`)
      .then((r) => r.json())
      .then((json) => {
        const t: ApiTournament = json?.data ?? json;
        setTournament(t);

        // Also fetch match count in parallel — don't block the page on it
        getMatchesByTournament(id)
          .then((matches) => setMatchCount(matches.length))
          .catch(() => setMatchCount(null));
      })
      .catch(() => setError("Failed to load tournament details."))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-ktsa-bg">
        <div className="w-8 h-8 border-4 border-ktsa-accent/30 border-t-ktsa-accent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Error / not found ──
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

  const { label, cls } = statusMeta(tournament.status);
  const canRegister = isRegistrationOpen(tournament);
  const startTime = formatTime(tournament.startDate);

  const categories = [
    { label: "Open Singles", enabled: tournament.openSingleEnabled, fee: tournament.openSingleFee },
    { label: "Open Doubles", enabled: tournament.openDoubleEnabled, fee: tournament.openDoubleFee },
    { label: "Mixed Doubles", enabled: tournament.mixedDoubleEnabled, fee: tournament.mixedDoubleFee },
    { label: "Women's Singles", enabled: tournament.womenSingleEnabled, fee: tournament.womenSingleFee },
  ];
  const enabledCategories = categories.filter((c) => c.enabled);

  // Shape required by RegistrationModal
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
    image: tournament.bannerUrl ?? "",
  };

  return (
    <div className="min-h-screen bg-ktsa-bg">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative h-[calc(40vh+5rem)] min-h-[320px] overflow-hidden">
        {tournament.bannerUrl ? (
          <>
            <ImageWithFallback
              src={tournament.bannerUrl}
              alt={tournament.tournamentName}
              className="w-full h-full object-cover"
            />
            {/* Zoom trigger */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-24 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
              title="View full image"
            >
              <ZoomIn size={16} />
            </button>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ktsa-primary/60 to-ktsa-secondary/40 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-ktsa-accent/20"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="m3 16 5-5 4 4 3-3 4 4" />
              <circle cx="8.5" cy="8.5" r="1.5" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg via-ktsa-bg/50 to-black/20" />

        {/* Back button */}
        <div className="absolute top-24 left-4 z-10">
          <button
            onClick={() => navigate("/tournaments")}
            className="flex items-center gap-2 text-ktsa-text/80 hover:text-ktsa-accent transition-colors font-medium text-sm bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
          >
            <ArrowLeft size={15} />
            All Tournaments
          </button>
        </div>

        {/* Title area at bottom of banner */}
        <div className="absolute bottom-6 left-0 right-0 px-4 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cls}`}>
              {label}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ktsa-accent/10 border border-ktsa-accent/20 text-ktsa-accent/80">
              {tournament.format.replace(/_/g, " ")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
            {tournament.tournamentName}
          </h1>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-16">

        {/* ── Quick stats strip ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 -mt-2 mb-8">
          <StatTile
            icon={<Calendar size={16} />}
            label="Date"
            value={formatDateRange(tournament.startDate, tournament.endDate)}
          />
          <StatTile
            icon={<MapPin size={16} />}
            label="Venue"
            value={tournament.venue}
          />
          <StatTile
            icon={<Users size={16} />}
            label="Max Players"
            value={String(tournament.maxParticipants)}
          />
          {tournament.pricePool > 0 && (
            <StatTile
              icon={<IndianRupee size={16} />}
              label="Prize Pool"
              value={`₹${tournament.pricePool.toLocaleString("en-IN")}`}
            />
          )}
          {startTime && (
            <StatTile
              icon={<Clock size={16} />}
              label="Start Time"
              value={startTime}
            />
          )}
          {matchCount !== null && matchCount > 0 && (
            <StatTile
              icon={<Swords size={16} />}
              label="Matches"
              value={String(matchCount)}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left / main column ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            {tournament.description && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-ktsa-primary/10 border border-ktsa-accent/10 rounded-2xl p-5"
              >
                <h2 className="text-sm font-black text-ktsa-accent uppercase tracking-widest mb-3">
                  About this Tournament
                </h2>
                <p className="text-ktsa-text/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {tournament.description}
                </p>
              </motion.section>
            )}

            {/* Categories & Fees */}
            {enabledCategories.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-ktsa-primary/10 border border-ktsa-accent/10 rounded-2xl p-5"
              >
                <h2 className="text-sm font-black text-ktsa-accent uppercase tracking-widest mb-4">
                  Categories & Entry Fees
                </h2>
                <div className="space-y-2">
                  {enabledCategories.map((c) => (
                    <CategoryRow
                      key={c.label}
                      label={c.label}
                      enabled={c.enabled}
                      fee={c.fee}
                    />
                  ))}
                </div>
                {enabledCategories.every((c) => c.fee === 0) && (
                  <p className="text-xs text-ktsa-text/40 mt-3 italic">
                    Entry fees to be announced
                  </p>
                )}
              </motion.section>
            )}

            {/* Key Information — replaces Challonge bracket link */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-ktsa-primary/10 border border-ktsa-accent/10 rounded-2xl p-5"
            >
              <h2 className="text-sm font-black text-ktsa-accent uppercase tracking-widest mb-4">
                Key Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-ktsa-accent/10">
                  <span className="text-xs text-ktsa-text/50 uppercase tracking-wider font-semibold">Format</span>
                  <span className="text-sm font-bold text-ktsa-text">{tournament.format.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-ktsa-accent/10">
                  <span className="text-xs text-ktsa-text/50 uppercase tracking-wider font-semibold">Max Participants</span>
                  <span className="text-sm font-bold text-ktsa-text">{tournament.maxParticipants}</span>
                </div>
                {tournament.pricePool > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-ktsa-accent/10">
                    <span className="text-xs text-ktsa-text/50 uppercase tracking-wider font-semibold">Prize Pool</span>
                    <span className="text-sm font-bold text-ktsa-accent">₹{tournament.pricePool.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-ktsa-accent/10">
                  <span className="text-xs text-ktsa-text/50 uppercase tracking-wider font-semibold">Registration</span>
                  <span className={`text-sm font-bold ${tournament.registrationClosed ? "text-red-400" : "text-green-400"}`}>
                    {tournament.registrationClosed ? "Closed" : "Open"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-ktsa-text/50 uppercase tracking-wider font-semibold">Status</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    tournament.status === "COMPLETED"
                      ? "bg-green-600/20 text-green-400 border-green-600/30"
                      : tournament.status === "LIVE" || tournament.status === "ACTIVE"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-ktsa-highlight/20 text-ktsa-highlight border-ktsa-highlight/30"
                  }`}>
                    {tournament.status}
                  </span>
                </div>
              </div>
            </motion.section>

            {/* Results CTA — completed tournaments */}
            {tournament.status === "COMPLETED" && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-ktsa-accent/10 to-ktsa-primary/10 border border-ktsa-accent/30 rounded-2xl p-5 text-center"
              >
                <Trophy size={32} className="text-ktsa-accent mx-auto mb-3" />
                <h2 className="text-base font-black text-ktsa-text mb-2">
                  Tournament Complete
                </h2>
                <p className="text-ktsa-text/60 text-sm mb-4">
                  View the final standings and all match results
                </p>
                <button
                  onClick={() => navigate(`/tournaments/${tournament.id}/results`)}
                  className="px-8 py-3 bg-gradient-to-r from-ktsa-accent to-ktsa-primary text-ktsa-bg font-bold rounded-full hover:shadow-lg hover:shadow-ktsa-accent/40 hover:scale-105 transition-all duration-300"
                >
                  View Full Results
                </button>
              </motion.section>
            )}

            {/* Live banner */}
            {(tournament.status === "LIVE" || tournament.status === "ACTIVE") && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 font-black text-base">
                    Tournament In Progress
                  </span>
                </div>
                <p className="text-ktsa-text/60 text-sm mb-4">
                  Matches are currently being played. Check live results below.
                </p>
                <button
                  onClick={() => navigate(`/tournaments/${tournament.id}/results`)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-all duration-300"
                >
                  <Trophy size={15} />
                  View Live Results
                </button>
              </motion.section>
            )}
          </div>

          {/* ── Right / sticky sidebar ───────────────────────────────────── */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24"
            >
              {/* Registration card */}
              <div className="bg-ktsa-primary/10 border border-ktsa-accent/20 rounded-2xl p-5 mb-4">
                <h3 className="text-sm font-black text-ktsa-accent uppercase tracking-widest mb-4">
                  Registration
                </h3>

                {canRegister ? (
                  <>
                    <p className="text-ktsa-text/70 text-xs mb-4 leading-relaxed">
                      Registration is open. Select your category and sign up now.
                    </p>
                    <button
                      onClick={() => setRegisterOpen(true)}
                      className="w-full py-3 rounded-full font-bold text-sm border-2 border-ktsa-accent text-ktsa-accent hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300"
                    >
                      Register Now
                    </button>
                  </>
                ) : tournament.status === "UPCOMING" && tournament.registrationClosed ? (
                  <div className="text-center py-3">
                    <Shield size={24} className="text-amber-400/60 mx-auto mb-2" />
                    <p className="text-amber-400/80 text-sm font-semibold">
                      Registration Closed
                    </p>
                    <p className="text-ktsa-text/40 text-xs mt-1">
                      Contact admin for more info
                    </p>
                  </div>
                ) : tournament.status === "UPCOMING" ? (
                  <div className="text-center py-3">
                    <Clock size={24} className="text-ktsa-accent/50 mx-auto mb-2" />
                    <p className="text-ktsa-text/60 text-sm">
                      Registration opens soon
                    </p>
                  </div>
                ) : tournament.status === "COMPLETED" ? (
                  <p className="text-ktsa-text/40 text-sm text-center py-2">
                    This tournament has ended
                  </p>
                ) : (
                  <p className="text-red-400/80 text-sm font-semibold text-center py-2">
                    Tournament is currently live
                  </p>
                )}
              </div>

              {/* Format info card */}
              <div className="bg-ktsa-primary/10 border border-ktsa-accent/10 rounded-2xl p-5">
                <h3 className="text-sm font-black text-ktsa-accent uppercase tracking-widest mb-3">
                  Format
                </h3>
                <p className="text-ktsa-text/80 text-sm font-semibold">
                  {tournament.format.replace(/_/g, " ")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Registration Modal ───────────────────────────────────────────── */}
      {registerOpen && (
        <RegistrationModal
          tournament={modalShape}
          onClose={() => setRegisterOpen(false)}
        />
      )}

      {/* ── Banner Lightbox ──────────────────────────────────────────────── */}
      {lightboxOpen && tournament.bannerUrl && (
        <Lightbox
          src={tournament.bannerUrl}
          alt={tournament.tournamentName}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
