"use client";

import type { JSX } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AttachableMediaAssetItem } from "@/features/admin/products/editor/types";

type ProductImageLibraryPickerProps = {
  items: AttachableMediaAssetItem[];
  selectedAssetIds: string[];
  onToggle: (assetId: string) => void;
};

export function ProductImageLibraryPicker({
  items,
  selectedAssetIds,
  onToggle,
}: ProductImageLibraryPickerProps): JSX.Element {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-10 text-center">
        <p className="text-sm font-medium">Aucun média disponible</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tous les médias image disponibles sont déjà associés à ce produit, ou la médiathèque est
          vide.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const checked = selectedAssetIds.includes(item.id);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={cn(
              "group overflow-hidden rounded-2xl border text-left transition",
              checked
                ? "border-primary ring-2 ring-primary/25"
                : "border-border/60 hover:border-border"
            )}
          >
            <div className="relative aspect-4/3 overflow-hidden bg-muted">
              <Image
                src={item.publicUrl}
                alt={item.altText ?? item.originalFilename ?? "Média"}
                fill
                className="object-cover transition group-hover:scale-[1.01]"
              />

              <div className="absolute left-3 top-3">
                <span
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full border bg-background/90",
                    checked ? "border-primary text-primary" : "border-border/60 text-transparent"
                  )}
                >
                  <Check className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="space-y-1 px-3 py-3">
              <p className="line-clamp-2 text-sm font-medium">
                {item.altText?.trim().length
                  ? item.altText
                  : (item.originalFilename ?? "Sans titre")}
              </p>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {item.originalFilename ?? "Fichier sans nom"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
