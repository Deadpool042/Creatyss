import Image from "next/image";

export const PLACEHOLDER_FILENAME = "creatyss.webp";
const PLACEHOLDER_SRC = `/uploads/${PLACEHOLDER_FILENAME}`;

type PlaceholderImageProps = {
  alt?: string;
  className?: string;
};

export default function PlaceholderImage({
  alt = "Creatyss",
  className
}: PlaceholderImageProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface-subtle">
      <div className="relative h-1/3 w-1/2">
        <Image
          alt={alt}
          className={`object-contain opacity-20 ${className ?? ""}`.trim()}
          fill
          src={PLACEHOLDER_SRC}
        />
      </div>
    </div>
  );
}
