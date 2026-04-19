import Image from "next/image";
import markSrc from "../../public/brand/mark.png";

interface BrandMarkProps {
  size?: number;
  className?: string;
  title?: string;
}

export function BrandMark({ size = 24, className, title }: BrandMarkProps) {
  return (
    <Image
      src={markSrc}
      width={size}
      height={size}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      className={className}
      priority
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
