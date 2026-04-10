"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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

type ProductTableRowActionsProps = {
  slug: string;
  productName?: string;
  onConfirmDelete?: (slug: string) => void | Promise<void>;
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
  onConfirmDelete,
}: ProductTableRowActionsProps): JSX.Element {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayName = productName ?? slug;

  async function handleDelete(): Promise<void> {
    if (!onConfirmDelete) {
      setDeleteDialogOpen(false);
      return;
    }

    try {
      setIsDeleting(true);
      await onConfirmDelete(slug);
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
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

        <DropdownMenuContent align="end" className="w-52">
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

          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault();
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer ce produit ?</DialogTitle>
            <DialogDescription>
              Cette action retirera <strong>{displayName}</strong> du catalogue admin.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
            Produit concerné : <span className="font-medium text-foreground">{displayName}</span>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>

            <Button
              variant="destructive"
              type="button"
              onClick={() => void handleDelete()}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression…" : "Confirmer la suppression"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
