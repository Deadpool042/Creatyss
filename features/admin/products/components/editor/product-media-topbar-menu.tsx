"use client";

import Link from "next/link";
import { Images, MoreHorizontal, Plus, Trash2, Upload } from "lucide-react";
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

type ProductMediaTopbarMenuProps = {
  productId: string;
  onOpenLibrary: () => void;
  onOpenUpload: () => void;
};

export function ProductMediaTopbarMenu({
  productId,
  onOpenLibrary,
  onOpenUpload,
}: ProductMediaTopbarMenuProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Ouvrir les actions des images"
          className="h-9 w-9 rounded-full"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onOpenLibrary();
          }}
        >
          <TopbarMenuActionItem icon={Images}>Associer depuis la bibliothèque</TopbarMenuActionItem>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onOpenUpload();
          }}
        >
          <TopbarMenuActionItem icon={Upload}>Importer une image</TopbarMenuActionItem>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/admin/products/new">
            <TopbarMenuActionItem icon={Plus}>Nouveau produit</TopbarMenuActionItem>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DeleteProductButton
          productId={productId}
          trigger={
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              <TopbarMenuActionItem icon={Trash2} destructive>
                Supprimer le produit
              </TopbarMenuActionItem>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
