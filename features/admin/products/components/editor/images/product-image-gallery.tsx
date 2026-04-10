"use client";

import type { JSX } from "react";

import type {
  AdminProductImageItem,
  ReorderProductImageResult,
} from "@/features/admin/products/editor/types";
import { ProductImageItem } from "./product-image-item";

type ProductImageGalleryProps = {
  productId: string;
  images: AdminProductImageItem[];
  onSetPrimary?: (mediaAssetId: string) => Promise<ReorderProductImageResult>;
  onDelete?: (imageId: string) => Promise<ReorderProductImageResult>;
  onUpdateAltText?: (imageId: string, altText: string) => Promise<ReorderProductImageResult>;
  onReorder?: (imageId: string, sortOrder: number) => Promise<ReorderProductImageResult>;
};

export function ProductImageGallery({
  productId,
  images,
  onSetPrimary,
  onDelete,
  onUpdateAltText,
  onReorder,
}: ProductImageGalleryProps): JSX.Element {
  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        Aucun média associé.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((image, index) => {
        const previous = images[index - 1] ?? null;
        const next = images[index + 1] ?? null;

        return (
          <ProductImageItem
            key={image.id}
            productId={productId}
            image={image}
            canMoveUp={previous !== null}
            canMoveDown={next !== null}
            previousSortOrder={previous?.sortOrder ?? null}
            nextSortOrder={next?.sortOrder ?? null}
            {...(onSetPrimary ? { onSetPrimary } : {})}
            {...(onDelete ? { onDelete } : {})}
            {...(onUpdateAltText ? { onUpdateAltText } : {})}
            {...(onReorder ? { onReorder } : {})}
          />
        );
      })}
    </div>
  );
}
