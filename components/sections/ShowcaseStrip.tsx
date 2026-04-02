"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { ShowcaseItem } from "@/lib/apps";

interface ShowcaseStripProps {
  showcase: ShowcaseItem[];
  appName: string;
}

export function ShowcaseStrip({ showcase, appName }: ShowcaseStripProps) {
  const [active, setActive] = useState(0);
  const item = showcase[active];

  return (
    <section className="py-20 sm:py-28 bg-bg-secondary">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-medium text-accent tracking-[0.2em] uppercase mb-3">
            App Preview
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            See it in action
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Phone mockup — centered */}
          <div className="shrink-0 order-1 lg:order-2">
            <div className="relative w-[240px] h-[520px] overflow-hidden rounded-[32px] border border-white/[0.06] bg-black shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.image}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.image}
                    alt={`${appName} — ${item.title}`}
                    fill
                    className="object-cover object-top"
                    sizes="240px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Tab list + description */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="flex flex-col gap-2">
              {showcase.map((s, i) => (
                <button
                  key={s.image}
                  onClick={() => setActive(i)}
                  className={`text-left rounded-xl px-5 py-4 transition-all duration-300 cursor-pointer ${
                    i === active
                      ? "bg-bg-card border border-border-hover"
                      : "border border-transparent hover:bg-bg-card/50"
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      i === active ? "text-text-primary" : "text-text-muted"
                    }`}
                  >
                    {s.title}
                  </h3>
                  {i === active && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-text-secondary mt-1 leading-relaxed"
                    >
                      {s.caption}
                    </motion.p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
