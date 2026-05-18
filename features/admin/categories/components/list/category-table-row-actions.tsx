import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { AdminRowActionsMenu } from "@/components/admin/tables/admin-row-actions-menu";
import { deleteCategoryAction } from "@/features/admin/categories/actions/delete-category-action";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type CategoryTableRowActionsProps = Readonly<{
  categoryId: string;
  categoryName: string;
}>;

export function CategoryTableRowActions({
  categoryId,
  categoryName,
}: CategoryTableRowActionsProps) {
  async function handleDeleteCategory(): Promise<void> {
    "use server";
    await deleteCategoryAction({ categoryId });
  }

  return (
    <AdminRowActionsMenu
      label={`Ouvrir les actions de la catégorie ${categoryName}`}
      contentClassName="w-56"
    >
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href={`/admin/categories/${categoryId}`} className="flex items-center gap-2">
            <Pencil className="h-4 w-4 text-text-muted-strong" />
            <span>Modifier</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <form action={handleDeleteCategory}>
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent hover:text-destructive focus:bg-accent focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span>Supprimer</span>
        </button>
      </form>
    </AdminRowActionsMenu>
  );
}
