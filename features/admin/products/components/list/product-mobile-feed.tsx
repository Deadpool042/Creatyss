"use client";

import { useEffect, useRef, type JSX } from "react";

import { Button } from "@/components/ui/button";
import { useAdminProductFeed } from "@/features/admin/products/hooks/use-admin-product-feed";
import { mapAdminProductFeedItemToTableItem } from "@/features/admin/products/list/mappers/shared/map-admin-product-feed-item-to-table-item";
import type { AdminProductFeedPageResult } from "@/features/admin/products/list/types/admin-product-feed.types";
import { ProductCollectionCard } from "./product-collection-card";

type ProductMobileFeedProps = {
  initialFeed: AdminProductFeedPageResult;
};

function getScrollableParent(node: HTMLElement | null): HTMLElement | null {
  if (node === null) {
    return null;
  }

  let current: HTMLElement | null = node.parentElement;

  while (current !== null) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    const isScrollable =
      (overflowY === "auto" || overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight;

    if (isScrollable) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

export function ProductMobileFeed({ initialFeed }: ProductMobileFeedProps): JSX.Element {
  const { items, hasMore, isLoadingMore, loadMore } = useAdminProductFeed({
    initialFeed,
    limit: 12,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinelNode = sentinelRef.current;

    if (sentinelNode === null || !hasMore || isLoadingMore) {
      return;
    }

    const scrollRoot = getScrollableParent(sentinelNode);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || isLoadingMore) {
          return;
        }

        void loadMore();
      },
      {
        root: scrollRoot,
        rootMargin: "240px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinelNode);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, loadMore, items.length]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
        Aucun produit trouvé.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <ProductCollectionCard
            key={item.id}
            product={mapAdminProductFeedItemToTableItem(item)}
          />
        ))}
      </div>

      {hasMore ? (
        <div className="space-y-3 pt-2">
          <div ref={sentinelRef} aria-hidden="true" className="h-12 w-full" />

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadMore()}
              disabled={isLoadingMore}
              className="rounded-full"
            >
              {isLoadingMore ? "Chargement…" : "Charger plus"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
