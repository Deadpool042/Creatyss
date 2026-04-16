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
