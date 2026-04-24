import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type FaceKey = "front" | "right" | "left";
type RankKey = 1 | 2 | 3;

// ─── Constants ────────────────────────────────────────────────────────────────
const CUBE_SIZE = 180;

const rankToFace: Record<RankKey, FaceKey> = {
  1: "front",
  2: "right",
  3: "left",
};

const faceRotations: Record<FaceKey, string> = {
  front: "rotateY(0deg) rotateX(0deg)",
  right: "rotateY(-90deg) rotateX(0deg)",
  left: "rotateY(90deg) rotateX(0deg)",
};

// ─── Rank metadata ────────────────────────────────────────────────────────────
const rankMeta: Record<
  RankKey,
  { border: string; badge: string; gradient: string; label: string }
> = {
  1: {
    border: "border-yellow-400",
    badge: "from-yellow-300 to-yellow-600",
    gradient: "from-yellow-400 to-yellow-600",
    label: "Champion",
  },
  2: {
    border: "border-slate-300",
    badge: "from-slate-200 to-slate-500",
    gradient: "from-slate-300 to-slate-500",
    label: "Runner Up",
  },
  3: {
    border: "border-amber-700",
    badge: "from-amber-600 to-amber-900",
    gradient: "from-amber-600 to-amber-800",
    label: "Third",
  },
};

// ─── Sample players ───────────────────────────────────────────────────────────
const samplePlayers = [
  {
    rank: 1,
    name: "Alex Storm",
    points: 2840,
    matches: 42,
    wins: 35,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    rank: 2,
    name: "Jordan Lee",
    points: 2610,
    matches: 40,
    wins: 29,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80",
  },
  {
    rank: 3,
    name: "Riley Park",
    points: 2390,
    matches: 38,
    wins: 25,
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80",
  },
];

type Player = (typeof samplePlayers)[0];
type RankMeta = (typeof rankMeta)[RankKey];

// ─── Player face card ─────────────────────────────────────────────────────────
function PlayerFaceCard({
  player,
  meta,
}: {
  player: Player;
  meta: RankMeta;
  size?: number;
}) {
  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden"
      style={{
        border: "2px solid",
        borderColor: meta.border.replace("border-", ""),
        boxShadow: "3px 3px 3px  rgba(255,255,255,0.5)",
      }}
    >
      <img
        src={player.image}
        alt={player.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
        <p className="text-white font-black text-xs leading-tight pb-3">
          {player.name}
        </p>

        <div className="grid grid-cols-3 gap-1 text-white">
          <div>
            <p className="font-black text-xs">{player.matches}</p>
            <p className="text-[8px] text-white/60">Played</p>
          </div>
          <div>
            <p className="text-yellow-400 font-black text-xs">
              {player.points}
            </p>
            <p className="text-white/60 text-[9px] mb-1">PTS</p>
          </div>
          <div>
            <p className="font-black text-xs">{player.wins}</p>
            <p className="text-[8px] text-white/60">Wins</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Individual cube face ─────────────────────────────────────────────────────
function CubeFace({
  player,
  meta,
  transform,
  isActive,
  onClick,
}: {
  player: Player | undefined;
  meta: RankMeta;
  transform: string;
  isActive: boolean;
  onClick: () => void;
}) {
  if (!player) return null;
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        width: CUBE_SIZE,
        height: CUBE_SIZE,
        transform,
        backfaceVisibility: "hidden",
        cursor: "pointer",
        transition: "filter 0.3s",
        filter: isActive ? "brightness(1)" : "brightness(0.5)",
      }}
    >
      <PlayerFaceCard player={player} meta={meta} />
    </div>
  );
}

// ─── 3-D Cube Podium ─────────────────────────────────────────────────────────
export function CubePodium({
  players = samplePlayers,
}: {
  players?: Player[];
}) {
  const [activeFace, setActiveFace] = useState<FaceKey>("front");

  const activeRank = Object.entries(rankToFace).find(
    ([, face]) => face === activeFace,
  )?.[0];

  // Build face → player map
  const playersByFace = players.reduce<Partial<Record<FaceKey, Player>>>(
    (acc, p) => {
      acc[rankToFace[p.rank as RankKey]] = p;
      return acc;
    },
    {},
  );

  const half = CUBE_SIZE / 2;

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* ── Scene ── */}
      <div style={{ width: CUBE_SIZE, height: CUBE_SIZE, perspective: 600 }}>
        <motion.div
          style={{
            width: CUBE_SIZE,
            height: CUBE_SIZE,
            position: "relative",
            transformStyle: "preserve-3d",
          }}
          animate={{ transform: faceRotations[activeFace] }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        >
          {/* FRONT — rank 1 */}
          <CubeFace
            player={playersByFace.front}
            meta={rankMeta[1]}
            transform={`translateZ(${half}px)`}
            isActive={activeFace === "front"}
            onClick={() => setActiveFace("front")}
          />
          {/* RIGHT — rank 2 */}
          <CubeFace
            player={playersByFace.right}
            meta={rankMeta[2]}
            transform={`rotateY(90deg) translateZ(${half}px)`}
            isActive={activeFace === "right"}
            onClick={() => setActiveFace("right")}
          />
          {/* LEFT — rank 3 */}
          <CubeFace
            player={playersByFace.left}
            meta={rankMeta[3]}
            transform={`rotateY(-90deg) translateZ(${half}px)`}
            isActive={activeFace === "left"}
            onClick={() => setActiveFace("left")}
          />
          {/* TOP — decorative */}
          <div
            style={{
              position: "absolute",
              width: CUBE_SIZE,
              height: CUBE_SIZE,
              transform: `rotateX(90deg) translateZ(${half}px)`,
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          {/* BOTTOM — decorative */}
          <div
            style={{
              position: "absolute",
              width: CUBE_SIZE,
              height: CUBE_SIZE,
              transform: `rotateX(-90deg) translateZ(${half}px)`,
              backfaceVisibility: "hidden",
              background: "#0a0a0f",
            }}
          />
          {/* BACK — decorative */}
          <div
            style={{
              position: "absolute",
              width: CUBE_SIZE,
              height: CUBE_SIZE,
              transform: `rotateY(180deg) translateZ(${half}px)`,
              backfaceVisibility: "hidden",
              background: "#0a0a0f",
            }}
          />
        </motion.div>
      </div>

      {/* ── Face selector tabs ── */}
      <div className="flex gap-3">
        {[...players]
          .sort((a, b) => a.rank - b.rank)
          .map((player) => {
            const face = rankToFace[player.rank as RankKey];
            const meta = rankMeta[player.rank as RankKey];
            const isActive = activeFace === face;
            return (
              <button
                key={player.rank}
                onClick={() => setActiveFace(face)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-black transition-all duration-300 ${
                  isActive ? "text-white scale-110" : "text-white/50 scale-100"
                }`}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${
                        player.rank === 1
                          ? "#eab308"
                          : player.rank === 2
                            ? "#94a3b8"
                            : "#92400e"
                      }, ${
                        player.rank === 1
                          ? "#a16207"
                          : player.rank === 2
                            ? "#475569"
                            : "#451a03"
                      })`
                    : "rgba(255,255,255,0.07)",
                  boxShadow: isActive ? "0 4px 14px rgba(0,0,0,0.4)" : "none",
                }}
              >
                {meta.label}
              </button>
            );
          })}
      </div>
    </div>
  );
}
