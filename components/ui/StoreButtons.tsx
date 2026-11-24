import { ExternalLink } from "lucide-react";
import type { AppData } from "@/lib/apps";

export interface StoreButtonsDict {
  getOnGooglePlay: string;
  getOnAppStore: string;
  comingSoonAppStore: string;
}

interface StoreButtonsProps {
  app: AppData;
  dict: StoreButtonsDict;
  size?: "md" | "lg";
}

const SIZE_CLASSES = {
  md: "px-7 py-3.5 text-sm",
  lg: "px-8 py-4 text-base",
};

const LINK_CLASSES =
  "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e4d3a] to-[#163d2e] font-semibold text-[#d0e8dc] transition-all hover:shadow-[0_4px_20px_rgba(30,77,58,0.4)] cursor-pointer";

const LABEL_CLASSES =
  "inline-flex items-center gap-2 rounded-xl bg-accent-subtle font-semibold text-text-secondary border border-accent/20";

function StoreLink({ href, label, sizeClasses }: { href: string; label: string; sizeClasses: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${LINK_CLASSES} ${sizeClasses}`}>
      {label}
      <ExternalLink size={16} />
    </a>
  );
}

/** The store links of an available app: Google Play, and the App Store as a link or a "coming soon" label. */
export function StoreButtons({ app, dict, size = "md" }: StoreButtonsProps) {
  const sizeClasses = SIZE_CLASSES[size];
  const { appStore } = app;

  return (
    <>
      {app.playStoreUrl && (
        <StoreLink href={app.playStoreUrl} label={dict.getOnGooglePlay} sizeClasses={sizeClasses} />
      )}
      {appStore?.status === "available" && (
        <StoreLink href={appStore.url} label={dict.getOnAppStore} sizeClasses={sizeClasses} />
      )}
      {appStore?.status === "coming-soon" && (
        <span className={`${LABEL_CLASSES} ${sizeClasses}`}>{dict.comingSoonAppStore}</span>
      )}
    </>
  );
}
