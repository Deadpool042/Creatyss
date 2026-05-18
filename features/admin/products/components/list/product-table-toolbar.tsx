"use client";

import { useState, type JSX } from "react";

import { useProductTableContext } from "./product-table-context";
import { ProductTableToolbarDesktop } from "./product-table-toolbar-desktop";
import { ProductTableToolbarMobile } from "./product-table-toolbar-mobile";
import { ProductTableToolbarPermanentDeleteDialog } from "./toolbar/product-table-toolbar-permanent-delete-dialog";

type ProductTableToolbarProps = {
  mode: "desktop" | "mobile";
};

export function ProductTableToolbar({ mode }: ProductTableToolbarProps): JSX.Element {
  const { actions, view } = useProductTableContext();
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

  if (mode === "desktop") {
    return (
      <>
        <ProductTableToolbarDesktop
          onOpenPermanentDeleteDialog={() => setPermanentDeleteDialogOpen(true)}
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

  return (
    <>
      <ProductTableToolbarMobile
        onOpenPermanentDeleteDialog={() => setPermanentDeleteDialogOpen(true)}
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
