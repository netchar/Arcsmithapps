import type { CSSProperties } from "react";

interface DistantPlanetProps {
  /** Diameter in px. Default 7. */
  size?: number;
  /** Outer glow radius in px (default 3x size). */
  glow?: number;
  /** Core color. Default warm cream. */
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export function DistantPlanet({
  size = 7,
  glow,
  color = "#d9c9a8",
  className,
  style,
}: DistantPlanetProps) {
  const glowRadius = glow ?? size * 3;
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, ${color}cc 35%, transparent 75%)`,
        boxShadow: `0 0 ${glowRadius}px ${color}55`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
