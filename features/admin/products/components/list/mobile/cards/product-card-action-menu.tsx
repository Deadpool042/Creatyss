"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";

type ProductCardActionMenuProps = {
  product: Pick<ProductTableItem, "name" | "slug">;
  onConfirmDelete?: (slug: string) => void | Promise<void>;
  triggerClassName?: string;
  contentClassName?: string;
};

export function ProductCardActionMenu({
  product,
  onConfirmDelete,
  triggerClassName,
  contentClassName,
}: ProductCardActionMenuProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            [
              "h-8 w-8 rounded-full border border-surface-border bg-surface-panel-soft",
              "text-muted-foreground",
            ].join(" "),
            triggerClassName
          )}
          aria-label={`Actions pour ${product.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn("w-44 rounded-xl", contentClassName)}
      >
        <DropdownMenuItem asChild>
          <Link href={`/products/${product.slug}`} target="_blank" rel="noreferrer">
            <Eye className="mr-2 h-4 w-4" />
            Aperçu
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${product.slug}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            void onConfirmDelete?.(product.slug);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
