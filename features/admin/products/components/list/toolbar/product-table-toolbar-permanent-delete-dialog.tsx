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
          <DialogTitle>Supprimer définitivement la sélection ?</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Les produits sélectionnés seront supprimés
            définitivement du catalogue.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive">
          Cette suppression est définitive et ne pourra pas être annulée.
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isBulkPending}
          >
            Annuler
          </Button>

          <Button
            variant="destructive"
            type="button"
            onClick={() => void onConfirm()}
            disabled={isBulkPending}
          >
            {isBulkPending ? "Suppression…" : "Supprimer définitivement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
