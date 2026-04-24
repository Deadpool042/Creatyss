"use client";

import type { JSX } from "react";

import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types";
import { ProductVariantItem } from "./product-variant-item";

type ProductVariantListProps = {
  variants: AdminProductVariantListItem[];
  onEdit: (variantId: string) => void;
  onSetDefault?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
  onDelete?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
};

export function ProductVariantList({
  variants,
  onEdit,
  onSetDefault,
  onDelete,
}: ProductVariantListProps): JSX.Element {
  if (variants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-muted/20 px-4 py-7 text-center text-sm text-muted-foreground">
        Aucune variante définie pour ce produit.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-5">
      {variants.map((variant, index) => (
        <ProductVariantItem
          key={variant.id}
          variant={variant}
          position={index + 1}
          total={variants.length}
          hasOtherVariants={variants.length > 1}
          onEdit={onEdit}
          {...(onSetDefault ? { onSetDefault } : {})}
          {...(onDelete ? { onDelete } : {})}
        />
      ))}
    </div>
  );
}
