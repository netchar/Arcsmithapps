import Image from "next/image";

interface PhoneMockupProps {
  src: string;
  alt: string;
  className?: string;
}

export function PhoneMockup({ src, alt, className = "" }: PhoneMockupProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-black shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 180px, 220px"
      />
    </div>
  );
}
