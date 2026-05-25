"use client";

import { Pencil, Star } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AdminFeedSentinel } from "@/components/admin/shared/admin-feed-sentinel";
import { AdminThumbnail } from "@/components/admin/media/admin-thumbnail";
import { AdminStatusBadge } from "@/components/admin/shared/admin-status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LIST_COPY,
  CATEGORY_STATUS_LABELS,
  CATEGORY_TABLE_COPY,
} from "@/features/admin/categories/config";
import type { AdminCategoryCardItem } from "@/features/admin/categories/types";
import { getAdminCategoryDetailPath } from "../../shared";

import { useCategoriesTableContext } from "../../context/categories-data-provider";
import { CategoryTableRowActions } from "./category-table-row-actions";

const MOBILE_PAGE_SIZE = 8;

function MobileCountBox({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-3 py-2.5">
      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
        {label}
      </p>
      <p
        className={`text-[13px] font-semibold leading-5 tabular-nums ${value === 0 ? "text-muted-foreground/45" : "text-foreground"}`}
      >
        {value === 0 ? "—" : value}
      </p>
    </div>
  );
}

function CategoryMobileVisual({
  category,
}: Readonly<{
  category: AdminCategoryCardItem;
}>) {
  return (
    <AdminThumbnail
      src={category.primaryImageUrl}
      alt={category.primaryImageAlt ?? category.name}
      className="h-11 w-11 shrink-0 rounded-lg border border-surface-border/80 bg-surface-panel-soft sm:h-10 sm:w-10"
      fallbackLabel={CATEGORY_LIST_COPY.imageFallbackLabel(category.name)}
    />
  );
}

function CategoryMobileCard({ category }: Readonly<{ category: AdminCategoryCardItem }>) {
  const href = getAdminCategoryDetailPath(category.slug);

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-xl border bg-card p-3.5 shadow-card transition-colors",
        category.isFeatured ? "border-brand/35 bg-brand/3" : "border-surface-border"
      )}
    >
      {/* Lien couvrant toute la carte (sauf les boutons d'action) */}
      <Link
        href={href}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        aria-label={`${CATEGORY_LIST_COPY.rowEditAriaPrefix} ${category.name}`}
      />

      {/* Header: badge statut + actions (z-10 pour passer au-dessus du lien) */}
      <div className="relative z-10 mb-3 flex items-center justify-between gap-2">
        <AdminStatusBadge
          status={category.status}
          label={CATEGORY_STATUS_LABELS[category.status] ?? category.status}
        />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
            aria-label={`${CATEGORY_LIST_COPY.rowEditAriaPrefix} ${category.name}`}
          >
            <Link href={href}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <div className="relative z-10">
            <CategoryTableRowActions
              categoryId={category.id}
              categoryName={category.name}
              categorySlug={category.slug}
              status={category.status}
            />
          </div>
        </div>
      </div>

      {/* Body: image + nom + slug */}
      <div className="flex items-start gap-2.5">
        <CategoryMobileVisual category={category} />

        <div className="min-w-0 flex-1">
          {category.parentName ? (
            <p className="mb-0.5 truncate text-[0.65rem] font-medium text-brand/75">
              {category.parentName} <span className="text-muted-foreground/40">›</span>
            </p>
          ) : null}
          <h3 className="line-clamp-2 text-[0.96rem] font-semibold leading-5 tracking-tight text-foreground sm:line-clamp-1">
            {category.name}
          </h3>

          <p className="mt-1 truncate text-[11px] text-muted-foreground/70">{category.slug}</p>

          {category.isFeatured ? (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand/6 px-2 py-1 text-[11px] font-medium text-brand">
              <Star aria-hidden="true" className="h-3 w-3 fill-brand text-brand" />
              <span>{CATEGORY_LIST_COPY.featuredBadgeLabel}</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Counts */}
      <div className="mt-3.5 grid grid-cols-2 gap-2">
        <MobileCountBox
          label={CATEGORY_TABLE_COPY.mobile.productsLabel}
          value={category.productCount}
        />
        <MobileCountBox
          label={CATEGORY_TABLE_COPY.mobile.childrenLabel}
          value={category.childrenCount}
        />
      </div>
    </article>
  );
}

export function CategoryTableMobile() {
  const { categories, currentPage, totalPages, perPage, total } = useCategoriesTableContext();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [loadedItems, setLoadedItems] = useState(categories);
  const [visibleCount, setVisibleCount] = useState(MOBILE_PAGE_SIZE);
  const [loadedPage, setLoadedPage] = useState(currentPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadGenerationRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    loadGenerationRef.current += 1;
    isLoadingMoreRef.current = false;
    setLoadedItems(categories);
    setVisibleCount(MOBILE_PAGE_SIZE);
    setLoadedPage(currentPage);
    setIsLoadingMore(false);
  }, [categories, currentPage, queryString]);

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
      const response = await fetch(`/api/admin/categories/load-more?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as { items?: AdminCategoryCardItem[] };
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

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5 pb-[calc(4.5rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-1 gap-2.5 [@media(max-height:480px)]:gap-2 md:grid-cols-2 md:gap-3">
        {visibleItems.map((category) => (
          <CategoryMobileCard key={category.id} category={category} />
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
          <AdminFeedSentinel onIntersect={loadMore} />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-3 py-2.5 text-center [@media(max-height:480px)]:py-2">
          <p className="text-xs font-medium text-muted-foreground">
            {CATEGORY_LIST_COPY.tableEndLabel}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/85">
            {total}{" "}
            {total !== 1
              ? CATEGORY_LIST_COPY.categoriesCountSuffixPlural
              : CATEGORY_LIST_COPY.categoriesCountSuffixSingular}
          </p>
        </div>
      )}
    </div>
  );
}
