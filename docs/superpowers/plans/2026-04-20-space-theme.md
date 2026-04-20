# Space Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a restrained cosmic atmosphere to arcsmithapps.com — a static starfield behind the home hero plus a one-shot session-scoped entrance animation for the brand mark based on `docs/logo3.svg`.

**Architecture:** Three new client-safe UI primitives (`LogoMark`, `StarField`, `AnimatedBrandMark`) plugged into two existing components (`Header`, `FeaturedHero`). No new npm dependencies — `framer-motion` is already in the bundle. Animation honors `prefers-reduced-motion` and runs at most once per browser tab session (sessionStorage flag). The old PNG-based `BrandMark` is deleted along with its asset.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind v4 · framer-motion 12 · inline SVG

**Spec:** `docs/superpowers/specs/2026-04-20-space-theme-design.md`

**Verification policy:** This plan uses **manual verification only** (no automated tests — repo has no test stack). Every task ends with a specific manual check in addition to `npm run build`.

---

## File Structure

### New files
| Path | Responsibility |
|------|----------------|
| `components/ui/LogoMark.tsx` | Inline SVG of the logo. Static, server-safe. |
| `components/ui/StarField.tsx` | Decorative starfield for hero. Static, server-safe. |
| `components/ui/AnimatedBrandMark.tsx` | Client component. One-shot stroke-draw entrance, reduced-motion aware. |
| `scripts/generate-favicon.sh` | One-shot reproducibility script for `app/favicon.ico`. |

### Modified files
| Path | Change |
|------|--------|
| `components/layout/Header.tsx` | Swap `BrandMark` → `AnimatedBrandMark` |
| `components/layout/Footer.tsx` | Swap `BrandMark` → `AnimatedBrandMark` |
| `components/sections/FeaturedHero.tsx` | Render `<StarField />` between the two radial-glow layers |
| `app/icon.svg` | Overwritten with optimized `logo3.svg` (hardcoded `#e8f0ec`) |
| `app/favicon.ico` | Regenerated from `logo3.svg` via `scripts/generate-favicon.sh` |

### Deleted files
| Path | Reason |
|------|--------|
| `components/ui/BrandMark.tsx` | Superseded by `AnimatedBrandMark` |
| `public/brand/mark.png` | Only consumed by `BrandMark` — no consumers left |

---

## Task 1: LogoMark component

**Files:**
- Create: `components/ui/LogoMark.tsx`

- [ ] **Step 1: Write the component**

```tsx
// components/ui/LogoMark.tsx
import type { CSSProperties } from "react";

interface LogoMarkProps {
  size?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
  pathIds?: boolean;
}

const VIEWBOX = "0 0 816 832";

const PATHS = {
  spark:
    "M336.056091,547.063843 C325.595367,557.608826 314.429108,566.779358 302.875183,575.503296 C291.482056,584.105896 279.330597,591.555237 266.518951,598.707703 C271.927948,605.439819 278.254364,610.030212 284.425018,614.716309 C306.182434,631.239319 330.301300,642.734070 357.172638,648.165161 C367.436005,650.239502 377.880188,650.917175 388.293945,651.541382 C392.191589,651.774902 393.557617,652.901001 393.409729,656.791504 C393.163086,663.281128 393.154663,669.794189 393.408051,676.283203 C393.562256,680.233154 392.162231,681.472412 388.234467,681.415039 C367.138824,681.106812 346.716858,677.224670 326.671692,670.787170 C293.638885,660.178650 265.328278,642.163818 241.738419,616.821228 C237.526749,612.296570 233.441422,611.418030 227.297180,611.871948 C210.848755,613.087280 195.750717,608.193115 182.731232,597.911560 C178.402100,594.492859 173.426529,591.419556 170.986755,585.101440 C176.859528,584.469788 182.411087,584.318298 187.845016,583.234497 C216.020584,577.614746 241.299576,565.234924 265.468201,550.236938 C296.822754,530.779724 324.279816,506.552490 349.010101,479.430115 C383.751190,441.328583 411.679810,398.463196 434.122284,352.042999 C445.501343,328.506561 455.535339,304.420471 463.530670,279.506836 C464.785431,275.596863 466.108582,271.682007 468.468689,268.014893 C471.054749,269.441681 470.413757,271.669739 470.209290,273.411713 C465.998962,309.282623 458.393250,344.310760 446.026459,378.377380 C435.534943,407.278198 422.356598,434.814667 406.323578,460.906647 C391.246857,485.442322 373.798157,508.284485 354.019897,529.365967 C348.318512,535.442993 342.393188,541.179871 336.056091,547.063843 Z",
  orbit:
    "M598.661499,463.845581 C598.826538,454.925751 599.539062,446.562134 598.961914,438.009766 C597.746338,419.999268 594.526855,402.485748 589.172791,385.341003 C587.805298,380.962189 587.913757,378.143921 592.102783,375.320404 C599.309875,370.462585 605.035156,364.003937 609.226562,354.849518 C613.766418,364.722107 616.967773,373.522583 619.742432,382.513306 C626.512146,404.449341 629.579224,427.009186 629.085938,449.817627 C628.315918,485.416229 620.974976,519.711548 604.461914,551.556091 C583.091125,592.768616 552.162537,625.057434 512.321716,648.864136 C509.509430,650.544678 504.710449,650.787598 504.208069,654.012390 C503.540649,658.296570 502.535828,662.906677 503.726196,667.342468 C504.588226,670.554749 504.192139,673.591492 503.330658,676.679138 C501.580536,682.951965 498.280334,685.066528 491.344177,684.306763 C486.123932,683.734924 482.718750,679.816040 482.686798,673.986755 C482.613922,660.685547 482.701416,647.383484 482.647644,634.082153 C482.438080,582.266296 482.146149,530.450684 482.068085,478.634766 C482.061646,474.370850 480.630920,472.088287 476.967346,470.066223 C463.709717,462.748810 459.782928,450.723297 461.802521,436.597473 C463.650879,423.669647 471.682312,415.431396 483.966431,411.541534 C499.368134,406.664551 516.330811,414.588379 522.367737,429.178070 C529.192383,445.671539 523.214111,463.344269 507.959961,470.959320 C504.902863,472.485474 504.092194,474.386322 503.975922,477.554443 C503.169220,499.535339 503.370453,521.521973 503.331818,543.508057 C503.323914,547.997742 504.038635,552.375610 504.740479,557.180847 C514.739807,554.124756 522.177368,547.715027 529.269836,541.040466 C542.708496,528.393677 549.479553,512.141052 551.497375,494.240387 C556.005249,454.248505 552.768494,414.056366 553.665466,373.962341 C553.722900,371.394653 552.606506,370.208038 550.252686,369.223938 C534.808289,362.766754 526.495361,347.626556 528.738892,330.421082 C530.636108,315.871796 542.860046,303.106812 558.045166,300.899597 C581.926392,297.428436 601.133972,315.186432 599.512634,338.688721 C598.559998,352.497986 591.324280,362.002380 579.601440,368.225342 C575.813904,370.235931 574.922119,372.536407 574.948853,376.396515 C575.162231,407.224854 575.656128,438.061279 575.166077,468.880920 C574.841064,489.317047 572.789856,509.605042 563.773438,528.590881 C552.224060,552.910400 534.187683,570.117737 509.082672,579.668213 C504.541473,581.395813 503.154297,583.556763 503.221924,588.254822 C503.362946,598.053284 503.642456,607.821472 504.648956,618.335571 C510.570129,614.836609 515.939697,611.408997 520.934448,607.351624 C556.160889,578.736328 581.047485,543.208374 592.823914,499.087067 C595.855286,487.729797 597.817383,476.091766 598.661499,463.845581 M551.710510,324.208191 C546.937927,329.382019 545.286438,335.286163 547.786316,342.018585 C550.289978,348.761200 555.652893,352.071594 562.366516,353.374481 C571.927917,355.229950 583.381653,343.536377 581.305908,334.078247 C578.302551,320.393250 563.867859,313.079041 551.710510,324.208191 M500.593506,429.809387 C495.967499,426.755554 491.272491,426.967194 486.507050,429.476501 C480.304779,432.742462 477.175354,440.917297 479.690125,447.309113 C482.411102,454.225128 489.918274,458.804779 496.715576,456.724487 C502.625153,454.915955 506.082092,450.849121 507.412781,445.331726 C508.904938,439.144714 506.560211,433.915558 500.593506,429.809387 Z",
  planet:
    "M541.350830,250.947784 C537.321350,267.439575 526.440979,278.288086 513.886475,288.435974 C510.810883,284.189087 510.190948,279.665894 508.886871,275.492493 C505.918182,265.991943 503.191101,256.406677 500.716797,246.765747 C499.800995,243.197495 498.283936,243.136597 495.380066,244.267731 C482.512421,249.279968 469.245880,252.994858 455.733490,255.777344 C452.415680,256.460541 449.071228,257.833435 444.811737,256.783966 C449.244904,242.989456 456.572662,230.724854 462.236328,216.774490 C444.568146,215.105133 427.144714,213.458878 410.021362,211.841003 C409.222473,209.654144 410.215729,208.685181 411.059021,207.662796 C419.969635,196.859741 429.140808,186.400055 441.981140,179.915298 C450.575500,175.574890 459.584229,172.976624 469.168152,172.744904 C472.594299,172.662079 474.108826,171.297012 475.319336,168.264450 C491.851227,126.848862 522.727234,103.024231 566.073120,94.621559 C568.505615,94.150024 570.982727,93.908859 573.438599,93.557190 C579.386841,92.705421 580.267639,93.227333 581.268250,99.090118 C587.099609,133.258881 580.499756,164.712631 560.655701,193.287704 C557.037537,198.497864 553.510559,203.815918 548.415283,207.666656 C541.876221,212.608566 540.465149,218.738708 542.473206,226.422607 C544.579285,234.481903 543.301514,242.562241 541.350830,250.947784 M536.794067,131.227356 C528.092102,134.766510 524.346252,141.928436 527.116882,149.729874 C529.806763,157.303879 537.707581,161.521210 545.042542,159.298187 C552.141296,157.146774 557.035217,149.074081 555.486877,142.069733 C553.796143,134.420715 545.683167,129.408585 536.794067,131.227356 Z",
  drop:
    "M348.556335,453.528107 C339.015717,463.531921 330.315796,473.812683 320.699799,483.287354 C303.824310,499.914825 285.768768,515.051392 266.258545,528.448669 C242.113205,545.028992 216.562958,558.798889 187.863266,565.735596 C175.728592,568.668579 163.461472,568.718689 151.570648,564.122070 C135.051819,557.736328 127.164162,540.700623 129.258484,523.774658 C131.503998,505.626892 140.188828,490.653809 150.957031,475.769592 C152.028656,478.803925 150.689880,480.822571 150.213760,482.912689 C148.524292,490.329468 146.908112,497.551270 147.993668,505.447693 C150.412140,523.040100 167.628082,529.231506 181.638260,527.262756 C203.634811,524.171814 223.197235,514.928345 242.345871,504.267181 C267.374115,490.332489 289.975433,473.076630 310.798737,453.646912 C337.982758,428.282257 361.815338,399.860779 383.542053,369.682739 C402.618195,343.186310 419.740265,315.476349 435.458344,286.873505 C438.580261,281.192444 442.164185,275.761383 445.637573,270.279968 C446.582611,268.788635 447.718781,267.320740 451.034454,265.972717 C429.330780,336.180817 395.479034,398.192993 348.556335,453.528107 Z",
  crescent:
    "M302.043945,303.074646 C273.610901,319.228760 250.523346,340.517639 232.813751,367.680634 C217.763641,390.764526 208.287872,415.780609 205.264435,443.204773 C203.118576,462.668732 203.810501,481.999451 208.651657,501.011627 C209.717865,505.198883 208.400024,506.740570 204.852493,507.985992 C197.146240,510.691498 189.141022,512.152527 181.238617,514.057434 C177.932220,514.854370 176.550751,513.353455 176.120041,510.454742 C174.928024,502.432129 173.312134,494.432617 172.758087,486.362579 C171.046799,461.437042 173.810638,436.941345 181.783707,413.222626 C189.636765,389.860870 201.323975,368.608521 217.033936,349.446869 C225.944382,338.578705 235.522400,328.489166 246.214539,319.482330 C264.557281,304.030792 285.116058,292.310791 307.500854,283.648499 C322.930237,277.677734 338.928711,274.102112 355.207916,271.961395 C367.705505,270.317932 380.310089,269.960754 392.979462,271.414459 C399.550964,272.168427 406.178253,272.522247 412.716217,273.677612 C413.889343,273.884918 415.038513,274.030029 415.642700,275.658661 C414.291992,278.190796 411.732727,277.337708 409.644806,277.301331 C384.194458,276.858246 359.307709,280.262787 335.171722,288.426666 C323.826935,292.263947 312.741821,296.804352 302.043945,303.074646 Z",
  core:
    "M404.664124,644.999878 C404.663879,618.515259 404.610779,592.530334 404.725189,566.546204 C404.740845,562.988586 403.718262,560.853943 400.473816,558.988708 C388.279785,551.978394 384.438873,539.102478 387.979462,525.292053 C390.696594,514.693542 403.684265,505.492035 415.606506,506.026642 C429.812256,506.663605 439.384613,514.231506 442.843262,526.859741 C446.367004,539.726013 441.546844,552.091187 430.057678,558.988037 C427.185150,560.712463 426.277527,562.632324 426.288727,565.788635 C426.380768,591.772949 426.333466,617.757751 426.362640,643.742371 C426.368347,648.836731 427.117065,649.323669 432.369873,648.212646 C443.763245,645.802917 454.947937,642.692017 465.799255,638.427429 C467.317230,637.830872 468.910828,637.426758 470.344330,636.973083 C471.860809,638.188293 471.306000,639.622925 471.319611,640.857422 C471.387573,647.019775 471.235352,653.186279 471.394135,659.345337 C471.616486,667.971741 471.763855,668.159180 463.455048,670.748596 C453.161163,673.956665 442.759583,676.882019 432.045319,678.317749 C427.790344,678.887939 426.102020,680.579712 426.227814,685.056946 C426.527161,695.708984 426.390411,706.375366 426.320557,717.035217 C426.273071,724.284485 421.862488,728.473633 414.667480,728.335327 C408.288116,728.212585 405.080414,724.365112 404.721008,715.956787 C404.507751,710.968689 404.666504,705.964417 404.665863,700.967407 C404.663513,682.478271 404.664459,663.989075 404.664124,644.999878 M421.816498,544.443298 C427.684296,539.472656 428.887543,532.939148 424.963165,527.357727 C421.511047,522.448181 414.334534,520.940796 409.463715,524.102356 C403.919250,527.701172 401.961548,534.321228 404.881012,539.598999 C408.486694,546.117310 414.160065,547.926086 421.816498,544.443298 Z",
} as const;

export function LogoMark({
  size = 24,
  title,
  className,
  style,
  pathIds = false,
}: LogoMarkProps) {
  const labelled = Boolean(title);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEWBOX}
      width={size}
      height={size}
      className={className}
      style={style}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      fill="currentColor"
    >
      <path id={pathIds ? "orbit" : undefined} d={PATHS.orbit} />
      <path id={pathIds ? "spark" : undefined} d={PATHS.spark} />
      <path id={pathIds ? "planet" : undefined} d={PATHS.planet} />
      <path id={pathIds ? "drop" : undefined} d={PATHS.drop} />
      <path id={pathIds ? "crescent" : undefined} d={PATHS.crescent} />
      <path id={pathIds ? "core" : undefined} d={PATHS.core} />
    </svg>
  );
}

export { PATHS as LOGO_PATHS };
```

- [ ] **Step 2: Verify types and lint**

Run: `npm run build`
Expected: success, no new type errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/LogoMark.tsx
git commit -m "feat: Add LogoMark inline SVG component

Ports docs/logo3.svg into a React component with currentColor fill,
optional a11y title, and opt-in path ids for animation targeting."
```

---

## Task 2: StarField component

**Files:**
- Create: `components/ui/StarField.tsx`

- [ ] **Step 1: Write the component**

```tsx
// components/ui/StarField.tsx
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
            width: "1.5px",
            height: "1.5px",
            borderRadius: "50%",
            background: "#e8f0ec",
            opacity: star.opacity,
            transform: `scale(${star.scale})`,
            boxShadow: "0 0 2px rgba(232, 240, 236, 0.4)",
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add components/ui/StarField.tsx
git commit -m "feat: Add decorative StarField component

Hand-tuned 18-point constellation for ambient hero backgrounds.
Pure DOM, aria-hidden, SSR-safe (no runtime randomness)."
```

---

## Task 3: AnimatedBrandMark component

**Files:**
- Create: `components/ui/AnimatedBrandMark.tsx`

- [ ] **Step 1: Write the component**

```tsx
// components/ui/AnimatedBrandMark.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { LogoMark, LOGO_PATHS } from "@/components/ui/LogoMark";

const SESSION_KEY = "asa-mark-played";
const EASE = [0.22, 1, 0.36, 1] as const;

interface AnimatedBrandMarkProps {
  size?: number;
  title?: string;
  className?: string;
}

type Phase = "static" | "animate";

function resolvePhase(): Phase {
  if (typeof window === "undefined") return "static";
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return "static";
  } catch {
    // Safari private mode etc. — fall through and play
  }
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return "static";
  }
  return "animate";
}

function markPlayed() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ignore storage failures
  }
}

const strokeVariants: Variants = {
  hidden: { pathLength: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    transition: { duration: 0.5, delay, ease: EASE },
  }),
};

const dotVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, delay, ease: EASE },
  }),
};

export function AnimatedBrandMark({
  size = 24,
  title,
  className,
}: AnimatedBrandMarkProps) {
  const [phase, setPhase] = useState<Phase>("static");
  const [sparkDone, setSparkDone] = useState(false);
  const [orbitDone, setOrbitDone] = useState(false);

  useEffect(() => {
    setPhase(resolvePhase());
  }, []);

  if (phase === "static") {
    return <LogoMark size={size} title={title} className={className} />;
  }

  const labelled = Boolean(title);
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 816 832"
      width={size}
      height={size}
      className={className}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      fill="currentColor"
      onAnimationComplete={markPlayed}
    >
      {/* spark: stroke-draw, swap to fill at t≈500ms */}
      <motion.path
        d={LOGO_PATHS.spark}
        custom={0}
        initial="hidden"
        animate="visible"
        variants={strokeVariants}
        onAnimationComplete={() => setSparkDone(true)}
        style={{
          fill: sparkDone ? "currentColor" : "transparent",
          stroke: sparkDone ? "none" : "currentColor",
          strokeWidth: sparkDone ? 0 : 2,
        }}
      />
      {/* orbit: stroke-draw, swap to fill at t≈550ms */}
      <motion.path
        d={LOGO_PATHS.orbit}
        custom={0.15}
        initial="hidden"
        animate="visible"
        variants={strokeVariants}
        onAnimationComplete={() => setOrbitDone(true)}
        style={{
          fill: orbitDone ? "currentColor" : "transparent",
          stroke: orbitDone ? "none" : "currentColor",
          strokeWidth: orbitDone ? 0 : 2,
        }}
      />
      {/* crescent + drop + planet + core: fade/scale in after strokes land */}
      <motion.path
        d={LOGO_PATHS.planet}
        custom={0.45}
        initial="hidden"
        animate="visible"
        variants={dotVariants}
      />
      <motion.path
        d={LOGO_PATHS.drop}
        custom={0.45}
        initial="hidden"
        animate="visible"
        variants={dotVariants}
      />
      <motion.path
        d={LOGO_PATHS.crescent}
        custom={0.45}
        initial="hidden"
        animate="visible"
        variants={dotVariants}
      />
      <motion.path
        d={LOGO_PATHS.core}
        custom={0.45}
        initial="hidden"
        animate="visible"
        variants={dotVariants}
      />
    </motion.svg>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success. No hydration warnings in build log.

- [ ] **Step 3: Commit**

```bash
git add components/ui/AnimatedBrandMark.tsx
git commit -m "feat: Add AnimatedBrandMark with one-shot entrance

Stroke-draws the logo on first load of a browser session, then
renders static for subsequent renders in the same tab. Respects
prefers-reduced-motion. Per-path fill/stroke swap avoids the
outline-to-filled flash at global animation end."
```

---

## Task 4: Wire AnimatedBrandMark into Header and Footer

**Files:**
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/Footer.tsx`

**Context:** `BrandMark` is consumed by BOTH `Header.tsx:4,30` and `Footer.tsx:4,20`. Both must be migrated in the same commit or Task 8's deletion step will fail. The `AnimatedBrandMark` sessionStorage flag is global — whichever of Header/Footer mounts first plays the animation; the other renders static. On a typical page load the Header mounts first (higher in the tree), so the Footer logo is static from the jump. This is desired.

- [ ] **Step 1: Update `Header.tsx`**

Replace the import:
```tsx
import { BrandMark } from "@/components/ui/BrandMark";
```
with:
```tsx
import { AnimatedBrandMark } from "@/components/ui/AnimatedBrandMark";
```

Replace the JSX usage:
```tsx
<BrandMark size={22} className="text-accent" title="ArcSmith" />
```
with:
```tsx
<AnimatedBrandMark size={22} className="text-accent" title="ArcSmith" />
```

- [ ] **Step 2: Update `Footer.tsx`**

Exact same replacement as Header: swap the import and the single JSX usage.

- [ ] **Step 3: Confirm the migration is complete**

Run:
```bash
grep -rn "BrandMark" --include="*.ts" --include="*.tsx" components app lib
```
Expected: only the new `AnimatedBrandMark` references in Header, Footer, and the file `components/ui/AnimatedBrandMark.tsx` (which imports `LogoMark`, not `BrandMark`). No reference to `"@/components/ui/BrandMark"` or a bare `<BrandMark` JSX element should remain.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: success, no type errors. (`components/ui/BrandMark.tsx` is still on disk — its removal is Task 8.)

- [ ] **Step 5: Manual check**

Run: `npm run dev`, open a fresh incognito window.

Verify:
- [ ] Header logo stroke-draws in ~0.7s on first visit
- [ ] Footer logo appears **static** at the same moment (no second animation — sessionStorage flag was set by Header's completion)
- [ ] Cmd-R reload: both logos static from frame 1
- [ ] Close incognito, reopen → animation plays on Header again, Footer static
- [ ] DevTools → Rendering → `prefers-reduced-motion: reduce` → reload → both static, no animation anywhere

- [ ] **Step 6: Commit**

```bash
git add components/layout/Header.tsx components/layout/Footer.tsx
git commit -m "feat: Use AnimatedBrandMark in site header and footer

sessionStorage dedup ensures only the first-mounted instance plays
the entrance animation; the other renders static — so navigation
within a session is never noisy."
```

---

## Task 5: Wire StarField into FeaturedHero

**Files:**
- Modify: `components/sections/FeaturedHero.tsx`

- [ ] **Step 1: Add the import**

At the top of `components/sections/FeaturedHero.tsx`, after the existing imports, add:
```tsx
import { StarField } from "@/components/ui/StarField";
```

- [ ] **Step 2: Insert StarField between glow layers**

Locate the existing block:
```tsx
<div className="pointer-events-none absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.12)_0%,transparent_70%)]" />
<div className="pointer-events-none absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.08)_0%,transparent_70%)]" />
```

Insert `<StarField />` between the two `<div>` elements so the layer order becomes: `gradient → glow#1 → StarField → glow#2 → content`.

Result:
```tsx
<div className="pointer-events-none absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.12)_0%,transparent_70%)]" />
<StarField />
<div className="pointer-events-none absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.08)_0%,transparent_70%)]" />
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, load home page.

Verify:
- [ ] Hero block shows faint stars, visible but not drawing attention
- [ ] Navigate to `/<any-app-slug>` — no stars anywhere
- [ ] Navigate to `/about` — no stars anywhere
- [ ] Stars do not sit directly on top of the h1 or body copy

- [ ] **Step 5: Commit**

```bash
git add components/sections/FeaturedHero.tsx
git commit -m "feat: Add ambient starfield to home FeaturedHero"
```

---

## Task 6: Replace app/icon.svg

**Files:**
- Modify: `app/icon.svg`

- [ ] **Step 1: Overwrite `app/icon.svg`**

Write the following content to `app/icon.svg` (replaces whatever is there). All six paths from the source art are preserved. `fill="#e8f0ec"` is hardcoded on the root — this is a favicon asset, not a themed component.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 816 832" fill="#e8f0ec">
<path d="M598.661499,463.845581 C598.826538,454.925751 599.539062,446.562134 598.961914,438.009766 C597.746338,419.999268 594.526855,402.485748 589.172791,385.341003 C587.805298,380.962189 587.913757,378.143921 592.102783,375.320404 C599.309875,370.462585 605.035156,364.003937 609.226562,354.849518 C613.766418,364.722107 616.967773,373.522583 619.742432,382.513306 C626.512146,404.449341 629.579224,427.009186 629.085938,449.817627 C628.315918,485.416229 620.974976,519.711548 604.461914,551.556091 C583.091125,592.768616 552.162537,625.057434 512.321716,648.864136 C509.509430,650.544678 504.710449,650.787598 504.208069,654.012390 C503.540649,658.296570 502.535828,662.906677 503.726196,667.342468 C504.588226,670.554749 504.192139,673.591492 503.330658,676.679138 C501.580536,682.951965 498.280334,685.066528 491.344177,684.306763 C486.123932,683.734924 482.718750,679.816040 482.686798,673.986755 C482.613922,660.685547 482.701416,647.383484 482.647644,634.082153 C482.438080,582.266296 482.146149,530.450684 482.068085,478.634766 C482.061646,474.370850 480.630920,472.088287 476.967346,470.066223 C463.709717,462.748810 459.782928,450.723297 461.802521,436.597473 C463.650879,423.669647 471.682312,415.431396 483.966431,411.541534 C499.368134,406.664551 516.330811,414.588379 522.367737,429.178070 C529.192383,445.671539 523.214111,463.344269 507.959961,470.959320 C504.902863,472.485474 504.092194,474.386322 503.975922,477.554443 C503.169220,499.535339 503.370453,521.521973 503.331818,543.508057 C503.323914,547.997742 504.038635,552.375610 504.740479,557.180847 C514.739807,554.124756 522.177368,547.715027 529.269836,541.040466 C542.708496,528.393677 549.479553,512.141052 551.497375,494.240387 C556.005249,454.248505 552.768494,414.056366 553.665466,373.962341 C553.722900,371.394653 552.606506,370.208038 550.252686,369.223938 C534.808289,362.766754 526.495361,347.626556 528.738892,330.421082 C530.636108,315.871796 542.860046,303.106812 558.045166,300.899597 C581.926392,297.428436 601.133972,315.186432 599.512634,338.688721 C598.559998,352.497986 591.324280,362.002380 579.601440,368.225342 C575.813904,370.235931 574.922119,372.536407 574.948853,376.396515 C575.162231,407.224854 575.656128,438.061279 575.166077,468.880920 C574.841064,489.317047 572.789856,509.605042 563.773438,528.590881 C552.224060,552.910400 534.187683,570.117737 509.082672,579.668213 C504.541473,581.395813 503.154297,583.556763 503.221924,588.254822 C503.362946,598.053284 503.642456,607.821472 504.648956,618.335571 C510.570129,614.836609 515.939697,611.408997 520.934448,607.351624 C556.160889,578.736328 581.047485,543.208374 592.823914,499.087067 C595.855286,487.729797 597.817383,476.091766 598.661499,463.845581 M551.710510,324.208191 C546.937927,329.382019 545.286438,335.286163 547.786316,342.018585 C550.289978,348.761200 555.652893,352.071594 562.366516,353.374481 C571.927917,355.229950 583.381653,343.536377 581.305908,334.078247 C578.302551,320.393250 563.867859,313.079041 551.710510,324.208191 M500.593506,429.809387 C495.967499,426.755554 491.272491,426.967194 486.507050,429.476501 C480.304779,432.742462 477.175354,440.917297 479.690125,447.309113 C482.411102,454.225128 489.918274,458.804779 496.715576,456.724487 C502.625153,454.915955 506.082092,450.849121 507.412781,445.331726 C508.904938,439.144714 506.560211,433.915558 500.593506,429.809387 Z"/>
<path d="M336.056091,547.063843 C325.595367,557.608826 314.429108,566.779358 302.875183,575.503296 C291.482056,584.105896 279.330597,591.555237 266.518951,598.707703 C271.927948,605.439819 278.254364,610.030212 284.425018,614.716309 C306.182434,631.239319 330.301300,642.734070 357.172638,648.165161 C367.436005,650.239502 377.880188,650.917175 388.293945,651.541382 C392.191589,651.774902 393.557617,652.901001 393.409729,656.791504 C393.163086,663.281128 393.154663,669.794189 393.408051,676.283203 C393.562256,680.233154 392.162231,681.472412 388.234467,681.415039 C367.138824,681.106812 346.716858,677.224670 326.671692,670.787170 C293.638885,660.178650 265.328278,642.163818 241.738419,616.821228 C237.526749,612.296570 233.441422,611.418030 227.297180,611.871948 C210.848755,613.087280 195.750717,608.193115 182.731232,597.911560 C178.402100,594.492859 173.426529,591.419556 170.986755,585.101440 C176.859528,584.469788 182.411087,584.318298 187.845016,583.234497 C216.020584,577.614746 241.299576,565.234924 265.468201,550.236938 C296.822754,530.779724 324.279816,506.552490 349.010101,479.430115 C383.751190,441.328583 411.679810,398.463196 434.122284,352.042999 C445.501343,328.506561 455.535339,304.420471 463.530670,279.506836 C464.785431,275.596863 466.108582,271.682007 468.468689,268.014893 C471.054749,269.441681 470.413757,271.669739 470.209290,273.411713 C465.998962,309.282623 458.393250,344.310760 446.026459,378.377380 C435.534943,407.278198 422.356598,434.814667 406.323578,460.906647 C391.246857,485.442322 373.798157,508.284485 354.019897,529.365967 C348.318512,535.442993 342.393188,541.179871 336.056091,547.063843 Z"/>
<path d="M541.350830,250.947784 C537.321350,267.439575 526.440979,278.288086 513.886475,288.435974 C510.810883,284.189087 510.190948,279.665894 508.886871,275.492493 C505.918182,265.991943 503.191101,256.406677 500.716797,246.765747 C499.800995,243.197495 498.283936,243.136597 495.380066,244.267731 C482.512421,249.279968 469.245880,252.994858 455.733490,255.777344 C452.415680,256.460541 449.071228,257.833435 444.811737,256.783966 C449.244904,242.989456 456.572662,230.724854 462.236328,216.774490 C444.568146,215.105133 427.144714,213.458878 410.021362,211.841003 C409.222473,209.654144 410.215729,208.685181 411.059021,207.662796 C419.969635,196.859741 429.140808,186.400055 441.981140,179.915298 C450.575500,175.574890 459.584229,172.976624 469.168152,172.744904 C472.594299,172.662079 474.108826,171.297012 475.319336,168.264450 C491.851227,126.848862 522.727234,103.024231 566.073120,94.621559 C568.505615,94.150024 570.982727,93.908859 573.438599,93.557190 C579.386841,92.705421 580.267639,93.227333 581.268250,99.090118 C587.099609,133.258881 580.499756,164.712631 560.655701,193.287704 C557.037537,198.497864 553.510559,203.815918 548.415283,207.666656 C541.876221,212.608566 540.465149,218.738708 542.473206,226.422607 C544.579285,234.481903 543.301514,242.562241 541.350830,250.947784 M536.794067,131.227356 C528.092102,134.766510 524.346252,141.928436 527.116882,149.729874 C529.806763,157.303879 537.707581,161.521210 545.042542,159.298187 C552.141296,157.146774 557.035217,149.074081 555.486877,142.069733 C553.796143,134.420715 545.683167,129.408585 536.794067,131.227356 Z"/>
<path d="M348.556335,453.528107 C339.015717,463.531921 330.315796,473.812683 320.699799,483.287354 C303.824310,499.914825 285.768768,515.051392 266.258545,528.448669 C242.113205,545.028992 216.562958,558.798889 187.863266,565.735596 C175.728592,568.668579 163.461472,568.718689 151.570648,564.122070 C135.051819,557.736328 127.164162,540.700623 129.258484,523.774658 C131.503998,505.626892 140.188828,490.653809 150.957031,475.769592 C152.028656,478.803925 150.689880,480.822571 150.213760,482.912689 C148.524292,490.329468 146.908112,497.551270 147.993668,505.447693 C150.412140,523.040100 167.628082,529.231506 181.638260,527.262756 C203.634811,524.171814 223.197235,514.928345 242.345871,504.267181 C267.374115,490.332489 289.975433,473.076630 310.798737,453.646912 C337.982758,428.282257 361.815338,399.860779 383.542053,369.682739 C402.618195,343.186310 419.740265,315.476349 435.458344,286.873505 C438.580261,281.192444 442.164185,275.761383 445.637573,270.279968 C446.582611,268.788635 447.718781,267.320740 451.034454,265.972717 C429.330780,336.180817 395.479034,398.192993 348.556335,453.528107 Z"/>
<path d="M302.043945,303.074646 C273.610901,319.228760 250.523346,340.517639 232.813751,367.680634 C217.763641,390.764526 208.287872,415.780609 205.264435,443.204773 C203.118576,462.668732 203.810501,481.999451 208.651657,501.011627 C209.717865,505.198883 208.400024,506.740570 204.852493,507.985992 C197.146240,510.691498 189.141022,512.152527 181.238617,514.057434 C177.932220,514.854370 176.550751,513.353455 176.120041,510.454742 C174.928024,502.432129 173.312134,494.432617 172.758087,486.362579 C171.046799,461.437042 173.810638,436.941345 181.783707,413.222626 C189.636765,389.860870 201.323975,368.608521 217.033936,349.446869 C225.944382,338.578705 235.522400,328.489166 246.214539,319.482330 C264.557281,304.030792 285.116058,292.310791 307.500854,283.648499 C322.930237,277.677734 338.928711,274.102112 355.207916,271.961395 C367.705505,270.317932 380.310089,269.960754 392.979462,271.414459 C399.550964,272.168427 406.178253,272.522247 412.716217,273.677612 C413.889343,273.884918 415.038513,274.030029 415.642700,275.658661 C414.291992,278.190796 411.732727,277.337708 409.644806,277.301331 C384.194458,276.858246 359.307709,280.262787 335.171722,288.426666 C323.826935,292.263947 312.741821,296.804352 302.043945,303.074646 Z"/>
<path d="M404.664124,644.999878 C404.663879,618.515259 404.610779,592.530334 404.725189,566.546204 C404.740845,562.988586 403.718262,560.853943 400.473816,558.988708 C388.279785,551.978394 384.438873,539.102478 387.979462,525.292053 C390.696594,514.693542 403.684265,505.492035 415.606506,506.026642 C429.812256,506.663605 439.384613,514.231506 442.843262,526.859741 C446.367004,539.726013 441.546844,552.091187 430.057678,558.988037 C427.185150,560.712463 426.277527,562.632324 426.288727,565.788635 C426.380768,591.772949 426.333466,617.757751 426.362640,643.742371 C426.368347,648.836731 427.117065,649.323669 432.369873,648.212646 C443.763245,645.802917 454.947937,642.692017 465.799255,638.427429 C467.317230,637.830872 468.910828,637.426758 470.344330,636.973083 C471.860809,638.188293 471.306000,639.622925 471.319611,640.857422 C471.387573,647.019775 471.235352,653.186279 471.394135,659.345337 C471.616486,667.971741 471.763855,668.159180 463.455048,670.748596 C453.161163,673.956665 442.759583,676.882019 432.045319,678.317749 C427.790344,678.887939 426.102020,680.579712 426.227814,685.056946 C426.527161,695.708984 426.390411,706.375366 426.320557,717.035217 C426.273071,724.284485 421.862488,728.473633 414.667480,728.335327 C408.288116,728.212585 405.080414,724.365112 404.721008,715.956787 C404.507751,710.968689 404.666504,705.964417 404.665863,700.967407 C404.663513,682.478271 404.664459,663.989075 404.664124,644.999878 M421.816498,544.443298 C427.684296,539.472656 428.887543,532.939148 424.963165,527.357727 C421.511047,522.448181 414.334534,520.940796 409.463715,524.102356 C403.919250,527.701172 401.961548,534.321228 404.881012,539.598999 C408.486694,546.117310 414.160065,547.926086 421.816498,544.443298 Z"/>
</svg>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open site in three browsers (Chrome, Safari, Firefox).
Verify:
- [ ] Browser tab favicon shows the new logo at 16 and 32 px
- [ ] DevTools → Network: request to `/icon.svg` returns 200 with `Content-Type: image/svg+xml`

- [ ] **Step 4: Commit**

```bash
git add app/icon.svg
git commit -m "feat: Replace app/icon.svg with new ArcSmith logo"
```

---

## Task 7: Regenerate app/favicon.ico

**Files:**
- Create: `scripts/generate-favicon.sh`
- Modify: `app/favicon.ico`

- [ ] **Step 1: Pre-flight — pick the available rasterizer**

Run each command in turn and note which succeeds:
```bash
which rsvg-convert
which magick
which convert
which npx   # npx sharp-cli or npx svgexport fallback
```

The script below prefers `rsvg-convert` → `magick` → `convert`, else falls back to `npx svgexport`. If none are available, install one (macOS: `brew install librsvg` recommended).

- [ ] **Step 2: Write the script**

Create `scripts/generate-favicon.sh`:

```bash
#!/usr/bin/env bash
# Regenerate app/favicon.ico from app/icon.svg.
# Requires one of: rsvg-convert (librsvg), magick (ImageMagick 7),
# convert (ImageMagick 6), or npx svgexport.
# Also requires: png2ico OR ImageMagick to bundle the .ico.

set -euo pipefail

SRC="app/icon.svg"
OUT="app/favicon.ico"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

rasterize() {
  local size="$1"
  local dest="$2"
  if command -v rsvg-convert >/dev/null 2>&1; then
    rsvg-convert -w "$size" -h "$size" "$SRC" -o "$dest"
  elif command -v magick >/dev/null 2>&1; then
    magick -background none -density 384 "$SRC" -resize "${size}x${size}" "$dest"
  elif command -v convert >/dev/null 2>&1; then
    convert -background none -density 384 "$SRC" -resize "${size}x${size}" "$dest"
  else
    npx --yes svgexport "$SRC" "$dest" "${size}:${size}"
  fi
}

for size in 16 32 48; do
  rasterize "$size" "$TMP/icon-${size}.png"
done

if command -v magick >/dev/null 2>&1; then
  magick "$TMP"/icon-16.png "$TMP"/icon-32.png "$TMP"/icon-48.png "$OUT"
elif command -v convert >/dev/null 2>&1; then
  convert "$TMP"/icon-16.png "$TMP"/icon-32.png "$TMP"/icon-48.png "$OUT"
elif command -v png2ico >/dev/null 2>&1; then
  png2ico "$OUT" "$TMP"/icon-16.png "$TMP"/icon-32.png "$TMP"/icon-48.png
else
  echo "Need ImageMagick or png2ico to bundle .ico" >&2
  exit 1
fi

echo "Wrote $OUT"
```

Make executable:
```bash
chmod +x scripts/generate-favicon.sh
```

- [ ] **Step 3: Run the script**

```bash
./scripts/generate-favicon.sh
```
Expected: `Wrote app/favicon.ico` and no errors. If the script fails, fall back to manually rasterizing via Figma/online converter and placing the resulting `.ico` at `app/favicon.ico`.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 5: Manual check**

Hard-reload (Cmd-Shift-R) the site in each browser. Verify:
- [ ] `/favicon.ico` returns the new mark at 16 and 32 px
- [ ] In Firefox (which sometimes prefers `.ico` over `icon.svg`), the new mark shows

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-favicon.sh app/favicon.ico
git commit -m "feat: Regenerate favicon.ico from new logo

Adds scripts/generate-favicon.sh for reproducible builds. Regenerated
favicon carries 16/32/48 px raster tiers of the ArcSmith mark."
```

---

## Task 8: Delete BrandMark and its PNG asset

**Files:**
- Delete: `components/ui/BrandMark.tsx`
- Delete: `public/brand/mark.png`

- [ ] **Step 1: Confirm no remaining consumers**

Run:
```bash
grep -rn "BrandMark" --include="*.ts" --include="*.tsx" components app lib
grep -rn "brand/mark" --include="*.ts" --include="*.tsx" components app lib
grep -rn "@/components/ui/BrandMark" --include="*.ts" --include="*.tsx" components app lib
```
Expected: matches reference ONLY the new `AnimatedBrandMark` / `LogoMark` names, plus `components/ui/BrandMark.tsx` itself (which is about to be deleted). If a bare `<BrandMark` JSX usage or a `"@/components/ui/BrandMark"` import remains outside `BrandMark.tsx`, **stop** and migrate it in Task 4 before returning here.

- [ ] **Step 2: Delete**

```bash
git rm components/ui/BrandMark.tsx
git rm public/brand/mark.png
# If the brand/ directory is now empty, leave it — next run of git prune/git clean
# will handle it. Do NOT manually rmdir shared directories.
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: success, no "module not found" errors.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: Remove unused BrandMark component and PNG asset

AnimatedBrandMark (inline SVG) replaces both the old BrandMark
wrapper and the underlying mark.png raster."
```

---

## Task 9: Final verification

**No files changed** — this task is an end-to-end walk-through against the spec's acceptance criteria.

- [ ] **Step 1: Clean build**

```bash
rm -rf .next
npm run build
```
Expected: zero hydration warnings, zero type errors, zero new lint errors.

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: pass.

- [ ] **Step 3: Dev server acceptance walkthrough**

Run: `npm run dev`.

Go through each acceptance criterion from `docs/superpowers/specs/2026-04-20-space-theme-design.md` §10:
- [ ] Home hero shows stars, app pages and `/about` do not
- [ ] First-session animation plays (~700ms), reload is static, new tab plays again
- [ ] `prefers-reduced-motion: reduce` → no animation
- [ ] Favicon at 16/32 in Chrome, Safari, Firefox
- [ ] Lighthouse Performance ≥ baseline; CLS = 0 on home page
- [ ] `npm run build` emits no hydration warnings (already checked in Step 1)

- [ ] **Step 4: If anything fails**

Open a follow-up task, **do not silently patch**. The acceptance criteria are the contract for this PR.

- [ ] **Step 5: No commit**

This task produces no code. If all checks pass, the feature branch is ready for PR.

---

## Summary of commits

1. `feat: Add LogoMark inline SVG component`
2. `feat: Add decorative StarField component`
3. `feat: Add AnimatedBrandMark with one-shot entrance`
4. `feat: Use AnimatedBrandMark in site header and footer`
5. `feat: Add ambient starfield to home FeaturedHero`
6. `feat: Replace app/icon.svg with new ArcSmith logo`
7. `feat: Regenerate favicon.ico from new logo`
8. `chore: Remove unused BrandMark component and PNG asset`

Eight commits, four TypeScript components touched, no new dependencies, manual verification per spec §9.2.
