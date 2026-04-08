import Image from "next/image";

import { getMediaImagePlaceholderUrl } from "@/core/media";
import { cn } from "@/lib/utils";

type PlaceholderImageProps = {
  alt?: string;
  className?: string;
  imageClassName?: string;
};

export function PlaceholderImage({
  alt = "Creatyss",
  className,
  imageClassName,
}: PlaceholderImageProps) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center bg-muted/40", className)}>
      <div className="relative h-1/3 w-1/2">
        <Image
          alt={alt}
          className={cn("object-contain opacity-20", imageClassName)}
          fill
          src={getMediaImagePlaceholderUrl()}
        />
      </div>
    </div>
  );
}
