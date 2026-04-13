import fs from "fs";
import path from "path";
import matter from "gray-matter";

const APPS_DIR = path.join(process.cwd(), "content/apps");

export interface AppFeature {
  title: string;
  description: string;
  icon: string;
  screenshot?: string;
}

export interface ShowcaseItem {
  image: string;
  title: string;
  caption: string;
}

export interface AppData {
  name: string;
  slug: string;
  tagline: string;
  icon: string;
  playStoreUrl: string;
  status: "available" | "coming-soon";
  featured: boolean;
  order: number;
  screenshots: string[];
  showcase: ShowcaseItem[];
  features: AppFeature[];
  tech: string[];
  description: string;
}

function resolveFile(slug: string, locale: string = "en"): string | null {
  const localized = path.join(APPS_DIR, `${slug}.${locale}.mdx`);
  if (fs.existsSync(localized)) return localized;
  const fallback = path.join(APPS_DIR, `${slug}.en.mdx`);
  if (fs.existsSync(fallback)) return fallback;
  return null;
}

export function getApp(slug: string, locale: string = "en"): AppData | null {
  const filePath = resolveFile(slug, locale);
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    ...(data as Omit<AppData, "description" | "showcase">),
    description: content.trim(),
    showcase: (data as Record<string, unknown>).showcase as ShowcaseItem[] ?? [],
  };
}

export function getAllApps(locale: string = "en"): AppData[] {
  if (!fs.existsSync(APPS_DIR)) return [];

  return fs
    .readdirSync(APPS_DIR)
    .filter((f) => f.endsWith(".en.mdx"))
    .map((f) => {
      const slug = f.replace(".en.mdx", "");
      return getApp(slug, locale)!;
    })
    .sort((a, b) => a.order - b.order);
}

export function getAllAppSlugs(): string[] {
  if (!fs.existsSync(APPS_DIR)) return [];

  return fs
    .readdirSync(APPS_DIR)
    .filter((f) => f.endsWith(".en.mdx"))
    .map((f) => f.replace(".en.mdx", ""));
}
