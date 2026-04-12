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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
