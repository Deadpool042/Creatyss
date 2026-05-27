"use client";

import { useState, type JSX } from "react";

import {
  AdminConfigDataTableFrame,
  AdminPaginationBar,
} from "@/components/admin/tables";
import { PRODUCT_FILTER_VALID_VALUES } from "@/features/admin/products/config";
import type { ProductListView } from "@/features/admin/products/list/types";
import { useProductTableContext } from "../desktop/product-table-context";
import { ProductTableDesktop } from "../desktop/product-table-desktop";
import { ProductTableMobile } from "../mobile/product-table-mobile";
import { ProductListToolbar } from "../toolbar/product-list-toolbar";
import { ProductBulkBar, ProductTableEmptyState } from ".";
import { ProductTableToolbarPermanentDeleteDialog } from "../toolbar";

export function ProductTable(): JSX.Element {
  const { state, actions, view, total, perPage, onMobileVisibleSelectionChange } =
    useProductTableContext();
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);

  const isBulkPending = actions.isBulkPending;
  const isFiltered = state.search.trim().length > 0 || state.activeFilters.length > 0;
  const toolbar = (
    <ProductListToolbar onOpenPermanentDeleteDialog={() => setPermanentDeleteDialogOpen(true)} />
  );
  const desktopActionProps = getDesktopProductTableActionProps({ actions, view });
  const mobileActionProps = getMobileProductTableActionProps({ actions, view });

  async function handleBulkPermanentDelete(): Promise<void> {
    if (view !== "trash") {
      setPermanentDeleteDialogOpen(false);
      return;
    }

    await actions.handleBulkPermanentDelete();
    setPermanentDeleteDialogOpen(false);
  }

  if (state.paginated.length === 0) {
    return (
      <>
        {toolbar}
        <ProductTableEmptyState view={view} isFiltered={isFiltered} />
      </>
    );
  }

  return (
    <>
      <AdminConfigDataTableFrame
        toolbar={toolbar}
        desktopClassName="overflow-y-auto [scrollbar-gutter:stable] p-1"
        desktopContent={
          <ProductTableDesktop
            products={state.paginated}
            selectedProductIds={actions.selectedProductIds}
            areAllCurrentPageSelected={actions.areAllCurrentPageSelected}
            onToggleProductSelection={actions.toggleProductSelection}
            onToggleSelectAllCurrentPage={actions.toggleSelectAllCurrentPage}
            view={view}
            {...desktopActionProps}
          />
        }
        mobileClassName="p-1"
        mobileContent={
          <ProductTableMobile
            products={state.allFilteredProducts}
            view={view}
            selectedProductIds={actions.selectedProductIds}
            onToggleProductSelection={actions.toggleProductSelection}
            onVisibleSelectionStatsChange={onMobileVisibleSelectionChange}
            {...mobileActionProps}
          />
        }
        pagination={
          <AdminPaginationBar
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            perPage={perPage}
            totalItems={total}
            onPageChange={state.setPage}
            onPerPageChange={state.setPerPage}
            perPageOptions={PRODUCT_FILTER_VALID_VALUES.perPage}
          />
        }
        floatingBar={
          <ProductBulkBar onOpenPermanentDeleteDialog={() => setPermanentDeleteDialogOpen(true)} />
        }
      />

      <ProductTableToolbarPermanentDeleteDialog
        open={permanentDeleteDialogOpen}
        onOpenChange={setPermanentDeleteDialogOpen}
        isBulkPending={isBulkPending}
        onConfirm={handleBulkPermanentDelete}
      />
    </>
  );
}

type ProductTableActionPropsInput = Readonly<{
  actions: ReturnType<typeof useProductTableContext>["actions"];
  view: ProductListView;
}>;

function getDesktopProductTableActionProps({
  actions,
  view,
}: ProductTableActionPropsInput): Partial<Parameters<typeof ProductTableDesktop>[0]> {
  if (view === "active") {
    return { onConfirmArchive: actions.handleArchiveOne };
  }

  return {
    onConfirmRestore: actions.handleRestoreOne,
    onConfirmPermanentDelete: actions.handlePermanentDeleteOne,
  };
}

function getMobileProductTableActionProps({
  actions,
  view,
}: ProductTableActionPropsInput): Partial<Parameters<typeof ProductTableMobile>[0]> {
  if (view === "active") {
    return { onConfirmArchive: actions.handleArchiveOne };
  }

  return {
    onConfirmRestore: actions.handleRestoreOne,
    onConfirmPermanentDelete: actions.handlePermanentDeleteOne,
  };
}
