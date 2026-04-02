import type { MetadataRoute } from "next";
import { getAllApps } from "@/lib/apps";
import { getAllLegalPaths } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://arcsmithapps.com";

  const appPages = getAllApps().map((app) => ({
    url: `${baseUrl}/${app.slug}`,
    lastModified: new Date(),
  }));

  const legalPages = getAllLegalPaths().map((p) => ({
    url: `${baseUrl}/${p.app}/${p.doc}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    ...appPages,
    ...legalPages,
  ];
}
