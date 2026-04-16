"use client";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductListView } from "./product-table-toolbar-types";

type ProductTableToolbarBulkActionButtonProps = {
  children: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
};

function ProductTableToolbarBulkActionButton({
  children,
  onClick,
  disabled = false,
  danger = false,
}: ProductTableToolbarBulkActionButtonProps): JSX.Element {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 shrink-0 whitespace-nowrap rounded-full px-3 text-xs shadow-none",
        danger && "border-destructive/30 text-destructive/70 hover:text-destructive/70"
      )}
    >
      {children}
    </Button>
  );
}

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
          <ProductTableToolbarBulkActionButton onClick={onBulkRestore} disabled={isBulkPending}>
            Restaurer
          </ProductTableToolbarBulkActionButton>
        ) : null}

        {onOpenPermanentDeleteDialog ? (
          <ProductTableToolbarBulkActionButton
            onClick={onOpenPermanentDeleteDialog}
            disabled={isBulkPending}
            danger
          >
            Supprimer définitivement
          </ProductTableToolbarBulkActionButton>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {onBulkSetDraft ? (
        <ProductTableToolbarBulkActionButton onClick={onBulkSetDraft} disabled={isBulkPending}>
          Brouillon
        </ProductTableToolbarBulkActionButton>
      ) : null}

      {onBulkSetActive ? (
        <ProductTableToolbarBulkActionButton onClick={onBulkSetActive} disabled={isBulkPending}>
          Activer
        </ProductTableToolbarBulkActionButton>
      ) : null}

      {onBulkSetInactive ? (
        <ProductTableToolbarBulkActionButton onClick={onBulkSetInactive} disabled={isBulkPending}>
          Désactiver
        </ProductTableToolbarBulkActionButton>
      ) : null}

      {onBulkSetFeatured ? (
        <ProductTableToolbarBulkActionButton onClick={onBulkSetFeatured} disabled={isBulkPending}>
          Mettre en avant
        </ProductTableToolbarBulkActionButton>
      ) : null}

      {onBulkUnsetFeatured ? (
        <ProductTableToolbarBulkActionButton
          onClick={onBulkUnsetFeatured}
          disabled={isBulkPending}
        >
          Retirer la mise en avant
        </ProductTableToolbarBulkActionButton>
      ) : null}

      {onBulkArchive ? (
        <ProductTableToolbarBulkActionButton onClick={onBulkArchive} disabled={isBulkPending} danger>
          Corbeille
        </ProductTableToolbarBulkActionButton>
      ) : null}
    </div>
  );
}
