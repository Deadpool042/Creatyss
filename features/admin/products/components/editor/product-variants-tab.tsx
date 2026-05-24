"use client";

import { Plus } from "lucide-react";
import { useMemo, useState, type JSX } from "react";

import { AdminFormMessage } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared";
import {
  type archiveProductOptionColorValueAction,
  type createProductOptionColorValueAction,
  type deleteProductVariantAction,
  type setDefaultProductVariantAction,
  type updateProductOptionColorValueAction,
} from "@/features/admin/products/editor/actions";
import type {
  AdminProductImageItem,
  AdminProductOptionItem,
  AdminProductVariantListItem,
  ProductVariantFormAction,
} from "@/features/admin/products/editor/types";
import { ProductVariantColorValuesAccordion } from "./variants/product-variant-color-values-accordion";
import { ProductVariantEditorSheet } from "./variants/product-variant-editor-sheet";
import { ProductVariantItem } from "./variants/product-variant-item";

type SetDefaultProductVariantAction = typeof setDefaultProductVariantAction;
type DeleteProductVariantAction = typeof deleteProductVariantAction;
type CreateProductOptionColorValueAction = typeof createProductOptionColorValueAction;
type UpdateProductOptionColorValueAction = typeof updateProductOptionColorValueAction;
type ArchiveProductOptionColorValueAction = typeof archiveProductOptionColorValueAction;

type MessageState = {
  status: "success" | "error";
  message: string;
} | null;

type ProductVariantsTabProps = {
  productId: string;
  productSlug: string;
  variants: AdminProductVariantListItem[];
  images: AdminProductImageItem[];
  productOptions?: AdminProductOptionItem[];
  createAction?: ProductVariantFormAction;
  updateAction?: ProductVariantFormAction;
  setDefaultAction?: SetDefaultProductVariantAction;
  deleteAction?: DeleteProductVariantAction;
  createOptionColorValueAction?: CreateProductOptionColorValueAction;
  updateOptionColorValueAction?: UpdateProductOptionColorValueAction;
  archiveOptionColorValueAction?: ArchiveProductOptionColorValueAction;
  createDialogOpen?: boolean;
  onCreateDialogOpenChange?: (open: boolean) => void;
};

type ProductVariantListProps = Readonly<{
  variants: AdminProductVariantListItem[];
  onEdit: (variantId: string) => void;
  onSetDefault?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
  onDelete?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
}>;

function ProductVariantList({
  variants,
  onEdit,
  onSetDefault,
  onDelete,
}: ProductVariantListProps): JSX.Element {
  if (variants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-muted/20 px-4 py-7 text-center text-sm text-muted-foreground">
        Aucune variante definie pour ce produit.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-5">
      {variants.map((variant, index) => (
        <ProductVariantItem
          key={variant.id}
          variant={variant}
          position={index + 1}
          total={variants.length}
          hasOtherVariants={variants.length > 1}
          onEdit={onEdit}
          {...(onSetDefault ? { onSetDefault } : {})}
          {...(onDelete ? { onDelete } : {})}
        />
      ))}
    </div>
  );
}

export function ProductVariantsTab({
  productId,
  productSlug: _productSlug,
  variants,
  images,
  productOptions = [],
  createAction,
  updateAction,
  setDefaultAction,
  deleteAction,
  createOptionColorValueAction,
  updateOptionColorValueAction,
  archiveOptionColorValueAction,
  createDialogOpen,
  onCreateDialogOpenChange,
}: ProductVariantsTabProps): JSX.Element {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [internalSheetOpen, setInternalSheetOpen] = useState(false);
  const [sheetInstanceKey, setSheetInstanceKey] = useState(0);
  const [messageState, setMessageState] = useState<MessageState>(null);

  const isCreateDialogControlled =
    typeof createDialogOpen === "boolean" && typeof onCreateDialogOpenChange === "function";

  const sheetOpen = isCreateDialogControlled ? createDialogOpen : internalSheetOpen;

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) ?? null,
    [variants, selectedVariantId]
  );
  const defaultVariant = useMemo(
    () => variants.find((variant) => variant.isDefault) ?? null,
    [variants]
  );
  const defaultVariantLabel = useMemo(() => {
    if (!defaultVariant) return null;

    if (defaultVariant.name && defaultVariant.name.trim().length > 0) {
      return defaultVariant.name.trim();
    }

    const optionValues = defaultVariant.optionValues.map((item) => item.value).filter(Boolean);
    if (optionValues.length > 0) {
      return optionValues.join(" · ");
    }

    return defaultVariant.sku;
  }, [defaultVariant]);

  function setSheetOpen(nextOpen: boolean): void {
    if (isCreateDialogControlled) {
      onCreateDialogOpenChange(nextOpen);
      return;
    }

    setInternalSheetOpen(nextOpen);
  }

  function openCreateSheet(): void {
    setSelectedVariantId(null);
    setSheetInstanceKey((current) => current + 1);
    setSheetOpen(true);
  }

  function handleEdit(variantId: string): void {
    setSelectedVariantId(variantId);
    setSheetInstanceKey((current) => current + 1);
    setSheetOpen(true);
  }

  async function handleSetDefault(
    variantId: string
  ): Promise<{ status: "success" | "error"; message: string }> {
    if (!setDefaultAction) {
      return { status: "error", message: "Action indisponible." };
    }

    const result = await setDefaultAction({ productId, variantId });
    if (result.status === "success") {
      toast.success(result.message);
      setMessageState(null);
    } else {
      setMessageState(result);
    }
    return result;
  }

  async function handleDelete(
    variantId: string
  ): Promise<{ status: "success" | "error"; message: string }> {
    if (!deleteAction) {
      return { status: "error", message: "Action indisponible." };
    }

    const result = await deleteAction({ productId, variantId });
    if (result.status === "success") {
      toast.success(result.message);
      setMessageState(null);
    } else {
      setMessageState(result);
    }
    return result;
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(3.5rem+env(safe-area-inset-bottom)+0.75rem)] [@media(max-height:480px)]:pb-[calc(2.75rem+env(safe-area-inset-bottom)+0.5rem)] lg:pb-6">
        <div className="w-full space-y-6 px-4 py-4 md:space-y-7 md:px-6 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-5 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:py-3">
          <AdminFormMessage
            tone="error"
            message={messageState?.status === "error" ? messageState.message : null}
          />

          <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground">
                {variants.length} variante{variants.length > 1 ? "s" : ""}
                {defaultVariantLabel ? ` • variante par défaut : ${defaultVariantLabel}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                L&apos;image principale de chaque variante est choisie parmi les médias déjà
                rattachés au produit.
              </p>
            </div>

            <div className="flex shrink-0">
              <Button type="button" variant="outline" onClick={openCreateSheet}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une variante
              </Button>
            </div>
          </div>

          <ProductVariantColorValuesAccordion
            productId={productId}
            productOptions={productOptions}
            {...(createOptionColorValueAction ? { createOptionColorValueAction } : {})}
            {...(updateOptionColorValueAction ? { updateOptionColorValueAction } : {})}
            {...(archiveOptionColorValueAction ? { archiveOptionColorValueAction } : {})}
          />

          <ProductVariantList
            variants={variants}
            onEdit={handleEdit}
            {...(setDefaultAction ? { onSetDefault: handleSetDefault } : {})}
            {...(deleteAction ? { onDelete: handleDelete } : {})}
          />
        </div>
      </div>

      <ProductVariantEditorSheet
        key={sheetInstanceKey}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        productId={productId}
        variant={selectedVariant}
        images={images}
        productOptions={productOptions}
        {...(createAction ? { createAction } : {})}
        {...(updateAction ? { updateAction } : {})}
      />
    </>
  );
}
