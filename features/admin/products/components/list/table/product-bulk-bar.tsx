"use client";

import { X } from "lucide-react";

import { AdminDataTableFloatingBar } from "@/components/admin/tables";
import {
  PRODUCT_BULK_ACTIONS_COPY,
  PRODUCT_SELECTION_COPY,
} from "@/features/admin/products/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProductTableContext } from "../product-table-context";

type ProductBulkBarProps = Readonly<{
  onOpenPermanentDeleteDialog?: () => void;
}>;

type BulkActionButtonProps = Readonly<{
  children: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}>;

function BulkActionButton({
  children,
  onClick,
  disabled = false,
  danger = false,
}: BulkActionButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-7 shrink-0 whitespace-nowrap rounded-full px-3 text-xs shadow-none",
        danger && "border-destructive/30 text-destructive/70 hover:text-destructive/70"
      )}
    >
      {children}
    </Button>
  );
}

function ActiveViewActions({
  actions,
  isBulkPending,
}: {
  actions: ReturnType<typeof useProductTableContext>["actions"];
  isBulkPending: boolean;
}) {
  return (
    <>
      <BulkActionButton
        onClick={() => void actions.handleBulkStatusChange("draft")}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.setDraft}
      </BulkActionButton>
      <BulkActionButton
        onClick={() => void actions.handleBulkStatusChange("active")}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.setActive}
      </BulkActionButton>
      <BulkActionButton
        onClick={() => void actions.handleBulkStatusChange("inactive")}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.setInactive}
      </BulkActionButton>
      <BulkActionButton
        onClick={() => void actions.handleBulkFeaturedChange(true)}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.setFeatured}
      </BulkActionButton>
      <BulkActionButton
        onClick={() => void actions.handleBulkFeaturedChange(false)}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.unsetFeatured}
      </BulkActionButton>
      <BulkActionButton
        onClick={() => void actions.handleBulkArchive()}
        disabled={isBulkPending}
        danger
      >
        {PRODUCT_BULK_ACTIONS_COPY.archive}
      </BulkActionButton>
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
      <BulkActionButton
        onClick={() => void actions.handleBulkRestore()}
        disabled={isBulkPending}
      >
        {PRODUCT_BULK_ACTIONS_COPY.restore}
      </BulkActionButton>
      {onOpenPermanentDeleteDialog ? (
        <BulkActionButton
          onClick={onOpenPermanentDeleteDialog}
          disabled={isBulkPending}
          danger
        >
          {PRODUCT_BULK_ACTIONS_COPY.hardDelete}
        </BulkActionButton>
      ) : null}
    </>
  );
}

export function ProductBulkBar({ onOpenPermanentDeleteDialog }: ProductBulkBarProps) {
  const { actions, view } = useProductTableContext();
  const { selectedCount, isBulkPending, clearSelection } = actions;

  if (selectedCount === 0) return null;

  return (
    <AdminDataTableFloatingBar innerClassName="flex flex-wrap items-center gap-3 px-4 py-2.5 backdrop-blur-sm">
      <span className="text-sm font-medium text-foreground">
        {PRODUCT_SELECTION_COPY.selectedDesktop(selectedCount)}
      </span>

      <div className="h-4 w-px bg-surface-border" />

      <div className="flex flex-wrap items-center gap-2">
        {view === "active" ? (
          <ActiveViewActions actions={actions} isBulkPending={isBulkPending} />
        ) : (
          <TrashViewActions
            actions={actions}
            isBulkPending={isBulkPending}
            {...(onOpenPermanentDeleteDialog ? { onOpenPermanentDeleteDialog } : {})}
          />
        )}
      </div>

      <button
        type="button"
        onClick={clearSelection}
        disabled={isBulkPending}
        className="ml-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        aria-label={PRODUCT_SELECTION_COPY.clearSelectionDesktop}
      >
        <X className="h-4 w-4" />
      </button>
    </AdminDataTableFloatingBar>
  );
}
