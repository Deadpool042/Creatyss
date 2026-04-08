"use client";

import Link from "next/link";
import { MoreHorizontal, Plus, Trash2, type LucideIcon } from "lucide-react";
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

type ProductCreateTopbarMenuProps = {
  productId: string;
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

export function ProductCreateTopbarMenu({ productId }: ProductCreateTopbarMenuProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Ouvrir les actions du produit"
          className="h-9 w-9 rounded-full"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/admin/products/new">
            <MenuActionItem icon={Plus}>Nouveau produit</MenuActionItem>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
