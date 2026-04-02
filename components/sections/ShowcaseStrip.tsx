"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ShowcaseItem } from "@/lib/apps";

interface ShowcaseStripProps {
  showcase: ShowcaseItem[];
  appName: string;
}

export function ShowcaseStrip({ showcase, appName }: ShowcaseStripProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium text-accent tracking-[0.2em] uppercase mb-3">
            App Preview
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            See it in action
          </h2>
        </motion.div>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-6 px-6 snap-x snap-mandatory scrollbar-hide">
        {/* Left spacer for centering on large screens */}
        <div className="shrink-0 w-[max(0px,calc((100vw-1200px)/2))]" />

        {showcase.map((item, i) => (
          <motion.div
            key={item.image}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="shrink-0 snap-center flex flex-col items-center rounded-2xl bg-gradient-to-b from-[#1a2420] to-[#111a16] border border-border p-6 pt-7 pb-5 w-[260px]"
          >
            <h3 className="text-[15px] font-bold text-text-primary text-center leading-tight mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-text-secondary text-center mb-5 leading-relaxed">
              {item.caption}
            </p>
            <div className="relative w-[190px] h-[411px] overflow-hidden rounded-[24px] border border-white/[0.06] bg-black shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <Image
                src={item.image}
                alt={`${appName} — ${item.title}`}
                fill
                className="object-cover object-top"
                sizes="190px"
              />
            </div>
          </motion.div>
        ))}

        {/* Right spacer */}
        <div className="shrink-0 w-[max(0px,calc((100vw-1200px)/2))]" />
      </div>
    </section>
  );
}
