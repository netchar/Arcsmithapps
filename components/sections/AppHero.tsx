import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { AppData } from "@/lib/apps";

interface AppHeroProps {
  app: AppData;
}

export function AppHero({ app }: AppHeroProps) {
  return (
    <div className="relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.12)_0%,transparent_70%)]" />

      <div className="relative flex flex-col sm:flex-row items-start gap-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-border bg-bg-tertiary shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Image
            src={app.icon}
            alt={`${app.name} icon`}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl tracking-tight">
            {app.name}
          </h1>
          <p className="mt-1 text-lg text-text-secondary">{app.tagline}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {app.status === "available" && app.playStoreUrl ? (
              <a
                href={app.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e4d3a] to-[#163d2e] px-6 py-3 text-sm font-medium text-[#d0e8dc] transition-all hover:shadow-[0_4px_16px_rgba(30,77,58,0.3)] cursor-pointer"
              >
                Get on Google Play
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl bg-accent-subtle px-6 py-3 text-sm font-medium text-accent border border-accent/20">
                Coming Soon
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {app.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-lg bg-bg-tertiary text-text-muted border border-border"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
