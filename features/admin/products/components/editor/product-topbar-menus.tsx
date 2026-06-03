"use client";

import Link from "next/link";
import {
  Archive,
  Images,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  type LucideIcon,
} from "lucide-react";
import type { JSX, ReactNode } from "react";

import { AdminTopbarOverflowMenu } from "@/components/admin/shared/admin-topbar-overflow-menu";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PRODUCT_EDITOR_MENUS_COPY } from "@/features/admin/products/config";
import { useArchivedProductMutations } from "@/features/admin/products/editor/hooks";
import { ADMIN_PRODUCTS_CREATE_PATH } from "@/features/admin/products/navigation";
import type { DeleteProductInput, DeleteProductResult } from "@/features/admin/products/editor/types";
import { DeleteProductButton } from "./product-archived-actions";

type ProductEditorTopbarMenuProps = Readonly<{
  productId: string;
  productSlug: string;
  isArchived?: boolean;
  canCreateVariant?: boolean;
  onDelete?: (input: DeleteProductInput) => Promise<DeleteProductResult>;
  onCreateVariant?: () => void;
  onOpenLibrary?: () => void;
  onOpenUpload?: () => void;
}>;

type ProductMediaTopbarMenuProps = Readonly<{
  productId: string;
  onDelete?: (input: DeleteProductInput) => Promise<DeleteProductResult>;
  onOpenLibrary: () => void;
  onOpenUpload: () => void;
}>;

type ProductVariantTopbarMenuProps = Readonly<{
  productId: string;
  onDelete?: (input: DeleteProductInput) => Promise<DeleteProductResult>;
  onCreateVariant: () => void;
}>;

type TopbarMenuActionItemProps = Readonly<{
  icon: LucideIcon;
  children: ReactNode;
  destructive?: boolean;
}>;

function TopbarMenuActionItem({
  icon: Icon,
  children,
  destructive = false,
}: TopbarMenuActionItemProps): JSX.Element {
  return (
    <span
      className={[
        "flex w-full items-center gap-2 text-sm",
        destructive ? "text-destructive" : "text-foreground",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </span>
  );
}

export function ProductEditorTopbarMenu({
  productId,
  productSlug,
  isArchived = false,
  canCreateVariant = false,
  onDelete,
  onCreateVariant,
  onOpenLibrary,
  onOpenUpload,
}: ProductEditorTopbarMenuProps): JSX.Element {
  const { isPending, handleRestore, handlePermanentDelete } = useArchivedProductMutations({
    productSlug,
  });

  return (
    <AdminTopbarOverflowMenu
      ariaLabel={PRODUCT_EDITOR_MENUS_COPY.editorMenuAriaLabel}
      disabled={isPending}
      contentClassName="w-64"
    >
      <DropdownMenuLabel inset>{PRODUCT_EDITOR_MENUS_COPY.editorMenuAriaLabel}</DropdownMenuLabel>

      <DropdownMenuItem asChild>
        <Link href={ADMIN_PRODUCTS_CREATE_PATH}>
          <TopbarMenuActionItem icon={Plus}>
            {PRODUCT_EDITOR_MENUS_COPY.newProductLabel}
          </TopbarMenuActionItem>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {canCreateVariant && onCreateVariant ? (
        <>
          <DropdownMenuLabel inset>Variantes</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              onCreateVariant();
            }}
          >
            <TopbarMenuActionItem icon={Plus}>
              {PRODUCT_EDITOR_MENUS_COPY.addVariantLabel}
            </TopbarMenuActionItem>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
        </>
      ) : null}

      {onOpenLibrary || onOpenUpload ? (
        <>
          <DropdownMenuLabel inset>Médias</DropdownMenuLabel>
          {onOpenLibrary ? (
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
          ) : null}
          {onOpenUpload ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                onOpenUpload();
              }}
            >
              <TopbarMenuActionItem icon={Upload}>
                {PRODUCT_EDITOR_MENUS_COPY.uploadImageLabel}
              </TopbarMenuActionItem>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />
        </>
      ) : null}

      <DropdownMenuLabel inset>Archivage</DropdownMenuLabel>
      {isArchived ? (
        <>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              handleRestore();
            }}
          >
            <TopbarMenuActionItem icon={RotateCcw}>
              {PRODUCT_EDITOR_MENUS_COPY.restoreLabel}
            </TopbarMenuActionItem>
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
      ) : onDelete ? (
        <DeleteProductButton
          productId={productId}
          onDelete={onDelete}
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
      ) : null}
    </AdminTopbarOverflowMenu>
  );
}

export function ProductMediaTopbarMenu({
  productId,
  onDelete,
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
        <TopbarMenuActionItem icon={Upload}>
          {PRODUCT_EDITOR_MENUS_COPY.uploadImageLabel}
        </TopbarMenuActionItem>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem asChild>
        <Link href={ADMIN_PRODUCTS_CREATE_PATH}>
          <TopbarMenuActionItem icon={Plus}>
            {PRODUCT_EDITOR_MENUS_COPY.newProductLabel}
          </TopbarMenuActionItem>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {onDelete ? (
        <DeleteProductButton
          productId={productId}
          onDelete={onDelete}
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
      ) : null}
    </AdminTopbarOverflowMenu>
  );
}

export function ProductVariantTopbarMenu({
  productId,
  onDelete,
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
        <TopbarMenuActionItem icon={Plus}>
          {PRODUCT_EDITOR_MENUS_COPY.addVariantLabel}
        </TopbarMenuActionItem>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem asChild>
        <Link href={ADMIN_PRODUCTS_CREATE_PATH}>
          <TopbarMenuActionItem icon={Plus}>
            {PRODUCT_EDITOR_MENUS_COPY.newProductLabel}
          </TopbarMenuActionItem>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {onDelete ? (
        <DeleteProductButton
          productId={productId}
          onDelete={onDelete}
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
      ) : null}
    </AdminTopbarOverflowMenu>
  );
}
