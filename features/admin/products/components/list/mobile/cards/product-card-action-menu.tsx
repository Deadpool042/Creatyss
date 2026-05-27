"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { AdminRowActionsMenu } from "@/components/admin/tables";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { ProductListView, ProductTableItem } from "@/features/admin/products/list/types";
import {
  PRODUCT_CARD_ACTIONS_COPY,
  PRODUCT_ROW_ACTIONS_COPY,
} from "@/features/admin/products/config";
import { useProductLifecycleActionState } from "@/features/admin/products/list/hooks";
import { cn } from "@/lib/utils";
import { ProductLifecycleActionDialogSet } from "../../product-lifecycle-action-dialogs";

type ProductCardActionMenuProps = {
  product: Pick<ProductTableItem, "name" | "slug">;
  view: ProductListView;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
  triggerClassName?: string;
  contentClassName?: string;
};

export function ProductCardActionMenu({
  product,
  view,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
  triggerClassName,
  contentClassName,
}: ProductCardActionMenuProps): JSX.Element {
  const lifecycleState = useProductLifecycleActionState({
    productSlug: product.slug,
    onConfirmArchive,
    onConfirmRestore,
    onConfirmPermanentDelete,
  });

  return (
    <>
      <AdminRowActionsMenu
        label={PRODUCT_CARD_ACTIONS_COPY.menuAriaLabel(product.name)}
        triggerVariant="ghost"
        triggerSize="icon"
        triggerClassName={cn(
          "h-8 w-8 rounded-full bg-transparent text-muted-foreground hover:bg-surface-panel-soft",
          triggerClassName
        )}
        contentSideOffset={8}
        contentClassName={cn("w-56 rounded-lg", contentClassName)}
      >
        <DropdownMenuItem asChild>
          <Link href={`/products/${product.slug}`} target="_blank" rel="noreferrer">
            <Eye className="mr-2 h-4 w-4" />
            {PRODUCT_CARD_ACTIONS_COPY.preview}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${product.slug}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            {PRODUCT_CARD_ACTIONS_COPY.edit}
          </Link>
        </DropdownMenuItem>

        {view === "active" ? (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(event) => {
              event.preventDefault();
              lifecycleState.setArchiveDialogOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {PRODUCT_ROW_ACTIONS_COPY.archive}
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                lifecycleState.setRestoreDialogOpen(true);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {PRODUCT_ROW_ACTIONS_COPY.restore}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault();
                lifecycleState.setPermanentDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {PRODUCT_ROW_ACTIONS_COPY.permanentDelete}
            </DropdownMenuItem>
          </>
        )}
      </AdminRowActionsMenu>

      <ProductLifecycleActionDialogSet lifecycleState={lifecycleState} productName={product.name} />
    </>
  );
}
