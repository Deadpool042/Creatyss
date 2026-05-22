"use client";

import { useCallback, useEffect, useMemo, useState, type JSX } from "react";

import { AdminFeedSentinel } from "@/components/admin/shared/admin-feed-sentinel";
import type { ProductTableItem } from "@/features/admin/products/list/types/product-table.types";
import { PRODUCT_TABLE_COPY } from "@/features/admin/products/config";
import { ProductCollectionCard } from "./product-collection-card";

const PRODUCT_CARD_TWO_COLUMN_CLASS_NAME = "[@media(min-width:667px)]:grid-cols-2";

const MOBILE_PAGE_SIZE = 12;
const MOBILE_BOTTOM_NAV_CLEARANCE_CLASS_NAME =
  "pb-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] [@media(max-height:480px)]:pb-[calc(2.75rem+env(safe-area-inset-bottom)+0.75rem)]";

type ProductListView = "active" | "trash";

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
  const [visibleCount, setVisibleCount] = useState(MOBILE_PAGE_SIZE);

  const filterKey = useMemo(() => {
    const first = products[0]?.id ?? "";
    const last = products[products.length - 1]?.id ?? "";
    return `${products.length}::${first}::${last}`;
  }, [products]);

  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(MOBILE_PAGE_SIZE);
  }

  const hasMore = visibleCount < products.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + MOBILE_PAGE_SIZE, products.length));
  }, [products.length]);


  const visibleItems = products.slice(0, visibleCount);
  const visibleProductIds = visibleItems.map((product) => product.id);

  const visibleSelectedCount = visibleProductIds.filter((productId) =>
    selectedProductIds.includes(productId)
  ).length;

  const areAllVisibleSelected =
    visibleProductIds.length > 0 &&
    visibleProductIds.every((productId) => selectedProductIds.includes(productId));

  useEffect(() => {
    onVisibleSelectionStatsChange?.({
      visibleCount: visibleItems.length,
      visibleSelectedCount,
      areAllVisibleSelected,
    });
  }, [
    areAllVisibleSelected,
    onVisibleSelectionStatsChange,
    visibleItems.length,
    visibleSelectedCount,
  ]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {view === "trash" ? PRODUCT_TABLE_COPY.emptyTrash : PRODUCT_TABLE_COPY.emptyFiltered}
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        "space-y-2 [@media(max-height:480px)]:space-y-1.5",
        MOBILE_BOTTOM_NAV_CLEARANCE_CLASS_NAME,
      ].join(" ")}
    >
      <div
        className={[
          "grid gap-2.5 [@media(max-height:480px)]:gap-2",
          PRODUCT_CARD_TWO_COLUMN_CLASS_NAME,
        ].join(" ")}
      >
        {visibleItems.map((product) => (
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
        ))}
      </div>

      {hasMore ? (
        <>
          <div
            className="flex h-10 items-center justify-center [@media(max-height:480px)]:h-8"
            aria-hidden="true"
          >
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-surface-border border-t-foreground/40" />
          </div>
          <AdminFeedSentinel
            onIntersect={loadMore}
            rootSelector="[data-scroll-root]"
            rootMargin="260px 0px"
          />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-3 py-2.5 text-center [@media(max-height:480px)]:py-2">
          <p className="text-xs font-medium text-muted-foreground">{PRODUCT_TABLE_COPY.mobileEndOfList}</p>
          <p className="mt-1 text-[11px] text-muted-foreground/85">
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
