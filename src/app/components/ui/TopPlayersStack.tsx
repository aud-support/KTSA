import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const topPlayers = [
  {
    rank: 1,
    name: "Arjun Sharma",
    points: 2850,
    image:
      "https://instagram.fblr22-1.fna.fbcdn.net/v/t51.71878-15/519003066_4208693196065850_5771027984412155748_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=108&ig_cache_key=MzY3NjcyODQ1MTYxNzAzODc3Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=IVgdlY8TlDIQ7kNvwE6TktL&_nc_oc=AdqteSUkfCrBW0plTnyZK4aQYV_kiifxjNZcO-YSbUgTk-F_Irfco4H5A_Sw5M8wC6bSlotq1flyJMuzJRXTGB1f&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fblr22-1.fna&_nc_gid=YoZ1rQkgT1Ar7wj0nn9ziA&_nc_ss=7a32e&oh=00_Af1rU73tJyk1wGXV_g-XxZaM8a-FmM3E4SCqSrGu74KokA&oe=69D2C260",
  },
  {
    rank: 2,
    name: "Priya Menon",
    points: 2720,
    image:
      "https://instagram.fblr22-2.fna.fbcdn.net/v/t51.71878-15/658175772_1241326494648751_4780876928066013296_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=107&ig_cache_key=Mzg2NDk5OTkyMTIwMDE5MzcyMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=8pNnJ1Hz5WcQ7kNvwGDDKYa&_nc_oc=Adrf75F61fbx9FljevcKorQivEGZNUpp66_0D9DwCyRE5CdMfBZx3p68EHAGvtMH40j5Mg69vn1AzS4QA1339BTC&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fblr22-2.fna&_nc_gid=_-zPTf9oeHYNQHWP3PXWig&_nc_ss=7a32e&oh=00_Af2-vgaM2M1_DE8tzbri2OnWTAI1y6jrdkKKrq_FQlWDbw&oe=69DED653",
  },
  {
    rank: 3,
    name: "Rahul Patel",
    points: 2680,
    image:
      "https://instagram.fblr22-1.fna.fbcdn.net/v/t51.71878-15/657442736_936027782555192_1960907205301419746_n.jpg?stp=dst-jpegr_e15_tt6&_nc_cat=106&ig_cache_key=Mzg2NDA0ODk4MDYzNjkwOTY2MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2Lmhkci5DMyJ9&_nc_ohc=SXu3EQJCGpIQ7kNvwE3w9sC&_nc_oc=AdpOftgc4LAPnqmUvHwMezKbTismGWyk9Fl5yFBQS0sp_B1l3Y083WOkX-ynfNLMPWds2kVekLfStkFVlLJld7PG&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fblr22-1.fna&_nc_gid=j2DwgiP-1TZsuvrcCL9WTA&_nc_ss=7a32e&oh=00_Af0W_9bsg2hl3QgcoV4XuhT5HJrY6_3_fQcbCJ_wA0PG3g&oe=69DED2EC",
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

              {/* Rank #1 badge */}
              {player.rank === 1 && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Trophy size={14} className="text-yellow-900" />
                </div>
              )}

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
          className="px-6 py-2 rounded-full border border-ktsa-accent/40 text-ktsa-accent text-xs font-bold hover:bg-ktsa-accent/10 transition-colors"
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
