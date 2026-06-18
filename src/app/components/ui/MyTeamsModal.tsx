import { useEffect, useRef, useState } from "react";
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

// ── Mock data — replace with real API call ────────────────────────────────────
const MOCK_TEAMS: Team[] = [
  {
    id: 1,
    teamName: "Team Blitz",
    category: "Open Doubles",
    role: "Attacker",
    partner: {
      name: "Rahul Mehta",
      email: "rahul@gmail.com",
      role: "Defender",
    },
    tournaments: [
      {
        id: 1,
        name: "Karnataka Open 2026",
        date: "2026-04-25",
        status: "Upcoming",
      },
      {
        id: 3,
        name: "Bengaluru Tournament",
        date: "2026-03-29",
        status: "Completed",
      },
    ],
  },
  {
    id: 2,
    teamName: "Solo Run",
    category: "Open Singles",
    role: "Solo",
    tournaments: [
      {
        id: 2,
        name: "January Open",
        date: "2026-01-31",
        status: "Completed",
      },
    ],
  },
];

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
      transition={{ delay: index * 0.08 }}
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
                      {new Date(t.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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

export default function MyTeamsModal({ isOpen, onClose, userId }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Fetch teams ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !userId) return;
    setLoading(true);

    // Replace with real API call:
    // fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/teams/user/${userId}`)
    //   .then(r => r.json()).then(d => setTeams(d.data)).finally(() => setLoading(false));

    setTimeout(() => {
      setTeams(MOCK_TEAMS);
      setLoading(false);
    }, 600);
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
        <div className="flex-shrink-0 px-8 pt-8 pb-6">
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
          <p className="text-sm text-gray-400">
            Teams and registrations you're part of
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-7 h-7 rounded-full border-2 border-ktsa-primary border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400">Loading teams…</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-ktsa-primary/10 border border-ktsa-accent/20 flex items-center justify-center">
                <Users size={24} className="text-ktsa-accent/50" />
              </div>
              <p className="text-white font-semibold">No teams yet</p>
              <p className="text-gray-500 text-sm">
                Register for a tournament to see your teams here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {teams.map((team, i) => (
                <TeamCard key={team.id} team={team} index={i} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
