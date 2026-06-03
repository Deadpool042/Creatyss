"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { AdminRowActionsMenu } from "@/components/admin/tables/actions/admin-row-actions-menu";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PRODUCT_ROW_ACTIONS_COPY } from "@/features/admin/products/config";
import {
  buildAdminProductEditPath,
  buildAdminProductPreviewPath,
} from "@/features/admin/products/navigation";
import type { ProductListView } from "@/features/admin/products/list/types";
import { useProductLifecycleActionState } from "@/features/admin/products/list/hooks";
import { ProductLifecycleActionDialogSet } from "../product-lifecycle-action-dialogs";

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
    href: buildAdminProductEditPath,
  },
  {
    label: PRODUCT_ROW_ACTIONS_COPY.preview,
    icon: Eye,
    href: buildAdminProductPreviewPath,
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

      <ProductLifecycleActionDialogSet
        lifecycleState={lifecycleState}
        productName={displayName}
        showProductDetails
        showPermanentDeleteWarning
      />
    </>
  );
}
