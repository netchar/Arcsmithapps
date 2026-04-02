import Link from "next/link";
import { getAllApps } from "@/lib/apps";

export function Footer() {
  const apps = getAllApps();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div>
            <p className="text-lg font-bold text-text-primary">
              ArcSmith<span className="text-accent">.</span>
            </p>
            <p className="mt-1 text-xs text-text-muted max-w-[280px]">
              Independent Android apps crafted with care.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[11px] text-text-muted">
            {apps.map((app, i) => (
              <span key={app.slug} className="inline-flex items-center gap-x-1">
                {i > 0 && <span className="mx-1.5 text-border">|</span>}
                <span>{app.name}:</span>
                <Link
                  href={`/${app.slug}/privacy-policy`}
                  className="hover:text-text-secondary transition-colors"
                >
                  Privacy
                </Link>
                <span className="mx-0.5">&middot;</span>
                <Link
                  href={`/${app.slug}/terms`}
                  className="hover:text-text-secondary transition-colors"
                >
                  Terms
                </Link>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} ArcSmith Apps
          </p>
        </div>
      </div>
    </footer>
  );
}
