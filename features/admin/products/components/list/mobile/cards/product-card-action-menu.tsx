"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Eye, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductTableItem } from "@/features/admin/products/list/types/product-table.types";
import { cn } from "@/lib/utils";
import { useProductLifecycleActionState } from "../../hooks/use-product-lifecycle-action-state";
import { ProductLifecycleActionDialogs } from "../../product-lifecycle-action-dialogs";

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
  const lifecycleState = useProductLifecycleActionState({
    productSlug: product.slug,
    onConfirmArchive,
    onConfirmRestore,
    onConfirmPermanentDelete,
  });

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
                lifecycleState.setArchiveDialogOpen(true);
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
                  lifecycleState.setRestoreDialogOpen(true);
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restaurer
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  lifecycleState.setPermanentDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer définitivement
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductLifecycleActionDialogs
        isSubmitting={lifecycleState.isSubmitting}
        archiveDialog={{
          open: lifecycleState.archiveDialogOpen,
          onOpenChange: lifecycleState.setArchiveDialogOpen,
          title: "Mettre ce produit à la corbeille ?",
          description: (
            <>
              Cette action retirera <strong>{product.name}</strong> du catalogue actif.
            </>
          ),
          cancelLabel: "Annuler",
          confirmLabel: "Mettre à la corbeille",
          pendingLabel: "Déplacement…",
          confirmVariant: "destructive",
          onConfirm: lifecycleState.handleArchive,
        }}
        restoreDialog={{
          open: lifecycleState.restoreDialogOpen,
          onOpenChange: lifecycleState.setRestoreDialogOpen,
          title: "Restaurer ce produit ?",
          description: (
            <>
              Cette action replacera <strong>{product.name}</strong> dans le catalogue actif.
            </>
          ),
          cancelLabel: "Annuler",
          confirmLabel: "Restaurer",
          pendingLabel: "Restauration…",
          onConfirm: lifecycleState.handleRestore,
        }}
        permanentDeleteDialog={{
          open: lifecycleState.permanentDeleteDialogOpen,
          onOpenChange: lifecycleState.setPermanentDeleteDialogOpen,
          title: "Supprimer définitivement ce produit ?",
          description: (
            <>
              Cette action est irréversible. <strong>{product.name}</strong> sera supprimé
              définitivement du catalogue.
            </>
          ),
          cancelLabel: "Annuler",
          confirmLabel: "Supprimer définitivement",
          pendingLabel: "Suppression…",
          confirmVariant: "destructive",
          onConfirm: lifecycleState.handlePermanentDelete,
        }}
      />
    </>
  );
}
