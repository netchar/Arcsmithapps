import fs from "fs";
import path from "path";
import matter from "gray-matter";

const LEGAL_DIR = path.join(process.cwd(), "content/legal");

export interface LegalDoc {
  content: string;
  frontmatter: {
    title: string;
    lastUpdated: string;
    appName: string;
  };
}

export function getLegalDoc(app: string, doc: string): LegalDoc | null {
  const filePath = path.join(LEGAL_DIR, app, `${doc}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  return {
    content,
    frontmatter: data as LegalDoc["frontmatter"],
  };
}

export function getAllLegalPaths(): { app: string; doc: string }[] {
  const paths: { app: string; doc: string }[] = [];
  if (!fs.existsSync(LEGAL_DIR)) return paths;

  const apps = fs.readdirSync(LEGAL_DIR);
  for (const app of apps) {
    const appDir = path.join(LEGAL_DIR, app);
    if (!fs.statSync(appDir).isDirectory()) continue;

    const docs = fs.readdirSync(appDir);
    for (const doc of docs) {
      if (doc.endsWith(".mdx")) {
        paths.push({ app, doc: doc.replace(".mdx", "") });
      }
    }
  }
  return paths;
}
