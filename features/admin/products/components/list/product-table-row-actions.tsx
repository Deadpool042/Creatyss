"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Eye, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProductLifecycleActionState } from "./hooks/use-product-lifecycle-action-state";
import { ProductLifecycleActionDialogs } from "./product-lifecycle-action-dialogs";

type ProductListView = "active" | "trash";

type ProductTableRowActionsProps = {
  slug: string;
  productName?: string;
  view: ProductListView;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
};

type ProductRowAction = {
  label: string;
  icon: typeof Pencil;
  href: (slug: string) => string;
};

const productRowActions: ProductRowAction[] = [
  {
    label: "Modifier",
    icon: Pencil,
    href: (slug: string) => `/admin/products/${slug}/edit`,
  },
  {
    label: "Voir la fiche",
    icon: Eye,
    href: (slug: string) => `/admin/products/${slug}/preview`,
  },
];

export function ProductTableRowActions({
  slug,
  productName,
  view,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductTableRowActionsProps): JSX.Element {
  const lifecycleState = useProductLifecycleActionState({
    productSlug: slug,
    onConfirmArchive,
    onConfirmRestore,
    onConfirmPermanentDelete,
  });

  const displayName = productName ?? slug;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="text-text-muted-strong data-[state=open]:border-control-border-strong data-[state=open]:bg-control-surface-selected data-[state=open]:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ouvrir les actions du produit {displayName}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            {productRowActions.map((action) => (
              <DropdownMenuItem key={action.label} asChild>
                <Link href={action.href(slug)} className="flex items-center gap-2">
                  <action.icon className="h-4 w-4 text-text-muted-strong" />
                  <span>{action.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {view === "active" ? (
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  lifecycleState.setArchiveDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span>Mettre à la corbeille</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  lifecycleState.setRestoreDialogOpen(true);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restaurer</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  lifecycleState.setPermanentDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span>Supprimer définitivement</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
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
              Cette action retirera <strong>{displayName}</strong> du catalogue actif.
            </>
          ),
          cancelLabel: "Annuler",
          confirmLabel: "Mettre à la corbeille",
          pendingLabel: "Déplacement…",
          confirmVariant: "destructive",
          onConfirm: lifecycleState.handleArchive,
          details: (
            <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
              Produit concerné : <span className="font-medium text-foreground">{displayName}</span>
            </div>
          ),
        }}
        restoreDialog={{
          open: lifecycleState.restoreDialogOpen,
          onOpenChange: lifecycleState.setRestoreDialogOpen,
          title: "Restaurer ce produit ?",
          description: (
            <>
              Cette action replacera <strong>{displayName}</strong> dans le catalogue actif.
            </>
          ),
          cancelLabel: "Annuler",
          confirmLabel: "Restaurer",
          pendingLabel: "Restauration…",
          onConfirm: lifecycleState.handleRestore,
          details: (
            <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
              Produit concerné : <span className="font-medium text-foreground">{displayName}</span>
            </div>
          ),
        }}
        permanentDeleteDialog={{
          open: lifecycleState.permanentDeleteDialogOpen,
          onOpenChange: lifecycleState.setPermanentDeleteDialogOpen,
          title: "Supprimer définitivement ce produit ?",
          description: (
            <>
              Cette action est irréversible. <strong>{displayName}</strong> sera supprimé
              définitivement du catalogue.
            </>
          ),
          cancelLabel: "Annuler",
          confirmLabel: "Supprimer définitivement",
          pendingLabel: "Suppression…",
          confirmVariant: "destructive",
          onConfirm: lifecycleState.handlePermanentDelete,
          details: (
            <div className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-3 text-sm text-destructive">
              Cette suppression est définitive et ne pourra pas être annulée.
            </div>
          ),
        }}
      />
    </>
  );
}
