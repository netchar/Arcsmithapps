# Space Theme — Design Spec

**Date:** 2026-04-20
**Status:** Approved (pending spec review)
**Scope:** arcsmithapps.com marketing site

## 1. Goal

Introduce a restrained cosmic atmosphere to the site that reinforces the `logo3.svg` brand mark without violating the brand brief's *"70% Timeless, 90% Minimalist, avoid futuristic"* positioning. The theme must read as ambience, not science-fiction decoration.

## 2. Non-Goals

- Expanding ambient treatment beyond the home hero
- Animating the logo on every page navigation
- Changing the color palette, typography, or theme tokens in `globals.css`
- Android adaptive icon updates
- OG image regeneration (tracked as separate follow-up)
- `prefers-color-scheme: light` support (site is dark-only)
- Hover / click interactions on the logo

## 3. Brand Alignment

Per `docs/logo-brief.md`:

- Brand brief explicitly permits an entrance animation: *"Arc draws itself in (stroke animation, ~0.8s)"* under §7 Platform-Specific Variants / Animated variant.
- `globals.css` already exposes `--color-accent-glow` and `FeaturedHero` already uses two radial-glow layers — the ambient treatment extends an existing visual language rather than introducing a new one.
- The logo mark (`docs/logo3.svg`) contains four geometric fragments whose composition is reinforced, not reinterpreted. No narrative is added to the mark.

## 4. Architecture

### 4.1 New files

| File | Purpose |
|------|---------|
| `components/ui/StarField.tsx` | Decorative ambient starfield used inside `FeaturedHero` |
| `components/ui/AnimatedBrandMark.tsx` | Wraps the logo with a one-shot, session-scoped entrance animation |
| `components/ui/LogoMark.tsx` | Inline SVG React component, generated from optimized `logo3.svg` |
| `scripts/generate-favicon.sh` | Reproducible favicon build from `logo3.svg` |

### 4.2 Modified files

| File | Change |
|------|--------|
| `components/sections/FeaturedHero.tsx` | Render `<StarField />` between the two existing radial-glow layers |
| `components/layout/Header.tsx` | Swap `BrandMark` → `AnimatedBrandMark` |
| `app/icon.svg` | Replace with optimized `logo3.svg` (fill `#e8f0ec`) |
| `app/favicon.ico` | Regenerate from `logo3.svg` (16/32/48 px) |

### 4.3 Removed files

| File | Reason |
|------|--------|
| `public/brand/mark.png` | Only consumed by `BrandMark`, which is being removed |
| `components/ui/BrandMark.tsx` | Superseded by `AnimatedBrandMark` |

### 4.4 Untouched

- `app/globals.css` theme tokens (palette frozen)
- `components/sections/AppLandingHero.tsx`, `FeatureGrid.tsx`, `FeatureSpotlight.tsx`, `ShowcaseStrip.tsx`, `CtaBanner.tsx`, `AppGrid.tsx`
- About page and app landing pages (no ambient layer)
- `next.config.ts`, `package.json` (no new dependencies)
- Brand documentation under `docs/`

### 4.5 Layer order inside `FeaturedHero`

```
FeaturedHero (section)
 ├─ absolute gradient bg          (existing)
 ├─ radial-glow #1 top-left       (existing)
 ├─ StarField                      (NEW — aria-hidden, pointer-events-none)
 ├─ radial-glow #2 bottom-right   (existing)
 └─ relative content (z>1)
```

## 5. Component Contracts

### 5.1 `StarField`

```typescript
interface StarFieldProps {
  count?: number;
  className?: string;
}
```

**Behavior**

- Renders a full-coverage absolutely-positioned `<div>` with `aria-hidden="true"` and `pointer-events-none`.
- Renders up to `count` decorative `<span>` elements (default `18`). `count` behaves as a **cap**, not a generator target — see clamp rule below.
- Star positions come from a hardcoded `STARS` constant in the same module — not runtime `Math.random()`. This guarantees SSR/CSR parity, zero hydration warnings, and lets the designer hand-tune the pattern.
- Each star is 1.5 × 1.5 px, `border-radius: 50%`, `background: #e8f0ec`, with `box-shadow: 0 0 2px rgba(232,240,236,0.4)`. Per-star `opacity` drawn from the `STARS` array, range `0.18–0.40`.
- No transitions, no keyframe animations, no canvas.

**Data shape**

```typescript
interface Star {
  top: number;      // percent, 0–100
  left: number;     // percent, 0–100
  opacity: number;  // 0.18–0.40
  scale: number;    // 0.75–1.15
}

const STARS: ReadonlyArray<Star> = [ /* 18 tuned entries */ ];
```

If `count < STARS.length`, `STARS.slice(0, count)` is rendered. If `count > STARS.length`, `count` is clamped to `STARS.length` (no duplication, no generation).

### 5.2 `LogoMark`

```typescript
interface LogoMarkProps {
  size?: number;        // default 24, square
  title?: string;       // a11y label; if absent, SVG is aria-hidden
  className?: string;
  pathIds?: boolean;    // default false — when true, paths get ids: spark, orbit, crescent, drop
}
```

**Behavior**

- Pure inline SVG. No client directive needed.
- `viewBox="0 0 816 832"`. All paths `fill="currentColor"`.
- When `title` is provided: `role="img"`, `aria-label={title}`. Otherwise: `aria-hidden="true"`. Never both.
- `pathIds={true}` is used only by `AnimatedBrandMark` to attach motion targets.

**Source**

- `docs/logo3.svg` is optimized with SVGO (remove `xml:space`, `enable-background`, `xmlns:xlink`, `id="Layer_1"`, collapse whitespace), then ported into `LogoMark.tsx` as JSX. The four paths are assigned stable ids by geometry: `spark` (large diagonal arc), `orbit` (right-side curve), `crescent` (upper crescent), `drop` (lower drop).

### 5.3 `AnimatedBrandMark`

```typescript
interface AnimatedBrandMarkProps {
  size?: number;
  className?: string;
  title?: string;
}
```

**Behavior**

- `"use client"` component.
- First render (SSR and pre-effect CSR): static `<LogoMark title={title} size={size} className={className} />`. This is the SSR output — no FOUC, no hydration mismatch.
- On mount, a single `useEffect` reads:
  - `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
  - `sessionStorage.getItem(SESSION_KEY)` where `SESSION_KEY = 'asa-mark-played'`
- If either returns a truthy "skip" signal → remains static.
- Otherwise → swap to a `motion.svg` variant, run animation, set `sessionStorage[SESSION_KEY] = '1'` on completion.

**Animation timeline** (framer-motion, easing `[0.22, 1, 0.36, 1]`)

| Time (ms) | Target | Property | From → To |
|-----------|--------|----------|-----------|
| 0–500 | `#spark` | `pathLength` | 0 → 1 |
| 150–550 | `#orbit` | `pathLength` | 0 → 1 |
| 450–700 | `#crescent`, `#drop` | `opacity`, `scale` | `0, 0.85` → `1, 1` |

During stroke-draw, `#spark` and `#orbit` are rendered as `fill: transparent; stroke: currentColor; stroke-width: 2`. The fill/stroke swap (`fill: currentColor; stroke: none`) is applied **per path** the moment that path's `pathLength` reaches 1 — so `#spark` swaps at t≈500ms, `#orbit` at t≈550ms. This avoids a visible "outline → filled" flash at the global end. All four paths end at `opacity: 1`.

**sessionStorage semantics**

- Key: `asa-mark-played` (string, any truthy value means "already played")
- Scope: per tab session (cleared on tab close per browser sessionStorage semantics)
- Cross-route: navigating within the tab does NOT replay the animation — this is desired ("once per session")

**Safety**

- The component never accesses `window` / `sessionStorage` during render, only inside `useEffect`.
- If sessionStorage write throws (Safari private mode, quota, etc.), the error is swallowed — the animation simply may replay on next load.

## 6. Static Assets

### 6.1 `app/icon.svg`

Replaced with optimized `logo3.svg`. `fill="#e8f0ec"` hardcoded (this is a favicon asset, not a component). Same 4-path structure. Next.js serves this preferentially via `<link rel="icon" type="image/svg+xml">`.

### 6.2 `app/favicon.ico`

Regenerated via `scripts/generate-favicon.sh`:

1. Rasterize `logo3.svg` at 16, 32, 48 px with `#e8f0ec` on transparent background.
2. Combine into single `.ico` via `png-to-ico` or ImageMagick `convert`.
3. Output committed to repository as `app/favicon.ico`.

The script documents reproducibility. It is not invoked during Next.js build.

### 6.3 Removals

`public/brand/mark.png` and `components/ui/BrandMark.tsx` are deleted. Before deletion, verify via `grep -r "BrandMark" --include="*.tsx"` and `grep -r "brand/mark" --include="*.tsx"` that the only consumer is `Header.tsx`.

## 7. Accessibility

| Concern | Decision |
|---------|----------|
| Decorative star layer | `aria-hidden="true"`, removed from a11y tree |
| Logo semantics | `role="img"` + `aria-label` only when `title` is set; otherwise `aria-hidden="true"` |
| Reduced motion | Full animation skip on `prefers-reduced-motion: reduce` — hard invariant |
| Keyboard / focus | No interactive elements introduced; no new tab stops |
| Contrast | Stars do not sit behind `<h1>` / body text reading areas; positions tuned to periphery of the hero |

## 8. Performance Budget

- `StarField`: 0 JS runtime cost, ~1 KB HTML.
- `AnimatedBrandMark`: inline SVG (~2 KB after SVGO) + reuses existing `framer-motion` bundle (no delta, `FeaturedHero` already imports it).
- No new npm dependencies.
- CLS target: 0 (entrance animation runs on elements whose layout box is reserved at SSR).
- Lighthouse Performance: must not regress vs. baseline.

## 9. Verification

The repository currently has no automated test infrastructure (no Vitest, no Playwright, no `tests/` directory, no test scripts in `package.json`). Rather than bootstrap a full stack for three components, verification for this change is **manual + build-gated**. Automated coverage can be introduced in a later spec when the project adopts a testing stack.

### 9.1 Build verification (automated, CI-ready)

- `npm run build` completes with **zero** hydration warnings, type errors, or new eslint errors.
- `npm run lint` passes.

### 9.2 Manual verification (dev server)

Run `npm run dev` and in a fresh Chrome profile:

**Home page — ambient layer**
- [ ] Hero block on `/` shows faint star pinpoints, visible but not drawing attention.
- [ ] App detail pages (`/<app-slug>`) and `/about` have **no** stars.

**Logo entrance animation**
- [ ] First visit in a fresh tab: header logo stroke-draws in ~700ms, points fade in, settles to static.
- [ ] Reload tab (Cmd-R): logo is static from frame 1, no animation.
- [ ] Close tab, open new tab, navigate to `/`: animation plays again.
- [ ] DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce" → reload: animation does **not** play.

**Assets**
- [ ] Browser tab favicon renders at 16 and 32 px in Chrome, Safari, Firefox.
- [ ] `<link rel="icon" type="image/svg+xml">` picked up (check DevTools Network panel for `icon.svg` request).

**Cross-browser smoke**
- [ ] Chrome, Safari, Firefox — all of the above.

### 9.3 Performance spot-check

- Run Lighthouse on `/` before and after the change (same Chrome profile, same network throttling).
- [ ] Performance score does not regress.
- [ ] CLS = 0 (no layout shift from logo animation).

## 10. Acceptance Criteria

- [ ] On the home page, hero block shows faint stars (manual dev visual check).
- [ ] App detail pages and About page show no stars.
- [ ] On the first page load of a browser session, the header logo stroke-draws in ~700ms.
- [ ] Reloading the same tab leaves the logo static.
- [ ] With OS-level `prefers-reduced-motion: reduce`, the animation never plays.
- [ ] Favicon renders at 16/32 px in Chrome, Safari, Firefox.
- [ ] Lighthouse Performance ≥ baseline; CLS = 0.
- [ ] Manual verification checklist (§9.2) fully green.
- [ ] `npm run build` emits no hydration warnings.

## 11. Follow-ups (out of scope)

- OG image (`public/og.png`, 1200×630) regenerated from `logo3.svg` with matching ambient treatment.
- Android adaptive icon (`foreground.xml` + background) derived from `logo3.svg`.
- Optional extension of the ambient layer to `AppLandingHero` after live observation of the home hero.
- Evaluation of `prefers-reduced-motion` matching UX (e.g., whether to skip `StarField` altogether — currently it stays, being static).

## 12. Open Questions

None at spec-write time. All scope decisions have been made:

- Ambient scope: home `FeaturedHero` only.
- Logo asset scope: web + `icon.svg` + `favicon.ico`. Not Android, not OG.
- Animation cadence: once per browser tab session.
- Star count: 18, hand-tuned constants.
- Reduced motion: hard-skip for entrance animation; `StarField` is static and kept.
