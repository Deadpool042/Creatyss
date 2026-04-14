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
          <Plus className="sm:mr-2 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Nouveau</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Créer un produit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
