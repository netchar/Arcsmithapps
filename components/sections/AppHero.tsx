import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { AppData } from "@/lib/apps";
import { TechBadge } from "@/components/ui/TechBadge";

interface AppHeroProps {
  app: AppData;
}

export function AppHero({ app }: AppHeroProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-border shadow-sm">
        <Image
          src={app.icon}
          alt={`${app.name} icon`}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          {app.name}
        </h1>
        <p className="mt-1 text-lg text-text-secondary">{app.tagline}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {app.status === "available" && app.playStoreUrl ? (
            <a
              href={app.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Get on Google Play
              <ExternalLink size={14} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl bg-accent-subtle px-5 py-2.5 text-sm font-medium text-accent border border-accent/20">
              Coming Soon
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {app.tech.map((t) => (
            <TechBadge key={t} label={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
