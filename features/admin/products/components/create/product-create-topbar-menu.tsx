"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProductCreateTopbarMenuProps = {
  productId: string;
};

export function ProductCreateTopbarMenu({ productId: _productId }: ProductCreateTopbarMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Créer un produit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
