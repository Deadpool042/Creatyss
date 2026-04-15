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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    href: (slug: string) => `/admin/products/${slug}/view`,
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
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayName = productName ?? slug;

  async function handleArchive(): Promise<void> {
    if (!onConfirmArchive) {
      setArchiveDialogOpen(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmArchive(slug);
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
      await onConfirmRestore(slug);
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
      await onConfirmPermanentDelete(slug);
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
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground data-[state=open]:bg-muted"
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
                  <action.icon className="h-4 w-4 text-muted-foreground" />
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
                  setArchiveDialogOpen(true);
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
                  setRestoreDialogOpen(true);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restaurer</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setPermanentDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span>Supprimer définitivement</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mettre ce produit à la corbeille ?</DialogTitle>
            <DialogDescription>
              Cette action retirera <strong>{displayName}</strong> du catalogue actif.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
            Produit concerné : <span className="font-medium text-foreground">{displayName}</span>
          </div>

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
              Cette action replacera <strong>{displayName}</strong> dans le catalogue actif.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
            Produit concerné : <span className="font-medium text-foreground">{displayName}</span>
          </div>

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
              Cette action est irréversible. <strong>{displayName}</strong> sera supprimé
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
