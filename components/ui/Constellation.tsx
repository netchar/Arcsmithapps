import type { CSSProperties } from "react";
import styles from "./StarField.module.css";

interface ConstellationStar {
  cx: number;
  cy: number;
  r?: number;     // default 0.9
  peak?: number;  // peak opacity, default 0.85
}

interface ConstellationProps {
  /** viewBox "minX minY width height" in local units */
  viewBox: string;
  stars: ReadonlyArray<ConstellationStar>;
  /** Each tuple is a pair of star indices to connect with a straight line. */
  lines: ReadonlyArray<readonly [number, number]>;
  /** Accessible label. When provided, svg gets role="img" + aria-label. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

type TwinkleStyle = CSSProperties & Record<`--${string}`, string | number>;

export function Constellation({
  viewBox,
  stars,
  lines,
  label,
  className,
  style,
}: ConstellationProps) {
  const labelled = Boolean(label);
  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={style}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? label : undefined}
      aria-hidden={labelled ? undefined : true}
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke="#e8f0ec" strokeOpacity={0.12} strokeWidth={0.25} fill="none" strokeLinecap="round">
        {lines.map(([a, b], i) => (
          <line
            key={i}
            x1={stars[a]?.cx}
            y1={stars[a]?.cy}
            x2={stars[b]?.cx}
            y2={stars[b]?.cy}
          />
        ))}
      </g>
      {stars.map((star, i) => {
        const peak = star.peak ?? 0.85;
        const twinkleStyle: TwinkleStyle = {
          "--twinkle-low": peak * 0.4,
          "--twinkle-high": peak,
          "--twinkle-duration": `${3.2 + (i % 5) * 0.6}s`,
          "--twinkle-delay": `${((i * 0.47) % 3).toFixed(2)}s`,
          opacity: peak,
        };
        return (
          <circle
            key={i}
            cx={star.cx}
            cy={star.cy}
            r={star.r ?? 0.9}
            fill="#e8f0ec"
            className={styles.star}
            style={twinkleStyle}
          />
        );
      })}
    </svg>
  );
}
