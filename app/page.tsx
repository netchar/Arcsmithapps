import { getAllApps } from "@/lib/apps";
import { AppCard } from "@/components/ui/AppCard";

export default function HomePage() {
  const apps = getAllApps();

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20">
      <div className="text-center max-w-xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-text-primary sm:text-5xl">
          ArcSmith<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 text-lg text-text-secondary leading-relaxed">
          Independent Android apps crafted with care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {apps.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </div>
    </div>
  );
}
