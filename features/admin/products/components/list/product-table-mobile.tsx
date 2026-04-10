"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type JSX } from "react";

import type { ProductTableItem } from "@/features/admin/products/list/types/product-table.types";
import { PRODUCT_CARD_TWO_COLUMN_CLASS_NAME } from "./mobile/product-card-layout";
import { ProductCollectionCard } from "./product-collection-card";

const MOBILE_PAGE_SIZE = 12;

type ProductTableMobileProps = {
  products: ProductTableItem[];
};

export function ProductTableMobile({ products }: ProductTableMobileProps): JSX.Element {
  const [visibleCount, setVisibleCount] = useState(MOBILE_PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Stable key identifying the current filter set.
  // Resets visible window when filters change without relying on reference equality.
  const filterKey = useMemo(() => {
    const first = products[0]?.id ?? "";
    const last = products[products.length - 1]?.id ?? "";
    return `${products.length}::${first}::${last}`;
  }, [products]);

  // "Adjusting state on render" pattern (React docs recommended).
  // Avoids useEffect cascade: sets state synchronously during render,
  // React immediately re-renders with the new value — no extra cycle.
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(MOBILE_PAGE_SIZE);
  }

  const hasMore = visibleCount < products.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + MOBILE_PAGE_SIZE, products.length));
  }, [products.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel === null || !hasMore) return;

    // Find the nearest scroll container exposed by AdminPageShell.
    // This is deterministic unlike a scrollHeight heuristic.
    const scrollRoot = sentinel.closest<HTMLElement>("[data-scroll-root]") ?? null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      {
        root: scrollRoot,
        rootMargin: "260px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const visibleItems = products.slice(0, visibleCount);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Aucun produit trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 [@media(max-height:480px)]:space-y-2">
      <div
        className={[
          "grid gap-2.5 [@media(max-height:480px)]:gap-2",
          PRODUCT_CARD_TWO_COLUMN_CLASS_NAME,
        ].join(" ")}
      >
        {visibleItems.map((product) => (
          <ProductCollectionCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore ? (
        <div
          ref={sentinelRef}
          className="flex h-10 items-center justify-center [@media(max-height:480px)]:h-8"
          aria-hidden="true"
        >
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-surface-border border-t-foreground/40" />
        </div>
      ) : null}
    </div>
  );
}
