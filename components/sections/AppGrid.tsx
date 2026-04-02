"use client";

import { motion } from "framer-motion";
import { AppCard } from "@/components/ui/AppCard";
import type { AppData } from "@/lib/apps";

interface AppGridProps {
  apps: AppData[];
}

export function AppGrid({ apps }: AppGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      {apps.map((app, i) => (
        <motion.div
          key={app.slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2 + i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <AppCard app={app} />
        </motion.div>
      ))}
    </div>
  );
}
