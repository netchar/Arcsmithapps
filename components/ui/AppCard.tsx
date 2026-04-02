import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { AppData } from "@/lib/apps";

interface AppCardProps {
  app: AppData;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link
      href={`/${app.slug}`}
      className="group relative block rounded-2xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-border-hover hover:shadow-[0_8px_40px_rgba(30,77,58,0.12)] cursor-pointer"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(30,77,58,0.08),transparent_70%)]" />

      <div className="relative flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px]">
          <Image
            src={app.icon}
            alt={`${app.name} icon`}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors duration-300">
              {app.name}
            </h3>
            {app.status === "coming-soon" && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded-full border border-accent/20">
                Soon
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted mt-0.5">{app.tagline}</p>
        </div>

        <ArrowRight
          size={16}
          className="text-text-muted group-hover:text-accent transition-all duration-300 group-hover:translate-x-1 shrink-0 mt-1"
        />
      </div>

      <p className="relative mt-4 text-sm text-text-secondary leading-relaxed line-clamp-2">
        {app.description}
      </p>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {app.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-md bg-bg-tertiary text-text-muted border border-border"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
