"use client";

import type { JSX } from "react";
import { useRouter } from "next/navigation";

import { AdminThumbnail } from "@/components/admin/media/admin-thumbnail";
import { AdminStatusBadge } from "@/components/admin/shared/admin-status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductListView, ProductTableItem } from "@/features/admin/products/list/types";
import { PRODUCT_CARD_COPY } from "@/features/admin/products/config";
import { AdminRowActionsReveal, AdminTableIdentityStack } from "@/components/admin/tables";
import { AdminProductsCategoryCell } from "./admin-products-category-cell";
import { AdminProductsPriceCell } from "./admin-products-price-cell";
import { ProductTableRowActions } from "./product-table-row-actions";

type ProductTableDesktopRowProps = Readonly<{
  product: ProductTableItem;
  isSelected: boolean;
  onToggleProductSelection: (productId: string) => void;
  view: ProductListView;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
}>;

export function ProductTableDesktopRow({
  product,
  isSelected,
  onToggleProductSelection,
  view,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductTableDesktopRowProps): JSX.Element {
  const router = useRouter();

  function handleRowClick(): void {
    router.push(`/admin/products/${product.slug}/edit`);
  }

  return (
    <tr
      tabIndex={0}
      className="group cursor-pointer border-b border-surface-border/30 transition-colors duration-150 hover:bg-surface-subtle/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/50"
      onClick={handleRowClick}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleRowClick();
        }

        if (event.key === " ") {
          event.preventDefault();
          onToggleProductSelection(product.id);
        }
      }}
    >
      <td className="px-3 py-2.5 align-middle" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleProductSelection(product.id)}
            aria-label={PRODUCT_CARD_COPY.selectionAriaLabel(product.name)}
          />
        </div>
      </td>

      <td className="px-3 py-2.5 align-middle" onClick={(event) => event.stopPropagation()}>
        <AdminThumbnail
          src={product.primaryImageUrl}
          alt={product.primaryImageAlt ?? product.name}
          className="h-9 w-9 rounded-md border border-surface-border/40 bg-surface-subtle/50"
          imageClassName="transition-transform duration-300 group-hover:scale-105"
          fallbackLabel={PRODUCT_CARD_COPY.imageFallbackLabel(product.name)}
        />
      </td>

      <td className="px-4 py-2.5 align-middle">
        <AdminTableIdentityStack
          title={product.name}
          titleClassName="line-clamp-1 leading-snug"
          caption={
            <div className="mt-1 hidden min-w-0 items-center gap-1.5 text-xs text-muted-foreground/60 lg:flex xl:hidden">
              <span className="line-clamp-1 tabular-nums font-medium text-foreground/85">
                {product.priceLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="line-clamp-1">{product.categoryPathLabel}</span>
            </div>
          }
        />
      </td>

      <td className="px-4 py-2.5 align-middle">
        <AdminStatusBadge status={product.status} />
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

      <td
        className="px-2 py-2.5 align-middle text-right"
        onClick={(event) => event.stopPropagation()}
      >
        <AdminRowActionsReveal className="flex items-center justify-end">
          <ProductTableRowActions
            slug={product.slug}
            productName={product.name}
            view={view}
            {...(onConfirmArchive ? { onConfirmArchive } : {})}
            {...(onConfirmRestore ? { onConfirmRestore } : {})}
            {...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {})}
          />
        </AdminRowActionsReveal>
      </td>
    </tr>
  );
}
