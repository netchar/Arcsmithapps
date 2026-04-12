/**
 * Build a locale-aware path. EN (default) gets no prefix, other locales get /{locale} prefix.
 */
export function localePath(locale: string, path: string): string {
  return locale === "en" ? path : `/${locale}${path}`;
}
