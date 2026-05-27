"use client";

import { useCallback, type JSX } from "react";
import { useSearchParams } from "next/navigation";

import { AdminConfigMobileFeed, parseAdminLoadMoreItems } from "@/components/admin/tables";
import { PRODUCT_TABLE_COPY } from "@/features/admin/products/config";
import type { ProductListView, ProductTableItem } from "@/features/admin/products/list/types";
import { useProductTableContext } from "../desktop/product-table-context";
import { ProductCollectionCard } from "./product-collection-card";

const PRODUCT_CARD_TWO_COLUMN_CLASS_NAME = "[@media(min-width:667px)]:grid-cols-2";
const MOBILE_BOTTOM_NAV_CLEARANCE_CLASS_NAME =
  "pb-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] [@media(max-height:480px)]:pb-[calc(2.75rem+env(safe-area-inset-bottom)+0.75rem)]";

type ProductTableMobileProps = {
  products: ProductTableItem[];
  view: ProductListView;
  selectedProductIds: string[];
  onToggleProductSelection: (productId: string) => void;
  onVisibleSelectionStatsChange?: (stats: {
    visibleCount: number;
    visibleSelectedCount: number;
    areAllVisibleSelected: boolean;
  }) => void;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
};

export function ProductTableMobile({
  products,
  view,
  selectedProductIds,
  onToggleProductSelection,
  onVisibleSelectionStatsChange,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductTableMobileProps): JSX.Element {
  const { currentPage, totalPages, perPage, total } = useProductTableContext();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const handleVisibleItemsChange = useCallback(
    (visibleItems: ProductTableItem[]) => {
      const visibleProductIds = visibleItems.map((product) => product.id);
      const visibleSelectedCount = visibleProductIds.filter((productId) =>
        selectedProductIds.includes(productId)
      ).length;

      onVisibleSelectionStatsChange?.({
        visibleCount: visibleItems.length,
        visibleSelectedCount,
        areAllVisibleSelected:
          visibleProductIds.length > 0 &&
          visibleProductIds.every((productId) => selectedProductIds.includes(productId)),
      });
    },
    [onVisibleSelectionStatsChange, selectedProductIds]
  );

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-surface-border/60 bg-surface-panel-soft/60 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {view === "trash" ? PRODUCT_TABLE_COPY.emptyTrash : PRODUCT_TABLE_COPY.emptyFiltered}
        </p>
      </div>
    );
  }

  return (
    <AdminConfigMobileFeed
      items={products}
      currentPage={currentPage}
      totalPages={totalPages}
      perPage={perPage}
      totalItems={total}
      queryString={queryString}
      loadMorePath="/api/admin/products/load-more"
      className={MOBILE_BOTTOM_NAV_CLEARANCE_CLASS_NAME}
      gridClassName={PRODUCT_CARD_TWO_COLUMN_CLASS_NAME}
      endLabel={PRODUCT_TABLE_COPY.mobileEndOfList}
      totalLabel={(count) => `${count} produit${count !== 1 ? "s" : ""}`}
      parseItems={parseAdminLoadMoreItems<ProductTableItem>}
      onVisibleItemsChange={handleVisibleItemsChange}
      renderItem={(product) => (
        <ProductCollectionCard
          key={product.id}
          product={product}
          view={view}
          isSelected={selectedProductIds.includes(product.id)}
          onToggleSelection={onToggleProductSelection}
          {...(onConfirmArchive ? { onConfirmArchive } : {})}
          {...(onConfirmRestore ? { onConfirmRestore } : {})}
          {...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {})}
        />
      )}
    />
  );
}
