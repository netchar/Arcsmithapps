interface BrandMarkProps {
  size?: number;
  className?: string;
  title?: string;
}

/**
 * ArcSmith brand mark — Sierpinski Fragment.
 *
 * A triangle with its inverted center removed (first iteration of the Sierpinski
 * fractal). Self-similar geometry: the rule contains itself. A fitting signature
 * for software — which is, after all, recursion made useful.
 *
 * Uses `currentColor` so it can be tinted via Tailwind's text color utilities,
 * and `fill-rule="evenodd"` so the inner triangle becomes a true transparent hole
 * that picks up whatever background sits behind it.
 */
export function BrandMark({ size = 24, className, title }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M 50 14 L 82 78 L 18 78 Z M 50 46 L 66 78 L 34 78 Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
