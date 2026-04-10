"use client";

import Image from "next/image";
import type { JSX } from "react";

import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { hasRealImage } from "@/core/media";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";

type ProductCardImageProps = {
  product: Pick<ProductTableItem, "name" | "primaryImageAlt" | "primaryImageUrl">;
  sizes: string;
  className?: string;
  imageClassName?: string;
  placeholderClassName?: string;
  placeholderImageClassName?: string;
};

export function ProductCardImage({
  product,
  sizes,
  className,
  imageClassName,
  placeholderClassName,
  placeholderImageClassName,
}: ProductCardImageProps): JSX.Element {
  const primaryImageUrl = product.primaryImageUrl;
  const primaryImageAlt = product.primaryImageAlt ?? product.name;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-surface-border bg-muted",
        className
      )}
    >
      {primaryImageUrl && hasRealImage(primaryImageUrl) ? (
        <Image
          src={primaryImageUrl}
          alt={primaryImageAlt}
          fill
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <PlaceholderImage
          alt={primaryImageAlt}
          className={cn("bg-muted", placeholderClassName)}
          imageClassName={cn("opacity-15", placeholderImageClassName)}
        />
      )}
    </div>
  );
}
