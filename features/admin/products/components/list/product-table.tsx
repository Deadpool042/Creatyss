"use client";

import { useEffect, useMemo, useState, type JSX } from "react";

import { Button } from "@/components/ui/button";
import { archiveProductAction } from "@/features/admin/products/list/actions/archive-product.action";
import { bulkArchiveProductsAction } from "@/features/admin/products/list/actions/bulk-archive-products.action";
import { bulkRestoreProductsAction } from "@/features/admin/products/list/actions/bulk-restore-products.action";
import { bulkUpdateProductFeaturedAction } from "@/features/admin/products/list/actions/bulk-update-product-featured.action";
import { bulkUpdateProductStatusAction } from "@/features/admin/products/list/actions/bulk-update-product-status.action";
import { restoreProductAction } from "@/features/admin/products/list/actions/restore-product.action";
import { useProductTableFilters } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type {
  ProductFilterCategoryOption,
  ProductTableItem,
  ProductTableStatus,
} from "@/features/admin/products/list/types/product-table.types";
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

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [isBulkPending, setIsBulkPending] = useState(false);
  const [mobileVisibleSelection, setMobileVisibleSelection] =
    useState<MobileVisibleSelectionState | null>(null);

  useEffect(() => {
    if (bulkMessage === null && bulkError === null) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setBulkMessage(null);
      setBulkError(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [bulkMessage, bulkError]);

  const currentPageProductIds = useMemo(() => {
    return state.paginated.map((product) => product.id);
  }, [state.paginated]);

  const mobileVisibleProductIds = useMemo(() => {
    const visibleCount = mobileVisibleSelection?.visibleCount ?? 0;
    return state.allFilteredProducts.slice(0, visibleCount).map((product) => product.id);
  }, [mobileVisibleSelection?.visibleCount, state.allFilteredProducts]);

  const selectedCount = selectedProductIds.length;

  const areAllCurrentPageSelected =
    currentPageProductIds.length > 0 &&
    currentPageProductIds.every((productId) => selectedProductIds.includes(productId));

  function toggleProductSelection(productId: string): void {
    setBulkMessage(null);
    setBulkError(null);

    setSelectedProductIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      return [...current, productId];
    });
  }

  function toggleSelectAllCurrentPage(): void {
    setBulkMessage(null);
    setBulkError(null);

    setSelectedProductIds((current) => {
      if (areAllCurrentPageSelected) {
        return current.filter((id) => !currentPageProductIds.includes(id));
      }

      const next = new Set(current);

      for (const productId of currentPageProductIds) {
        next.add(productId);
      }

      return Array.from(next);
    });
  }

  function toggleSelectAllMobileVisible(): void {
    setBulkMessage(null);
    setBulkError(null);

    const areAllVisibleSelected =
      mobileVisibleProductIds.length > 0 &&
      mobileVisibleProductIds.every((productId) => selectedProductIds.includes(productId));

    setSelectedProductIds((current) => {
      if (areAllVisibleSelected) {
        return current.filter((id) => !mobileVisibleProductIds.includes(id));
      }

      const next = new Set(current);

      for (const productId of mobileVisibleProductIds) {
        next.add(productId);
      }

      return Array.from(next);
    });
  }

  function clearSelection(): void {
    setSelectedProductIds([]);
    setBulkMessage(null);
    setBulkError(null);
  }

  async function handleBulkStatusChange(status: ProductTableStatus): Promise<void> {
    if (selectedProductIds.length === 0 || isBulkPending) return;

    setIsBulkPending(true);
    setBulkMessage(null);
    setBulkError(null);

    const result = await bulkUpdateProductStatusAction({
      productIds: selectedProductIds,
      status,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setSelectedProductIds([]);
    } else {
      setBulkError(result.message);
    }

    setIsBulkPending(false);
  }

  async function handleBulkFeaturedChange(isFeatured: boolean): Promise<void> {
    if (selectedProductIds.length === 0 || isBulkPending) return;

    setIsBulkPending(true);
    setBulkMessage(null);
    setBulkError(null);

    const result = await bulkUpdateProductFeaturedAction({
      productIds: selectedProductIds,
      isFeatured,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setSelectedProductIds([]);
    } else {
      setBulkError(result.message);
    }

    setIsBulkPending(false);
  }

  async function handleBulkArchive(): Promise<void> {
    if (selectedProductIds.length === 0 || isBulkPending) return;

    setIsBulkPending(true);
    setBulkMessage(null);
    setBulkError(null);

    const result = await bulkArchiveProductsAction({
      productIds: selectedProductIds,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setSelectedProductIds([]);
    } else {
      setBulkError(result.message);
    }

    setIsBulkPending(false);
  }

  async function handleBulkRestore(): Promise<void> {
    if (selectedProductIds.length === 0 || isBulkPending) return;

    setIsBulkPending(true);
    setBulkMessage(null);
    setBulkError(null);

    const result = await bulkRestoreProductsAction({
      productIds: selectedProductIds,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setSelectedProductIds([]);
    } else {
      setBulkError(result.message);
    }

    setIsBulkPending(false);
  }

  async function handleArchiveOne(productSlug: string): Promise<void> {
    const result = await archiveProductAction(productSlug);

    if (result.status === "success") {
      setBulkMessage(result.message);
      setBulkError(null);
    } else {
      setBulkError(result.message);
      setBulkMessage(null);
    }
  }

  async function handleRestoreOne(productSlug: string): Promise<void> {
    const result = await restoreProductAction(productSlug);

    if (result.status === "success") {
      setBulkMessage(result.message);
      setBulkError(null);
    } else {
      setBulkError(result.message);
      setBulkMessage(null);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 lg:gap-3">
      <div className="hidden min-h-0 flex-1 flex-col gap-2 lg:flex">
        <ProductTableToolbar
          categoryOptions={categoryOptions}
          state={state}
          mode="desktop"
          view={view}
          selectedCount={selectedCount}
          onClearSelection={clearSelection}
          bulkMessage={bulkMessage}
          bulkError={bulkError}
          isBulkPending={isBulkPending}
          onBulkSetDraft={() => void handleBulkStatusChange("draft")}
          onBulkSetActive={() => void handleBulkStatusChange("active")}
          onBulkSetInactive={() => void handleBulkStatusChange("inactive")}
          onBulkSetFeatured={() => void handleBulkFeaturedChange(true)}
          onBulkUnsetFeatured={() => void handleBulkFeaturedChange(false)}
          onBulkArchive={() => void handleBulkArchive()}
          onBulkRestore={() => void handleBulkRestore()}
        />

        <div className="min-h-0 flex-1">
          <ProductTableDesktop
            products={state.paginated}
            selectedProductIds={selectedProductIds}
            areAllCurrentPageSelected={areAllCurrentPageSelected}
            onToggleProductSelection={toggleProductSelection}
            onToggleSelectAllCurrentPage={toggleSelectAllCurrentPage}
            view={view}
            onConfirmArchive={handleArchiveOne}
            onConfirmRestore={handleRestoreOne}
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
          selectedCount={selectedCount}
          onClearSelection={clearSelection}
          bulkMessage={bulkMessage}
          bulkError={bulkError}
          isBulkPending={isBulkPending}
          onBulkSetDraft={() => void handleBulkStatusChange("draft")}
          onBulkSetActive={() => void handleBulkStatusChange("active")}
          onBulkSetInactive={() => void handleBulkStatusChange("inactive")}
          onBulkSetFeatured={() => void handleBulkFeaturedChange(true)}
          onBulkUnsetFeatured={() => void handleBulkFeaturedChange(false)}
          onBulkArchive={() => void handleBulkArchive()}
          onBulkRestore={() => void handleBulkRestore()}
          mobileVisibleCount={mobileVisibleSelection?.visibleCount ?? 0}
          mobileVisibleSelectedCount={mobileVisibleSelection?.visibleSelectedCount ?? 0}
          mobileAllVisibleSelected={mobileVisibleSelection?.areAllVisibleSelected ?? false}
          {...(mobileVisibleSelection !== null
            ? { onToggleSelectAllMobileVisible: toggleSelectAllMobileVisible }
            : {})}
        />

        <div
          data-scroll-root="true"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
        >
          <ProductTableMobile
            products={state.allFilteredProducts}
            view={view}
            selectedProductIds={selectedProductIds}
            onToggleProductSelection={toggleProductSelection}
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
            onConfirmArchive={handleArchiveOne}
            onConfirmRestore={handleRestoreOne}
          />
        </div>
      </div>
    </div>
  );
}
