# About Page + i18n Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an About page and site-wide i18n with subdirectory routing (EN default without prefix, PL/RU with prefix) to arcsmithapps.com.

**Architecture:** Subdirectory i18n using `app/[lang]/` dynamic segment. `proxy.ts` (Next.js 16's replacement for middleware) handles locale detection and rewrites. JSON dictionaries for UI strings. EN is the default locale served without URL prefix; PL and RU use `/pl/` and `/ru/` prefixes.

**Tech Stack:** Next.js 16.2.2, React 19, Tailwind CSS 4, Framer Motion, `negotiator` + `@formatjs/intl-localematcher` for locale matching.

**Spec:** `docs/superpowers/specs/2026-04-12-about-page-i18n-design.md`

---

## File Structure

```
Create:
  proxy.ts                              — locale detection, rewrite/redirect logic
  lib/i18n.ts                           — locale config, getDictionary(), type exports
  lib/dictionaries/en.json              — English UI strings
  lib/dictionaries/pl.json              — Polish UI strings
  lib/dictionaries/ru.json              — Russian UI strings
  app/[lang]/layout.tsx                 — locale-aware layout (html lang, metadata, Header/Footer with dict)
  app/[lang]/page.tsx                   — homepage (moved from app/page.tsx)
  app/[lang]/about/page.tsx             — About page (new)
  app/[lang]/[app]/page.tsx             — app pages (moved from app/[app]/page.tsx)
  app/[lang]/[app]/[doc]/page.tsx       — legal pages (moved from app/[app]/[doc]/page.tsx)

Modify:
  app/layout.tsx                        — strip to bare root (fonts, CSS only, no Header/Footer)
  components/layout/Header.tsx          — add About link + language switcher, accept dict prop
  components/layout/Footer.tsx          — accept dict prop for translated strings
  components/sections/AppLegal.tsx      — prefix links with locale
  app/sitemap.ts                        — generate locale variants
  package.json                          — add negotiator + @formatjs/intl-localematcher

Delete:
  app/page.tsx                          — moved to app/[lang]/page.tsx
  app/[app]/page.tsx                    — moved to app/[lang]/[app]/page.tsx
  app/[app]/[doc]/page.tsx              — moved to app/[lang]/[app]/[doc]/page.tsx
```

---

### Task 1: Install i18n dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
cd ~/Work/Projects/arcsmithapps.com && npm install negotiator @formatjs/intl-localematcher
```

- [ ] **Step 2: Install type definitions**

```bash
cd ~/Work/Projects/arcsmithapps.com && npm install -D @types/negotiator
```

- [ ] **Step 3: Commit**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add package.json package-lock.json
git commit -m "chore: Add negotiator and intl-localematcher for i18n"
```

---

### Task 2: Create i18n config and dictionaries

**Files:**
- Create: `lib/i18n.ts`
- Create: `lib/dictionaries/en.json`
- Create: `lib/dictionaries/pl.json`
- Create: `lib/dictionaries/ru.json`

- [ ] **Step 1: Create `lib/i18n.ts`**

```ts
import "server-only";

export const locales = ["en", "pl", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function hasLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  pl: () => import("./dictionaries/pl.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
```

- [ ] **Step 2: Create `lib/dictionaries/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "hero": {
    "tagline": "Independent apps crafted with care."
  },
  "appGrid": {
    "label": "Our Apps",
    "heading": "Crafted with care"
  },
  "about": {
    "title": "About",
    "heroHeadline": "Built by one developer. Designed for everyone.",
    "paragraphs": [
      "ArcSmith Apps is an independent app studio based in Warsaw, Poland. We build thoughtful, privacy-first mobile applications — each designed to do one thing well.",
      "Behind ArcSmith is a developer with over 13 years of experience in software engineering. Every app is built with modern tools and best practices — following the same standards you'd expect from a larger team.",
      "We believe great apps don't need to track you, push ads, or ask for unnecessary permissions. Our apps respect your privacy and are built to last."
    ],
    "contact": {
      "heading": "Contact",
      "email": "support@arcsmithapps.com",
      "entity": "ArcSmith Apps — Warsaw, Poland",
      "nip": "NIP: 8952251825"
    }
  },
  "footer": {
    "tagline": "Independent apps crafted with care.",
    "copyright": "ArcSmith Apps"
  },
  "legal": {
    "privacyPolicy": "Privacy Policy",
    "terms": "Terms of Service",
    "backTo": "Back to"
  },
  "cta": {
    "learnMore": "Learn more",
    "comingSoon": "Coming Soon",
    "getOnGooglePlay": "Get it on Google Play"
  }
}
```

- [ ] **Step 3: Create `lib/dictionaries/pl.json`**

```json
{
  "nav": {
    "home": "Strona główna",
    "about": "O nas"
  },
  "hero": {
    "tagline": "Niezależne aplikacje tworzone z troską."
  },
  "appGrid": {
    "label": "Nasze aplikacje",
    "heading": "Tworzone z troską"
  },
  "about": {
    "title": "O nas",
    "heroHeadline": "Tworzone przez jednego programistę. Zaprojektowane dla wszystkich.",
    "paragraphs": [
      "ArcSmith Apps to niezależne studio aplikacji z siedzibą w Warszawie. Tworzymy przemyślane aplikacje mobilne, w których prywatność jest priorytetem — każda zaprojektowana tak, by robić jedną rzecz dobrze.",
      "Za ArcSmith stoi programista z ponad 13-letnim doświadczeniem w inżynierii oprogramowania. Każda aplikacja powstaje z wykorzystaniem nowoczesnych narzędzi i najlepszych praktyk — na poziomie, jakiego oczekiwałbyś od większego zespołu.",
      "Wierzymy, że świetne aplikacje nie muszą Cię śledzić, wyświetlać reklam ani prosić o zbędne uprawnienia. Nasze aplikacje szanują Twoją prywatność i są tworzone z myślą o trwałości."
    ],
    "contact": {
      "heading": "Kontakt",
      "email": "support@arcsmithapps.com",
      "entity": "ArcSmith Apps — Warszawa, Polska",
      "nip": "NIP: 8952251825"
    }
  },
  "footer": {
    "tagline": "Niezależne aplikacje tworzone z troską.",
    "copyright": "ArcSmith Apps"
  },
  "legal": {
    "privacyPolicy": "Polityka prywatności",
    "terms": "Regulamin",
    "backTo": "Powrót do"
  },
  "cta": {
    "learnMore": "Dowiedz się więcej",
    "comingSoon": "Wkrótce",
    "getOnGooglePlay": "Pobierz z Google Play"
  }
}
```

- [ ] **Step 4: Create `lib/dictionaries/ru.json`**

```json
{
  "nav": {
    "home": "Главная",
    "about": "О нас"
  },
  "hero": {
    "tagline": "Независимые приложения, созданные с заботой."
  },
  "appGrid": {
    "label": "Наши приложения",
    "heading": "Созданные с заботой"
  },
  "about": {
    "title": "О нас",
    "heroHeadline": "Создано одним разработчиком. Спроектировано для каждого.",
    "paragraphs": [
      "ArcSmith Apps — независимая студия приложений из Варшавы, Польша. Мы создаём продуманные мобильные приложения с фокусом на приватность — каждое спроектировано делать одну вещь хорошо.",
      "За ArcSmith стоит разработчик с более чем 13-летним опытом в разработке ПО. Каждое приложение создаётся с использованием современных инструментов и лучших практик — на уровне, которого вы ожидали бы от большой команды.",
      "Мы верим, что отличным приложениям не нужно следить за вами, показывать рекламу или запрашивать лишние разрешения. Наши приложения уважают вашу приватность и созданы надолго."
    ],
    "contact": {
      "heading": "Контакты",
      "email": "support@arcsmithapps.com",
      "entity": "ArcSmith Apps — Варшава, Польша",
      "nip": "NIP: 8952251825"
    }
  },
  "footer": {
    "tagline": "Независимые приложения, созданные с заботой.",
    "copyright": "ArcSmith Apps"
  },
  "legal": {
    "privacyPolicy": "Политика конфиденциальности",
    "terms": "Условия использования",
    "backTo": "Назад к"
  },
  "cta": {
    "learnMore": "Подробнее",
    "comingSoon": "Скоро",
    "getOnGooglePlay": "Скачать в Google Play"
  }
}
```

- [ ] **Step 5: Verify TypeScript resolves the module**

```bash
cd ~/Work/Projects/arcsmithapps.com && npx tsc --noEmit lib/i18n.ts 2>&1 | head -20
```

If there are import errors for `server-only`, install it:

```bash
npm install server-only
```

- [ ] **Step 6: Commit**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add lib/i18n.ts lib/dictionaries/
git commit -m "feat: Add i18n config and EN/PL/RU dictionaries"
```

---

### Task 3: Create proxy.ts for locale routing

**Files:**
- Create: `proxy.ts` (project root)

Next.js 16 renamed `middleware.ts` to `proxy.ts`. The exported function must be named `proxy`.

- [ ] **Step 1: Create `proxy.ts`**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";

const locales = ["en", "pl", "ru"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // If it's the default locale with prefix, redirect to remove it
    // e.g. /en/about -> /about
    if (
      pathname.startsWith(`/${defaultLocale}/`) ||
      pathname === `/${defaultLocale}`
    ) {
      const newPathname = pathname.replace(`/${defaultLocale}`, "") || "/";
      return NextResponse.redirect(new URL(newPathname, request.url));
    }
    // Non-default locale with prefix: pass through
    return;
  }

  // No locale prefix: rewrite to default locale path internally
  // e.g. /about -> /en/about (URL stays /about)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|apps/).*)",
  ],
};
```

- [ ] **Step 2: Verify the file is valid TypeScript**

```bash
cd ~/Work/Projects/arcsmithapps.com && npx tsc --noEmit proxy.ts 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add proxy.ts
git commit -m "feat: Add locale proxy for i18n routing"
```

---

### Task 4: Restructure app directory — move pages into [lang]

This task moves existing pages into the `[lang]` dynamic segment and splits the root layout.

**Files:**
- Modify: `app/layout.tsx` — strip to bare root (fonts + CSS only)
- Create: `app/[lang]/layout.tsx` — locale-aware layout with Header/Footer
- Move: `app/page.tsx` → `app/[lang]/page.tsx`
- Move: `app/[app]/page.tsx` → `app/[lang]/[app]/page.tsx`
- Move: `app/[app]/[doc]/page.tsx` → `app/[lang]/[app]/[doc]/page.tsx`

- [ ] **Step 1: Create directory structure**

```bash
cd ~/Work/Projects/arcsmithapps.com
mkdir -p app/\[lang\]/\[app\]/\[doc\]
mkdir -p app/\[lang\]/about
```

- [ ] **Step 2: Rewrite `app/layout.tsx` to bare root**

Replace contents with:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://arcsmithapps.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

Note: We add `latin-ext` (for Polish diacritics) and `cyrillic` (for Russian) subsets.

- [ ] **Step 3: Create `app/[lang]/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    title: {
      default: "ArcSmith Apps",
      template: "%s — ArcSmith Apps",
    },
    description: dict.hero.tagline,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, l === "en" ? "/" : `/${l}`])
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} className="font-sans">
      <body className="bg-bg-primary text-text-primary antialiased">
        <Header lang={lang as Locale} dict={dict} />
        <main className="pt-14">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create `app/[lang]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getAllApps } from "@/lib/apps";
import { FeaturedHero } from "@/components/sections/FeaturedHero";
import { AppGrid } from "@/components/sections/AppGrid";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const apps = getAllApps();
  const featured = apps.find((a) => a.featured) ?? apps[0];

  return (
    <div>
      <FeaturedHero app={featured} />

      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            {dict.appGrid.label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            {dict.appGrid.heading}
          </h2>
        </div>
        <AppGrid apps={apps} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `app/[lang]/[app]/page.tsx`**

Copy from original `app/[app]/page.tsx` and update params type to include `lang`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApp, getAllAppSlugs } from "@/lib/apps";
import { AppLandingHero } from "@/components/sections/AppLandingHero";
import { ShowcaseStrip } from "@/components/sections/ShowcaseStrip";
import { FeatureSpotlight } from "@/components/sections/FeatureSpotlight";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { AppLegal } from "@/components/sections/AppLegal";
import { hasLocale, locales } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string; app: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllAppSlugs();
  return locales.flatMap((lang) => slugs.map((app) => ({ lang, app })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { app: slug } = await params;
  const app = getApp(slug);
  if (!app) return { title: "Not Found" };

  return {
    title: app.name,
    description: `${app.tagline} — ${app.description}`,
  };
}

export default async function AppPage({ params }: PageProps) {
  const { lang, app: slug } = await params;
  if (!hasLocale(lang)) notFound();

  const app = getApp(slug);
  if (!app) notFound();

  const spotlightFeatures = app.features.slice(0, 3);
  const gridFeatures = app.features.slice(3);

  return (
    <div>
      <AppLandingHero app={app} />
      {app.showcase.length > 0 && (
        <ShowcaseStrip showcase={app.showcase} appName={app.name} />
      )}
      {spotlightFeatures.length > 0 && (
        <FeatureSpotlight
          features={spotlightFeatures}
          screenshots={app.screenshots}
          appName={app.name}
        />
      )}
      {gridFeatures.length > 0 && <FeatureGrid features={gridFeatures} />}
      <CtaBanner app={app} />
      <AppLegal appSlug={app.slug} appName={app.name} lang={lang} />
    </div>
  );
}
```

- [ ] **Step 6: Create `app/[lang]/[app]/[doc]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getLegalDoc, getAllLegalPaths } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string; app: string; doc: string }>;
}

export async function generateStaticParams() {
  const paths = getAllLegalPaths();
  return locales.flatMap((lang) =>
    paths.map((p) => ({ lang, app: p.app, doc: p.doc }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { app, doc } = await params;
  const legalDoc = getLegalDoc(app, doc);
  if (!legalDoc) return { title: "Not Found" };

  return {
    title: `${legalDoc.frontmatter.title} — ${legalDoc.frontmatter.appName}`,
    description: `${legalDoc.frontmatter.title} for ${legalDoc.frontmatter.appName}`,
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { lang, app, doc } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const legalDoc = getLegalDoc(app, doc);
  if (!legalDoc) notFound();

  const { content, frontmatter } = legalDoc;
  const prefix = lang === "en" ? "" : `/${lang}`;

  return (
    <div className="mx-auto max-w-3xl px-6 pt-20 pb-20">
      <Link
        href={`${prefix}/${app}`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        {dict.legal.backTo} {frontmatter.appName}
      </Link>

      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        {frontmatter.title}
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Last updated: {frontmatter.lastUpdated}
      </p>

      <article className="prose prose-invert mt-10 max-w-none">
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
```

- [ ] **Step 7: Delete old page files**

```bash
cd ~/Work/Projects/arcsmithapps.com
rm app/page.tsx
rm -rf app/\[app\]
```

- [ ] **Step 8: Commit**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add -A
git commit -m "feat: Restructure app directory with [lang] segment for i18n"
```

---

### Task 5: Update Header with About link and language switcher

**Files:**
- Modify: `components/layout/Header.tsx`

- [ ] **Step 1: Rewrite Header component**

```tsx
import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";
import { locales, defaultLocale } from "@/lib/i18n";

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

const localeLabels: Record<Locale, string> = {
  en: "EN",
  pl: "PL",
  ru: "RU",
};

function localePath(locale: Locale, path: string): string {
  return locale === defaultLocale ? path : `/${locale}${path}`;
}

export function Header({ lang, dict }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            href={localePath(lang, "/")}
            className="text-lg font-bold text-text-primary"
          >
            ArcSmith<span className="text-accent">.</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href={localePath(lang, "/about")}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {dict.nav.about}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1 text-xs">
          {locales.map((locale, i) => (
            <span key={locale} className="flex items-center">
              {i > 0 && (
                <span className="text-border mx-1">/</span>
              )}
              <Link
                href={localePath(locale, lang === defaultLocale ? "" : "")}
                className={`transition-colors ${
                  locale === lang
                    ? "text-text-primary font-medium"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {localeLabels[locale]}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
```

Note: The language switcher links to the root of each locale. For a current-page-preserving switcher, we would need client-side `usePathname()`, which can be done as a follow-up. For now, switching locale goes to the homepage of that locale.

- [ ] **Step 2: Commit**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add components/layout/Header.tsx
git commit -m "feat: Add About link and language switcher to Header"
```

---

### Task 6: Update Footer with dictionary strings

**Files:**
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Rewrite Footer component**

```tsx
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";

interface FooterProps {
  dict: Dictionary;
}

export function Footer({ dict }: FooterProps) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-lg font-bold text-text-primary">
            ArcSmith<span className="text-accent">.</span>
          </Link>

          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {dict.footer.copyright}.{" "}
            {dict.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add components/layout/Footer.tsx
git commit -m "feat: Update Footer to use dictionary strings"
```

---

### Task 7: Update AppLegal to accept locale

**Files:**
- Modify: `components/sections/AppLegal.tsx`

- [ ] **Step 1: Update AppLegal component**

```tsx
import Link from "next/link";
import { FileText, Shield } from "lucide-react";

interface AppLegalProps {
  appSlug: string;
  appName: string;
  lang?: string;
}

export function AppLegal({ appSlug, appName, lang }: AppLegalProps) {
  const prefix = !lang || lang === "en" ? "" : `/${lang}`;

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-wrap items-center gap-6 justify-center text-sm">
          <Link
            href={`${prefix}/${appSlug}/privacy-policy`}
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
          >
            <Shield size={14} />
            Privacy Policy
          </Link>
          <span className="text-border">|</span>
          <Link
            href={`${prefix}/${appSlug}/terms`}
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
          >
            <FileText size={14} />
            Terms of Service
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add components/sections/AppLegal.tsx
git commit -m "feat: Add locale prefix support to AppLegal links"
```

---

### Task 8: Create About page

**Files:**
- Create: `app/[lang]/about/page.tsx`

- [ ] **Step 1: Create About page**

```tsx
import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  return {
    title: dict.about.title,
    description: dict.about.paragraphs[0],
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-glow/40 to-transparent" />
        <div className="relative mx-auto max-w-[1200px] px-6 pt-24 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary">
            {dict.about.heroHeadline}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
          {dict.about.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            {dict.about.contact.heading}
          </h2>
          <div className="space-y-2 text-text-secondary">
            <a
              href={`mailto:${dict.about.contact.email}`}
              className="inline-flex items-center gap-2 hover:text-text-primary transition-colors"
            >
              <Mail size={16} />
              {dict.about.contact.email}
            </a>
            <p>{dict.about.contact.entity}</p>
            <p className="text-text-muted text-sm">{dict.about.contact.nip}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add app/\[lang\]/about/
git commit -m "feat: Add About page with i18n support"
```

---

### Task 9: Update sitemap for locale variants

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Rewrite sitemap.ts**

```ts
import type { MetadataRoute } from "next";
import { getAllApps } from "@/lib/apps";
import { getAllLegalPaths } from "@/lib/mdx";
import { locales, defaultLocale } from "@/lib/i18n";

function localeUrl(baseUrl: string, locale: string, path: string): string {
  return locale === defaultLocale
    ? `${baseUrl}${path}`
    : `${baseUrl}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://arcsmithapps.com";
  const now = new Date();

  const staticPages = ["/", "/about"];
  const appPages = getAllApps().map((app) => `/${app.slug}`);
  const legalPages = getAllLegalPaths().map((p) => `/${p.app}/${p.doc}`);
  const allPaths = [...staticPages, ...appPages, ...legalPages];

  return allPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: localeUrl(baseUrl, locale, path),
      lastModified: now,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, localeUrl(baseUrl, l, path)])
        ),
      },
    }))
  );
}
```

Note: `lib/i18n.ts` uses `import "server-only"` which cannot be imported from `sitemap.ts` since it runs at build time. If this causes an error, create a separate `lib/i18n-config.ts` without `server-only` that exports just `locales` and `defaultLocale`, and import from there in both `lib/i18n.ts` and `sitemap.ts`.

- [ ] **Step 2: Commit**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add app/sitemap.ts
git commit -m "feat: Update sitemap with locale variants and alternates"
```

---

### Task 10: Build and verify

- [ ] **Step 1: Run the build**

```bash
cd ~/Work/Projects/arcsmithapps.com && npm run build
```

Expected: All pages generate for all 3 locales. Routes should include:
- `/en`, `/en/about`, `/en/eloquote`, `/en/nicknamer`, etc.
- `/pl`, `/pl/about`, `/pl/eloquote`, etc.
- `/ru`, `/ru/about`, `/ru/eloquote`, etc.

- [ ] **Step 2: Fix any build errors**

Read error messages carefully. Common issues:
- `server-only` import in sitemap — extract locale config to a shared file
- Missing `lang` prop threading — check component interfaces
- `generateStaticParams` not returning all locale combos

- [ ] **Step 3: Verify pages locally**

```bash
cd ~/Work/Projects/arcsmithapps.com && npm run dev
```

Test in browser:
- `/about` — EN About page
- `/pl/about` — PL About page
- `/ru/about` — RU About page
- `/en/about` — should redirect to `/about`
- `/` — homepage in EN
- `/pl/` — homepage in PL
- `/eloquote` — app page works
- `/pl/eloquote` — app page works
- Language switcher in Header works
- About link in Header works

- [ ] **Step 4: Verify no old references remain**

```bash
cd ~/Work/Projects/arcsmithapps.com && grep -r "middleware" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules --exclude-dir=.next | head -20
```

Expected: No references to old `middleware.ts` convention.

- [ ] **Step 5: Commit any fixes**

```bash
cd ~/Work/Projects/arcsmithapps.com
git add -A
git commit -m "fix: Resolve build issues from i18n restructuring"
```

---

### Task 11: Final commit and push

- [ ] **Step 1: Verify clean build one more time**

```bash
cd ~/Work/Projects/arcsmithapps.com && npm run build
```

- [ ] **Step 2: Push**

```bash
cd ~/Work/Projects/arcsmithapps.com && git push
```

---

## Verification Checklist

After all tasks complete:

1. `npm run build` passes with no errors
2. `/about` renders EN About content with hero, 3 paragraphs, contact block
3. `/pl/about` renders PL About content
4. `/ru/about` renders RU About content
5. `/en/about` redirects to `/about`
6. `/en/` redirects to `/`
7. Header shows About link and language switcher on all pages
8. Language switcher highlights current locale
9. `<html lang>` matches locale on every page
10. Existing app pages work: `/eloquote`, `/pl/eloquote`, `/ru/eloquote`
11. Legal pages work: `/eloquote/terms`, `/pl/eloquote/terms`
12. Sitemap includes all locale variants with `alternates`
