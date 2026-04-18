"use client";

import Link from "next/link";
import { Archive, MoreHorizontal, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { JSX } from "react";

import { DeleteProductButton } from "./delete-product-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TopbarMenuActionItem } from "./topbar-menu-action-item";
import { useArchivedProductMutations } from "./hooks/use-archived-product-mutations";

type ProductEditorTopbarMenuProps = {
  productId: string;
  productSlug: string;
  isArchived?: boolean;
};

export function ProductEditorTopbarMenu({
  productId,
  productSlug,
  isArchived = false,
}: ProductEditorTopbarMenuProps): JSX.Element {
  const { isPending, handleRestore, handlePermanentDelete } = useArchivedProductMutations({
    productSlug,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Ouvrir les actions du produit"
          className="h-9 w-9 rounded-full"
          disabled={isPending}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/admin/products/new">
            <TopbarMenuActionItem icon={Plus}>Nouveau produit</TopbarMenuActionItem>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isArchived ? (
          <>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleRestore();
              }}
            >
              <TopbarMenuActionItem icon={RotateCcw}>Restaurer</TopbarMenuActionItem>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handlePermanentDelete();
              }}
            >
              <TopbarMenuActionItem icon={Trash2} destructive>
                Supprimer définitivement
              </TopbarMenuActionItem>
            </DropdownMenuItem>
          </>
        ) : (
          <DeleteProductButton
            productId={productId}
            trigger={
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                }}
              >
                <TopbarMenuActionItem icon={Archive} destructive>
                  Mettre à la corbeille
                </TopbarMenuActionItem>
              </DropdownMenuItem>
            }
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
