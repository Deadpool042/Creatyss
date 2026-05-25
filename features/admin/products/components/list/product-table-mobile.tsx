"use client";

import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { useSearchParams } from "next/navigation";

import { AdminFeedSentinel } from "@/components/admin/shared/admin-feed-sentinel";
import type { ProductListView, ProductTableItem } from "@/features/admin/products/list/types";
import { PRODUCT_TABLE_COPY } from "@/features/admin/products/config";
import { ProductCollectionCard } from "./product-collection-card";
import { useProductTableContext } from "./product-table-context";

const PRODUCT_CARD_TWO_COLUMN_CLASS_NAME = "[@media(min-width:667px)]:grid-cols-2";

const MOBILE_PAGE_SIZE = 8;
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

  const [loadedItems, setLoadedItems] = useState(products);
  const [visibleCount, setVisibleCount] = useState(MOBILE_PAGE_SIZE);
  const [loadedPage, setLoadedPage] = useState(currentPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadGenerationRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    loadGenerationRef.current += 1;
    isLoadingMoreRef.current = false;
    setLoadedItems(products);
    setVisibleCount(MOBILE_PAGE_SIZE);
    setLoadedPage(currentPage);
    setIsLoadingMore(false);
  }, [currentPage, products, queryString]);

  const hasMorePages = loadedPage < totalPages;
  const hasMoreVisibleItems = visibleCount < loadedItems.length;
  const hasMore = hasMoreVisibleItems || hasMorePages;

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current) return;

    if (visibleCount < loadedItems.length) {
      setVisibleCount((prev) => Math.min(prev + MOBILE_PAGE_SIZE, loadedItems.length));
      return;
    }

    if (!hasMorePages) return;

    const requestGeneration = loadGenerationRef.current;
    const nextPage = loadedPage + 1;
    const params = new URLSearchParams(queryString);
    params.set("page", String(nextPage));
    params.set("perPage", String(perPage));

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const response = await fetch(`/api/admin/products/load-more?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as { items?: ProductTableItem[] };
      const nextItems = Array.isArray(data.items) ? data.items : [];
      if (loadGenerationRef.current !== requestGeneration || nextItems.length === 0) return;

      setLoadedItems((prev) => [...prev, ...nextItems]);
      setLoadedPage(nextPage);
      setVisibleCount((prev) => prev + MOBILE_PAGE_SIZE);
    } finally {
      if (loadGenerationRef.current === requestGeneration) {
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [hasMorePages, loadedPage, loadedItems.length, perPage, queryString, visibleCount]);

  const visibleItems = loadedItems.slice(0, visibleCount);
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
            <div
              className={[
                "h-5 w-5 rounded-full border-2 border-surface-border border-t-foreground/40",
                isLoadingMore ? "animate-spin" : "animate-pulse",
              ].join(" ")}
            />
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
            {total} produit{total !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
