"use client";

import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
import { Pencil, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { hasRealImage } from "@/core/media";
import { ProductStatusBadge } from "@/features/admin/products/components/shared";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import {
  AdminProductsCategoryCell,
  AdminProductsPriceCell,
  ProductStockBadge,
} from "@/features/admin/products/components/list";

type ProductCompactCardProps = {
  product: ProductTableItem;
};

export function ProductCompactCard({ product }: ProductCompactCardProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-surface-border bg-card px-3 py-2.5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-surface-border bg-muted">
          {hasRealImage(product.primaryImageUrl) ? (
            <Image
              src={product.primaryImageUrl!}
              alt={product.primaryImageAlt ?? product.name}
              fill
              className="object-cover"
            />
          ) : (
            <PlaceholderImage
              alt={product.primaryImageAlt ?? product.name}
              className="bg-muted"
              imageClassName="opacity-15"
            />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/admin/products/${product.slug}/edit`} className="block">
                <p className="truncate text-sm font-semibold leading-tight">{product.name}</p>
              </Link>

              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <ProductStatusBadge status={product.status} />
                <ProductStockBadge state={product.stockState} quantity={product.stockQuantity} />

                <span className="rounded-full border border-surface-border bg-surface-panel-soft px-2 py-0.5 text-[11px] text-muted-foreground">
                  {product.variantCount} variante{product.variantCount > 1 ? "s" : ""}
                </span>

                {product.isFeatured ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-surface-border bg-surface-panel-soft px-2 py-0.5 text-[11px] text-muted-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    Mis en avant
                  </span>
                ) : null}
              </div>
            </div>

            <Button variant="outline" size="sm" asChild className="h-7 shrink-0 px-2">
              <Link href={`/admin/products/${product.slug}/edit`} className="inline-flex gap-1.5">
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-2.5 py-1.5">
              <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Prix</p>
              <AdminProductsPriceCell
                priceLabel={product.priceLabel}
                compareAtPriceLabel={product.compareAtPriceLabel}
                hasPromotion={product.hasPromotion}
              />
            </div>

            <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-2.5 py-2">
              <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                Catégorie
              </p>
              <AdminProductsCategoryCell label={product.categoryPathLabel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
