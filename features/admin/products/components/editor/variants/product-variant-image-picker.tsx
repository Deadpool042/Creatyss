"use client";

import Image from "next/image";
import type { JSX } from "react";

import type { AdminProductImageItem } from "@/features/admin/products/editor/public";

type ProductVariantImagePickerProps = {
  images: AdminProductImageItem[];
  currentSelectedMediaAssetId: string;
};

export function ProductVariantImagePicker({
  images,
  currentSelectedMediaAssetId,
}: ProductVariantImagePickerProps): JSX.Element {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {images.map((image) => {
        const checked = image.mediaAssetId === currentSelectedMediaAssetId;

        return (
          <label
            key={image.id}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm"
          >
            <input
              type="radio"
              name="primaryImageId"
              value={image.mediaAssetId}
              defaultChecked={checked}
              className="size-4"
            />

            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
              {image.publicUrl ? (
                <Image
                  src={image.publicUrl}
                  alt={image.altText ?? "Image produit"}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate text-foreground">{image.originalName ?? "Média"}</p>
              <p className="truncate text-muted-foreground">{image.altText ?? "Sans texte alternatif"}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
