# About Page + i18n Infrastructure — Design Spec

**Date:** 2026-04-12
**Project:** arcsmithapps.com
**Stack:** Next.js 16.2.2, React 19, Tailwind CSS 4, Framer Motion

## Purpose

Add an About page to arcsmithapps.com and set up site-wide internationalization (EN, PL, RU). The site serves as the official business presence for ArcSmith Apps (CEIDG-registered JDG in Poland).

## Scope

- New About page with content in 3 languages
- i18n routing infrastructure (subdirectory-based)
- Language switcher in Header
- About link in Header navigation
- Existing pages (homepage, app pages, legal) get locale-aware routing but content stays EN-only for now

**Out of scope:** Translating existing MDX content (app descriptions, legal docs). That's a separate task.

---

## i18n Architecture

### Routing

Subdirectory-based locale routing with EN as default (no prefix):

| Route | Description |
|-------|-------------|
| `/` | Homepage (EN, default) |
| `/about` | About page (EN) |
| `/eloquote` | App page (EN) |
| `/pl/` | Homepage (PL) |
| `/pl/about` | About page (PL) |
| `/ru/about` | About page (RU) |

### App Directory Structure

```
app/
  [locale]/
    page.tsx              # homepage
    about/
      page.tsx            # About page (new)
    [app]/
      page.tsx            # app landing pages
      [doc]/
        page.tsx          # legal doc pages
    layout.tsx            # locale-aware layout (html lang, metadata)
  layout.tsx              # root layout (fonts, globals)

middleware.ts              # locale detection + redirect
```

### Translation System

JSON dictionary files — no external i18n library needed for this scale:

```
lib/
  i18n.ts                 # locale config, getDictionary() helper
  dictionaries/
    en.json               # UI strings EN
    pl.json               # UI strings PL
    ru.json               # UI strings RU
```

Dictionary structure:

```json
{
  "nav": {
    "about": "About",
    "home": "Home"
  },
  "hero": {
    "tagline": "Independent apps crafted with care."
  },
  "about": {
    "title": "About",
    "heroHeadline": "Built by one developer. Designed for everyone.",
    "paragraphs": [
      "ArcSmith Apps is an independent app studio based in Warsaw, Poland. We build thoughtful, privacy-first mobile applications — each designed to do one thing well.",
      "Behind ArcSmith is a developer with over 13 years of experience in software engineering. Every app is built with modern tools and best practices — following the same standards you'd expect from a larger team.",
      "We believe great apps don't need to track you, push ads, or ask for unnecessary permissions. Our apps respect your privacy and are built to last."
    ]
  },
  "footer": {
    "tagline": "Independent apps crafted with care.",
    "copyright": "ArcSmith Apps"
  },
  "languageSwitcher": {
    "label": "Language"
  }
}
```

### Middleware

`middleware.ts` handles:
1. Detect locale from `Accept-Language` header (fallback: EN)
2. Redirect root requests without locale prefix to detected locale (or EN default)
3. Set `x-locale` header for downstream use

EN requests stay unprefixed (`/about`), PL/RU get prefix (`/pl/about`, `/ru/about`).

### Content Loading

- **UI strings:** `getDictionary(locale)` loads the JSON file
- **MDX content** (apps, legal): loaded as-is (EN only). The `lib/apps.ts` and `lib/mdx.ts` functions get a `locale` parameter for future use, but currently always return EN content
- **About text:** stored in dictionaries (not MDX) since it's short and structured

---

## About Page Design

### Layout

Follows the site's existing section patterns:

1. **Hero area** — headline with subtle gradient background
2. **Content section** — 3 paragraphs, max-width prose container
3. **Contact block** — business details

### Content

**EN:**

Hero: "Built by one developer. Designed for everyone."

Body:
- ArcSmith Apps is an independent app studio based in Warsaw, Poland. We build thoughtful, privacy-first mobile applications — each designed to do one thing well.
- Behind ArcSmith is a developer with over 13 years of experience in software engineering. Every app is built with modern tools and best practices — following the same standards you'd expect from a larger team.
- We believe great apps don't need to track you, push ads, or ask for unnecessary permissions. Our apps respect your privacy and are built to last.

**PL:**

Hero: "Tworzone przez jednego programiste. Zaprojektowane dla wszystkich."

Body:
- ArcSmith Apps to niezalezne studio aplikacji z siedziba w Warszawie. Tworzymy przemyslane aplikacje mobilne, w ktorych prywatnosc jest priorytetem — kazda zaprojektowana tak, by robic jedna rzecz dobrze.
- Za ArcSmith stoi programista z ponad 13-letnim doswiadczeniem w inzynierii oprogramowania. Kazda aplikacja powstaje z wykorzystaniem nowoczesnych narzedzi i najlepszych praktyk — na poziomie, jakiego oczekiwalbys od wiekszego zespolu.
- Wierzymy, ze swietne aplikacje nie musza Cie sledzic, wyswietlac reklam ani prosic o zbedne uprawnienia. Nasze aplikacje szanuja Twoja prywatnosc i sa tworzone z mysla o trwalosci.

**RU:**

Hero: "Создано одним разработчиком. Спроектировано для каждого."

Body:
- ArcSmith Apps — независимая студия приложений из Варшавы, Польша. Мы создаём продуманные мобильные приложения с фокусом на приватность — каждое спроектировано делать одну вещь хорошо.
- За ArcSmith стоит разработчик с более чем 13-летним опытом в разработке ПО. Каждое приложение создаётся с использованием современных инструментов и лучших практик — на уровне, которого вы ожидали бы от большой команды.
- Мы верим, что отличным приложениям не нужно следить за вами, показывать рекламу или запрашивать лишние разрешения. Наши приложения уважают вашу приватность и созданы надолго.

**Contact block (all languages, same data):**
- support@arcsmithapps.com
- ArcSmith Apps — Warsaw, Poland
- NIP: 8952251825

---

## Header Changes

- Add "About" link to navigation
- Add language switcher (dropdown or inline links: EN / PL / RU)
- Language switcher preserves current path when switching locale

---

## SEO

- `<html lang>` set from locale parameter
- `<link rel="alternate" hreflang="...">` tags for all locale variants
- `generateMetadata()` returns locale-appropriate title/description
- `sitemap.ts` generates entries for all locale variants

---

## Key Files to Create/Modify

**Create:**
- `middleware.ts`
- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx` (move from `app/page.tsx`)
- `app/[locale]/about/page.tsx`
- `app/[locale]/[app]/page.tsx` (move from `app/[app]/page.tsx`)
- `app/[locale]/[app]/[doc]/page.tsx` (move from `app/[app]/[doc]/page.tsx`)
- `lib/i18n.ts`
- `lib/dictionaries/en.json`
- `lib/dictionaries/pl.json`
- `lib/dictionaries/ru.json`

**Modify:**
- `app/layout.tsx` — simplify to root layout (fonts, globals only)
- `components/layout/Header.tsx` — add About link + language switcher
- `components/layout/Footer.tsx` — use dictionary strings
- `lib/apps.ts` — add locale parameter
- `lib/mdx.ts` — add locale parameter
- `app/sitemap.ts` — generate locale variants
- `app/robots.ts` — if needed

**Delete (moved into [locale]):**
- `app/page.tsx`
- `app/[app]/page.tsx`
- `app/[app]/[doc]/page.tsx`

---

## Verification

1. `npm run build` — all pages generate for all locales
2. `/about` renders EN About content
3. `/pl/about` renders PL About content
4. `/ru/about` renders RU About content
5. Language switcher navigates between locales preserving path
6. Header shows About link on all pages
7. Middleware redirects based on Accept-Language
8. `<html lang>` matches locale on every page
9. Existing app/legal pages work at both `/eloquote` and `/pl/eloquote`
