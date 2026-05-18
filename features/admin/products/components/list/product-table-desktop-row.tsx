"use client";

import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Checkbox } from "@/components/ui/checkbox";
import { hasRealImage } from "@/core/media";
import { toggleProductFeaturedAction } from "@/features/admin/products/list/actions/toggle-product-featured.action";
import type { ProductTableItem } from "@/features/admin/products/list/types/product-table.types";
import { ProductStatusBadge } from "@/features/admin/products/components/shared/product-status-badge";
import { AdminProductsCategoryCell } from "./admin-products-category-cell";
import { AdminProductsPriceCell } from "./admin-products-price-cell";
import { ProductFeaturedToggle } from "./product-featured-toggle";
import { ProductStockBadge } from "./product-stock-badge";
import { ProductTableRowActions } from "./product-table-row-actions";

type ProductListView = "active" | "trash";

type ProductTableDesktopRowProps = Readonly<{
  product: ProductTableItem;
  isSelected: boolean;
  onToggleProductSelection: (productId: string) => void;
  view: ProductListView;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
}>;

function getVariantLabel(variantCount: number): string {
  if (variantCount <= 1) return "Simple";
  return `${variantCount} variantes`;
}

export function ProductTableDesktopRow({
  product,
  isSelected,
  onToggleProductSelection,
  view,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductTableDesktopRowProps): JSX.Element {
  return (
    <tr className="group border-b border-surface-border/30 transition-colors duration-150 hover:bg-surface-subtle/40">
      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleProductSelection(product.id)}
            aria-label={`Sélectionner ${product.name}`}
          />
        </div>
      </td>

      <td className="px-3 py-2.5 align-middle">
        <div className="relative h-9 w-9 overflow-hidden rounded-md border border-surface-border/40 bg-surface-subtle/50">
          {hasRealImage(product.primaryImageUrl) ? (
            <Image
              src={product.primaryImageUrl!}
              alt={product.primaryImageAlt ?? product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="44px"
            />
          ) : (
            <PlaceholderImage
              alt={product.primaryImageAlt ?? product.name}
              className="bg-muted"
              imageClassName="opacity-15"
            />
          )}
        </div>
      </td>

      <td className="px-4 py-2.5 align-middle">
        <Link href={`/admin/products/${product.slug}/edit`} className="group/link block min-w-0">
          <span className="line-clamp-1 font-medium leading-snug text-foreground group-hover/link:underline">
            {product.name}
          </span>
          <div className="mt-0.5">
            <span className="inline-flex items-center rounded-md border border-surface-border/50 bg-surface-panel-soft px-2 py-0.5 text-[11px] text-muted-foreground/80">
              {getVariantLabel(product.variantCount)}
            </span>
          </div>
          <div className="mt-1 hidden min-w-0 items-center gap-1.5 text-xs text-muted-foreground/60 lg:flex xl:hidden">
            <span className="line-clamp-1">{getVariantLabel(product.variantCount)}</span>
            <span aria-hidden="true">·</span>
            <span className="line-clamp-1 tabular-nums font-medium text-foreground/85">
              {product.priceLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="line-clamp-1">{product.categoryPathLabel}</span>
          </div>
        </Link>
      </td>

      <td className="px-4 py-2.5 align-middle text-center">
        <ProductFeaturedToggle
          productId={product.id}
          isFeatured={product.isFeatured}
          onToggle={toggleProductFeaturedAction}
        />
      </td>

      <td className="px-4 py-2.5 align-middle">
        <ProductStatusBadge status={product.status} />
      </td>

      <td className="px-4 py-2.5 align-middle">
        <ProductStockBadge state={product.stockState} quantity={product.stockQuantity} />
      </td>

      <td className="hidden xl:table-cell px-4 py-2.5 align-middle">
        <AdminProductsPriceCell
          priceLabel={product.priceLabel}
          compareAtPriceLabel={product.compareAtPriceLabel}
          hasPromotion={product.hasPromotion}
        />
      </td>

      <td className="hidden xl:table-cell px-4 py-2.5 align-middle">
        <div className="min-w-0">
          <AdminProductsCategoryCell label={product.categoryPathLabel} />
        </div>
      </td>

      <td className="px-2 py-2.5 align-middle text-right">
        <ProductTableRowActions
          slug={product.slug}
          productName={product.name}
          view={view}
          {...(onConfirmArchive ? { onConfirmArchive } : {})}
          {...(onConfirmRestore ? { onConfirmRestore } : {})}
          {...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {})}
        />
      </td>
    </tr>
  );
}
