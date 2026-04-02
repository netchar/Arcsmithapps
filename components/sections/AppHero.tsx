"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import type { AppData } from "@/lib/apps";

interface AppHeroProps {
  app: AppData;
}

export function AppHero({ app }: AppHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#141e1a] via-bg-card to-[#111a16]">
      {/* Glow */}
      <div className="pointer-events-none absolute top-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.15)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-[-100px] left-[-50px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.1)_0%,transparent_70%)]" />

      <div className="relative flex flex-col lg:flex-row items-center gap-10 p-8 sm:p-12 lg:p-16">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="flex items-center gap-4 justify-center lg:justify-start mb-6">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-tertiary shadow-lg">
              <Image
                src={app.icon}
                alt={`${app.name} icon`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                {app.name}
              </h1>
              <p className="text-text-secondary mt-0.5">{app.tagline}</p>
            </div>
          </div>

          <p className="text-text-secondary leading-relaxed max-w-md mx-auto lg:mx-0">
            {app.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
            {app.status === "available" && app.playStoreUrl ? (
              <a
                href={app.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e4d3a] to-[#163d2e] px-6 py-3 text-sm font-semibold text-[#d0e8dc] transition-all hover:shadow-[0_4px_16px_rgba(30,77,58,0.3)] cursor-pointer"
              >
                Get on Google Play
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl bg-accent-subtle px-6 py-3 text-sm font-medium text-accent border border-accent/20">
                Coming Soon
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5 justify-center lg:justify-start">
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

        {/* Right: Phone mockups */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-4 items-start shrink-0"
        >
          {app.screenshots.slice(0, 2).map((src, i) => (
            <PhoneMockup
              key={src}
              src={src}
              alt={`${app.name} screenshot ${i + 1}`}
              className={`w-[155px] h-[330px] ${i === 1 ? "translate-y-6" : ""}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
