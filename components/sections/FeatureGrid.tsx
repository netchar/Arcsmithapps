"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { AppFeature } from "@/lib/apps";

interface FeatureGridProps {
  features: AppFeature[];
}

function getIcon(iconName: string) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName];
  return Icon ?? LucideIcons.Sparkles;
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-medium text-accent tracking-[0.2em] uppercase mb-3">
            And more
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Everything you need
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = getIcon(feature.icon);
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-border-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle border border-accent/15">
                  <Icon size={18} className="text-accent" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
