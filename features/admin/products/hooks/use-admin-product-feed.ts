"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  AdminProductFeedItem,
  AdminProductFeedPageResult,
} from "@/features/admin/products/list/types/admin-product-feed.types";
import type { ProductFeedCursor } from "@/features/products/types";

type UseAdminProductFeedInput = {
  initialItems: AdminProductFeedItem[];
  initialNextCursor: ProductFeedCursor | null;
  initialHasMore: boolean;
  search: string;
  limit?: number;
};

type UseAdminProductFeedResult = {
  items: AdminProductFeedItem[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  reset: (input: {
    items: AdminProductFeedItem[];
    nextCursor: ProductFeedCursor | null;
    hasMore: boolean;
  }) => void;
};

function buildFeedUrl(input: {
  limit: number;
  search: string;
  cursor: ProductFeedCursor | null;
}): string {
  const params = new URLSearchParams();

  params.set("limit", String(input.limit));

  const trimmedSearch = input.search.trim();
  if (trimmedSearch.length > 0) {
    params.set("search", trimmedSearch);
  }

  if (input.cursor) {
    params.set("cursorUpdatedAt", input.cursor.updatedAt);
    params.set("cursorId", input.cursor.id);
  }

  return `/api/admin/products/feed?${params.toString()}`;
}

export function useAdminProductFeed({
  initialItems,
  initialNextCursor,
  initialHasMore,
  search,
  limit = 12,
}: UseAdminProductFeedInput): UseAdminProductFeedResult {
  const [items, setItems] = useState<AdminProductFeedItem[]>(initialItems);
  const [nextCursor, setNextCursor] = useState<ProductFeedCursor | null>(initialNextCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeRequestRef = useRef<AbortController | null>(null);
  const latestSearchRef = useRef(search);

  useEffect(() => {
    latestSearchRef.current = search;
  }, [search]);

  const reset = useCallback(
    (input: {
      items: AdminProductFeedItem[];
      nextCursor: ProductFeedCursor | null;
      hasMore: boolean;
    }) => {
      activeRequestRef.current?.abort();
      activeRequestRef.current = null;

      setItems(input.items);
      setNextCursor(input.nextCursor);
      setHasMore(input.hasMore);
      setIsLoading(false);
      setError(null);
    },
    []
  );

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !nextCursor) {
      return;
    }

    const controller = new AbortController();
    activeRequestRef.current?.abort();
    activeRequestRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        buildFeedUrl({
          limit,
          search: latestSearchRef.current,
          cursor: nextCursor,
        }),
        {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Impossible de charger plus de produits.");
      }

      const payload = (await response.json()) as AdminProductFeedPageResult;

      setItems((currentItems) => {
        const existingIds = new Set(currentItems.map((item) => item.id));
        const nextItems = payload.items.filter((item) => !existingIds.has(item.id));
        return [...currentItems, ...nextItems];
      });
      setNextCursor(payload.nextCursor);
      setHasMore(payload.hasMore);
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
        return;
      }

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de charger plus de produits."
      );
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }

      setIsLoading(false);
    }
  }, [hasMore, isLoading, limit, nextCursor]);

  useEffect(() => {
    return () => {
      activeRequestRef.current?.abort();
    };
  }, []);

  return useMemo(
    () => ({
      items,
      hasMore,
      isLoading,
      error,
      loadMore,
      reset,
    }),
    [error, hasMore, isLoading, items, loadMore, reset]
  );
}
