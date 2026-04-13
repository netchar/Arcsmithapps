import { notFound } from "next/navigation";
import { getAllApps } from "@/lib/apps";
import { FeaturedHero } from "@/components/sections/FeaturedHero";
import { AppGrid } from "@/components/sections/AppGrid";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const apps = getAllApps(lang);
  const featured = apps.find((a) => a.featured) ?? apps[0];

  return (
    <div>
      <FeaturedHero app={featured} lang={lang} dict={dict} />
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            {dict.appGrid.label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            {dict.appGrid.heading}
          </h2>
        </div>
        <AppGrid apps={apps} lang={lang} />
      </div>
    </div>
  );
}
