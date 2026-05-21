"use client";

import type { JSX } from "react";

import { AdminFilterPopover } from "@/components/admin/shared/admin-filter-popover";
import { AdminToolbar } from "@/components/admin/shared/admin-toolbar";
import { AdminDataTableActiveFilters } from "@/components/admin/tables";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PRODUCT_FEATURED_OPTIONS,
  PRODUCT_IMAGE_OPTIONS,
  PRODUCT_LIST_COPY,
  PRODUCT_SELECTION_COPY,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_STOCK_OPTIONS,
  PRODUCT_VARIANT_OPTIONS,
} from "@/features/admin/products/config";
import type { ProductTableFiltersState } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type {
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
} from "@/features/admin/products/list/types/product-table.types";
import { AdminProductsCategoryFilter } from "./admin-products-category-filter";
import { useProductTableContext } from "./product-table-context";
import {
  ProductTableToolbarBulkActions,
  ProductTableToolbarResultsCount,
  ProductTableToolbarViewSwitch,
} from "./toolbar";

type ProductTableToolbarDesktopProps = {
  onOpenPermanentDeleteDialog: () => void;
};

function StatusFilterList({ state }: { state: ProductTableFiltersState }) {
  return (
    <div className="flex flex-col gap-0.5">
      {PRODUCT_STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => state.setStatus(opt.value)}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
            state.status === opt.value ? "font-medium text-foreground" : "text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              state.status === opt.value ? "bg-foreground" : "bg-transparent"
            )}
          />
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const ADVANCED_LABEL_CLASS =
  "text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60";

function AdvancedFiltersContent({ state }: { state: ProductTableFiltersState }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-1.5">
        <p className={ADVANCED_LABEL_CLASS}>{PRODUCT_LIST_COPY.filterAdvancedFeaturedLabel}</p>
        <Select
          value={state.featured}
          onValueChange={(v) => state.setFeatured(v as ProductFilterFeaturedOption)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_FEATURED_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <p className={ADVANCED_LABEL_CLASS}>{PRODUCT_LIST_COPY.filterAdvancedImagesLabel}</p>
        <Select
          value={state.image}
          onValueChange={(v) => state.setImage(v as ProductFilterImageOption)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_IMAGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <p className={ADVANCED_LABEL_CLASS}>{PRODUCT_LIST_COPY.filterAdvancedVariantsLabel}</p>
        <Select
          value={state.variant}
          onValueChange={(v) => state.setVariant(v as ProductFilterVariantOption)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_VARIANT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <p className={ADVANCED_LABEL_CLASS}>{PRODUCT_LIST_COPY.filterAdvancedStockLabel}</p>
        <Select
          value={state.stock}
          onValueChange={(v) => state.setStock(v as ProductFilterStockOption)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_STOCK_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function ProductTableToolbarDesktop({
  onOpenPermanentDeleteDialog,
}: ProductTableToolbarDesktopProps): JSX.Element {
  const { state, actions, view } = useProductTableContext();

  const selectedCount = actions.selectedCount;
  const bulkMessage = actions.bulkMessage;
  const bulkError = actions.bulkError;
  const isBulkPending = actions.isBulkPending;
  const hasActiveFilters = state.activeFilters.length > 0;
  const hasSelection = selectedCount > 0;

  const statusCount = state.status !== "all" ? 1 : 0;
  const categoryCount = state.categoryId !== "all" ? 1 : 0;
  const advancedCount = [
    state.featured !== "all",
    state.image !== "all",
    state.variant !== "all",
    state.stock !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-2">
      {hasSelection ? (
        <div className="rounded-xl border border-surface-border-strong bg-interactive-selected px-3 py-3 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">
              {PRODUCT_SELECTION_COPY.selectedDesktop(selectedCount)}
            </p>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={actions.clearSelection}
              className="h-8 rounded-full px-3 text-xs"
            >
              {PRODUCT_SELECTION_COPY.clearSelectionDesktop}
            </Button>
          </div>

          <div className="mt-3">
            <ProductTableToolbarBulkActions
              view={view}
              isBulkPending={isBulkPending}
              onBulkSetDraft={() => void actions.handleBulkStatusChange("draft")}
              onBulkSetActive={() => void actions.handleBulkStatusChange("active")}
              onBulkSetInactive={() => void actions.handleBulkStatusChange("inactive")}
              onBulkSetFeatured={() => void actions.handleBulkFeaturedChange(true)}
              onBulkUnsetFeatured={() => void actions.handleBulkFeaturedChange(false)}
              onBulkArchive={() => void actions.handleBulkArchive()}
              onBulkRestore={() => void actions.handleBulkRestore()}
              {...(view === "trash" ? { onOpenPermanentDeleteDialog } : {})}
            />
          </div>
        </div>
      ) : null}

      {bulkMessage ? (
        <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-3 py-2 text-sm text-foreground shadow-card">
          {bulkMessage}
        </div>
      ) : null}

      {bulkError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive shadow-card">
          {bulkError}
        </div>
      ) : null}

      <div className="border-b border-surface-border/40 pb-3">
        <AdminToolbar
          search={state.search}
          onSearchChange={state.handleSearchChange}
          placeholder={PRODUCT_LIST_COPY.searchPlaceholder}
          className="mt-0"
          extraControls={
            <div className="flex shrink-0 items-center gap-2">
              <AdminFilterPopover label={PRODUCT_LIST_COPY.filterStatutLabel} count={statusCount}>
                <StatusFilterList state={state} />
              </AdminFilterPopover>

              <AdminFilterPopover
                label={PRODUCT_LIST_COPY.filterCategoryLabel}
                count={categoryCount}
                contentClassName="w-72 p-3"
              >
                <AdminProductsCategoryFilter
                  categories={state.categoryOptions}
                  selectedParentCategoryId={state.parentCategoryId}
                  selectedCategoryId={state.categoryId}
                  onParentCategoryChange={state.setParentCategoryId}
                  onCategoryChange={state.setCategoryId}
                  triggerClassName="h-8 text-xs"
                />
              </AdminFilterPopover>

              <AdminFilterPopover label={PRODUCT_LIST_COPY.filterAdvancedLabel} count={advancedCount}>
                <AdvancedFiltersContent state={state} />
              </AdminFilterPopover>

              <Select
                value={state.sort}
                onValueChange={(v) => state.setSort(v as ProductSortOption)}
              >
                <SelectTrigger className="h-9 w-36 text-sm text-muted-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <ProductTableToolbarViewSwitch view={view} />

              <ProductTableToolbarResultsCount
                filteredCount={state.filteredCount}
                className="whitespace-nowrap"
              />
            </div>
          }
        />
      </div>

      {hasActiveFilters ? (
        <AdminDataTableActiveFilters items={state.activeFilters} onClearAll={state.reset} />
      ) : null}
    </div>
  );
}
