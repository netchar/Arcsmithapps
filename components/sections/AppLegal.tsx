import Link from "next/link";
import { FileText, Shield } from "lucide-react";
import { localePath } from "@/lib/locale-path";

interface AppLegalProps {
  appSlug: string;
  appName: string;
  lang: string;
  dict: {
    legal: { privacyPolicy: string; terms: string };
  };
}

export function AppLegal({ appSlug, appName, lang, dict }: AppLegalProps) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-wrap items-center gap-6 justify-center text-sm">
          <Link
            href={localePath(lang, `/${appSlug}/privacy-policy`)}
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
          >
            <Shield size={14} />
            {dict.legal.privacyPolicy}
          </Link>
          <span className="text-border">|</span>
          <Link
            href={localePath(lang, `/${appSlug}/terms`)}
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
          >
            <FileText size={14} />
            {dict.legal.terms}
          </Link>
        </div>
      </div>
    </section>
  );
}
