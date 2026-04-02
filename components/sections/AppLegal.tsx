import Link from "next/link";
import { FileText, Shield } from "lucide-react";

interface AppLegalProps {
  appSlug: string;
  appName: string;
}

export function AppLegal({ appSlug, appName }: AppLegalProps) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-wrap items-center gap-6 justify-center text-sm">
          <Link
            href={`/${appSlug}/privacy-policy`}
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
          >
            <Shield size={14} />
            Privacy Policy
          </Link>
          <span className="text-border">|</span>
          <Link
            href={`/${appSlug}/terms`}
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
          >
            <FileText size={14} />
            Terms of Service
          </Link>
        </div>
      </div>
    </section>
  );
}
