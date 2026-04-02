"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import type { AppData } from "@/lib/apps";

interface AppLandingHeroProps {
  app: AppData;
}

export function AppLandingHero({ app }: AppLandingHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141e1a] via-[#111a16] to-bg-primary" />

      {/* Decorative glows */}
      <div className="pointer-events-none absolute top-[-200px] left-[-100px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.14)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.08)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[1200px] px-6 pt-20 pb-28 sm:pt-28 sm:pb-36">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 text-center lg:text-left"
          >
            {/* App identity */}
            <div className="flex items-center gap-4 justify-center lg:justify-start mb-8">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                <Image
                  src={app.icon}
                  alt={`${app.name} icon`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                  {app.name}
                </h1>
                <p className="text-sm text-text-secondary">{app.tagline}</p>
              </div>
            </div>

            {/* Headline — the tagline, displayed BIG */}
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-text-primary tracking-tight leading-[1.08]">
              {app.tagline}
            </h2>

            <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0">
              {app.description}
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              {app.status === "available" && app.playStoreUrl ? (
                <a
                  href={app.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e4d3a] to-[#163d2e] px-7 py-3.5 text-sm font-semibold text-[#d0e8dc] transition-all hover:shadow-[0_4px_20px_rgba(30,77,58,0.4)] cursor-pointer"
                >
                  Get on Google Play
                  <ExternalLink size={16} />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl bg-accent-subtle px-7 py-3.5 text-sm font-semibold text-accent border border-accent/20">
                  Coming Soon
                </span>
              )}
            </div>

            {/* Tech stack */}
            <div className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start">
              {app.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] text-text-muted border border-white/[0.06]"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: 3 staggered phone mockups */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-5 items-start shrink-0"
          >
            {app.screenshots.slice(0, 3).map((src, i) => (
              <PhoneMockup
                key={src}
                src={src}
                alt={`${app.name} screenshot ${i + 1}`}
                className={`w-[150px] h-[325px] sm:w-[175px] sm:h-[379px] ${
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
