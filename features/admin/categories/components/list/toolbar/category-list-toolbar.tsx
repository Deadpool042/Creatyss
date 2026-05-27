"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import {
  AdminConfigDataTableToolbar,
  AdminDataTableFiltersTrigger,
  type AdminDataTableActiveFilterItem,
} from "@/components/admin/tables";
import { cn } from "@/lib/utils";
import { useCategoriesTableContext } from "@/features/admin/categories/context/categories-data-provider";
import {
  CATEGORY_FEATURED_OPTIONS,
  CATEGORY_RESULTS_COUNT_COPY,
  CATEGORY_LIST_ACTIONS_COPY,
  CATEGORY_LIST_COPY,
  CATEGORY_STATUS_OPTIONS,
} from "@/features/admin/categories/config";
import { useCategoryFilters } from "@/features/admin/categories/list";
import { CategoryListFilterControls, CategoryListMobileFiltersDrawer } from ".";

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
    <AdminDataTableFiltersTrigger
      icon={SlidersHorizontal}
      label={CATEGORY_LIST_ACTIONS_COPY.mobileFiltersLabel}
      activeCount={mobileFilterCount}
      activeCountSeparator={CATEGORY_LIST_ACTIONS_COPY.mobileFiltersWithCountSeparator}
      active={mobileFilterCount > 0}
      onClick={() => setDrawerOpen(true)}
      className={cn("lg:hidden inline-flex h-9 shrink-0 items-center gap-1.5 px-3 text-sm")}
      activeClassName="border-surface-border-strong bg-interactive-selected text-foreground"
    />
  );

  return (
    <>
      <AdminConfigDataTableToolbar
        search={filters.search}
        onSearchChange={filters.setSearch}
        mobileSearchPlaceholder={CATEGORY_LIST_COPY.searchPlaceholder}
        desktopSearchPlaceholder={CATEGORY_LIST_COPY.searchPlaceholder}
        mobileControls={mobileFiltersButton}
        desktopFilters={
          <CategoryListFilterControls
            categoriesForPicker={categoriesForPicker}
            categorySlugs={filters.categorySlugs}
            status={filters.status}
            featured={filters.featured}
            onCategorySlugsChange={filters.setCategorySlugs}
            onStatusChange={filters.setStatus}
            onFeaturedChange={filters.setFeatured}
          />
        }
        activeFilters={chips}
        onClearActiveFilters={handleReset}
        clearActiveFiltersLabel={CATEGORY_LIST_COPY.activeFiltersResetLabel}
        resultsCount={total}
        resultsFullLabel={CATEGORY_RESULTS_COUNT_COPY.results}
        resultsShortLabel={CATEGORY_RESULTS_COUNT_COPY.resultsShort}
      />

      <CategoryListMobileFiltersDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        categoriesForPicker={categoriesForPicker}
        categorySlugs={filters.categorySlugs}
        status={filters.status}
        featured={filters.featured}
        hasActiveFilters={mobileFilterCount > 0}
        activeFilterItems={chips}
        onCategorySlugsChange={filters.setCategorySlugs}
        onStatusChange={filters.setStatus}
        onFeaturedChange={filters.setFeatured}
        onReset={handleReset}
      />
    </>
  );
}
