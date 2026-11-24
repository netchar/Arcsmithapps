import Image from "next/image";

interface PhoneMockupProps {
  src: string;
  alt: string;
  className?: string;
  /** The image already shows the device frame on a transparent background; give className a width only. */
  framed?: boolean;
}

/** Width to height of a framed phone image (the 600x1224 iPhone exports of the Eloquote store assets). */
export const FRAMED_PHONE_ASPECT = "aspect-[600/1224]";

export function PhoneMockup({ src, alt, className = "", framed = false }: PhoneMockupProps) {
  if (framed) {
    return (
      <div className={`relative ${FRAMED_PHONE_ASPECT} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          sizes="(max-width: 768px) 180px, 240px"
        />
      </div>
    );
  }

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
