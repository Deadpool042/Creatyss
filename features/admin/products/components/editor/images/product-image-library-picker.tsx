"use client";

import Image from "next/image";
import type { JSX } from "react";

import type { AttachableMediaAssetItem } from "@/features/admin/products/editor/types";

type ProductImageLibraryPickerProps = {
  items: AttachableMediaAssetItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function ProductImageLibraryPicker({
  items,
  selectedIds,
  onToggle,
}: ProductImageLibraryPickerProps): JSX.Element {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        Aucun média disponible.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const checked = selectedIds.includes(item.id);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={[
              "overflow-hidden rounded-2xl border bg-card text-left shadow-sm transition",
              checked ? "border-foreground ring-1 ring-foreground/20" : "border-border hover:border-foreground/30",
            ].join(" ")}
          >
            <div className="relative aspect-4/3 overflow-hidden bg-muted">
              <Image
                src={item.publicUrl}
                alt={item.altText ?? item.originalFilename ?? "Média"}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-1 p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="line-clamp-1 text-sm font-medium text-foreground">
                  {item.originalFilename ?? "Média"}
                </p>
                <span
                  className={[
                    "mt-0.5 inline-flex h-4 w-4 shrink-0 rounded-full border",
                    checked ? "border-foreground bg-foreground" : "border-border bg-background",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </div>

              <p className="line-clamp-2 text-sm text-muted-foreground">
                {item.altText && item.altText.trim().length > 0 ? item.altText : "Sans texte alternatif"}
              </p>

              <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString("fr-FR")}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
