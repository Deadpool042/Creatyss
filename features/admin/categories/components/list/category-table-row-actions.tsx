"use client";

import { useTransition } from "react";
import { Archive, ArchiveRestore, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { AdminRowActionsMenu } from "@/components/admin/tables/admin-row-actions-menu";
import { ConfirmDestructiveDialog } from "@/components/shared";
import { deleteCategoryAction } from "@/features/admin/categories/actions/delete-category-action";
import { restoreCategoryAction } from "@/features/admin/categories/actions/restore-category-action";
import { hardDeleteCategoryAction } from "@/features/admin/categories/actions/hard-delete-category-action";
import type { AdminCategoryStatus } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type CategoryTableRowActionsProps = Readonly<{
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  status: AdminCategoryStatus;
}>;

export function CategoryTableRowActions({
  categoryId,
  categoryName,
  categorySlug,
  status,
}: CategoryTableRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleArchive() {
    startTransition(async () => {
      try {
        await deleteCategoryAction({ categoryId });
        toast.success(`"${categoryName}" archivée`);
      } catch {
        toast.error("Échec de l'archivage", {
          description: "Une erreur est survenue. Veuillez réessayer.",
        });
      }
    });
  }

  function handleRestore() {
    startTransition(async () => {
      const result = await restoreCategoryAction({ categoryId });
      if (result.success) {
        toast.success(`"${categoryName}" restaurée en brouillon`);
      } else {
        toast.error("Échec de la restauration", {
          description: "Une erreur est survenue. Veuillez réessayer.",
        });
      }
    });
  }

  function handleHardDelete(): Promise<boolean> {
    return new Promise((resolve) => {
      startTransition(async () => {
        const result = await hardDeleteCategoryAction({ categoryId });
        if (result.success) {
          toast.success(`"${categoryName}" supprimée définitivement`);
          resolve(true);
        } else {
          toast.error("Échec de la suppression", {
            description: "Une erreur est survenue. Veuillez réessayer.",
          });
          resolve(false);
        }
      });
    });
  }

  if (status === "archived") {
    return (
      <AdminRowActionsMenu
        label={`Ouvrir les actions de la catégorie ${categoryName}`}
        contentClassName="w-52"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleRestore} disabled={isPending} className="gap-2">
            <ArchiveRestore className="h-4 w-4" />
            <span>{isPending ? "Restauration…" : "Restaurer"}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <ConfirmDestructiveDialog
            trigger={
              <button
                type="button"
                disabled={isPending}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent hover:text-destructive focus:bg-accent focus:text-destructive disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Supprimer définitivement</span>
              </button>
            }
            title={`Supprimer définitivement "${categoryName}" ?`}
            description="Cette action est irréversible. La catégorie et toutes ses données associées seront définitivement supprimées."
            confirmLabel="Supprimer définitivement"
            pending={isPending}
            onConfirm={handleHardDelete}
          />
        </DropdownMenuGroup>
      </AdminRowActionsMenu>
    );
  }

  return (
    <AdminRowActionsMenu
      label={`Ouvrir les actions de la catégorie ${categoryName}`}
      contentClassName="w-44"
    >
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            href={`/admin/catalog/categories/${categorySlug}`}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
            <span>Modifier</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={handleArchive}
          disabled={isPending}
          className="gap-2 text-muted-foreground focus:text-foreground"
        >
          <Archive className="h-4 w-4" />
          <span>{isPending ? "Archivage…" : "Archiver"}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </AdminRowActionsMenu>
  );
}
