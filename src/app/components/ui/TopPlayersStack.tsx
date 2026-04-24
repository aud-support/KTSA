import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import palyer1 from "../../../assets/male_avatar.jfif";
import palyer2 from "../../../assets/female_avatar.jfif";
import palyer3 from "../../../assets/doubles_avatar.jfif";

const topPlayers = [
  {
    rank: 1,
    name: "Nadeem",
    points: 140,
    image: palyer1,
  },
  {
    rank: 2,
    name: "Akshatha",
    points: 40,
    image: palyer2,
  },
  {
    rank: 3,
    name: "Manoj & Saravanan",
    points: 120,
    image: palyer3,
  },
];

// Display order: rank2 left, rank1 center, rank3 right
const displayOrder = [1, 0, 2];

// Stacked rotations (closed state)
const stackedRotations = [-10, 0, 10];
const stackedTranslateX = [-8, 0, 8];

export function TopPlayersStack() {
  const [opened, setOpened] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(1);
  const [isMobile, setIsMobile] = useState(false);

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

    // Always keep all 3 spread at fixed positions regardless of focus
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

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Hint text */}
      {/* <p className="text-xs text-ktsa-text/40 font-semibold tracking-wide">
        {opened
          ? isMobile
            ? "Tap a card to focus"
            : "Hover a card to highlight"
          : isMobile
            ? "Tap to reveal players"
            : "Hover to reveal players"}
      </p> */}

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
          const player = topPlayers[playerIdx];
          const isHovered = !isMobile && hoveredIndex === displayIdx;
          const isFocused = isMobile && focusedIndex === displayIdx && opened;

          const rotate = opened ? 0 : stackedRotations[displayIdx];
          const translateX = getTranslateX(displayIdx);
          const translateY = isHovered || isFocused ? -18 : 0;
          const zIndex = getZIndex(displayIdx);

          const medalEmoji =
            player.rank === 1 ? "🥇" : player.rank === 2 ? "🥇" : "🥇";

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
                  setFocusedIndex(focusedIndex === displayIdx ? 1 : displayIdx);
                }
              }}
            >
              {/* Image */}
              <ImageWithFallback
                src={player.image}
                alt={player.name}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Player info */}
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

        {/* Hint overlay — only when closed, clickable */}
        {!opened && (
          <div
            className="absolute inset-0 flex items-end justify-center pb-3 z-30 cursor-pointer"
            onClick={() => setOpened(true)}
          >
            {/* <div className="bg-ktsa-bg/75 backdrop-blur-sm px-3 py-1 rounded-full border border-ktsa-accent/40">
              <p className="text-[10px] font-bold text-ktsa-accent">
                {isMobile ? "Tap to reveal" : "Hover to reveal"}
              </p>
            </div> */}
          </div>
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
