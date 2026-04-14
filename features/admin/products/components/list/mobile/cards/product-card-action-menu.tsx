"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { Archive, Eye, MoreHorizontal, Pencil, RotateCcw } from "lucide-react";

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
  onConfirmArchive: ((slug: string) => void | Promise<void>) | undefined;
  onConfirmRestore: ((slug: string) => void | Promise<void>) | undefined;
  triggerClassName?: string;
  contentClassName?: string;
};

export function ProductCardActionMenu({
  product,
  view,
  onConfirmArchive,
  onConfirmRestore,
  triggerClassName,
  contentClassName,
}: ProductCardActionMenuProps): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm(): Promise<void> {
    try {
      setIsPending(true);

      if (view === "trash") {
        if (onConfirmRestore) {
          await onConfirmRestore(product.slug);
        }
      } else if (onConfirmArchive) {
        await onConfirmArchive(product.slug);
      }

      setDialogOpen(false);
    } finally {
      setIsPending(false);
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
          className={cn("w-48 rounded-xl", contentClassName)}
        >
          {view === "active" ? (
            <>
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

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setDialogOpen(true);
                }}
              >
                <Archive className="mr-2 h-4 w-4" />
                Mettre à la corbeille
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setDialogOpen(true);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restaurer
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {view === "trash" ? "Restaurer ce produit ?" : "Mettre ce produit à la corbeille ?"}
            </DialogTitle>
            <DialogDescription>
              {view === "trash" ? (
                <>
                  <strong>{product.name}</strong> reviendra dans la liste active.
                </>
              ) : (
                <>
                  <strong>{product.name}</strong> sera retiré du catalogue actif, sans suppression
                  définitive.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
            Produit concerné : <span className="font-medium text-foreground">{product.name}</span>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setDialogOpen(false)}
              disabled={isPending}
            >
              Annuler
            </Button>

            <Button type="button" onClick={() => void handleConfirm()} disabled={isPending}>
              {isPending
                ? view === "trash"
                  ? "Restauration…"
                  : "Archivage…"
                : view === "trash"
                  ? "Confirmer la restauration"
                  : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
