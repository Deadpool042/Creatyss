"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { AdminToolbar } from "@/components/admin/shared/admin-toolbar";
import {
  AdminDataTableActiveFilters,
  type AdminDataTableActiveFilterItem,
} from "@/components/admin/tables";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCategoriesTableContext } from "@/features/admin/categories/context/categories-data-provider";
import {
  CATEGORY_FEATURED_OPTIONS,
  CATEGORY_LIST_ACTIONS_COPY,
  CATEGORY_LIST_COPY,
  CATEGORY_STATUS_OPTIONS,
} from "@/features/admin/categories/config";
import { useCategoryFilters } from "@/features/admin/categories/list/hooks/use-category-filters";
import {
  CategoryListFilterControls,
  CategoryListMobileFiltersDrawer,
} from "./toolbar";

// ─── Main toolbar ───────────────────────────────────────────────────────────

export function CategoryListToolbar() {
  const { total, categoriesForPicker } = useCategoriesTableContext();
  const filters = useCategoryFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mobileFilterCount =
    filters.status.length + filters.featured.length + filters.categorySlugs.length;

  // Chips actifs
  const chips: AdminDataTableActiveFilterItem[] = [
    ...filters.categorySlugs.map((slug) => ({
      key: `cat-${slug}`,
      label: categoriesForPicker.find((c) => c.slug === slug)?.name ?? slug,
      onRemove: () => filters.setCategorySlugs(filters.categorySlugs.filter((v) => v !== slug)),
    })),
    ...filters.status.map((s) => ({
      key: `status-${s}`,
      label: CATEGORY_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s,
      onRemove: () => filters.setStatus(filters.status.filter((v) => v !== s)),
    })),
    ...filters.featured.map((f) => ({
      key: `featured-${f}`,
      label: CATEGORY_FEATURED_OPTIONS.find((o) => o.value === f)?.label ?? f,
      onRemove: () => filters.setFeatured(filters.featured.filter((v) => v !== f)),
    })),
  ];

  function handleReset() {
    filters.resetFilters();
  }

  const mobileFiltersButton = (
    <Button
      variant="outline"
      size="sm"
      type="button"
      onClick={() => setDrawerOpen(true)}
      className={cn(
        "lg:hidden inline-flex h-9 shrink-0 items-center gap-1.5 px-3 text-sm",
        mobileFilterCount > 0
          ? "border-surface-border-strong bg-interactive-selected text-foreground"
          : "text-muted-foreground"
      )}
    >
      <SlidersHorizontal className="h-4 w-4" />
      {mobileFilterCount > 0
        ? `${CATEGORY_LIST_ACTIONS_COPY.mobileFiltersLabel}${CATEGORY_LIST_ACTIONS_COPY.mobileFiltersWithCountSeparator}${mobileFilterCount}`
        : CATEGORY_LIST_ACTIONS_COPY.mobileFiltersLabel}
    </Button>
  );

  return (
    <div className="flex flex-col gap-2">
      <AdminToolbar
        search={filters.search}
        onSearchChange={filters.setSearch}
        placeholder={CATEGORY_LIST_COPY.searchPlaceholder}
        extraControls={
          <>
            {mobileFiltersButton}
            <CategoryListFilterControls
              categoriesForPicker={categoriesForPicker}
              categorySlugs={filters.categorySlugs}
              status={filters.status}
              featured={filters.featured}
              onCategorySlugsChange={filters.setCategorySlugs}
              onStatusChange={filters.setStatus}
              onFeaturedChange={filters.setFeatured}
            />
          </>
        }
        className="mt-0"
      />

      {/* Active chips — tous viewports */}
      <AdminDataTableActiveFilters
        items={chips}
        onClearAll={handleReset}
        clearLabel={CATEGORY_LIST_COPY.activeFiltersResetLabel}
      />

      {/* Drawer mobile */}
      <CategoryListMobileFiltersDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        categoriesForPicker={categoriesForPicker}
        categorySlugs={filters.categorySlugs}
        status={filters.status}
        featured={filters.featured}
        hasActiveFilters={mobileFilterCount > 0}
        onCategorySlugsChange={filters.setCategorySlugs}
        onStatusChange={filters.setStatus}
        onFeaturedChange={filters.setFeatured}
        onReset={handleReset}
      />

      {total > 0 ? (
        <p className="text-xs text-muted-foreground">
          {total}{" "}
          {total === 1
            ? CATEGORY_LIST_ACTIONS_COPY.foundSingularSuffix
            : CATEGORY_LIST_ACTIONS_COPY.foundPluralSuffix}
        </p>
      ) : null}
    </div>
  );
}
