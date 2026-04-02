import { getAllApps } from "@/lib/apps";
import { FeaturedHero } from "@/components/sections/FeaturedHero";
import { AppGrid } from "@/components/sections/AppGrid";

export default function HomePage() {
  const apps = getAllApps();
  const featured = apps.find((a) => a.featured) ?? apps[0];

  return (
    <div>
      <FeaturedHero app={featured} />

      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <h2 className="text-xl font-semibold text-text-primary mb-8">Our Apps</h2>
        <AppGrid apps={apps} />
      </div>
    </div>
  );
}
