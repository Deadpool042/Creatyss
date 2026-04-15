"use client";

import Link from "next/link";
import type { JSX } from "react";

import { Card, CardContent } from "@/components/ui/card";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import { stripHtml } from "@/features/admin/products/list/utils";
import { AdminProductsCategoryCell } from "./admin-products-category-cell";
import { AdminProductsPriceCell } from "./admin-products-price-cell";
import { ProductCardActionMenu } from "./mobile/cards/product-card-action-menu";
import { ProductCardBadges } from "./mobile/cards/product-card-badges";
import { ProductCardFeaturedControl } from "./mobile/cards/product-card-featured-control";
import { ProductCardImage } from "./mobile/cards/product-card-image";
import { ProductCardInfoTile } from "./mobile/cards/product-card-info-tile";

type ProductListView = "active" | "trash";

type ProductMobileCardProps = {
  product: ProductTableItem;
  view: ProductListView;
  onConfirmArchive: ((slug: string) => void | Promise<void>) | undefined;
  onConfirmRestore: ((slug: string) => void | Promise<void>) | undefined;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
};

export function ProductMobileCard({
  product,
  view,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductMobileCardProps): JSX.Element {
  const shortDescription = product.shortDescription ? stripHtml(product.shortDescription) : null;

  return (
    <Card className="overflow-hidden rounded-2xl border border-surface-border bg-card shadow-card">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link href={`/admin/products/${product.slug}/edit`} className="block">
              <h2 className="line-clamp-2 text-2xl font-semibold leading-tight tracking-tight text-foreground">
                {product.name}
              </h2>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <ProductCardFeaturedControl productId={product.id} isFeatured={product.isFeatured} />
            <ProductCardActionMenu
              product={product}
              view={view}
              {...(onConfirmArchive ? { onConfirmArchive } : {})}
              {...(onConfirmRestore ? { onConfirmRestore } : {})}
              {...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {})}
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ProductCardImage
            product={product}
            sizes="72px"
            className="h-18 w-18 shrink-0 rounded-lg"
            placeholderClassName="bg-muted"
          />

          <div className="min-w-0 flex-1 pt-0.5">
            {shortDescription ? (
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                {shortDescription}
              </p>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">-</p>
            )}
          </div>
        </div>

        <ProductCardBadges product={product} />

        <div className="grid grid-cols-1 gap-2">
          <ProductCardInfoTile label="Prix">
            <AdminProductsPriceCell
              priceLabel={product.priceLabel}
              compareAtPriceLabel={product.compareAtPriceLabel}
              hasPromotion={product.hasPromotion}
            />
          </ProductCardInfoTile>

          <ProductCardInfoTile label="Catégorie">
            <AdminProductsCategoryCell label={product.categoryPathLabel} />
          </ProductCardInfoTile>
        </div>
      </CardContent>
    </Card>
  );
}
