import Image from "next/image";
import type { JSX } from "react";

import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { hasRealImage } from "@/core/media";
import { cn } from "@/lib/utils";

type AdminThumbnailProps = Readonly<{
  src: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
}>;

export function AdminThumbnail({
  src,
  alt,
  className,
  imageClassName,
  fallbackLabel,
}: AdminThumbnailProps): JSX.Element {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {hasRealImage(src) ? (
        <Image src={src!} alt={alt} fill className={cn("object-cover", imageClassName)} sizes="44px" />
      ) : (
        <>
          <PlaceholderImage alt={alt} className="bg-muted" imageClassName="opacity-15" />
          {fallbackLabel ? <span className="sr-only">{fallbackLabel}</span> : null}
        </>
      )}
    </div>
  );
}
