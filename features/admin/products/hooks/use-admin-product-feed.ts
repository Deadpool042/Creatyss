"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  AdminProductFeedItem,
  AdminProductFeedPageResult,
} from "@/features/admin/products/list/types/admin-product-feed.types";

type FeedCursor = {
  updatedAt: string;
  id: string;
} | null;

type UseAdminProductFeedInput = {
  initialFeed: AdminProductFeedPageResult;
  limit?: number;
};

type UseAdminProductFeedResult = {
  items: AdminProductFeedItem[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
  resetFeed: (nextFeed: AdminProductFeedPageResult) => void;
};

function getCursorKey(cursor: FeedCursor): string {
  if (cursor === null) {
    return "__initial__";
  }

  return `${cursor.updatedAt}::${cursor.id}`;
}

function mergeItems(
  currentItems: AdminProductFeedItem[],
  nextItems: AdminProductFeedItem[]
): AdminProductFeedItem[] {
  const map = new Map<string, AdminProductFeedItem>();

  for (const item of currentItems) {
    map.set(item.id, item);
  }

  for (const item of nextItems) {
    map.set(item.id, item);
  }

  return Array.from(map.values());
}

export function useAdminProductFeed({
  initialFeed,
  limit = 12,
}: UseAdminProductFeedInput): UseAdminProductFeedResult {
  const [items, setItems] = useState<AdminProductFeedItem[]>(initialFeed.items);
  const [nextCursor, setNextCursor] = useState<FeedCursor>(initialFeed.nextCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialFeed.hasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const inFlightRef = useRef(false);
  const requestedCursorKeysRef = useRef<Set<string>>(new Set());

  const initialFeedKey = useMemo(() => {
    return JSON.stringify({
      itemIds: initialFeed.items.map((item) => item.id),
      nextCursor: initialFeed.nextCursor,
      hasMore: initialFeed.hasMore,
    });
  }, [initialFeed]);

  useEffect(() => {
    setItems(initialFeed.items);
    setNextCursor(initialFeed.nextCursor);
    setHasMore(initialFeed.hasMore);
    setIsLoadingMore(false);
    inFlightRef.current = false;
    requestedCursorKeysRef.current = new Set();
  }, [initialFeedKey, initialFeed]);

  const loadMore = useCallback(async () => {
    if (inFlightRef.current || isLoadingMore || !hasMore || nextCursor === null) {
      return;
    }

    const cursorKey = getCursorKey(nextCursor);

    if (requestedCursorKeysRef.current.has(cursorKey)) {
      return;
    }

    inFlightRef.current = true;
    requestedCursorKeysRef.current.add(cursorKey);
    setIsLoadingMore(true);

    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("cursorUpdatedAt", nextCursor.updatedAt);
      params.set("cursorId", nextCursor.id);

      const response = await fetch(`/api/admin/products/feed?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load admin products feed.");
      }

      const data = (await response.json()) as AdminProductFeedPageResult;

      setItems((currentItems) => mergeItems(currentItems, data.items));

      const currentCursorKey = getCursorKey(nextCursor);
      const nextCursorKey = getCursorKey(data.nextCursor);

      const cursorDidAdvance =
        data.nextCursor !== null && nextCursorKey !== currentCursorKey;

      if (!cursorDidAdvance) {
        setNextCursor(data.nextCursor);
        setHasMore(false);
      } else {
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      }

      if (data.items.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      inFlightRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, limit, nextCursor]);

  const resetFeed = useCallback((nextFeed: AdminProductFeedPageResult) => {
    setItems(nextFeed.items);
    setNextCursor(nextFeed.nextCursor);
    setHasMore(nextFeed.hasMore);
    setIsLoadingMore(false);
    inFlightRef.current = false;
    requestedCursorKeysRef.current = new Set();
  }, []);

  return {
    items,
    hasMore,
    isLoadingMore,
    loadMore,
    resetFeed,
  };
}
