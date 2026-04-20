# Space Theme — Design Spec

**Date:** 2026-04-20
**Status:** Approved
**Scope:** arcsmithapps.com marketing site

## 1. Goal

Introduce a restrained cosmic atmosphere to the site that reinforces the `logo3.svg` brand mark without violating the brand brief's *"70% Timeless, 90% Minimalist, avoid futuristic"* positioning. The theme must read as ambience, not science-fiction decoration.

## 2. Non-Goals

- Expanding ambient treatment beyond the home hero
- **Any logo animation** (entrance, hover, loop, load-in) — logo is fully static
- Changing the color palette, typography, or theme tokens in `globals.css`
- Android adaptive icon updates
- OG image regeneration (tracked as separate follow-up)
- `prefers-color-scheme: light` support (site is dark-only)
- Hover / click interactions on the logo

## 3. Brand Alignment

Per `docs/logo-brief.md`:

- `globals.css` already exposes `--color-accent-glow` and `FeaturedHero` already uses two radial-glow layers — the ambient treatment extends an existing visual language rather than introducing a new one.
- The logo mark (`docs/logo3.svg`) contains six geometric fragments whose composition is reinforced, not reinterpreted. No narrative is added to the mark.
- The brand brief permits an optional entrance animation; this scope deliberately declines that option in favor of a fully static mark.

## 4. Architecture

### 4.1 New files

| File | Purpose |
|------|---------|
| `components/ui/LogoMark.tsx` | Inline SVG React component, ported from optimized `logo3.svg` |
| `components/ui/StarField.tsx` | Decorative ambient starfield used inside `FeaturedHero` |
| `scripts/generate-favicon.sh` | Reproducible favicon build from `logo3.svg` |

### 4.2 Modified files

| File | Change |
|------|--------|
| `components/sections/FeaturedHero.tsx` | Render `<StarField />` between the two existing radial-glow layers |
| `components/layout/Header.tsx` | Swap `BrandMark` → `LogoMark` |
| `components/layout/Footer.tsx` | Swap `BrandMark` → `LogoMark` |
| `app/icon.svg` | Replace with optimized `logo3.svg` (fill `#e8f0ec`) |
| `app/favicon.ico` | Regenerate from `logo3.svg` (16/32/48 px) |

### 4.3 Removed files

| File | Reason |
|------|--------|
| `components/ui/BrandMark.tsx` | Superseded by `LogoMark` |
| `public/brand/mark.png` | Only consumed by `BrandMark` — no consumers left |

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

### 5.1 `LogoMark`

```typescript
interface LogoMarkProps {
  size?: number;        // default 24, square
  title?: string;       // a11y label; if absent, SVG is aria-hidden
  className?: string;
  style?: CSSProperties;
}
```

**Behavior**

- Pure inline SVG. Server-safe, no `"use client"` directive.
- `viewBox="0 0 816 832"`. All paths `fill="currentColor"`.
- When `title` is provided: `role="img"`, `aria-label={title}`. Otherwise: `aria-hidden="true"`. Never both.
- No state, no effects, no refs.

**Source**

- `docs/logo3.svg` is optimized (remove `xml:space`, `enable-background`, `xmlns:xlink`, `id="Layer_1"`, collapse whitespace), then ported into `LogoMark.tsx` as JSX. All **six** top-level paths from the source are preserved in render order: `orbit` (right-side curve with two internal dot holes, line 3 of source), `spark` (large diagonal arc, line 58), `planet` (upper-right saturn-with-ring, line 86), `drop` (lower-left drop, line 114), `crescent` (upper-left crescent, line 134), `core` (central vertical bar with dot, line 156).

### 5.2 `StarField`

```typescript
interface StarFieldProps {
  count?: number;
  className?: string;
}
```

**Behavior**

- Renders a full-coverage absolutely-positioned `<div>` with `aria-hidden="true"` and `pointer-events-none`.
- Renders up to `count` decorative `<span>` elements (default `18`). `count` behaves as a **cap**, not a generator target.
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

## 6. Static Assets

### 6.1 `app/icon.svg`

Replaced with optimized `logo3.svg`. `fill="#e8f0ec"` hardcoded (this is a favicon asset, not a themed component). All six paths preserved. Next.js serves this preferentially via `<link rel="icon" type="image/svg+xml">`.

### 6.2 `app/favicon.ico`

Regenerated via `scripts/generate-favicon.sh`:

1. Rasterize `logo3.svg` at 16, 32, 48 px with `#e8f0ec` on transparent background.
2. Combine into single `.ico` via `png-to-ico` or ImageMagick `convert`.
3. Output committed to repository as `app/favicon.ico`.

The script documents reproducibility. It is not invoked during Next.js build.

### 6.3 Removals

`public/brand/mark.png` and `components/ui/BrandMark.tsx` are deleted. Before deletion, verify via `grep` across `components`, `app`, `lib` that the only consumers are `Header.tsx` and `Footer.tsx` — both migrated to `LogoMark` in the same atomic commit.

## 7. Accessibility

| Concern | Decision |
|---------|----------|
| Decorative star layer | `aria-hidden="true"`, removed from a11y tree |
| Logo semantics | `role="img"` + `aria-label` only when `title` is set; otherwise `aria-hidden="true"` |
| Keyboard / focus | No interactive elements introduced; no new tab stops |
| Contrast | Stars do not sit behind `<h1>` / body text reading areas; positions tuned to periphery of the hero |
| Motion | No animated UI introduced by this change, so `prefers-reduced-motion` is inherently respected without special casing |

## 8. Performance Budget

- `LogoMark`: inline SVG (~2 KB after optimization).
- `StarField`: 0 JS runtime cost, ~1 KB HTML.
- No new npm dependencies.
- CLS target: 0.
- Lighthouse Performance: must not regress vs. baseline.

## 9. Verification

The repository currently has no automated test infrastructure (no Vitest, no Playwright, no `tests/` directory, no test scripts in `package.json`). Rather than bootstrap a full stack for two small components, verification for this change is **manual + build-gated**. Automated coverage can be introduced in a later spec when the project adopts a testing stack.

### 9.1 Build verification (automated, CI-ready)

- `npm run build` completes with **zero** hydration warnings, type errors, or new eslint errors.
- `npm run lint` passes.

### 9.2 Manual verification (dev server)

Run `npm run dev` and in a fresh Chrome profile:

**Home page — ambient layer**
- [ ] Hero block on `/` shows faint star pinpoints, visible but not drawing attention.
- [ ] App detail pages (`/<app-slug>`) and `/about` have **no** stars.

**Logo**
- [ ] Header and footer logos render correctly — no layout shift, no flicker, no animation.
- [ ] Logo is visibly sharp at 22 px (Header) and 22 px (Footer).

**Assets**
- [ ] Browser tab favicon renders at 16 and 32 px in Chrome, Safari, Firefox.
- [ ] `<link rel="icon" type="image/svg+xml">` picked up (check DevTools Network panel for `icon.svg` request).

**Cross-browser smoke**
- [ ] Chrome, Safari, Firefox — all of the above.

### 9.3 Performance spot-check

- Run Lighthouse on `/` before and after the change (same Chrome profile, same network throttling).
- [ ] Performance score does not regress.
- [ ] CLS = 0.

## 10. Acceptance Criteria

- [ ] On the home page, hero block shows faint stars (manual dev visual check).
- [ ] App detail pages and About page show no stars.
- [ ] Header and footer logos render correctly with no animation and no layout shift.
- [ ] Favicon renders at 16/32 px in Chrome, Safari, Firefox.
- [ ] Lighthouse Performance ≥ baseline; CLS = 0.
- [ ] Manual verification checklist (§9.2) fully green.
- [ ] `npm run build` emits no hydration warnings.

## 11. Follow-ups (out of scope)

- OG image (`public/og.png`, 1200×630) regenerated from `logo3.svg` with matching ambient treatment.
- Android adaptive icon (`foreground.xml` + background) derived from `logo3.svg`.
- Optional extension of the ambient layer to `AppLandingHero` after live observation of the home hero.
- Optional logo entrance animation — deliberately declined in this scope; can be revisited after users see the static version.

## 12. Open Questions

None. All scope decisions have been made:

- Ambient scope: home `FeaturedHero` only.
- Logo asset scope: web + `icon.svg` + `favicon.ico`. Not Android, not OG.
- Logo behavior: fully static — no entrance, hover, loop, or load-in animation.
- Star count: 18, hand-tuned constants.
