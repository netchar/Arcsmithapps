interface Star {
  top: number;      // percent 0-100
  left: number;     // percent 0-100
  opacity: number;  // 0.18-0.40
  scale: number;    // 0.75-1.15
}

const STARS: ReadonlyArray<Star> = [
  { top: 8,  left: 6,  opacity: 0.30, scale: 1.00 },
  { top: 14, left: 38, opacity: 0.22, scale: 0.85 },
  { top: 19, left: 72, opacity: 0.28, scale: 0.95 },
  { top: 23, left: 18, opacity: 0.18, scale: 0.80 },
  { top: 28, left: 54, opacity: 0.35, scale: 1.10 },
  { top: 32, left: 88, opacity: 0.24, scale: 0.90 },
  { top: 39, left: 10, opacity: 0.26, scale: 0.95 },
  { top: 44, left: 44, opacity: 0.20, scale: 0.85 },
  { top: 48, left: 78, opacity: 0.32, scale: 1.05 },
  { top: 55, left: 26, opacity: 0.23, scale: 0.90 },
  { top: 60, left: 62, opacity: 0.19, scale: 0.80 },
  { top: 66, left: 92, opacity: 0.28, scale: 1.00 },
  { top: 71, left: 16, opacity: 0.34, scale: 1.10 },
  { top: 76, left: 48, opacity: 0.21, scale: 0.85 },
  { top: 81, left: 80, opacity: 0.25, scale: 0.90 },
  { top: 85, left: 32, opacity: 0.30, scale: 1.00 },
  { top: 91, left: 66, opacity: 0.22, scale: 0.85 },
  { top: 95, left: 12, opacity: 0.27, scale: 0.95 },
];

interface StarFieldProps {
  /**
   * Cap on number of stars to render. `count` greater than the hardcoded
   * constellation is clamped down — the constellation is hand-tuned and
   * not expanded procedurally.
   */
  count?: number;
  className?: string;
}

export function StarField({ count = 18, className }: StarFieldProps) {
  const cap = Math.min(count, STARS.length);
  const stars = STARS.slice(0, cap);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    >
      {stars.map((star, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: "2.5px",
            height: "2.5px",
            borderRadius: "50%",
            background: "#e8f0ec",
            opacity: star.opacity,
            transform: `scale(${star.scale})`,
            boxShadow: "0 0 4px rgba(232, 240, 236, 0.7)",
          }}
        />
      ))}
    </div>
  );
}
