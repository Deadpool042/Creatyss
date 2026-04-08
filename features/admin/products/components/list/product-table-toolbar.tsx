"use client";

import { Filter, SlidersHorizontal } from "lucide-react";
import { useState, type JSX } from "react";

import { AdminDataTableActiveFilters } from "@/components/admin/tables/admin-data-table-active-filters";
import { AdminDataTableFiltersSheet } from "@/components/admin/tables/admin-data-table-filters-sheet";
import { AdminSearchInput } from "@/components/admin/tables/admin-search-input";
import { Button } from "@/components/ui/button";
import type { ProductTableFiltersState } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type { ProductFilterCategoryOption } from "@/features/admin/products/list/types/product-table.types";
import { cn } from "@/lib/utils";
import { ProductSearchSheet } from "./product-search-sheet";
import { ProductTableFiltersForm } from "./product-table-filters-form";

type ProductTableToolbarProps = {
  categoryOptions: ProductFilterCategoryOption[];
  state: ProductTableFiltersState;
};

function ResultsCount({
  filteredCount,
  className,
}: {
  filteredCount: number;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-medium italic text-muted-foreground sm:text-[11px]",
        className
      )}
    >
      <span className="[@media(max-height:480px)]:hidden">
        {filteredCount} résultat{filteredCount !== 1 ? "s" : ""}
      </span>

      <span className="hidden [@media(max-height:480px)]:inline">{filteredCount} res.</span>
    </span>
  );
}

export function ProductTableToolbar({
  categoryOptions,
  state,
}: ProductTableToolbarProps): JSX.Element {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const activeFiltersCount = state.activeFilters.length;
  const hasActiveFilters = activeFiltersCount > 0;
  const mobileFiltersLabel = hasActiveFilters ? `Filtres · ${activeFiltersCount}` : "Filtres";
  const mobileFiltersDescription = hasActiveFilters
    ? `${activeFiltersCount} filtre${activeFiltersCount > 1 ? "s" : ""} actif${activeFiltersCount > 1 ? "s" : ""}.`
    : "Affiner rapidement la liste.";

  return (
    <div className="space-y-3 [@media(max-height:480px)]:space-y-1">
      <div className="hidden lg:block">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:gap-4">
            <div className="w-full 2xl:max-w-sm 2xl:flex-none">
              <AdminSearchInput
                value={state.search}
                onChange={state.handleSearchChange}
                placeholder="Rechercher un produit…"
                className="relative w-full"
              />
            </div>

            <div className="min-w-0 2xl:min-w-lg 2xl:flex-1">
              <ProductTableFiltersForm
                categoryOptions={categoryOptions}
                state={state}
                mode="primary"
              />
            </div>

            <div className="flex items-center justify-between gap-3 2xl:shrink-0 2xl:justify-end">
              <ResultsCount filteredCount={state.filteredCount} className="whitespace-nowrap" />

              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => state.setShowAdvancedFilters(!state.showAdvancedFilters)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full",
                  hasActiveFilters &&
                    "border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {hasActiveFilters ? `Filtres · ${activeFiltersCount}` : "Filtres"}
              </Button>
            </div>
          </div>

          {state.showAdvancedFilters ? (
            <div className="rounded-xl border border-surface-border bg-surface-panel-soft p-3 lg:p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <ProductTableFiltersForm
                  categoryOptions={categoryOptions}
                  state={state}
                  mode="secondary"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-1 px-0.5 lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto">
            <ProductSearchSheet
              open={mobileSearchOpen}
              onOpenChange={setMobileSearchOpen}
              value={state.search}
              onChange={state.handleSearchChange}
              triggerClassName="shrink-0"
            />

            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => state.setMobileFiltersOpen(true)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[11px] sm:px-3 sm:text-xs [@media(max-height:480px)]:gap-1 [@media(max-height:480px)]:px-2 [@media(max-height:480px)]:text-[10px]",
                hasActiveFilters &&
                  "border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15"
              )}
              aria-label={
                hasActiveFilters ? `${activeFiltersCount} filtres actifs` : "Ouvrir les filtres"
              }
            >
              <Filter className="h-4 w-4" />
              <span>{mobileFiltersLabel}</span>
            </Button>
          </div>

          <div className="shrink-0 pr-0.5 text-right">
            <ResultsCount
              filteredCount={state.filteredCount}
              className="hidden whitespace-nowrap text-[10px] sm:text-[11px] [@media(max-height:480px)]:inline-flex"
            />
          </div>
        </div>

        <AdminDataTableFiltersSheet
          open={state.mobileFiltersOpen}
          onOpenChange={state.setMobileFiltersOpen}
          title={hasActiveFilters ? `Filtres produits · ${activeFiltersCount}` : "Filtres produits"}
          description={mobileFiltersDescription}
          footer={
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                type="button"
                onClick={state.reset}
                className="px-2 text-muted-foreground"
                disabled={!hasActiveFilters}
              >
                Réinitialiser
              </Button>

              <Button type="button" onClick={() => state.setMobileFiltersOpen(false)}>
                Appliquer
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {hasActiveFilters ? (
              <div className="rounded-xl border border-surface-border bg-surface-panel-soft p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Filtres actifs
                  </p>

                  <span className="rounded-full border border-surface-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {activeFiltersCount}
                  </span>
                </div>

                <AdminDataTableActiveFilters items={state.activeFilters} onClearAll={state.reset} />
              </div>
            ) : null}

            <ProductTableFiltersForm
              categoryOptions={categoryOptions}
              state={state}
              mode="mobile"
            />
          </div>
        </AdminDataTableFiltersSheet>
      </div>

      <div className="hidden md:block [@media(max-height:480px)]:hidden">
        <AdminDataTableActiveFilters items={state.activeFilters} onClearAll={state.reset} />
      </div>
    </div>
  );
}
