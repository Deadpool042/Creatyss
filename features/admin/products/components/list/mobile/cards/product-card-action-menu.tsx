"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { Eye, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";

type ProductListView = "active" | "trash";

type ProductCardActionMenuProps = {
  product: Pick<ProductTableItem, "name" | "slug">;
  view: ProductListView;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
  triggerClassName?: string;
  contentClassName?: string;
};

export function ProductCardActionMenu({
  product,
  view,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
  triggerClassName,
  contentClassName,
}: ProductCardActionMenuProps): JSX.Element {
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleArchive(): Promise<void> {
    if (!onConfirmArchive) {
      setArchiveDialogOpen(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmArchive(product.slug);
      setArchiveDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRestore(): Promise<void> {
    if (!onConfirmRestore) {
      setRestoreDialogOpen(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmRestore(product.slug);
      setRestoreDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePermanentDelete(): Promise<void> {
    if (!onConfirmPermanentDelete) {
      setPermanentDeleteDialogOpen(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmPermanentDelete(product.slug);
      setPermanentDeleteDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              [
                "h-8 w-8 rounded-full border border-surface-border bg-surface-panel-soft",
                "text-muted-foreground",
              ].join(" "),
              triggerClassName
            )}
            aria-label={`Actions pour ${product.name}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn("w-56 rounded-xl", contentClassName)}
        >
          <DropdownMenuItem asChild>
            <Link href={`/products/${product.slug}`} target="_blank" rel="noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Aperçu
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/admin/products/${product.slug}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </DropdownMenuItem>

          {view === "active" ? (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault();
                setArchiveDialogOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Mettre à la corbeille
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setRestoreDialogOpen(true);
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restaurer
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setPermanentDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer définitivement
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mettre ce produit à la corbeille ?</DialogTitle>
            <DialogDescription>
              Cette action retirera <strong>{product.name}</strong> du catalogue actif.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setArchiveDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>

            <Button
              variant="destructive"
              type="button"
              onClick={() => void handleArchive()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Déplacement…" : "Mettre à la corbeille"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restaurer ce produit ?</DialogTitle>
            <DialogDescription>
              Cette action replacera <strong>{product.name}</strong> dans le catalogue actif.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setRestoreDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>

            <Button type="button" onClick={() => void handleRestore()} disabled={isSubmitting}>
              {isSubmitting ? "Restauration…" : "Restaurer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={permanentDeleteDialogOpen} onOpenChange={setPermanentDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer définitivement ce produit ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. <strong>{product.name}</strong> sera supprimé
              définitivement du catalogue.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setPermanentDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>

            <Button
              variant="destructive"
              type="button"
              onClick={() => void handlePermanentDelete()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression…" : "Supprimer définitivement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
