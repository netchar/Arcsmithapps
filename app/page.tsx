import { getAllApps } from "@/lib/apps";
import { HomeHero } from "@/components/sections/HomeHero";
import { AppGrid } from "@/components/sections/AppGrid";

export default function HomePage() {
  const apps = getAllApps();

  return (
    <div className="relative">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.12)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
        <HomeHero />
        <AppGrid apps={apps} />
      </div>
    </div>
  );
}
