import Link from "next/link";
import { localePath } from "@/lib/locale-path";
import type { Dictionary } from "@/lib/i18n";
import { LogoMark } from "@/components/ui/LogoMark";

interface FooterProps {
  lang: string;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href={localePath(lang, "/")}
            className="flex items-center gap-2 text-lg font-bold text-text-primary"
          >
            <LogoMark size={56} className="text-accent" title="ArcSmith" />
            <span>
              ArcSmith<span className="text-accent">.</span>
            </span>
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
