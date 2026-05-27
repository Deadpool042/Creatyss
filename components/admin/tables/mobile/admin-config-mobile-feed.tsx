"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { AdminFeedSentinel } from "@/components/admin/shared/admin-feed-sentinel";
import { cn } from "@/lib/utils";

type AdminConfigMobileFeedProps<TItem> = Readonly<{
  items: TItem[];
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  queryString: string;
  loadMorePath: string;
  pageSize?: number;
  className?: string;
  gridClassName?: string;
  rootMargin?: string;
  rootSelector?: string;
  endLabel: string;
  totalLabel: (total: number) => string;
  renderItem: (item: TItem) => ReactNode;
  parseItems: (payload: unknown) => TItem[];
  onVisibleItemsChange?: (items: TItem[]) => void;
}>;

const DEFAULT_MOBILE_PAGE_SIZE = 8;

export function parseAdminLoadMoreItems<TItem>(payload: unknown): TItem[] {
  if (!payload || typeof payload !== "object" || !("items" in payload)) return [];

  const items = (payload as { items?: unknown }).items;
  return Array.isArray(items) ? (items as TItem[]) : [];
}

export function AdminConfigMobileFeed<TItem>({
  items,
  currentPage,
  totalPages,
  perPage,
  totalItems,
  queryString,
  loadMorePath,
  pageSize = DEFAULT_MOBILE_PAGE_SIZE,
  className,
  gridClassName,
  rootMargin = "260px 0px",
  rootSelector = "[data-scroll-root]",
  endLabel,
  totalLabel,
  renderItem,
  parseItems,
  onVisibleItemsChange,
}: AdminConfigMobileFeedProps<TItem>) {
  const [loadedItems, setLoadedItems] = useState(items);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loadedPage, setLoadedPage] = useState(currentPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadGenerationRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    loadGenerationRef.current += 1;
    isLoadingMoreRef.current = false;
    setLoadedItems(items);
    setVisibleCount(pageSize);
    setLoadedPage(currentPage);
    setIsLoadingMore(false);
  }, [currentPage, items, pageSize, queryString]);

  const hasMorePages = loadedPage < totalPages;
  const hasMoreVisibleItems = visibleCount < loadedItems.length;
  const hasMore = hasMoreVisibleItems || hasMorePages;
  const spinnerClassName = cn(
    "h-5 w-5 rounded-full border-2 border-surface-border border-t-foreground/40",
    isLoadingMore ? "animate-spin" : "animate-pulse"
  );
  const visibleItems = useMemo(
    () => loadedItems.slice(0, visibleCount),
    [loadedItems, visibleCount]
  );

  useEffect(() => {
    onVisibleItemsChange?.(visibleItems);
  }, [onVisibleItemsChange, visibleItems]);

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current) return;

    if (visibleCount < loadedItems.length) {
      setVisibleCount((prev) => Math.min(prev + pageSize, loadedItems.length));
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
      const response = await fetch(`${loadMorePath}?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) return;

      const nextItems = parseItems(await response.json());
      if (loadGenerationRef.current !== requestGeneration || nextItems.length === 0) return;

      setLoadedItems((prev) => [...prev, ...nextItems]);
      setLoadedPage(nextPage);
      setVisibleCount((prev) => prev + pageSize);
    } finally {
      if (loadGenerationRef.current === requestGeneration) {
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [
    hasMorePages,
    loadedItems.length,
    loadedPage,
    loadMorePath,
    pageSize,
    parseItems,
    perPage,
    queryString,
    visibleCount,
  ]);

  return (
    <div className={cn("space-y-2.5 [@media(max-height:480px)]:space-y-2", className)}>
      <div
        className={cn("grid grid-cols-1 gap-2.5 [@media(max-height:480px)]:gap-2", gridClassName)}
      >
        {visibleItems.map(renderItem)}
      </div>

      {hasMore ? (
        <>
          <div
            className="flex h-10 items-center justify-center [@media(max-height:480px)]:h-8"
            aria-hidden="true"
          >
            <div className={spinnerClassName} />
          </div>
          <AdminFeedSentinel
            onIntersect={loadMore}
            rootSelector={rootSelector}
            rootMargin={rootMargin}
          />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-3 py-2.5 text-center [@media(max-height:480px)]:py-2">
          <p className="text-xs font-medium text-muted-foreground">{endLabel}</p>
          <p className="mt-1 text-[11px] text-muted-foreground/85">{totalLabel(totalItems)}</p>
        </div>
      )}
    </div>
  );
}
