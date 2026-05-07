import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X, Calendar, MapPin, Trophy, Clock } from "lucide-react";

interface Tournament {
  id: number;
  title: string;
  date: string;
  location: string;
  status: "Upcoming" | "Live" | "Completed";
  image: string;
  _key?: string;
}

interface Props {
  tournament: Tournament;
  onClose: () => void;
}

// Placeholder results — replace with real data from your tournaments array
// by adding a `results` field to your Tournament type/data as needed.
const mockResults: Record<
  number,
  { first: string; second: string; third: string; category: string }[]
> = {
  3: [
    {
      category: "Open Singles",
      first: "Rahul Sharma",
      second: "Anil Kumar",
      third: "Priya Nair",
    },
    {
      category: "Open Doubles",
      first: "Team Alpha",
      second: "Team Neon",
      third: "Team GG",
    },
  ],
  4: [
    {
      category: "Open Singles",
      first: "Kiran Rao",
      second: "Mehul Jain",
      third: "Sara Ahmed",
    },
  ],
};

export default function TournamentDetailsModal({ tournament, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const results = mockResults[tournament.id] ?? [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.button === 2) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const isLive = tournament.status === "Live";

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
        className="w-full max-w-md max-h-[85vh] overflow-y-auto no-scrollbar bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            {isLive && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
            <h2 className="text-2xl font-bold text-ktsa-accent text-center">
              {isLive ? "Live Now" : "Tournament Results"}
            </h2>
          </div>
          <p className="text-sm text-gray-400 text-center">
            {isLive
              ? "This tournament is currently ongoing"
              : "Final standings"}
          </p>
        </div>

        {/* Tournament Banner Image */}
        <div className="relative h-36 rounded-xl overflow-hidden mb-6 border border-ktsa-accent/20">
          <img
            src={tournament.image}
            alt={tournament.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <p className="text-white font-bold text-base leading-tight">
              {tournament.title}
            </p>
          </div>
          {isLive && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                LIVE
              </span>
            </div>
          )}
        </div>

        {/* Info Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 rounded-xl border border-ktsa-accent/20 bg-ktsa-primary/10">
            <Calendar size={14} className="text-ktsa-accent flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wide">
                Date
              </p>
              <p className="text-white text-xs font-semibold">
                {tournament.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl border border-ktsa-accent/20 bg-ktsa-primary/10">
            <MapPin size={14} className="text-ktsa-accent flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wide">
                Venue
              </p>
              <p className="text-white text-xs font-semibold">
                {tournament.location}
              </p>
            </div>
          </div>
        </div>

        {/* Results or Ongoing message */}
        {isLive ? (
          <div className="flex flex-col items-center justify-center py-6 text-center border border-ktsa-accent/20 rounded-xl bg-ktsa-primary/10">
            <Clock size={32} className="text-ktsa-accent mb-3" />
            <p className="text-white font-semibold text-sm mb-1">
              Tournament in Progress
            </p>
            <p className="text-gray-500 text-xs">
              Results will be available once the tournament concludes.
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-5">
            {results.map((result, i) => (
              <div key={i}>
                <p className="text-ktsa-accent text-xs font-bold uppercase tracking-widest mb-3">
                  {result.category}
                </p>
                <div className="space-y-2">
                  {/* 1st */}
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center flex-shrink-0">
                      <Trophy size={14} className="text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-yellow-500/80 uppercase tracking-wide font-semibold">
                        1st Place
                      </p>
                      <p className="text-white text-sm font-bold">
                        {result.first}
                      </p>
                    </div>
                    <span className="text-yellow-400 text-lg">🥇</span>
                  </div>

                  {/* 2nd */}
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-500/30 bg-gray-500/5">
                    <div className="w-8 h-8 rounded-full bg-gray-500/20 border border-gray-500/40 flex items-center justify-center flex-shrink-0">
                      <Trophy size={14} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">
                        2nd Place
                      </p>
                      <p className="text-white text-sm font-bold">
                        {result.second}
                      </p>
                    </div>
                    <span className="text-gray-400 text-lg">🥈</span>
                  </div>

                  {/* 3rd */}
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-orange-800/30 bg-orange-900/5">
                    <div className="w-8 h-8 rounded-full bg-orange-800/20 border border-orange-700/40 flex items-center justify-center flex-shrink-0">
                      <Trophy size={14} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-orange-700 uppercase tracking-wide font-semibold">
                        3rd Place
                      </p>
                      <p className="text-white text-sm font-bold">
                        {result.third}
                      </p>
                    </div>
                    <span className="text-orange-500 text-lg">🥉</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center border border-ktsa-accent/20 rounded-xl bg-ktsa-primary/10">
            <Trophy size={32} className="text-ktsa-accent/40 mb-3" />
            <p className="text-gray-400 text-sm">Results not available yet.</p>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 hover:cursor-pointer transition-all duration-300 text-sm"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
