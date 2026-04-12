import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";

interface FooterProps {
  dict: Dictionary;
}

export function Footer({ dict }: FooterProps) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-lg font-bold text-text-primary">
            ArcSmith<span className="text-accent">.</span>
          </Link>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {dict.footer.copyright}.{" "}
            {dict.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
