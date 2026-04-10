"use client";

import type { JSX } from "react";

import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types";
import { ProductVariantItem } from "./product-variant-item";

type ProductVariantListProps = {
  productId: string;
  productSlug: string;
  variants: AdminProductVariantListItem[];
  onEdit: (variantId: string) => void;
  onSetDefault?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
  onDelete?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
};

export function ProductVariantList({
  productId,
  productSlug,
  variants,
  onEdit,
  onSetDefault,
  onDelete,
}: ProductVariantListProps): JSX.Element {
  if (variants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        Aucune variante définie.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {variants.map((variant) => (
        <ProductVariantItem
          key={variant.id}
          productId={productId}
          productSlug={productSlug}
          variant={variant}
          onEdit={onEdit}
          {...(onSetDefault ? { onSetDefault } : {})}
          {...(onDelete ? { onDelete } : {})}
        />
      ))}
    </div>
  );
}
