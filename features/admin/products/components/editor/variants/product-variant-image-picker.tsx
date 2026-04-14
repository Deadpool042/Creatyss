"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { JSX } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => {
        const checked = image.mediaAssetId === currentSelectedMediaAssetId;
        const displayName = image.originalName ?? "Média";
        const displayAltText =
          image.altText && image.altText.trim().length > 0 ? image.altText.trim() : null;

        return (
          <label key={image.id} className="block cursor-pointer">
            <input
              type="radio"
              name="primaryImageId"
              value={image.mediaAssetId}
              defaultChecked={checked}
              className="peer sr-only"
            />

            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel-soft shadow-sm transition-all",
                "hover:border-surface-border-strong hover:shadow-card",
                "peer-checked:border-primary peer-checked:bg-background peer-checked:shadow-card peer-checked:ring-2 peer-checked:ring-primary/20"
              )}
            >
              <Badge
                variant="secondary"
                className="absolute right-2 top-2 z-10 gap-1 opacity-0 shadow-sm transition-opacity peer-checked:opacity-100"
              >
                <Check className="size-3" />
                Sélectionnée
              </Badge>

              <div className="relative aspect-square overflow-hidden border-b border-surface-border bg-muted">
                {image.publicUrl ? (
                  <Image
                    src={image.publicUrl}
                    alt={image.altText ?? "Image produit"}
                    fill
                    className="object-cover transition-transform duration-200 peer-checked:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
                    Média indisponible
                  </div>
                )}
              </div>

              <div className="flex min-h-16 flex-col gap-1 px-3 py-3">
                <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                {displayAltText ? (
                  <p className="truncate text-xs text-muted-foreground">{displayAltText}</p>
                ) : null}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
