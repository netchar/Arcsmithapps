"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import type { AppData } from "@/lib/apps";

interface FeaturedHeroProps {
  app: AppData;
}

export function FeaturedHero({ app }: FeaturedHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient + glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#141e1a] via-bg-primary to-[#111a16]" />
      <div className="pointer-events-none absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.12)_0%,transparent_70%)]" />
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
              Featured App
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-[1.1]">
              {app.tagline.split(" ").slice(0, -1).join(" ")}{" "}
              <br />
              {app.tagline.split(" ").slice(-1)}
            </h1>
            <p className="mt-5 text-lg text-text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0">
              {app.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href={`/${app.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e4d3a] to-[#163d2e] px-7 py-3.5 text-sm font-semibold text-[#d0e8dc] transition-all hover:shadow-[0_4px_20px_rgba(30,77,58,0.4)] cursor-pointer"
              >
                Learn more
                <ArrowRight size={16} />
              </Link>
              {app.status === "coming-soon" && (
                <span className="inline-flex items-center rounded-xl bg-accent-subtle px-5 py-3.5 text-sm font-medium text-accent border border-accent/20">
                  Coming Soon
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
