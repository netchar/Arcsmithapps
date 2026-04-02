import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApp, getAllAppSlugs } from "@/lib/apps";
import { AppLandingHero } from "@/components/sections/AppLandingHero";
import { ShowcaseStrip } from "@/components/sections/ShowcaseStrip";
import { FeatureSpotlight } from "@/components/sections/FeatureSpotlight";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { AppLegal } from "@/components/sections/AppLegal";

interface PageProps {
  params: Promise<{ app: string }>;
}

export async function generateStaticParams() {
  return getAllAppSlugs().map((app) => ({ app }));
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
  const { app: slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();

  // Split features: first 3 get spotlights, rest go in grid
  const spotlightFeatures = app.features.slice(0, 3);
  const gridFeatures = app.features.slice(3);

  return (
    <div>
      {/* Section 1: Full-width hero */}
      <AppLandingHero app={app} />

      {/* Section 2: Showcase strip with scrollable cards */}
      {app.showcase.length > 0 && (
        <ShowcaseStrip showcase={app.showcase} appName={app.name} />
      )}

      {/* Section 3: Feature spotlights — alternating layout */}
      {spotlightFeatures.length > 0 && (
        <FeatureSpotlight
          features={spotlightFeatures}
          screenshots={app.screenshots}
          appName={app.name}
        />
      )}

      {/* Section 4: Remaining features in grid */}
      {gridFeatures.length > 0 && (
        <FeatureGrid features={gridFeatures} />
      )}

      {/* Section 5: CTA Banner */}
      <CtaBanner app={app} />

      {/* Section 6: Legal links */}
      <AppLegal appSlug={app.slug} appName={app.name} />
    </div>
  );
}
