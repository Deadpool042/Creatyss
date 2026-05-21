// components/shared/placeholder-image.tsx
import Image from "next/image";

import { getMediaImagePlaceholderUrl } from "@/core/media";
import { cn } from "@/lib/utils";

type PlaceholderImageFit = "contain" | "cover";

type PlaceholderImageProps = {
  alt?: string;
  className?: string;
  imageClassName?: string;
  fit?: PlaceholderImageFit;
};

export function PlaceholderImage({
  alt = "",
  className,
  imageClassName,
  fit = "contain",
}: PlaceholderImageProps) {
  if (fit === "cover") {
    return (
      <div className={cn("absolute inset-0 bg-muted/40", className)}>
        <Image
          alt={alt}
          className={cn("object-cover", imageClassName)}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          src={getMediaImagePlaceholderUrl()}
          fill
        />
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 flex items-center justify-center bg-muted/40", className)}>
      <div className="relative h-1/3 w-1/2">
        <Image
          alt={alt}
          className={cn("object-contain opacity-20", imageClassName)}
          fill
          sizes="160px"
          src={getMediaImagePlaceholderUrl()}
        />
      </div>
    </div>
  );
}
