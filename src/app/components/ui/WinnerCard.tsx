import { motion } from "motion/react";
import { Trophy, TrendingUp, Target, Zap } from "lucide-react";

// Supports Singles + Doubles
interface Player {
  rank: number;
  name?: string;
  names?: string[];
  points: number;
  matches: number;
  wins: number;
  trend: string;
}

interface WinnerCardProps {
  player: Player;
  category?: string;
}

export function WinnerCard({ player, category = "Overall" }: WinnerCardProps) {
  // Handle Singles / Doubles
  const playerName =
    player.name || (player.names ? player.names.join(" & ") : "Unknown");

  const losses = player.matches - player.wins;
  const winRate =
    player.matches > 0 ? Math.round((player.wins / player.matches) * 100) : 0;

  const pointsPercent = Math.min(100, Math.round((player.points / 3000) * 100));

  const initials = playerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-3xl overflow-hidden border-2 border-ktsa-accent"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,215,0,0.08) -19%, rgba(10,10,20,0.95) 60%)",
        boxShadow: "0 0 30px rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #14b8a6, #14b8a6, transparent)",
        }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-widest text-yellow-400/80 uppercase">
            {category} Leader
          </span>

          <Trophy
            size={16}
            className="text-yellow-400"
            style={{
              filter: "drop-shadow(0 0 6px rgba(255,200,0,0.8))",
            }}
          />
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 overflow-hidden"
            style={{
              border: "1.5px solid rgba(255,200,0,0.5)",
              boxShadow: "0 0 20px rgba(255,200,0,0.2)",
            }}
          >
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                playerName,
              )}&backgroundColor=1a1a2e&textColor=f5d000`}
              alt={playerName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerText = initials;
              }}
            />
          </div>

          <div>
            <p className="text-sm font-black text-white leading-tight">
              {playerName}
            </p>

            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,200,0,0.15)",
                  border: "1px solid rgba(255,200,0,0.3)",
                  color: "#f5d000",
                }}
              >
                Rank #1
              </span>

              {player.trend === "up" && (
                <span className="flex items-center gap-0.5 text-xs text-green-400 font-bold">
                  <TrendingUp size={12} />
                  Rising
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Points */}
        <div
          className="rounded-2xl p-3 mb-3 text-center"
          style={{
            background: "rgba(255,200,0,0.07)",
            border: "1px solid rgba(255,200,0,0.2)",
          }}
        >
          <p className="text-2xl font-black text-white tracking-tight leading-none">
            {player.points.toLocaleString()}
          </p>

          <p className="text-xs text-yellow-400/70 font-semibold mt-1 uppercase tracking-widest">
            Ranking Points
          </p>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-ktsa-text/50 mb-1.5">
              <span>Progress to max</span>
              <span className="text-yellow-400/70">{pointsPercent}%</span>
            </div>

            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pointsPercent}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #f5d000, #ffaa00)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            {
              label: "Played",
              value: player.matches,
              icon: <Target size={12} />,
            },
            {
              label: "Wins",
              value: player.wins,
              icon: <Trophy size={12} />,
            },
            {
              label: "Losses",
              value: losses,
              icon: <Zap size={12} />,
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="rounded-xl p-2 text-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex justify-center mb-1 text-ktsa-text/40">
                {icon}
              </div>

              <p className="text-sm font-black text-white">{value}</p>

              <p className="text-xs text-ktsa-text/50 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
