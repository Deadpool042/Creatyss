"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { AdminRowActionsMenu } from "@/components/admin/tables";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PRODUCT_ROW_ACTIONS_COPY } from "@/features/admin/products/config";
import type { ProductListView } from "@/features/admin/products/list/types";
import { useProductLifecycleActionState } from "@/features/admin/products/list/hooks";
import { ProductLifecycleActionDialogs } from "./product-lifecycle-action-dialogs";

type ProductTableRowActionsProps = {
  slug: string;
  productName?: string;
  view: ProductListView;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
};

type ProductRowAction = {
  label: string;
  icon: typeof Pencil;
  href: (slug: string) => string;
};

const productRowActions: ProductRowAction[] = [
  {
    label: PRODUCT_ROW_ACTIONS_COPY.edit,
    icon: Pencil,
    href: (slug: string) => `/admin/products/${slug}/edit`,
  },
  {
    label: PRODUCT_ROW_ACTIONS_COPY.preview,
    icon: Eye,
    href: (slug: string) => `/admin/products/${slug}/preview`,
  },
];

export function ProductTableRowActions({
  slug,
  productName,
  view,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductTableRowActionsProps): JSX.Element {
  const lifecycleState = useProductLifecycleActionState({
    productSlug: slug,
    onConfirmArchive,
    onConfirmRestore,
    onConfirmPermanentDelete,
  });

  const displayName = productName ?? slug;

  return (
    <>
      <AdminRowActionsMenu
        label={PRODUCT_ROW_ACTIONS_COPY.menuAriaLabel(displayName)}
        contentClassName="w-56"
      >
        <DropdownMenuGroup>
          {productRowActions.map((action) => (
            <DropdownMenuItem key={action.label} asChild>
              <Link href={action.href(slug)} className="flex items-center gap-2">
                <action.icon className="h-4 w-4 text-text-muted-strong" />
                <span>{action.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {view === "active" ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault();
                lifecycleState.setArchiveDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>{PRODUCT_ROW_ACTIONS_COPY.archive}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                lifecycleState.setRestoreDialogOpen(true);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>{PRODUCT_ROW_ACTIONS_COPY.restore}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault();
                lifecycleState.setPermanentDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>{PRODUCT_ROW_ACTIONS_COPY.permanentDelete}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </AdminRowActionsMenu>

      <ProductLifecycleActionDialogs
        isSubmitting={lifecycleState.isSubmitting}
        archiveDialog={{
          open: lifecycleState.archiveDialogOpen,
          onOpenChange: lifecycleState.setArchiveDialogOpen,
          title: PRODUCT_ROW_ACTIONS_COPY.archiveTitle,
          description: (
            <>
              {PRODUCT_ROW_ACTIONS_COPY.archiveDescriptionPrefix}{" "}
              <strong>{displayName}</strong>{" "}
              {PRODUCT_ROW_ACTIONS_COPY.archiveDescriptionSuffix}
            </>
          ),
          cancelLabel: PRODUCT_ROW_ACTIONS_COPY.cancel,
          confirmLabel: PRODUCT_ROW_ACTIONS_COPY.archive,
          pendingLabel: PRODUCT_ROW_ACTIONS_COPY.archivePending,
          confirmVariant: "destructive",
          onConfirm: lifecycleState.handleArchive,
          details: (
            <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
              {PRODUCT_ROW_ACTIONS_COPY.productLabel}{" "}
              <span className="font-medium text-foreground">{displayName}</span>
            </div>
          ),
        }}
        restoreDialog={{
          open: lifecycleState.restoreDialogOpen,
          onOpenChange: lifecycleState.setRestoreDialogOpen,
          title: PRODUCT_ROW_ACTIONS_COPY.restoreTitle,
          description: (
            <>
              {PRODUCT_ROW_ACTIONS_COPY.restoreDescriptionPrefix}{" "}
              <strong>{displayName}</strong>{" "}
              {PRODUCT_ROW_ACTIONS_COPY.restoreDescriptionSuffix}
            </>
          ),
          cancelLabel: PRODUCT_ROW_ACTIONS_COPY.cancel,
          confirmLabel: PRODUCT_ROW_ACTIONS_COPY.restore,
          pendingLabel: PRODUCT_ROW_ACTIONS_COPY.restorePending,
          onConfirm: lifecycleState.handleRestore,
          details: (
            <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-sm text-muted-foreground">
              {PRODUCT_ROW_ACTIONS_COPY.productLabel}{" "}
              <span className="font-medium text-foreground">{displayName}</span>
            </div>
          ),
        }}
        permanentDeleteDialog={{
          open: lifecycleState.permanentDeleteDialogOpen,
          onOpenChange: lifecycleState.setPermanentDeleteDialogOpen,
          title: PRODUCT_ROW_ACTIONS_COPY.permanentDeleteTitle,
          description: (
            <>
              {PRODUCT_ROW_ACTIONS_COPY.permanentDeleteDescriptionPrefix}{" "}
              <strong>{displayName}</strong>{" "}
              {PRODUCT_ROW_ACTIONS_COPY.permanentDeleteDescriptionSuffix}
            </>
          ),
          cancelLabel: PRODUCT_ROW_ACTIONS_COPY.cancel,
          confirmLabel: PRODUCT_ROW_ACTIONS_COPY.permanentDelete,
          pendingLabel: PRODUCT_ROW_ACTIONS_COPY.permanentDeletePending,
          confirmVariant: "destructive",
          onConfirm: lifecycleState.handlePermanentDelete,
          details: (
            <div className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-3 text-sm text-destructive">
              {PRODUCT_ROW_ACTIONS_COPY.permanentDeleteWarning}
            </div>
          ),
        }}
      />
    </>
  );
}
