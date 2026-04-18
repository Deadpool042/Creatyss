"use client";

import Link from "next/link";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
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

type ProductVariantTopbarMenuProps = {
  productId: string;
  onCreateVariant: () => void;
};

export function ProductVariantTopbarMenu({
  productId,
  onCreateVariant,
}: ProductVariantTopbarMenuProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Ouvrir les actions des variantes"
          className="h-9 w-9 rounded-full"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onCreateVariant();
          }}
        >
          <TopbarMenuActionItem icon={Plus}>Ajouter une variante</TopbarMenuActionItem>
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
