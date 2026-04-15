"use client";

import Link from "next/link";
import type { JSX } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";
import { AdminProductsCategoryCell } from "./admin-products-category-cell";
import { AdminProductsPriceCell } from "./admin-products-price-cell";
import { ProductCardActionMenu } from "./mobile/cards/product-card-action-menu";
import { ProductCardBadges } from "./mobile/cards/product-card-badges";
import { ProductCardFeaturedControl } from "./mobile/cards/product-card-featured-control";
import { ProductCardImage } from "./mobile/cards/product-card-image";
import { ProductCardInfoTile } from "./mobile/cards/product-card-info-tile";

type ProductListView = "active" | "trash";

type ProductCollectionCardProps = {
  product: ProductTableItem;
  view: ProductListView;
  isSelected: boolean;
  onToggleSelection: (productId: string) => void;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
};

export function ProductCollectionCard({
  product,
  view,
  isSelected,
  onToggleSelection,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductCollectionCardProps): JSX.Element {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-surface-border bg-card p-3 shadow-card",
        isSelected && "border-surface-border-strong bg-interactive-selected/30",
        "[@media(max-height:480px)]:rounded-xl [@media(max-height:480px)]:p-2.5"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-xs font-medium text-foreground">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(product.id)}
            aria-label={`Sélectionner ${product.name}`}
          />
          <span className="truncate">Sélectionner</span>
        </label>

        <div className="flex shrink-0 items-center gap-1">
          <ProductCardFeaturedControl
            productId={product.id}
            isFeatured={product.isFeatured}
            className="p-0.5"
            buttonClassName="h-7 w-7 [@media(max-height:480px)]:h-6 [@media(max-height:480px)]:w-6"
            iconClassName="h-3.5 w-3.5"
          />
          <ProductCardActionMenu
            product={product}
            view={view}
            triggerClassName="h-7 w-7 [@media(max-height:480px)]:h-6 [@media(max-height:480px)]:w-6"
            {...(onConfirmArchive ? { onConfirmArchive } : {})}
            {...(onConfirmRestore ? { onConfirmRestore } : {})}
            {...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {})}
          />
        </div>
      </div>

      <div className="flex items-start gap-2.5 [@media(max-height:480px)]:gap-2">
        <ProductCardImage
          product={product}
          sizes="(min-width: 667px) 44px, 48px"
          className="h-12 w-12 shrink-0 rounded-xl [@media(min-width:667px)]:h-11 [@media(min-width:667px)]:w-11 [@media(max-height:480px)]:h-10 [@media(max-height:480px)]:w-10"
          placeholderClassName="bg-muted"
        />

        <div className="min-w-0 flex-1">
          <Link href={`/admin/products/${product.slug}/edit`} className="block">
            <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-tight text-foreground [@media(min-width:667px)]:line-clamp-1 [@media(max-height:480px)]:line-clamp-1 [@media(max-height:480px)]:text-sm [@media(max-height:480px)]:leading-4">
              {product.name}
            </h3>
          </Link>

          <div className="mt-1">
            <ProductCardBadges
              product={product}
              compact
              className="gap-1.5"
              statusClassName="h-6 px-2 text-[11px]"
              stockClassName="h-6 px-2 text-[11px]"
              metricClassName="h-6 px-2 text-[11px]"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 [@media(max-height:480px)]:mt-1.5">
        <ProductCardInfoTile
          label="Prix"
          className="px-2.5 py-2 [@media(max-height:480px)]:px-2 [@media(max-height:480px)]:py-1.5"
          labelClassName="mb-1 block text-[9px]"
          bodyClassName="min-h-0 text-[13px] leading-5 [@media(max-height:480px)]:text-xs [@media(max-height:480px)]:leading-4"
        >
          <AdminProductsPriceCell
            priceLabel={product.priceLabel}
            compareAtPriceLabel={product.compareAtPriceLabel}
            hasPromotion={product.hasPromotion}
            compact
          />
        </ProductCardInfoTile>

        <ProductCardInfoTile
          label="Catégorie"
          className="px-2.5 py-2 [@media(max-height:480px)]:px-2 [@media(max-height:480px)]:py-1.5"
          labelClassName="mb-1 block text-[9px]"
          bodyClassName="min-h-0 text-[13px] leading-5 [@media(max-height:480px)]:text-xs [@media(max-height:480px)]:leading-4"
        >
          <AdminProductsCategoryCell
            label={product.categoryPathLabel}
            className="line-clamp-2 wrap-break-word text-[13px] leading-5 [@media(max-height:480px)]:text-xs [@media(max-height:480px)]:leading-4"
          />
        </ProductCardInfoTile>
      </div>
    </article>
  );
}
