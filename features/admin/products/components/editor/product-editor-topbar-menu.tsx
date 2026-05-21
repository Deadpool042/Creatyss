"use client";

import Link from "next/link";
import { Archive, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { JSX } from "react";

import { DeleteProductButton } from "./delete-product-button";
import { AdminTopbarOverflowMenu } from "@/components/admin/shared/admin-topbar-overflow-menu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TopbarMenuActionItem } from "./topbar-menu-action-item";
import { useArchivedProductMutations } from "./hooks/use-archived-product-mutations";
import { PRODUCT_EDITOR_MENUS_COPY } from "@/features/admin/products/config";

type ProductEditorTopbarMenuProps = {
  productId: string;
  productSlug: string;
  isArchived?: boolean;
};

export function ProductEditorTopbarMenu({
  productId,
  productSlug,
  isArchived = false,
}: ProductEditorTopbarMenuProps): JSX.Element {
  const { isPending, handleRestore, handlePermanentDelete } = useArchivedProductMutations({
    productSlug,
  });

  return (
    <AdminTopbarOverflowMenu
      ariaLabel={PRODUCT_EDITOR_MENUS_COPY.editorMenuAriaLabel}
      disabled={isPending}
    >
        <DropdownMenuItem asChild>
          <Link href="/admin/products/new">
            <TopbarMenuActionItem icon={Plus}>{PRODUCT_EDITOR_MENUS_COPY.newProductLabel}</TopbarMenuActionItem>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isArchived ? (
          <>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleRestore();
              }}
            >
              <TopbarMenuActionItem icon={RotateCcw}>{PRODUCT_EDITOR_MENUS_COPY.restoreLabel}</TopbarMenuActionItem>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handlePermanentDelete();
              }}
            >
              <TopbarMenuActionItem icon={Trash2} destructive>
                {PRODUCT_EDITOR_MENUS_COPY.permanentDeleteLabel}
              </TopbarMenuActionItem>
            </DropdownMenuItem>
          </>
        ) : (
          <DeleteProductButton
            productId={productId}
            trigger={
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                }}
              >
                <TopbarMenuActionItem icon={Archive} destructive>
                  {PRODUCT_EDITOR_MENUS_COPY.archiveLabel}
                </TopbarMenuActionItem>
              </DropdownMenuItem>
            }
          />
        )}
    </AdminTopbarOverflowMenu>
  );
}
