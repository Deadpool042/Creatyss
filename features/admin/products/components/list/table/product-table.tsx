"use client";

import { useCallback, useState, type JSX, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import {
  parseAdminLoadMoreItems,
  AdminConfigMobileFeed,
} from "@/components/admin/tables/mobile/admin-config-mobile-feed";
import { AdminConfigDataTable } from "@/components/admin/tables/admin-config-data-table";
import { AdminConfigDataTableFrame } from "@/components/admin/tables/layout/admin-config-data-table-frame";
import { AdminPaginationBar } from "@/components/admin/tables/layout/admin-pagination-bar";
import { PRODUCT_FILTER_VALID_VALUES, PRODUCT_TABLE_COPY } from "@/features/admin/products/config";
import { buildAdminProductEditPath } from "@/features/admin/products/navigation";
import type { ProductListView, ProductTableItem } from "@/features/admin/products/list/types";
import { useProductTableContext } from "../desktop/product-table-context";
import { createProductTableDesktopColumns } from "../desktop/product-table-desktop.config";
import { ProductCollectionCard } from "../mobile/product-collection-card";
import { ProductListToolbar } from "../toolbar/product-list-toolbar";
import { ProductBulkBar } from "./product-bulk-bar";
import { ProductTableEmptyState } from "./product-table-empty-state";
import { ProductTableToolbarPermanentDeleteDialog } from "../toolbar/product-table-toolbar-permanent-delete-dialog";

type ProductTableActionProps = Readonly<{
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
}>;

type ProductTableProps = Readonly<{
  /** Action de création, remontée depuis la page pour vivre dans la toolbar unifiée plutôt que dans AdminPageContextBar. */
  createAction?: ReactNode;
}>;

export function ProductTable({ createAction }: ProductTableProps): JSX.Element {
  const { state, actions, view, total, perPage, onMobileVisibleSelectionChange } =
    useProductTableContext();
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const isBulkPending = actions.isBulkPending;
  const isFiltered = state.search.trim().length > 0 || state.activeFilters.length > 0;
  const toolbar = (
    <ProductListToolbar
      onOpenPermanentDeleteDialog={() => setPermanentDeleteDialogOpen(true)}
      createAction={createAction}
    />
  );
  const actionProps = getProductTableActionProps({ actions, view });
  const desktopColumns = createProductTableDesktopColumns({
    selectedProductIds: actions.selectedProductIds,
    areAllCurrentPageSelected: actions.areAllCurrentPageSelected,
    view,
    sort: state.sort,
    onSortChange: state.setSort,
    onToggleProductSelection: actions.toggleProductSelection,
    onToggleSelectAllCurrentPage: actions.toggleSelectAllCurrentPage,
    ...actionProps,
  });
  const handleMobileVisibleItemsChange = useCallback(
    (visibleItems: ProductTableItem[]) => {
      const visibleProductIds = visibleItems.map((product) => product.id);
      const visibleSelectedCount = visibleProductIds.filter((productId) =>
        actions.selectedProductIds.includes(productId)
      ).length;

      onMobileVisibleSelectionChange?.({
        visibleCount: visibleItems.length,
        visibleSelectedCount,
        areAllVisibleSelected:
          visibleProductIds.length > 0 &&
          visibleProductIds.every((productId) => actions.selectedProductIds.includes(productId)),
      });
    },
    [actions.selectedProductIds, onMobileVisibleSelectionChange]
  );

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
        desktopClassName="p-1"
        desktopContent={
          <AdminConfigDataTable
            data={state.paginated}
            columns={desktopColumns}
            getRowId={(product) => product.id}
            wrapperClassName="flex min-h-0 flex-1 flex-col"
            viewportClassName="min-h-0 flex-1"
            headerClassName="backdrop-blur-xl"
            bodyClassName="[&_tr:last-child]:border-0"
            getRowHref={(product) => buildAdminProductEditPath(product.slug)}
            onToggleRowSelection={(product) => actions.toggleProductSelection(product.id)}
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
        mobileClassName="p-1"
        mobileContent={
          <AdminConfigMobileFeed
            items={state.allFilteredProducts}
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            perPage={perPage}
            totalItems={total}
            queryString={queryString}
            loadMorePath="/api/admin/products/load-more"
            className="safe-pb-mobile-nav"
            gridClassName="[@media(min-width:667px)]:grid-cols-2"
            endLabel={PRODUCT_TABLE_COPY.mobileEndOfList}
            totalLabel={(count) => `${count} produit${count !== 1 ? "s" : ""}`}
            parseItems={parseAdminLoadMoreItems<ProductTableItem>}
            onVisibleItemsChange={handleMobileVisibleItemsChange}
            renderItem={(product) => (
              <ProductCollectionCard
                key={product.id}
                product={product}
                view={view}
                isSelected={actions.selectedProductIds.includes(product.id)}
                onToggleSelection={actions.toggleProductSelection}
                {...(actionProps.onConfirmArchive
                  ? { onConfirmArchive: actionProps.onConfirmArchive }
                  : {})}
                {...(actionProps.onConfirmRestore
                  ? { onConfirmRestore: actionProps.onConfirmRestore }
                  : {})}
                {...(actionProps.onConfirmPermanentDelete
                  ? { onConfirmPermanentDelete: actionProps.onConfirmPermanentDelete }
                  : {})}
              />
            )}
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

type ProductTableActionPropsInput = Readonly<{
  actions: ReturnType<typeof useProductTableContext>["actions"];
  view: ProductListView;
}>;

function getProductTableActionProps({
  actions,
  view,
}: ProductTableActionPropsInput): ProductTableActionProps {
  if (view === "active") {
    return { onConfirmArchive: actions.handleArchiveOne };
  }

  return {
    onConfirmRestore: actions.handleRestoreOne,
    onConfirmPermanentDelete: actions.handlePermanentDeleteOne,
  };
}
