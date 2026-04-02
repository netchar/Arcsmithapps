"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import type { AppFeature } from "@/lib/apps";

interface FeatureSpotlightProps {
  features: AppFeature[];
  screenshots: string[];
  appName: string;
}

function getIcon(iconName: string) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName];
  return Icon ?? LucideIcons.Sparkles;
}

export function FeatureSpotlight({ features, screenshots, appName }: FeatureSpotlightProps) {
  return (
    <section>
      {features.map((feature, i) => {
        const Icon = getIcon(feature.icon);
        const isReversed = i % 2 === 1;
        // Use different screenshots for each spotlight, cycling through available ones
        const screenshotSrc = feature.screenshot ?? screenshots[i % screenshots.length];

        return (
          <div
            key={feature.title}
            className={`py-20 sm:py-28 ${
              i % 2 === 0
                ? "bg-gradient-to-br from-[#111a16]/50 to-transparent"
                : ""
            }`}
          >
            <div className="mx-auto max-w-[1200px] px-6">
              <div
                className={`flex flex-col items-center gap-12 lg:gap-20 ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                {/* Text side */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 text-center lg:text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-subtle border border-accent/15 mb-5 mx-auto lg:mx-0">
                    <Icon size={22} className="text-accent" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-text-secondary leading-relaxed max-w-md mx-auto lg:mx-0">
                    {feature.description}
                  </p>
                </motion.div>

                {/* Phone mockup side */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="shrink-0"
                >
                  <PhoneMockup
                    src={screenshotSrc}
                    alt={`${appName} — ${feature.title}`}
                    className="w-[220px] h-[477px]"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
