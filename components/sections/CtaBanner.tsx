"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { AppData } from "@/lib/apps";

interface CtaBannerProps {
  app: AppData;
}

export function CtaBanner({ app }: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#141e1a] to-transparent" />
      <div className="pointer-events-none absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.1)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            {app.tagline}
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-md mx-auto">
            {app.description}
          </p>

          <div className="mt-8">
            {app.status === "available" && app.playStoreUrl ? (
              <a
                href={app.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e4d3a] to-[#163d2e] px-8 py-4 text-base font-semibold text-[#d0e8dc] transition-all hover:shadow-[0_4px_20px_rgba(30,77,58,0.4)] cursor-pointer"
              >
                Download on Google Play
                <ExternalLink size={16} />
              </a>
            ) : (
              <div className="inline-flex flex-col items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-xl bg-accent-subtle px-8 py-4 text-base font-semibold text-accent border border-accent/20">
                  Coming Soon
                </span>
                <p className="text-sm text-text-muted">
                  We&apos;ll let you know when it&apos;s ready
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
