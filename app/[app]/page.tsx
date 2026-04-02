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
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.1)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 py-20">
        <AppHero app={app} />

        {app.screenshots.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Screenshots
            </h2>
            <Screenshots screenshots={app.screenshots} appName={app.name} />
          </section>
        )}

        {app.features.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Features
            </h2>
            <FeatureList features={app.features} />
          </section>
        )}

        <section className="mt-16">
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            {app.description}
          </p>
        </section>
      </div>
    </div>
  );
}
