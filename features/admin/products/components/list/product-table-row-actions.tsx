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
  onConfirmArchive: ((slug: string) => void | Promise<void>) | undefined;
  onConfirmRestore: ((slug: string) => void | Promise<void>) | undefined;
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
}: ProductTableRowActionsProps): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const displayName = productName ?? slug;

  async function handleConfirm(): Promise<void> {
    try {
      setIsPending(true);

      if (view === "trash") {
        if (onConfirmRestore) {
          await onConfirmRestore(slug);
        }
      } else if (onConfirmArchive) {
        await onConfirmArchive(slug);
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
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ouvrir les actions du produit {displayName}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          {view === "active" ? (
            <>
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
                    setDialogOpen(true);
                  }}
                >
                  <Archive className="h-4 w-4" />
                  <span>Mettre à la corbeille</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setDialogOpen(true);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restaurer</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
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
                  <strong>{displayName}</strong> reviendra dans la liste active en brouillon.
                </>
              ) : (
                <>
                  <strong>{displayName}</strong> sera retiré du catalogue actif, sans suppression
                  définitive.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
            Produit concerné : <span className="font-medium text-foreground">{displayName}</span>
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
