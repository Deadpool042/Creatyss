"use client";

import Link from "next/link";
import type { JSX } from "react";

import type { ProductTableItem } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";
import { AdminProductsCategoryCell } from "./admin-products-category-cell";
import { AdminProductsPriceCell } from "./admin-products-price-cell";
import { ProductCardActionMenu } from "./mobile/cards/product-card-action-menu";
import { ProductCardBadges } from "./mobile/cards/product-card-badges";
import { ProductCardFeaturedControl } from "./mobile/cards/product-card-featured-control";
import { ProductCardImage } from "./mobile/cards/product-card-image";
import { ProductCardInfoTile } from "./mobile/cards/product-card-info-tile";

type ProductCollectionCardProps = {
  product: ProductTableItem;
  onConfirmDelete?: (slug: string) => void | Promise<void>;
};

export function ProductCollectionCard({
  product,
  onConfirmDelete,
}: ProductCollectionCardProps): JSX.Element {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-surface-border bg-card p-3.5 shadow-card",
        "[@media(max-height:480px)]:p-3"
      )}
    >
      <div className="flex items-start gap-3">
        <ProductCardImage
          product={product}
          sizes="56px"
          className="h-14 w-14 shrink-0 rounded-lg [@media(max-height:480px)]:h-12 [@media(max-height:480px)]:w-12"
          placeholderClassName="bg-muted"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <Link href={`/admin/products/${product.slug}/edit`} className="block">
                <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-foreground [@media(max-height:480px)]:text-base">
                  {product.name}
                </h3>
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <ProductCardFeaturedControl productId={product.id} isFeatured={product.isFeatured} />
              <ProductCardActionMenu
                product={product}
                {...(onConfirmDelete ? { onConfirmDelete } : {})}
              />
            </div>
          </div>

          <ProductCardBadges
            product={product}
            className="mt-1.5 gap-1.5"
            statusClassName="h-6 px-2 text-[11px]"
            stockClassName="h-6 px-2 text-[11px]"
            metricClassName="h-6 px-2 text-[11px]"
          />
        </div>
      </div>

      <div className="mt-3 grid flex-1 grid-cols-2 gap-2 [@media(max-height:480px)]:mt-2.5">
        <ProductCardInfoTile
          label="Prix"
          className="px-3 py-2.5"
          labelClassName="mb-1.5 block"
          bodyClassName="min-h-12 text-sm leading-5"
        >
          <AdminProductsPriceCell
            priceLabel={product.priceLabel}
            compareAtPriceLabel={product.compareAtPriceLabel}
            hasPromotion={product.hasPromotion}
          />
        </ProductCardInfoTile>

        <ProductCardInfoTile
          label="Catégorie"
          className="px-3 py-2.5"
          labelClassName="mb-1.5 block"
          bodyClassName="min-h-12 text-sm leading-5"
        >
          <AdminProductsCategoryCell label={product.categoryPathLabel} />
        </ProductCardInfoTile>
      </div>
    </article>
  );
}
