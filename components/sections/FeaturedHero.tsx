"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { StarField } from "@/components/ui/StarField";
import { Constellation } from "@/components/ui/Constellation";
import { DistantPlanet } from "@/components/ui/DistantPlanet";

// Ursa Major — 7 stars, handle runs left→right, bowl on the right.
const URSA_MAJOR = {
  viewBox: "0 0 120 50",
  stars: [
    { cx: 5,   cy: 30 },              // Alkaid (handle tip)
    { cx: 25,  cy: 26 },              // Mizar
    { cx: 45,  cy: 22 },              // Alioth
    { cx: 65,  cy: 20 },              // Megrez (bowl corner, handle end)
    { cx: 85,  cy: 5,  peak: 0.95 },  // Dubhe (brightest in bowl)
    { cx: 115, cy: 15 },              // Merak
    { cx: 90,  cy: 32 },              // Phecda
  ],
  lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]] as const,
};

// Virgo — simplified bright stars around the "Y" backbone.
const VIRGO = {
  viewBox: "0 0 80 70",
  stars: [
    { cx: 5,  cy: 5  },              // Vindemiatrix
    { cx: 30, cy: 15 },              // Auva
    { cx: 45, cy: 25 },              // Porrima (junction)
    { cx: 75, cy: 22 },              // Zavijava
    { cx: 60, cy: 42 },              // Zaniah
    { cx: 55, cy: 62, peak: 1.0, r: 1.3 }, // Spica (brightest)
  ],
  lines: [[0,1],[1,2],[2,3],[2,4],[4,5]] as const,
};
import { localePath } from "@/lib/locale-path";
import type { AppData } from "@/lib/apps";

interface FeaturedHeroProps {
  app: AppData;
  lang: string;
  dict: {
    hero: { featured: string };
    cta: { learnMore: string; comingSoon: string };
  };
}

export function FeaturedHero({ app, lang, dict }: FeaturedHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient + glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#141e1a] via-bg-primary to-[#111a16]" />
      <div className="pointer-events-none absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.12)_0%,transparent_70%)]" />
      <StarField />
      <Constellation
        viewBox={URSA_MAJOR.viewBox}
        stars={URSA_MAJOR.stars}
        lines={URSA_MAJOR.lines}
        label="Ursa Major"
        className="pointer-events-none absolute"
        style={{ top: "8%", right: "4%", width: "clamp(140px, 18vw, 240px)", aspectRatio: "120 / 50" }}
      />
      <Constellation
        viewBox={VIRGO.viewBox}
        stars={VIRGO.stars}
        lines={VIRGO.lines}
        label="Virgo"
        className="pointer-events-none absolute"
        style={{ left: "3%", bottom: "10%", width: "clamp(90px, 11vw, 150px)", aspectRatio: "80 / 70" }}
      />
      <DistantPlanet
        size={8}
        glow={30}
        color="#d9c9a8"
        style={{ top: "24%", left: "6%" }}
      />
      <div className="pointer-events-none absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.08)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 text-center lg:text-left"
          >
            <p className="text-sm font-medium text-accent tracking-wide uppercase mb-4">
              {dict.hero.featured}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-[1.1]">
              {app.tagline}
            </h1>
            <p className="mt-5 text-lg text-text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0">
              {app.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href={localePath(lang, `/${app.slug}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e4d3a] to-[#163d2e] px-7 py-3.5 text-sm font-semibold text-[#d0e8dc] transition-all hover:shadow-[0_4px_20px_rgba(30,77,58,0.4)] cursor-pointer"
              >
                {dict.cta.learnMore}
                <ArrowRight size={16} />
              </Link>
              {app.status === "coming-soon" && (
                <span className="inline-flex items-center rounded-xl bg-accent-subtle px-5 py-3.5 text-sm font-medium text-accent border border-accent/20">
                  {dict.cta.comingSoon}
                </span>
              )}
            </div>
          </motion.div>

          {/* Right: Phone mockups */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-5 items-start shrink-0"
          >
            {app.screenshots.slice(0, 3).map((src, i) => (
              <PhoneMockup
                key={src}
                src={src}
                alt={`${app.name} screenshot ${i + 1}`}
                className={`w-[160px] h-[340px] sm:w-[185px] sm:h-[400px] ${
                  i === 1 ? "translate-y-10" : i === 2 ? "translate-y-4" : ""
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
