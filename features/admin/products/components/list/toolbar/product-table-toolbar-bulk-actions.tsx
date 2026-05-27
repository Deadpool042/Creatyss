"use client";

import type { JSX } from "react";

import { AdminDataTableBulkActionButton } from "@/components/admin/tables";
import { PRODUCT_BULK_ACTIONS_COPY } from "@/features/admin/products/config";
import type { ProductListView } from "@/features/admin/products/list/types";

type ProductTableToolbarBulkActionsProps = {
  view: ProductListView;
  isBulkPending: boolean;
  onBulkSetDraft?: () => void;
  onBulkSetActive?: () => void;
  onBulkSetInactive?: () => void;
  onBulkSetFeatured?: () => void;
  onBulkUnsetFeatured?: () => void;
  onBulkArchive?: () => void;
  onBulkRestore?: () => void;
  onOpenPermanentDeleteDialog?: () => void;
};

export function ProductTableToolbarBulkActions({
  view,
  isBulkPending,
  onBulkSetDraft,
  onBulkSetActive,
  onBulkSetInactive,
  onBulkSetFeatured,
  onBulkUnsetFeatured,
  onBulkArchive,
  onBulkRestore,
  onOpenPermanentDeleteDialog,
}: ProductTableToolbarBulkActionsProps): JSX.Element {
  if (view === "trash") {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {onBulkRestore ? (
          <AdminDataTableBulkActionButton
            onClick={onBulkRestore}
            disabled={isBulkPending}
            className="h-8"
          >
            {PRODUCT_BULK_ACTIONS_COPY.restore}
          </AdminDataTableBulkActionButton>
        ) : null}

        {onOpenPermanentDeleteDialog ? (
          <AdminDataTableBulkActionButton
            onClick={onOpenPermanentDeleteDialog}
            disabled={isBulkPending}
            danger
            className="h-8"
          >
            {PRODUCT_BULK_ACTIONS_COPY.hardDelete}
          </AdminDataTableBulkActionButton>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {onBulkSetDraft ? (
        <AdminDataTableBulkActionButton
          onClick={onBulkSetDraft}
          disabled={isBulkPending}
          className="h-8"
        >
          {PRODUCT_BULK_ACTIONS_COPY.setDraft}
        </AdminDataTableBulkActionButton>
      ) : null}

      {onBulkSetActive ? (
        <AdminDataTableBulkActionButton
          onClick={onBulkSetActive}
          disabled={isBulkPending}
          className="h-8"
        >
          {PRODUCT_BULK_ACTIONS_COPY.setActive}
        </AdminDataTableBulkActionButton>
      ) : null}

      {onBulkSetInactive ? (
        <AdminDataTableBulkActionButton
          onClick={onBulkSetInactive}
          disabled={isBulkPending}
          className="h-8"
        >
          {PRODUCT_BULK_ACTIONS_COPY.setInactive}
        </AdminDataTableBulkActionButton>
      ) : null}

      {onBulkSetFeatured ? (
        <AdminDataTableBulkActionButton
          onClick={onBulkSetFeatured}
          disabled={isBulkPending}
          className="h-8"
        >
          {PRODUCT_BULK_ACTIONS_COPY.setFeatured}
        </AdminDataTableBulkActionButton>
      ) : null}

      {onBulkUnsetFeatured ? (
        <AdminDataTableBulkActionButton
          onClick={onBulkUnsetFeatured}
          disabled={isBulkPending}
          className="h-8"
        >
          {PRODUCT_BULK_ACTIONS_COPY.unsetFeatured}
        </AdminDataTableBulkActionButton>
      ) : null}

      {onBulkArchive ? (
        <AdminDataTableBulkActionButton
          onClick={onBulkArchive}
          disabled={isBulkPending}
          danger
          className="h-8"
        >
          {PRODUCT_BULK_ACTIONS_COPY.archive}
        </AdminDataTableBulkActionButton>
      ) : null}
    </div>
  );
}
