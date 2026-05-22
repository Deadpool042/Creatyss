"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { AdminToolbar } from "@/components/admin/shared/admin-toolbar";
import {
  AdminDataTableActiveFilters,
  AdminDataTableFilterControlsRow,
  AdminDataTableFiltersTrigger,
  AdminDataTableMobileTopbar,
  AdminDataTableResultsCount,
  AdminDataTableToolbarLayout,
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
    <AdminDataTableFiltersTrigger
      icon={SlidersHorizontal}
      label={CATEGORY_LIST_ACTIONS_COPY.mobileFiltersLabel}
      activeLabel={`${CATEGORY_LIST_ACTIONS_COPY.mobileFiltersLabel}${CATEGORY_LIST_ACTIONS_COPY.mobileFiltersWithCountSeparator}${mobileFilterCount}`}
      active={mobileFilterCount > 0}
      onClick={() => setDrawerOpen(true)}
      className={cn(
        "lg:hidden inline-flex h-9 shrink-0 items-center gap-1.5 px-3 text-sm",
      )}
      activeClassName="border-surface-border-strong bg-interactive-selected text-foreground"
    />
  );

  return (
    <>
      <AdminDataTableToolbarLayout
        toolbar={
          <>
            <div className="lg:hidden">
              <AdminDataTableMobileTopbar
                search={filters.search}
                onSearchChange={filters.setSearch}
                placeholder={CATEGORY_LIST_COPY.searchPlaceholder}
                controls={mobileFiltersButton}
              />
            </div>
            <AdminToolbar
              search={filters.search}
              onSearchChange={filters.setSearch}
              placeholder={CATEGORY_LIST_COPY.searchPlaceholder}
              extraControls={
                <AdminDataTableFilterControlsRow
                  filters={
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
                />
              }
              className="mt-0"
              hideMobile
            />
          </>
        }
        activeFilters={
          <AdminDataTableActiveFilters
            items={chips}
            onClearAll={handleReset}
            clearLabel={CATEGORY_LIST_COPY.activeFiltersResetLabel}
            className="hidden lg:flex"
          />
        }
        meta={
          total > 0 ? (
            <AdminDataTableResultsCount
              count={total}
              fullLabel={CATEGORY_RESULTS_COUNT_COPY.results}
              shortLabel={CATEGORY_RESULTS_COUNT_COPY.resultsShort}
              className="text-xs not-italic"
            />
          ) : null
        }
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
