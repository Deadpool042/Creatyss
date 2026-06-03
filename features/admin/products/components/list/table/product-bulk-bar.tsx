"use client";

import { AdminDataTableSelectionFloatingBar } from "@/components/admin/tables/admin-data-table-selection-floating-bar";
import { AdminDataTableBulkActionButton } from "@/components/admin/tables/admin-data-table-bulk-action-button";
import {
  PRODUCT_BULK_ACTIONS_COPY,
  PRODUCT_SELECTION_COPY,
} from "@/features/admin/products/config";
import { useProductTableContext } from "../desktop/product-table-context";

type ProductBulkBarProps = Readonly<{
  onOpenPermanentDeleteDialog?: () => void;
}>;

function ActiveViewActions({
  actions,
  isBulkPending,
}: {
  actions: ReturnType<typeof useProductTableContext>["actions"];
  isBulkPending: boolean;
}) {
  return (
    <>
      <AdminDataTableBulkActionButton
        onClick={() => void actions.handleBulkStatusChange("draft")}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.setDraft}
      </AdminDataTableBulkActionButton>
      <AdminDataTableBulkActionButton
        onClick={() => void actions.handleBulkStatusChange("active")}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.setActive}
      </AdminDataTableBulkActionButton>
      <AdminDataTableBulkActionButton
        onClick={() => void actions.handleBulkStatusChange("inactive")}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.setInactive}
      </AdminDataTableBulkActionButton>
      <AdminDataTableBulkActionButton
        onClick={() => void actions.handleBulkFeaturedChange(true)}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.setFeatured}
      </AdminDataTableBulkActionButton>
      <AdminDataTableBulkActionButton
        onClick={() => void actions.handleBulkFeaturedChange(false)}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.unsetFeatured}
      </AdminDataTableBulkActionButton>
      <AdminDataTableBulkActionButton
        onClick={() => void actions.handleBulkArchive()}
        disabled={isBulkPending}
        danger
      >
        {PRODUCT_BULK_ACTIONS_COPY.archive}
      </AdminDataTableBulkActionButton>
    </>
  );
}

function TrashViewActions({
  actions,
  isBulkPending,
  onOpenPermanentDeleteDialog,
}: {
  actions: ReturnType<typeof useProductTableContext>["actions"];
  isBulkPending: boolean;
  onOpenPermanentDeleteDialog?: () => void;
}) {
  return (
    <>
      <AdminDataTableBulkActionButton
        onClick={() => void actions.handleBulkRestore()}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.restore}
      </AdminDataTableBulkActionButton>
      {onOpenPermanentDeleteDialog ? (
        <AdminDataTableBulkActionButton
          onClick={onOpenPermanentDeleteDialog}
          disabled={isBulkPending}
          danger
        >
          {PRODUCT_BULK_ACTIONS_COPY.hardDelete}
        </AdminDataTableBulkActionButton>
      ) : null}
    </>
  );
}

export function ProductBulkBar({ onOpenPermanentDeleteDialog }: ProductBulkBarProps) {
  const { actions, view } = useProductTableContext();
  const { selectedCount, isBulkPending, clearSelection } = actions;

  if (selectedCount === 0) return null;

  return (
    <AdminDataTableSelectionFloatingBar
      selectionLabel={PRODUCT_SELECTION_COPY.selectedDesktop(selectedCount)}
      clearSelectionLabel={PRODUCT_SELECTION_COPY.clearSelectionDesktop}
      onClearSelection={clearSelection}
      disabled={isBulkPending}
    >
      {view === "active" ? (
        <ActiveViewActions actions={actions} isBulkPending={isBulkPending} />
      ) : (
        <TrashViewActions
          actions={actions}
          isBulkPending={isBulkPending}
          {...(onOpenPermanentDeleteDialog ? { onOpenPermanentDeleteDialog } : {})}
        />
      )}
    </AdminDataTableSelectionFloatingBar>
  );
}
