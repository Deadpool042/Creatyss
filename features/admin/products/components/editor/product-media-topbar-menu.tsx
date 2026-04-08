"use client";

import Link from "next/link";
import { Images, MoreHorizontal, Plus, Trash2, Upload, type LucideIcon } from "lucide-react";
import type { JSX, ReactNode } from "react";

import { DeleteProductButton } from "@/features/admin/products/components/editor/delete-product-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProductMediaTopbarMenuProps = {
  productId: string;
  onOpenLibrary: () => void;
  onOpenUpload: () => void;
};

type MenuActionItemProps = {
  icon: LucideIcon;
  children: ReactNode;
  destructive?: boolean;
};

function MenuActionItem({
  icon: Icon,
  children,
  destructive = false,
}: MenuActionItemProps): JSX.Element {
  return (
    <span
      className={[
        "flex w-full items-center gap-2 text-sm",
        destructive ? "text-destructive" : "text-foreground",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </span>
  );
}

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
          <MenuActionItem icon={Images}>Associer depuis la bibliothèque</MenuActionItem>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onOpenUpload();
          }}
        >
          <MenuActionItem icon={Upload}>Importer une image</MenuActionItem>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/admin/products/new">
            <MenuActionItem icon={Plus}>Nouveau produit</MenuActionItem>
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
              <MenuActionItem icon={Trash2} destructive>
                Supprimer le produit
              </MenuActionItem>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
