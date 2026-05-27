"use client";

import type { JSX, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRODUCT_ROW_ACTIONS_COPY } from "@/features/admin/products/config";
import type { useProductLifecycleActionState } from "@/features/admin/products/list/hooks";

type ProductLifecycleDialogConfig = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  pendingLabel: string;
  confirmVariant?: "default" | "destructive";
  onConfirm: () => Promise<void>;
  details?: ReactNode;
};

type ProductLifecycleActionDialogsProps = {
  isSubmitting: boolean;
  archiveDialog: ProductLifecycleDialogConfig;
  restoreDialog: ProductLifecycleDialogConfig;
  permanentDeleteDialog: ProductLifecycleDialogConfig;
};

function ProductLifecycleDialog({
  config,
  isSubmitting,
}: {
  config: ProductLifecycleDialogConfig;
  isSubmitting: boolean;
}): JSX.Element {
  return (
    <Dialog open={config.open} onOpenChange={config.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {config.details ?? null}

        <DialogFooter>
          <Button
            variant="ghost"
            type="button"
            onClick={() => config.onOpenChange(false)}
            disabled={isSubmitting}
          >
            {config.cancelLabel}
          </Button>

          <Button
            variant={config.confirmVariant ?? "default"}
            type="button"
            onClick={() => void config.onConfirm()}
            disabled={isSubmitting}
          >
            {isSubmitting ? config.pendingLabel : config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProductLifecycleActionDialogs({
  isSubmitting,
  archiveDialog,
  restoreDialog,
  permanentDeleteDialog,
}: ProductLifecycleActionDialogsProps): JSX.Element {
  return (
    <>
      <ProductLifecycleDialog config={archiveDialog} isSubmitting={isSubmitting} />
      <ProductLifecycleDialog config={restoreDialog} isSubmitting={isSubmitting} />
      <ProductLifecycleDialog config={permanentDeleteDialog} isSubmitting={isSubmitting} />
    </>
  );
}

type ProductLifecycleActionDialogSetProps = Readonly<{
  lifecycleState: ReturnType<typeof useProductLifecycleActionState>;
  productName: string;
  showProductDetails?: boolean;
  showPermanentDeleteWarning?: boolean;
}>;

function ProductDetails({ productName }: Readonly<{ productName: string }>): JSX.Element {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
      {PRODUCT_ROW_ACTIONS_COPY.productLabel}{" "}
      <span className="font-medium text-foreground">{productName}</span>
    </div>
  );
}

function PermanentDeleteWarning(): JSX.Element {
  return (
    <div className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-3 text-sm text-destructive">
      {PRODUCT_ROW_ACTIONS_COPY.permanentDeleteWarning}
    </div>
  );
}

export function ProductLifecycleActionDialogSet({
  lifecycleState,
  productName,
  showProductDetails = false,
  showPermanentDeleteWarning = false,
}: ProductLifecycleActionDialogSetProps): JSX.Element {
  return (
    <ProductLifecycleActionDialogs
      isSubmitting={lifecycleState.isSubmitting}
      archiveDialog={{
        open: lifecycleState.archiveDialogOpen,
        onOpenChange: lifecycleState.setArchiveDialogOpen,
        title: PRODUCT_ROW_ACTIONS_COPY.archiveTitle,
        description: (
          <>
            {PRODUCT_ROW_ACTIONS_COPY.archiveDescriptionPrefix} <strong>{productName}</strong>{" "}
            {PRODUCT_ROW_ACTIONS_COPY.archiveDescriptionSuffix}
          </>
        ),
        cancelLabel: PRODUCT_ROW_ACTIONS_COPY.cancel,
        confirmLabel: PRODUCT_ROW_ACTIONS_COPY.archive,
        pendingLabel: PRODUCT_ROW_ACTIONS_COPY.archivePending,
        confirmVariant: "destructive",
        onConfirm: lifecycleState.handleArchive,
        ...(showProductDetails ? { details: <ProductDetails productName={productName} /> } : {}),
      }}
      restoreDialog={{
        open: lifecycleState.restoreDialogOpen,
        onOpenChange: lifecycleState.setRestoreDialogOpen,
        title: PRODUCT_ROW_ACTIONS_COPY.restoreTitle,
        description: (
          <>
            {PRODUCT_ROW_ACTIONS_COPY.restoreDescriptionPrefix} <strong>{productName}</strong>{" "}
            {PRODUCT_ROW_ACTIONS_COPY.restoreDescriptionSuffix}
          </>
        ),
        cancelLabel: PRODUCT_ROW_ACTIONS_COPY.cancel,
        confirmLabel: PRODUCT_ROW_ACTIONS_COPY.restore,
        pendingLabel: PRODUCT_ROW_ACTIONS_COPY.restorePending,
        onConfirm: lifecycleState.handleRestore,
        ...(showProductDetails ? { details: <ProductDetails productName={productName} /> } : {}),
      }}
      permanentDeleteDialog={{
        open: lifecycleState.permanentDeleteDialogOpen,
        onOpenChange: lifecycleState.setPermanentDeleteDialogOpen,
        title: PRODUCT_ROW_ACTIONS_COPY.permanentDeleteTitle,
        description: (
          <>
            {PRODUCT_ROW_ACTIONS_COPY.permanentDeleteDescriptionPrefix}{" "}
            <strong>{productName}</strong>{" "}
            {PRODUCT_ROW_ACTIONS_COPY.permanentDeleteDescriptionSuffix}
          </>
        ),
        cancelLabel: PRODUCT_ROW_ACTIONS_COPY.cancel,
        confirmLabel: PRODUCT_ROW_ACTIONS_COPY.permanentDelete,
        pendingLabel: PRODUCT_ROW_ACTIONS_COPY.permanentDeletePending,
        confirmVariant: "destructive",
        onConfirm: lifecycleState.handlePermanentDelete,
        ...(showPermanentDeleteWarning ? { details: <PermanentDeleteWarning /> } : {}),
      }}
    />
  );
}
