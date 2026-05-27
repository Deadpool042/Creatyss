"use client";

import type { JSX } from "react";

import { AdminMobileInfoTile, AdminMobileLinkedCard } from "@/components/admin/tables";
import { Checkbox } from "@/components/ui/checkbox";
import { PRODUCT_CARD_COPY, PRODUCT_TABLE_COPY } from "@/features/admin/products/config";
import type { ProductListView, ProductTableItem } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";
import { AdminProductsCategoryCell } from "../admin-products-category-cell";
import { AdminProductsPriceCell } from "../admin-products-price-cell";
import {
  ProductCardActionMenu,
  ProductCardBadges,
  ProductCardFeaturedControl,
  ProductCardImage,
} from "./cards";

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
    <AdminMobileLinkedCard
      href={`/admin/products/${product.slug}/edit`}
      ariaLabel={PRODUCT_CARD_COPY.selectionAriaLabel(product.name)}
      className={cn(
        isSelected && "border-surface-border-strong bg-interactive-selected/20",
        "[@media(max-height:480px)]:rounded-lg [@media(max-height:480px)]:p-2.5"
      )}
    >
      <div className="relative z-10 mb-2.5 flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-xs font-medium text-foreground">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(product.id)}
            aria-label={PRODUCT_CARD_COPY.selectionAriaLabel(product.name)}
          />
          <span className="truncate">{PRODUCT_CARD_COPY.selectionLabel}</span>
        </label>

        <div className="flex shrink-0 items-center gap-1">
          <ProductCardFeaturedControl
            productId={product.id}
            isFeatured={product.isFeatured}
            className="p-0"
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

      <div className="relative z-10 flex items-start gap-2.5 [@media(max-height:480px)]:gap-2">
        <ProductCardImage
          product={product}
          sizes="(min-width: 667px) 44px, 48px"
          className="h-12 w-12 shrink-0 rounded-lg [@media(min-width:667px)]:h-11 [@media(min-width:667px)]:w-11 [@media(max-height:480px)]:h-10 [@media(max-height:480px)]:w-10"
          placeholderClassName="bg-muted"
        />

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-tight text-foreground [@media(min-width:667px)]:line-clamp-1 [@media(max-height:480px)]:line-clamp-1 [@media(max-height:480px)]:text-sm [@media(max-height:480px)]:leading-4">
            {product.name}
          </h3>

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

      <div className="relative z-10 mt-2 grid grid-cols-2 gap-1.5 [@media(max-height:480px)]:mt-1.5">
        <AdminMobileInfoTile
          label={PRODUCT_TABLE_COPY.columns.price}
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
        </AdminMobileInfoTile>

        <AdminMobileInfoTile
          label={PRODUCT_TABLE_COPY.columns.category}
          className="px-2.5 py-2 [@media(max-height:480px)]:px-2 [@media(max-height:480px)]:py-1.5"
          labelClassName="mb-1 block text-[9px]"
          bodyClassName="min-h-0 text-[13px] leading-5 [@media(max-height:480px)]:text-xs [@media(max-height:480px)]:leading-4"
        >
          <AdminProductsCategoryCell
            label={product.categoryPathLabel}
            className="line-clamp-2 wrap-break-word text-[13px] leading-5 [@media(max-height:480px)]:text-xs [@media(max-height:480px)]:leading-4"
          />
        </AdminMobileInfoTile>
      </div>
    </AdminMobileLinkedCard>
  );
}
