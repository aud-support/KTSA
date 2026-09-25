/**
 * DoublesAvatar
 *
 * Renders a compact team avatar for doubles ranking entries.
 * Two circular photos overlap side-by-side. Each slot falls back to
 * the provided `defaultSrc` (gender/doubles static asset) when the
 * player has no profile picture or when the remote URL fails to load.
 *
 * Usage (table row — small):
 *   <DoublesAvatar p1Url={...} p2Url={...} defaultSrc={doublePlayer} size={28} />
 *
 * Usage (podium card — large, fills its container):
 *   <DoublesAvatar p1Url={...} p2Url={...} defaultSrc={doublePlayer} fill />
 */

interface DoublesAvatarProps {
  p1Url: string | null | undefined;
  p2Url: string | null | undefined;
  /** Fallback image used for any slot that has no real picture */
  defaultSrc: string;
  /** Pixel size for inline/compact mode (used in table rows, WinnerCard) */
  size?: number;
  /** When true, the component expands to fill its parent container (podium cards) */
  fill?: boolean;
  className?: string;
  alt1?: string;
  alt2?: string;
}

function AvatarSlot({
  src,
  fallback,
  alt,
  style,
  className = "",
}: {
  src: string;
  fallback: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <img
      src={src || fallback}
      alt={alt}
      style={style}
      className={className}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback;
        }
      }}
    />
  );
}

export function DoublesAvatar({
  p1Url,
  p2Url,
  defaultSrc,
  size = 28,
  fill = false,
  className = "",
  alt1 = "Player 1",
  alt2 = "Player 2",
}: DoublesAvatarProps) {
  const src1 = p1Url || defaultSrc;
  const src2 = p2Url || defaultSrc;

  if (fill) {
    // ── Fill mode: used inside podium / cube face cards ──────────────────────
    // Splits the container into two halves with a thin divider line.
    return (
      <div className={`absolute inset-0 flex ${className}`}>
        <AvatarSlot
          src={src1}
          fallback={defaultSrc}
          alt={alt1}
          className="w-1/2 h-full object-cover"
        />
        {/* subtle centre divider */}
        <div className="w-px bg-white/20 flex-shrink-0" />
        <AvatarSlot
          src={src2}
          fallback={defaultSrc}
          alt={alt2}
          className="w-1/2 h-full object-cover"
        />
      </div>
    );
  }

  // ── Compact mode: used in table rows and WinnerCard ──────────────────────
  // Two circles, second one overlaps the first by 1/3 of its width.
  const overlap = Math.round(size * 0.33);
  const totalWidth = size * 2 - overlap;

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: totalWidth, height: size }}
    >
      {/* Player 1 — left / back */}
      <AvatarSlot
        src={src1}
        fallback={defaultSrc}
        alt={alt1}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1.5px solid rgba(255,255,255,0.25)",
          zIndex: 1,
        }}
      />
      {/* Player 2 — right / front */}
      <AvatarSlot
        src={src2}
        fallback={defaultSrc}
        alt={alt2}
        style={{
          position: "absolute",
          left: size - overlap,
          top: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1.5px solid rgba(255,255,255,0.25)",
          zIndex: 2,
        }}
      />
    </div>
  );
}
