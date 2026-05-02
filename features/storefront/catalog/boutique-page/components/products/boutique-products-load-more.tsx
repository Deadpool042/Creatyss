"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { BoutiqueProductGrid } from "@/features/storefront/catalog/boutique-page/components/products/boutique-product-grid";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueProductsLoadMoreProps = {
  initialProducts: BoutiquePageViewModel["products"];
  initialNextCursor: string | null;
  initialHasMore: boolean;
  pageSize: number;
  filters: BoutiquePageViewModel["apiFilters"];
};

type ProductsPagePayload = {
  items: BoutiquePageViewModel["products"];
  nextCursor: string | null;
  hasMore: boolean;
};

function isProductsPagePayload(value: unknown): value is ProductsPagePayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("items" in value) || !("nextCursor" in value) || !("hasMore" in value)) {
    return false;
  }

  return (
    Array.isArray(value.items) &&
    (typeof value.nextCursor === "string" || value.nextCursor === null) &&
    typeof value.hasMore === "boolean"
  );
}

export function BoutiqueProductsLoadMore({
  initialProducts,
  initialNextCursor,
  initialHasMore,
  pageSize,
  filters,
}: BoutiqueProductsLoadMoreProps) {
  const [products, setProducts] = useState(initialProducts);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);
  const nextCursorRef = useRef(nextCursor);
  const autoLoadLockedRef = useRef(false);
  const hasUserScrollIntentRef = useRef(false);
  const isSentinelIntersectingRef = useRef(false);
  const isDesktopAutoLoadEnabled = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(min-width: 1200px)").matches;
  }, []);

  useEffect(() => {
    hasMoreRef.current = hasMore;
    isLoadingRef.current = isLoading;
    nextCursorRef.current = nextCursor;
  }, [hasMore, isLoading, nextCursor]);

  const handleLoadMore = useCallback(async (trigger: "auto" | "manual") => {
    if (isLoadingRef.current || !hasMoreRef.current || nextCursorRef.current === null) {
      return;
    }

    if (trigger === "auto" && autoLoadLockedRef.current) {
      return;
    }

    if (trigger === "auto") {
      autoLoadLockedRef.current = true;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setErrorMessage(null);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const params = new URLSearchParams();

      if (filters.q && filters.q.trim().length > 0) {
        params.set("q", filters.q.trim());
      }

      if (filters.category && filters.category.trim().length > 0) {
        params.set("category", filters.category.trim());
      }

      if (filters.availability) {
        params.set("availability", filters.availability);
      }

      if (filters.sort !== "featured") {
        params.set("sort", filters.sort);
      }

      if (nextCursorRef.current) {
        params.set("cursor", nextCursorRef.current);
      }

      params.set("limit", String(pageSize));

      const response = await fetch(`/api/storefront/catalog/products?${params.toString()}`, {
        method: "GET",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("catalog_products_page_request_failed");
      }

      const payload: unknown = await response.json();

      if (!isProductsPagePayload(payload)) {
        throw new Error("catalog_products_page_invalid_payload");
      }

      setProducts((currentProducts) => {
        const currentIds = new Set(currentProducts.map((product) => product.id));
        const newItems = payload.items.filter((item) => !currentIds.has(item.id));

        if (newItems.length === 0) {
          return currentProducts;
        }

        return [...currentProducts, ...newItems];
      });
      setNextCursor(payload.nextCursor);
      setHasMore(payload.hasMore && payload.nextCursor !== null);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error("boutique_products_load_more_failed", error);
      setErrorMessage("Impossible de charger plus de produits.");
    } finally {
      abortControllerRef.current = null;
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [filters.availability, filters.category, filters.q, filters.sort, pageSize]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const markUserScrollIntent = () => {
      if (hasUserScrollIntentRef.current) {
        return;
      }

      hasUserScrollIntentRef.current = true;

      if (isDesktopAutoLoadEnabled() && isSentinelIntersectingRef.current) {
        void handleLoadMore("auto");
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (
        event.key === "PageDown" ||
        event.key === " " ||
        event.key === "ArrowDown" ||
        event.key === "End"
      ) {
        markUserScrollIntent();
      }
    };

    const sentinel = sentinelRef.current;
    const scrollRoot = sentinel?.closest<HTMLDivElement>(".desktop\\:overflow-y-auto") ?? null;

    window.addEventListener("wheel", markUserScrollIntent, { passive: true });
    window.addEventListener("touchmove", markUserScrollIntent, { passive: true });
    window.addEventListener("keydown", handleKeydown);

    if (scrollRoot) {
      scrollRoot.addEventListener("wheel", markUserScrollIntent, { passive: true });
      scrollRoot.addEventListener("touchmove", markUserScrollIntent, { passive: true });
    }

    return () => {
      window.removeEventListener("wheel", markUserScrollIntent);
      window.removeEventListener("touchmove", markUserScrollIntent);
      window.removeEventListener("keydown", handleKeydown);

      if (scrollRoot) {
        scrollRoot.removeEventListener("wheel", markUserScrollIntent);
        scrollRoot.removeEventListener("touchmove", markUserScrollIntent);
      }
    };
  }, [handleLoadMore, isDesktopAutoLoadEnabled]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore || isLoading || nextCursor === null || !isDesktopAutoLoadEnabled()) {
      return;
    }

    const scrollRoot = sentinel.closest<HTMLDivElement>(".desktop\\:overflow-y-auto");
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (!firstEntry) {
          return;
        }

        isSentinelIntersectingRef.current = firstEntry.isIntersecting;

        if (!firstEntry.isIntersecting) {
          autoLoadLockedRef.current = false;
          return;
        }

        if (!hasUserScrollIntentRef.current) {
          return;
        }

        void handleLoadMore("auto");
      },
      {
        root: scrollRoot ?? null,
        rootMargin: "240px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, hasMore, isDesktopAutoLoadEnabled, isLoading, nextCursor]);

  return (
    <div className="grid gap-4 min-[700px]:gap-5">
      <BoutiqueProductGrid products={products} />

      <div className="grid justify-items-center gap-2 pb-16 min-[560px]:max-[899px]:landscape:pb-8 min-[700px]:pb-4 min-[768px]:max-[1199px]:pb-10 min-[900px]:max-[1199px]:landscape:pb-7" aria-live="polite">
        {errorMessage ? <p className="m-0 text-sm text-text-muted-strong">{errorMessage}</p> : null}

        {hasMore ? (
          <>
            <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
            <Button
              type="button"
              onClick={() => {
                void handleLoadMore("manual");
              }}
              disabled={isLoading}
              className="min-w-36"
            >
              {isLoading ? "Chargement…" : "Voir plus"}
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
