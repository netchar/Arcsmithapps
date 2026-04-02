import { getAllApps } from "@/lib/apps";
import { FeaturedHero } from "@/components/sections/FeaturedHero";
import { AppGrid } from "@/components/sections/AppGrid";

export default function HomePage() {
  const apps = getAllApps();
  const featured = apps.find((a) => a.featured) ?? apps[0];

  return (
    <div>
      <FeaturedHero app={featured} />

      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Our Apps</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">Crafted with care</h2>
        </div>
        <AppGrid apps={apps} />
      </div>
    </div>
  );
}
