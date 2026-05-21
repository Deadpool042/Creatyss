"use client";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRODUCT_BULK_DELETE_DIALOG_COPY } from "@/features/admin/products/config";

type ProductTableToolbarPermanentDeleteDialogProps = {
  open: boolean;
  isBulkPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
};

export function ProductTableToolbarPermanentDeleteDialog({
  open,
  isBulkPending,
  onOpenChange,
  onConfirm,
}: ProductTableToolbarPermanentDeleteDialogProps): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{PRODUCT_BULK_DELETE_DIALOG_COPY.title}</DialogTitle>
          <DialogDescription>{PRODUCT_BULK_DELETE_DIALOG_COPY.description}</DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive">
          {PRODUCT_BULK_DELETE_DIALOG_COPY.warning}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isBulkPending}
          >
            {PRODUCT_BULK_DELETE_DIALOG_COPY.cancel}
          </Button>

          <Button
            variant="destructive"
            type="button"
            onClick={() => void onConfirm()}
            disabled={isBulkPending}
          >
            {isBulkPending ? PRODUCT_BULK_DELETE_DIALOG_COPY.pending : PRODUCT_BULK_DELETE_DIALOG_COPY.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
