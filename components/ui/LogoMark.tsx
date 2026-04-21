import type { CSSProperties } from "react";

interface LogoMarkProps {
  size?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

const VIEWBOX = "0 0 220 184";

// Main silhouette (inherits currentColor from className — text-accent,
// text-text-primary, etc. all work).
const MAIN =
  "M 124.5,100.5 C 124.198,104.79 124.864,108.79 126.5,112.5 C 127.406,119.468 128.073,126.468 128.5,133.5 C 127.945,137.012 128.612,140.012 130.5,142.5 C 136.206,139.653 141.539,136.32 146.5,132.5 C 164.426,111.919 165.926,90.2525 151,67.5 C 143.913,58.4153 134.746,52.5819 123.5,50 C 122.5,47.6667 121.5,45.3333 120.5,43 C 145.923,48.4228 161.423,63.9228 167,89.5 C 167.283,128.723 147.783,150.057 108.5,153.5 C 77.8451,151.341 59.0118,135.341 52,105.5 C 49.5369,77.9694 60.7036,58.136 85.5,46 C 89.3072,44.1192 93.3072,42.9526 97.5,42.5 C 97.0074,44.8056 96.6741,47.139 96.5,49.5 C 77.4285,54.0699 64.9285,65.7366 59,84.5 C 55.1174,102.982 59.6174,118.982 72.5,132.5 C 77.3794,137.109 83.046,140.442 89.5,142.5 C 89.5,141.167 89.5,139.833 89.5,138.5 C 90.2398,126.012 91.5731,113.679 93.5,101.5 C 94.9715,97.0808 95.6382,92.4141 95.5,87.5 C 98.1403,67.9824 102.807,48.9824 109.5,30.5 C 116.568,53.3758 121.568,76.7091 124.5,100.5 Z";

export function LogoMark({
  size = 24,
  title,
  className,
  style,
}: LogoMarkProps) {
  const labelled = Boolean(title);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEWBOX}
      width={size}
      className={className}
      style={style}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    >
      <path d={MAIN} />
    </svg>
  );
}
