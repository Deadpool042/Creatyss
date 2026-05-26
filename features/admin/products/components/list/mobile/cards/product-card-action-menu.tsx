"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Eye, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductListView, ProductTableItem } from "@/features/admin/products/list/types";
import {
  PRODUCT_CARD_ACTIONS_COPY,
  PRODUCT_ROW_ACTIONS_COPY,
} from "@/features/admin/products/config";
import { useProductLifecycleActionState } from "@/features/admin/products/list/hooks";
import { cn } from "@/lib/utils";
import { ProductLifecycleActionDialogs } from "../../product-lifecycle-action-dialogs";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              [
                "h-8 w-8 rounded-full bg-transparent text-muted-foreground hover:bg-surface-panel-soft",
              ].join(" "),
              triggerClassName
            )}
            aria-label={PRODUCT_CARD_ACTIONS_COPY.menuAriaLabel(product.name)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn("w-56 rounded-lg", contentClassName)}
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
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductLifecycleActionDialogs
        isSubmitting={lifecycleState.isSubmitting}
        archiveDialog={{
          open: lifecycleState.archiveDialogOpen,
          onOpenChange: lifecycleState.setArchiveDialogOpen,
          title: PRODUCT_ROW_ACTIONS_COPY.archiveTitle,
          description: (
            <>
              {PRODUCT_ROW_ACTIONS_COPY.archiveDescriptionPrefix}{" "}
              <strong>{product.name}</strong>{" "}
              {PRODUCT_ROW_ACTIONS_COPY.archiveDescriptionSuffix}
            </>
          ),
          cancelLabel: PRODUCT_ROW_ACTIONS_COPY.cancel,
          confirmLabel: PRODUCT_ROW_ACTIONS_COPY.archive,
          pendingLabel: PRODUCT_ROW_ACTIONS_COPY.archivePending,
          confirmVariant: "destructive",
          onConfirm: lifecycleState.handleArchive,
        }}
        restoreDialog={{
          open: lifecycleState.restoreDialogOpen,
          onOpenChange: lifecycleState.setRestoreDialogOpen,
          title: PRODUCT_ROW_ACTIONS_COPY.restoreTitle,
          description: (
            <>
              {PRODUCT_ROW_ACTIONS_COPY.restoreDescriptionPrefix}{" "}
              <strong>{product.name}</strong>{" "}
              {PRODUCT_ROW_ACTIONS_COPY.restoreDescriptionSuffix}
            </>
          ),
          cancelLabel: PRODUCT_ROW_ACTIONS_COPY.cancel,
          confirmLabel: PRODUCT_ROW_ACTIONS_COPY.restore,
          pendingLabel: PRODUCT_ROW_ACTIONS_COPY.restorePending,
          onConfirm: lifecycleState.handleRestore,
        }}
        permanentDeleteDialog={{
          open: lifecycleState.permanentDeleteDialogOpen,
          onOpenChange: lifecycleState.setPermanentDeleteDialogOpen,
          title: PRODUCT_ROW_ACTIONS_COPY.permanentDeleteTitle,
          description: (
            <>
              {PRODUCT_ROW_ACTIONS_COPY.permanentDeleteDescriptionPrefix}{" "}
              <strong>{product.name}</strong>{" "}
              {PRODUCT_ROW_ACTIONS_COPY.permanentDeleteDescriptionSuffix}
            </>
          ),
          cancelLabel: PRODUCT_ROW_ACTIONS_COPY.cancel,
          confirmLabel: PRODUCT_ROW_ACTIONS_COPY.permanentDelete,
          pendingLabel: PRODUCT_ROW_ACTIONS_COPY.permanentDeletePending,
          confirmVariant: "destructive",
          onConfirm: lifecycleState.handlePermanentDelete,
        }}
      />
    </>
  );
}
