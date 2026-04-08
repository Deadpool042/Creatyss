"use client";

import type { JSX } from "react";

import type { AdminProductImageItem } from "@/features/admin/products/editor/types";
import type {
  ProductImageReorderDirection,
  ReorderProductImageResult,
} from "@/features/admin/products/editor/types/product-image-reorder.types";
import { ProductImageItem } from "./product-image-item";

type ProductImageGalleryProps = {
  productId: string;
  images: AdminProductImageItem[];
  onSetPrimary?: (assetId: string) => Promise<ReorderProductImageResult>;
  onDelete?: (assetId: string) => Promise<ReorderProductImageResult>;
  onUpdateAltText?: (assetId: string, altText: string) => Promise<ReorderProductImageResult>;
  onReorder?: (
    assetId: string,
    direction: ProductImageReorderDirection
  ) => Promise<ReorderProductImageResult>;
};

function compareProductImages(left: AdminProductImageItem, right: AdminProductImageItem): number {
  if (left.sortOrder !== right.sortOrder) {
    return left.sortOrder - right.sortOrder;
  }

  return left.referenceId.localeCompare(right.referenceId);
}

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
      <div className="rounded-xl border border-dashed px-6 py-10 text-center">
        <p className="text-sm font-medium">Aucune image</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ce produit ne possède encore aucune image dans sa galerie.
        </p>
      </div>
    );
  }

  const orderedImages = [...images].sort(compareProductImages);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {orderedImages.map((image, index) => (
        <ProductImageItem
          key={image.referenceId}
          productId={productId}
          image={image}
          canMoveUp={index > 0}
          canMoveDown={index < orderedImages.length - 1}
          {...(onSetPrimary ? { onSetPrimary } : {})}
          {...(onDelete ? { onDelete } : {})}
          {...(onUpdateAltText ? { onUpdateAltText } : {})}
          {...(onReorder ? { onReorder } : {})}
        />
      ))}
    </div>
  );
}
