"use client";

import { useMemo, useState, type JSX } from "react";

import { Button } from "@/components/ui/button";
import { useProductTableFilters } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type {
  ProductFilterCategoryOption,
  ProductTableItem,
} from "@/features/admin/products/list/types/product-table.types";
import { useProductTableActions } from "./hooks/use-product-table-actions";
import { ProductTableDesktop } from "./product-table-desktop";
import { ProductTableMobile } from "./product-table-mobile";
import { ProductTableToolbar } from "./product-table-toolbar";

type ProductListView = "active" | "trash";

type ProductTableProps = {
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  view: ProductListView;
};

type MobileVisibleSelectionState = {
  visibleCount: number;
  visibleSelectedCount: number;
  areAllVisibleSelected: boolean;
};

export function ProductTable({ products, categoryOptions, view }: ProductTableProps): JSX.Element {
  const state = useProductTableFilters({ products, categoryOptions });

  const [mobileVisibleSelection, setMobileVisibleSelection] =
    useState<MobileVisibleSelectionState | null>(null);

  const currentPageProductIds = useMemo(() => {
    return state.paginated.map((product) => product.id);
  }, [state.paginated]);

  const mobileVisibleProductIds = useMemo(() => {
    const visibleCount = mobileVisibleSelection?.visibleCount ?? 0;
    return state.allFilteredProducts.slice(0, visibleCount).map((product) => product.id);
  }, [mobileVisibleSelection?.visibleCount, state.allFilteredProducts]);

  const actions = useProductTableActions({ currentPageProductIds, mobileVisibleProductIds });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 lg:gap-3">
      <div className="hidden min-h-0 flex-1 flex-col gap-2 lg:flex">
        <ProductTableToolbar
          categoryOptions={categoryOptions}
          state={state}
          mode="desktop"
          view={view}
          selectedCount={actions.selectedCount}
          onClearSelection={actions.clearSelection}
          bulkMessage={actions.bulkMessage}
          bulkError={actions.bulkError}
          isBulkPending={actions.isBulkPending}
          onBulkSetDraft={() => void actions.handleBulkStatusChange("draft")}
          onBulkSetActive={() => void actions.handleBulkStatusChange("active")}
          onBulkSetInactive={() => void actions.handleBulkStatusChange("inactive")}
          onBulkSetFeatured={() => void actions.handleBulkFeaturedChange(true)}
          onBulkUnsetFeatured={() => void actions.handleBulkFeaturedChange(false)}
          onBulkArchive={() => void actions.handleBulkArchive()}
          onBulkRestore={() => void actions.handleBulkRestore()}
          {...(view === "trash"
            ? { onBulkPermanentDelete: () => void actions.handleBulkPermanentDelete() }
            : {})}
        />

        <div className="min-h-0 flex-1">
          <ProductTableDesktop
            products={state.paginated}
            selectedProductIds={actions.selectedProductIds}
            areAllCurrentPageSelected={actions.areAllCurrentPageSelected}
            onToggleProductSelection={actions.toggleProductSelection}
            onToggleSelectAllCurrentPage={actions.toggleSelectAllCurrentPage}
            view={view}
            {...(view === "active" ? { onConfirmArchive: actions.handleArchiveOne } : {})}
            {...(view === "trash" ? { onConfirmRestore: actions.handleRestoreOne } : {})}
            {...(view === "trash"
              ? { onConfirmPermanentDelete: actions.handlePermanentDeleteOne }
              : {})}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-2">
          <p className="text-xs text-muted-foreground">
            Page {state.currentPage} sur {state.totalPages}
            {state.totalPages > 1 ? (
              <span className="ml-1.5 opacity-70">
                · {state.filteredCount} produit{state.filteredCount !== 1 ? "s" : ""}
              </span>
            ) : null}
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={state.goPrevious}
              disabled={state.currentPage <= 1}
              className="h-8 px-2.5 text-xs"
            >
              Précédent
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={state.goNext}
              disabled={state.currentPage >= state.totalPages}
              className="h-8 px-2.5 text-xs"
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        <ProductTableToolbar
          categoryOptions={categoryOptions}
          state={state}
          mode="mobile"
          view={view}
          selectedCount={actions.selectedCount}
          onClearSelection={actions.clearSelection}
          bulkMessage={actions.bulkMessage}
          bulkError={actions.bulkError}
          isBulkPending={actions.isBulkPending}
          onBulkSetDraft={() => void actions.handleBulkStatusChange("draft")}
          onBulkSetActive={() => void actions.handleBulkStatusChange("active")}
          onBulkSetInactive={() => void actions.handleBulkStatusChange("inactive")}
          onBulkSetFeatured={() => void actions.handleBulkFeaturedChange(true)}
          onBulkUnsetFeatured={() => void actions.handleBulkFeaturedChange(false)}
          onBulkArchive={() => void actions.handleBulkArchive()}
          onBulkRestore={() => void actions.handleBulkRestore()}
          {...(view === "trash"
            ? { onBulkPermanentDelete: () => void actions.handleBulkPermanentDelete() }
            : {})}
          mobileVisibleCount={mobileVisibleSelection?.visibleCount ?? 0}
          mobileVisibleSelectedCount={mobileVisibleSelection?.visibleSelectedCount ?? 0}
          mobileAllVisibleSelected={mobileVisibleSelection?.areAllVisibleSelected ?? false}
          {...(mobileVisibleSelection !== null
            ? { onToggleSelectAllMobileVisible: actions.toggleSelectAllMobileVisible }
            : {})}
        />

        <div
          data-scroll-root="true"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
        >
          <ProductTableMobile
            products={state.allFilteredProducts}
            view={view}
            selectedProductIds={actions.selectedProductIds}
            onToggleProductSelection={actions.toggleProductSelection}
            onVisibleSelectionStatsChange={(nextStats) => {
              setMobileVisibleSelection((current) => {
                if (
                  current !== null &&
                  current.visibleCount === nextStats.visibleCount &&
                  current.visibleSelectedCount === nextStats.visibleSelectedCount &&
                  current.areAllVisibleSelected === nextStats.areAllVisibleSelected
                ) {
                  return current;
                }

                return nextStats;
              });
            }}
            {...(view === "active" ? { onConfirmArchive: actions.handleArchiveOne } : {})}
            {...(view === "trash" ? { onConfirmRestore: actions.handleRestoreOne } : {})}
            {...(view === "trash"
              ? { onConfirmPermanentDelete: actions.handlePermanentDeleteOne }
              : {})}
          />
        </div>
      </div>
    </div>
  );
}
