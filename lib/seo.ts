import { defaultLocale, locales, type Locale } from "@/lib/i18n";

function localePath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Return the canonical URL and matching hreflang URLs for one logical page.
 * English is served at the unprefixed URL; other locales use a path prefix.
 */
export function pageAlternates(locale: Locale, path: string) {
  const englishPath = localePath(defaultLocale, path);

  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(
        locales.map((supportedLocale) => [
          supportedLocale,
          localePath(supportedLocale, path),
        ])
      ),
      "x-default": englishPath,
    },
  };
}
