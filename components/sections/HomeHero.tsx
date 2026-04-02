"use client";

import { motion } from "framer-motion";

export function HomeHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center max-w-2xl mx-auto mb-20"
    >
      <h1 className="text-5xl font-bold text-text-primary sm:text-6xl tracking-tight">
        ArcSmith<span className="text-accent">.</span>
      </h1>
      <p className="mt-5 text-lg text-text-secondary leading-relaxed">
        Independent Android apps crafted with care — built with Kotlin, Jetpack Compose, and a passion for great design.
      </p>
    </motion.div>
  );
}
