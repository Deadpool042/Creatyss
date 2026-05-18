"use client";

import type { JSX } from "react";

import { AdminTablePagination } from "@/components/admin/tables/admin-table-pagination";
import type {
  ProductFilterCategoryOption,
  ProductTableItem,
} from "@/features/admin/products/list/types/product-table.types";
import { ProductTableProvider, useProductTableContext } from "./product-table-context";
import { ProductTableDesktop } from "./product-table-desktop";
import { ProductTableMobile } from "./product-table-mobile";
import { ProductTableToolbar } from "./product-table-toolbar";
import type { ProductListView } from "./toolbar/product-table-toolbar-types";

type ProductTableProps = {
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  view: ProductListView;
};

export function ProductTable({ products, categoryOptions, view }: ProductTableProps): JSX.Element {
  return (
    <ProductTableProvider products={products} categoryOptions={categoryOptions} view={view}>
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-4">
        <ProductTableDesktopView />
        <ProductTableMobileView />
      </div>
    </ProductTableProvider>
  );
}

function ProductTableDesktopView(): JSX.Element {
  const { state, actions, view } = useProductTableContext();

  return (
    <div className="hidden min-h-0 flex-1 flex-col gap-3 lg:flex">
      <ProductTableToolbar mode="desktop" />

      <div className="min-h-0 flex-1 overflow-hidden">
        <ProductTableDesktop
          products={state.paginated}
          selectedProductIds={actions.selectedProductIds}
          areAllCurrentPageSelected={actions.areAllCurrentPageSelected}
          onToggleProductSelection={actions.toggleProductSelection}
          onToggleSelectAllCurrentPage={actions.toggleSelectAllCurrentPage}
          view={view}
          {...getDesktopProductTableActionProps({ actions, view })}
        />
      </div>

      <AdminTablePagination
        currentPage={state.currentPage}
        totalPages={state.totalPages}
        onPrevious={state.goPrevious}
        onNext={state.goNext}
        countLabel={`${state.filteredCount} produit${state.filteredCount !== 1 ? "s" : ""}`}
      />
    </div>
  );
}

function ProductTableMobileView(): JSX.Element {
  const { state, actions, view, onMobileVisibleSelectionChange } = useProductTableContext();

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:hidden">
      <ProductTableToolbar mode="mobile" />

      <div
        data-scroll-root="true"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
      >
        <ProductTableMobile
          products={state.allFilteredProducts}
          view={view}
          selectedProductIds={actions.selectedProductIds}
          onToggleProductSelection={actions.toggleProductSelection}
          onVisibleSelectionStatsChange={onMobileVisibleSelectionChange}
          {...getMobileProductTableActionProps({ actions, view })}
        />
      </div>
    </div>
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
