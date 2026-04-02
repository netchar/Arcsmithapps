import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApp, getAllAppSlugs } from "@/lib/apps";
import { AppHero } from "@/components/sections/AppHero";
import { FeatureList } from "@/components/sections/FeatureList";
import { Screenshots } from "@/components/sections/Screenshots";

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

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20">
      {/* Hero card with phone mockups */}
      <AppHero app={app} />

      {/* Screenshots gallery */}
      {app.screenshots.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-semibold text-text-primary mb-8">
            Screenshots
          </h2>
          <Screenshots screenshots={app.screenshots} appName={app.name} />
        </section>
      )}

      {/* Features */}
      {app.features.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-semibold text-text-primary mb-8">
            Features
          </h2>
          <FeatureList features={app.features} />
        </section>
      )}
    </div>
  );
}
