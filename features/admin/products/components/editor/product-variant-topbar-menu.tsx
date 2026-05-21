"use client";

import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import type { JSX } from "react";

import { DeleteProductButton } from "./delete-product-button";
import { AdminTopbarOverflowMenu } from "@/components/admin/shared/admin-topbar-overflow-menu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TopbarMenuActionItem } from "./topbar-menu-action-item";
import { PRODUCT_EDITOR_MENUS_COPY } from "@/features/admin/products/config";

type ProductVariantTopbarMenuProps = {
  productId: string;
  onCreateVariant: () => void;
};

export function ProductVariantTopbarMenu({
  productId,
  onCreateVariant,
}: ProductVariantTopbarMenuProps): JSX.Element {
  return (
    <AdminTopbarOverflowMenu ariaLabel={PRODUCT_EDITOR_MENUS_COPY.variantsMenuAriaLabel}>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onCreateVariant();
          }}
        >
          <TopbarMenuActionItem icon={Plus}>{PRODUCT_EDITOR_MENUS_COPY.addVariantLabel}</TopbarMenuActionItem>
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
