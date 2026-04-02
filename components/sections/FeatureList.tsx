import * as LucideIcons from "lucide-react";
import type { AppFeature } from "@/lib/apps";

interface FeatureListProps {
  features: AppFeature[];
}

function getIcon(iconName: string) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName];
  return Icon ?? LucideIcons.Sparkles;
}

export function FeatureList({ features }: FeatureListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature) => {
        const Icon = getIcon(feature.icon);
        return (
          <div
            key={feature.title}
            className="rounded-xl border border-border bg-bg-secondary/50 p-5 transition-colors hover:border-border-hover"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-subtle border border-accent/10">
              <Icon size={16} className="text-accent" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-text-primary">
              {feature.title}
            </h3>
            <p className="mt-1 text-sm text-text-muted leading-relaxed">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
