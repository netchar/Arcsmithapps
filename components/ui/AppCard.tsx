"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { AppData } from "@/lib/apps";

interface AppCardProps {
  app: AppData;
}

export function AppCard({ app }: AppCardProps) {
  const previewScreenshots = app.screenshots.slice(0, 3);

  return (
    <Link
      href={`/${app.slug}`}
      className="group relative block rounded-3xl border border-border bg-bg-card overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-[0_24px_80px_rgba(30,77,58,0.15)] cursor-pointer"
    >
      {/* Background glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,122,94,0.08),transparent_60%)]" />

      {/* Screenshot preview strip */}
      <div className="relative h-[180px] bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary overflow-hidden">
        {/* Ambient gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-card/60 via-transparent to-bg-card/60 z-10" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,240,236,1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,240,236,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Phone screenshots fan */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 pt-4">
          {previewScreenshots.map((src, i) => {
            const isCenter = i === 0;
            const rotation = i === 0 ? 0 : i === 1 ? 6 : -6;
            const translateY = isCenter ? 0 : 8;
            const scale = isCenter ? 1 : 0.9;

            return (
              <motion.div
                key={src}
                className="relative overflow-hidden rounded-xl shadow-2xl shadow-black/40"
                style={{
                  width: isCenter ? 80 : 68,
                  height: isCenter ? 160 : 140,
                  rotate: rotation,
                  y: translateY,
                  scale,
                  zIndex: isCenter ? 3 : 2 - i,
                  order: i === 2 ? -1 : i,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  sizes="80px"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-border group-hover:ring-accent/40 transition-all duration-500">
            <Image
              src={app.icon}
              alt={`${app.name} icon`}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors duration-300">
                {app.name}
              </h3>
              {app.status === "coming-soon" && (
                <span className="text-[9px] font-semibold uppercase tracking-widest text-accent/70 bg-accent/10 px-2 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted truncate">{app.tagline}</p>
          </div>

          <div className="h-8 w-8 rounded-full bg-bg-tertiary border border-border flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-300">
            <ArrowRight
              size={14}
              className="text-text-muted group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5"
            />
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">
          {app.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {app.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-bg-tertiary/80 text-text-muted border border-border/60"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
