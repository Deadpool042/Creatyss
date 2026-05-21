"use client";

import Link from "next/link";
import { Images, Plus, Trash2, Upload } from "lucide-react";
import type { JSX } from "react";

import { DeleteProductButton } from "./delete-product-button";
import { AdminTopbarOverflowMenu } from "@/components/admin/shared/admin-topbar-overflow-menu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TopbarMenuActionItem } from "./topbar-menu-action-item";
import { PRODUCT_EDITOR_MENUS_COPY } from "@/features/admin/products/config";

type ProductMediaTopbarMenuProps = {
  productId: string;
  onOpenLibrary: () => void;
  onOpenUpload: () => void;
};

export function ProductMediaTopbarMenu({
  productId,
  onOpenLibrary,
  onOpenUpload,
}: ProductMediaTopbarMenuProps): JSX.Element {
  return (
    <AdminTopbarOverflowMenu ariaLabel={PRODUCT_EDITOR_MENUS_COPY.mediaMenuAriaLabel}>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onOpenLibrary();
          }}
        >
          <TopbarMenuActionItem icon={Images}>
            {PRODUCT_EDITOR_MENUS_COPY.attachFromLibraryLabel}
          </TopbarMenuActionItem>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onOpenUpload();
          }}
        >
          <TopbarMenuActionItem icon={Upload}>{PRODUCT_EDITOR_MENUS_COPY.uploadImageLabel}</TopbarMenuActionItem>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/admin/products/new">
            <TopbarMenuActionItem icon={Plus}>{PRODUCT_EDITOR_MENUS_COPY.newProductLabel}</TopbarMenuActionItem>
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
              <TopbarMenuActionItem icon={Trash2} destructive>
                {PRODUCT_EDITOR_MENUS_COPY.deleteProductLabel}
              </TopbarMenuActionItem>
            </DropdownMenuItem>
          }
        />
    </AdminTopbarOverflowMenu>
  );
}
