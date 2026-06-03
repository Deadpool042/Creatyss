"use client";

import { Pencil, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AdminThumbnail } from "@/components/admin/media/admin-thumbnail";
import { AdminStatusBadge } from "@/components/admin/shared/admin-status-badge";
import {
  parseAdminLoadMoreItems,
  AdminConfigMobileFeed,
} from "@/components/admin/tables/mobile/admin-config-mobile-feed";
import { AdminCountValue } from "@/components/admin/tables/columns/admin-count-value";
import { AdminMobileInfoTile } from "@/components/admin/tables/mobile/admin-mobile-info-tile";
import { AdminMobileLinkedCard } from "@/components/admin/tables/mobile/admin-mobile-linked-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LIST_COPY,
  CATEGORY_STATUS_LABELS,
  CATEGORY_TABLE_COPY,
} from "@/features/admin/categories/config";
import type { AdminCategoryCardItem } from "@/features/admin/categories/types";
import { getAdminCategoryDetailPath } from "../../../shared";

import { useCategoriesTableContext } from "../../../context/categories-data-provider";
import { CategoryTableRowActions } from "../actions/category-table-row-actions";

function MobileCountBox({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <AdminMobileInfoTile
      label={label}
      className="py-2"
      labelClassName="mb-1 text-[9px] tracking-[0.12em] text-muted-foreground/80"
      bodyClassName={`mt-0 min-h-0 text-[13px] font-semibold leading-5 ${value === 0 ? "text-muted-foreground/45" : "text-foreground"}`}
    >
      <AdminCountValue value={value} />
    </AdminMobileInfoTile>
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
      className="h-11 w-11 shrink-0 rounded-md border border-surface-border/70 bg-surface-panel-soft sm:h-10 sm:w-10"
      fallbackLabel={CATEGORY_LIST_COPY.imageFallbackLabel(category.name)}
    />
  );
}

function CategoryMobileCard({ category }: Readonly<{ category: AdminCategoryCardItem }>) {
  const href = getAdminCategoryDetailPath(category.slug);

  return (
    <AdminMobileLinkedCard
      href={href}
      ariaLabel={`${CATEGORY_LIST_COPY.rowEditAriaPrefix} ${category.name}`}
      className={cn(
        category.isFeatured ? "border-brand/25 bg-brand/4" : "border-surface-border/70"
      )}
    >
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
            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-brand/8 px-2 py-0.5 text-[11px] font-medium text-brand/90">
              <Star aria-hidden="true" className="h-3 w-3 text-brand/90" />
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
    </AdminMobileLinkedCard>
  );
}

export function CategoryTableMobile() {
  const { categories, currentPage, totalPages, perPage, total } = useCategoriesTableContext();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  if (categories.length === 0) {
    return null;
  }

  return (
    <AdminConfigMobileFeed
      items={categories}
      currentPage={currentPage}
      totalPages={totalPages}
      perPage={perPage}
      totalItems={total}
      queryString={queryString}
      loadMorePath="/api/admin/categories/load-more"
      className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(4rem+env(safe-area-inset-bottom))]"
      gridClassName="md:grid-cols-2 md:gap-3"
      endLabel={CATEGORY_LIST_COPY.tableEndLabel}
      totalLabel={(count) =>
        `${count} ${
          count !== 1
            ? CATEGORY_LIST_COPY.categoriesCountSuffixPlural
            : CATEGORY_LIST_COPY.categoriesCountSuffixSingular
        }`
      }
      parseItems={parseAdminLoadMoreItems<AdminCategoryCardItem>}
      renderItem={(category) => <CategoryMobileCard key={category.id} category={category} />}
    />
  );
}
