import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import maleAvatar from "../../../assets/male_avatar.jfif";
import femaleAvatar from "../../../assets/female_avatar.jfif";
import doublesAvatar from "../../../assets/doubles_avatar.jfif";
import {
  getTopSpotlightPlayers,
  RankingResponse,
} from "../../../services/rankingService";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SpotlightPlayer {
  rank: number;
  name: string;
  points: number;
  category: string;
  image: string;
}

/** Picks the correct fallback avatar based on backend category */
function fallbackAvatar(category: string): string {
  if (category === "WOMENS_SINGLES") return femaleAvatar;
  if (category === "OPEN_DOUBLES" || category === "MIXED_DOUBLES")
    return doublesAvatar;
  return maleAvatar;
}

/** Maps backend category enum to a short display label */
function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    MENS_SINGLES: "Men's Singles",
    WOMENS_SINGLES: "Women's Singles",
    OPEN_DOUBLES: "Open Doubles",
    MIXED_DOUBLES: "Mixed Doubles",
  };
  return map[category] ?? category;
}

/** Converts the API response array to the 3-slot spotlight format */
function toSpotlight(data: RankingResponse[]): SpotlightPlayer[] {
  return data.slice(0, 3).map((r, i) => ({
    rank: i + 1,
    name: r.userName,
    points: r.points,
    category: categoryLabel(r.category),
    image: r.profilePictureUrl ?? fallbackAvatar(r.category),
  }));
}

// Display order: rank2 left, rank1 center, rank3 right
const displayOrder = [1, 0, 2];

// Stacked rotations / offsets (closed state)
const stackedRotations = [-10, 0, 10];
const stackedTranslateX = [-8, 0, 8];

// ── Component ─────────────────────────────────────────────────────────────────
export function TopPlayersStack() {
  const [opened, setOpened] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(1);
  const [isMobile, setIsMobile] = useState(false);
  const [players, setPlayers] = useState<SpotlightPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch top spotlight players on mount ──────────────────────────────
  useEffect(() => {
    getTopSpotlightPlayers()
      .then((data) => setPlayers(toSpotlight(data)))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Responsive breakpoint ─────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const CARD_W = isMobile ? 150 : 240;
  const CARD_H = isMobile ? 210 : 340;
  const SPREAD_X = isMobile ? 95 : 260;

  const getTranslateX = (displayIdx: number) => {
    if (!opened) return stackedTranslateX[displayIdx];
    if (displayIdx === 0) return -SPREAD_X;
    if (displayIdx === 2) return SPREAD_X;
    return 0;
  };

  const getZIndex = (displayIdx: number) => {
    if (isMobile && focusedIndex !== null && opened) {
      return displayIdx === focusedIndex ? 10 : 1;
    }
    if (hoveredIndex === displayIdx) return 10;
    if (displayIdx === 1) return 3;
    if (displayIdx === 0) return 2;
    return 1;
  };

  const containerWidth = opened
    ? isMobile
      ? "100%"
      : SPREAD_X * 2 + CARD_W + 40
    : CARD_W + 48;

  // ── Loading spinner ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: CARD_H + 48 }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-ktsa-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────
  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <Trophy size={32} className="text-ktsa-accent/40" />
        <p className="text-sm text-gray-500">No ranking data yet</p>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Stack wrapper */}
      <div
        className="relative flex items-center justify-center mx-auto"
        style={{
          width: containerWidth,
          maxWidth: "100%",
          height: CARD_H + 48,
          transition: "width 0.45s cubic-bezier(0.175,0.885,0.32,1.275)",
        }}
        onMouseEnter={() => !isMobile && setOpened(true)}
        onMouseLeave={() => {
          if (!isMobile) {
            setOpened(false);
            setHoveredIndex(null);
          }
        }}
        onClick={() => {
          if (!opened) setOpened(true);
        }}
      >
        {displayOrder.map((playerIdx, displayIdx) => {
          const player = players[playerIdx];
          if (!player) return null;

          const isHovered = !isMobile && hoveredIndex === displayIdx;
          const isFocused = isMobile && focusedIndex === displayIdx && opened;

          const rotate = opened ? 0 : stackedRotations[displayIdx];
          const translateX = getTranslateX(displayIdx);
          const translateY = isHovered || isFocused ? -18 : 0;
          const zIndex = getZIndex(displayIdx);

          const medalEmoji =
            player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉";

          const borderColor =
            isHovered || isFocused
              ? "rgba(0,229,255,0.9)"
              : player.rank === 1
                ? "rgba(255,255,255,0.65)"
                : "rgba(0,229,255,0.35)";

          const glowShadow =
            isHovered || isFocused
              ? "0 20px 60px rgba(0,229,255,0.45)"
              : player.rank === 1
                ? "0 10px 40px rgba(255,255,255,0.3)"
                : "0 8px 28px rgba(0,0,0,0.5)";

          return (
            <motion.div
              key={player.rank}
              animate={{ rotate, x: translateX, y: translateY, zIndex }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="absolute rounded-2xl overflow-hidden cursor-pointer"
              style={{
                width: CARD_W,
                height: CARD_H,
                transformOrigin: "bottom center",
                border: `2px solid ${borderColor}`,
                boxShadow: glowShadow,
              }}
              onMouseEnter={() => {
                if (!isMobile && opened) setHoveredIndex(displayIdx);
              }}
              onMouseLeave={() => {
                if (!isMobile) setHoveredIndex(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile && opened) {
                  setFocusedIndex(
                    focusedIndex === displayIdx ? 1 : displayIdx,
                  );
                }
              }}
            >
              {/* Player photo */}
              <ImageWithFallback
                src={player.image}
                alt={player.name}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Player info footer */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1 mb-0.5">
                  <span style={{ fontSize: 13 }}>{medalEmoji}</span>
                  <h3
                    className="font-black text-white leading-tight truncate"
                    style={{ fontSize: isMobile ? 11 : 14 }}
                  >
                    {player.name}
                  </h3>
                </div>
                <p
                  className="text-ktsa-accent/70 truncate mb-0.5"
                  style={{ fontSize: isMobile ? 9 : 11 }}
                >
                  {player.category}
                </p>
                <div className="flex items-center gap-1">
                  <Trophy
                    size={isMobile ? 10 : 12}
                    className="text-ktsa-accent"
                  />
                  <span
                    className="font-bold text-ktsa-accent"
                    style={{ fontSize: isMobile ? 10 : 12 }}
                  >
                    {player.points} pts
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Invisible click target when stack is closed */}
        {!opened && (
          <div
            className="absolute inset-0 z-30 cursor-pointer"
            onClick={() => setOpened(true)}
          />
        )}
      </div>

      {/* Mobile close button */}
      {opened && isMobile && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-2 rounded-full border border-ktsa-text text-ktsa-text text-xs font-bold"
          onClick={() => {
            setOpened(false);
            setHoveredIndex(null);
            setFocusedIndex(1);
          }}
        >
          Close
        </motion.button>
      )}
    </div>
  );
}
