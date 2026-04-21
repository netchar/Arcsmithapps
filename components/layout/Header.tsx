import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";
import { locales, defaultLocale } from "@/lib/i18n";
import { LogoMark } from "@/components/ui/LogoMark";

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
            className="flex items-center gap-2 text-lg font-bold text-text-primary"
          >
            <LogoMark size={36} className="text-accent" title="ArcSmith" />
            <span>
              ArcSmith<span className="text-accent">.</span>
            </span>
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
              {i > 0 && <span className="text-border mx-1">/</span>}
              <Link
                href={localePath(locale, "/")}
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
