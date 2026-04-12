import type { MetadataRoute } from "next";
import { getAllApps } from "@/lib/apps";
import { getAllLegalPaths } from "@/lib/mdx";

const locales = ["en", "pl", "ru"];
const defaultLocale = "en";

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
