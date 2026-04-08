"use client";

import type { JSX } from "react";

import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types/product-variants.types";
import { ProductVariantItem } from "./product-variant-item";

type ProductVariantListProps = {
  variants: AdminProductVariantListItem[];
  onEdit?: (variantId: string) => void;
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
      <div className="rounded-xl border border-dashed px-6 py-10 text-center">
        <p className="text-sm font-medium">Aucune variante</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ce produit ne possède encore aucune variante.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4 xl:gap-5">
      {variants.map((variant) => (
        <ProductVariantItem
          key={variant.id}
          variant={variant}
          variantCount={variants.length}
          {...(onEdit ? { onEdit } : {})}
          {...(onSetDefault ? { onSetDefault } : {})}
          {...(onDelete ? { onDelete } : {})}
        />
      ))}
    </div>
  );
}
