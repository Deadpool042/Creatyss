"use client";

import { useState, type JSX } from "react";

import {
  AdminDataTableDesktopLayout,
  AdminDataTableEmptyState,
  AdminDataTableMobileLayout,
  AdminPaginationBar,
} from "@/components/admin/tables";
import { PRODUCT_FILTER_VALID_VALUES, PRODUCT_TABLE_COPY } from "@/features/admin/products/config";
import { ProductTableStateProvider, useProductTableContext, useProductTableData } from "./product-table-context";
import { ProductTableDesktop } from "./product-table-desktop";
import { ProductTableMobile } from "./product-table-mobile";
import { ProductTableToolbar } from "./product-table-toolbar";
import { ProductBulkBar } from "./table";
import { ProductTableToolbarPermanentDeleteDialog, type ProductListView } from "./toolbar";

export function ProductTable(): JSX.Element {
  return (
    <ProductTableStateProvider>
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-4">
        <ProductTableDesktopView />
        <ProductTableMobileView />
      </div>
    </ProductTableStateProvider>
  );
}

function ProductTableDesktopView(): JSX.Element {
  const { state, actions, view } = useProductTableContext();
  const { total, perPage } = useProductTableData();
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);

  const isBulkPending = actions.isBulkPending;

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
        <ProductTableToolbar mode="desktop" />
        <AdminDataTableEmptyState
          message={
            view === "trash" ? PRODUCT_TABLE_COPY.emptyTrash : PRODUCT_TABLE_COPY.emptyFiltered
          }
        />
      </>
    );
  }

  return (
    <>
      <AdminDataTableDesktopLayout
        toolbar={<ProductTableToolbar mode="desktop" />}
        content={
          <ProductTableDesktop
            products={state.paginated}
            selectedProductIds={actions.selectedProductIds}
            areAllCurrentPageSelected={actions.areAllCurrentPageSelected}
            onToggleProductSelection={actions.toggleProductSelection}
            onToggleSelectAllCurrentPage={actions.toggleSelectAllCurrentPage}
            view={view}
            {...getDesktopProductTableActionProps({ actions, view })}
          />
        }
        contentClassName="overflow-hidden"
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
          <ProductBulkBar
            onOpenPermanentDeleteDialog={() => setPermanentDeleteDialogOpen(true)}
          />
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

function ProductTableMobileView(): JSX.Element {
  const { state, actions, view, onMobileVisibleSelectionChange } = useProductTableContext();

  return (
    <AdminDataTableMobileLayout
      toolbar={<ProductTableToolbar mode="mobile" />}
      content={
        <ProductTableMobile
          products={state.allFilteredProducts}
          view={view}
          selectedProductIds={actions.selectedProductIds}
          onToggleProductSelection={actions.toggleProductSelection}
          onVisibleSelectionStatsChange={onMobileVisibleSelectionChange}
          {...getMobileProductTableActionProps({ actions, view })}
        />
      }
    />
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
