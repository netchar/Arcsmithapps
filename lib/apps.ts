import fs from "fs";
import path from "path";
import matter from "gray-matter";

const APPS_DIR = path.join(process.cwd(), "content/apps");

export interface AppFeature {
  title: string;
  description: string;
  icon: string;
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
  features: AppFeature[];
  tech: string[];
  description: string;
}

export function getApp(slug: string): AppData | null {
  const filePath = path.join(APPS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    ...(data as Omit<AppData, "description">),
    description: content.trim(),
  };
}

export function getAllApps(): AppData[] {
  if (!fs.existsSync(APPS_DIR)) return [];

  return fs
    .readdirSync(APPS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(".mdx", "");
      return getApp(slug)!;
    })
    .sort((a, b) => a.order - b.order);
}

export function getAllAppSlugs(): string[] {
  if (!fs.existsSync(APPS_DIR)) return [];

  return fs
    .readdirSync(APPS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
