import Image from "next/image";

interface ScreenshotsProps {
  screenshots: string[];
  appName: string;
}

export function Screenshots({ screenshots, appName }: ScreenshotsProps) {
  if (screenshots.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
      {screenshots.map((src, i) => (
        <div
          key={src}
          className="relative shrink-0 w-[200px] h-[420px] overflow-hidden rounded-2xl border border-border shadow-sm snap-center"
        >
          <Image
            src={src}
            alt={`${appName} screenshot ${i + 1}`}
            fill
            className="object-cover object-top"
            sizes="200px"
          />
        </div>
      ))}
    </div>
  );
}
