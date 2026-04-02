import Image from "next/image";

interface ScreenshotsProps {
  screenshots: string[];
  appName: string;
}

export function Screenshots({ screenshots, appName }: ScreenshotsProps) {
  if (screenshots.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
      {screenshots.map((src, i) => (
        <div key={src} className="shrink-0 snap-center">
          <div className="relative w-[220px] h-[440px] overflow-hidden rounded-[28px] border border-white/[0.06] bg-black shadow-[0_6px_24px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)]">
            <Image
              src={src}
              alt={`${appName} screenshot ${i + 1}`}
              fill
              className="object-cover object-top"
              sizes="220px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
