import Image from "next/image";
import type { ShowcaseItem } from "@/lib/apps";

interface ScreenshotsProps {
  showcase: ShowcaseItem[];
  appName: string;
}

export function Screenshots({ showcase, appName }: ScreenshotsProps) {
  if (showcase.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
      {showcase.map((item) => (
        <div
          key={item.image}
          className="shrink-0 snap-center flex flex-col items-center rounded-2xl bg-gradient-to-b from-[#1a2420] to-[#111a16] border border-border p-6 pt-7 pb-5 w-[280px]"
        >
          {/* Caption */}
          <h3 className="text-base font-bold text-text-primary text-center leading-tight mb-1">
            {item.title}
          </h3>
          <p className="text-xs text-text-secondary text-center mb-4 leading-relaxed">
            {item.caption}
          </p>

          {/* Phone frame */}
          <div className="relative w-[200px] h-[433px] overflow-hidden rounded-[24px] border border-white/[0.06] bg-black shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <Image
              src={item.image}
              alt={`${appName} — ${item.title}`}
              fill
              className="object-cover object-top"
              sizes="200px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
