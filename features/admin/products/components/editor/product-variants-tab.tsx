"use client";

import { Plus } from "lucide-react";
import { useMemo, useState, type JSX } from "react";

import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import {
  type deleteProductVariantAction,
  type setDefaultProductVariantAction,
  type AdminPriceListOption,
  type AdminProductImageItem,
  type AdminProductVariantListItem,
  type ProductVariantFormAction,
} from "@/features/admin/products/editor/public";
import { ProductVariantEditorSheet } from "./variants/product-variant-editor-sheet";
import { ProductVariantList } from "./variants/product-variant-list";

type SetDefaultProductVariantAction = typeof setDefaultProductVariantAction;
type DeleteProductVariantAction = typeof deleteProductVariantAction;

type MessageState = {
  status: "success" | "error";
  message: string;
} | null;

type ProductVariantsTabProps = {
  productId: string;
  productSlug: string;
  variants: AdminProductVariantListItem[];
  images: AdminProductImageItem[];
  priceLists: readonly AdminPriceListOption[];
  createAction?: ProductVariantFormAction;
  updateAction?: ProductVariantFormAction;
  setDefaultAction?: SetDefaultProductVariantAction;
  deleteAction?: DeleteProductVariantAction;
  createDialogOpen?: boolean;
  onCreateDialogOpenChange?: (open: boolean) => void;
};

export function ProductVariantsTab({
  productId,
  productSlug,
  variants,
  images,
  priceLists,
  createAction,
  updateAction,
  setDefaultAction,
  deleteAction,
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
    setMessageState(result);
    return result;
  }

  async function handleDelete(
    variantId: string
  ): Promise<{ status: "success" | "error"; message: string }> {
    if (!deleteAction) {
      return { status: "error", message: "Action indisponible." };
    }

    const result = await deleteAction({ productId, variantId });
    setMessageState(result);
    return result;
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="w-full space-y-5 px-4 py-4 md:space-y-8 md:px-6 md:py-6 lg:mx-auto lg:max-w-6xl lg:px-4 xl:px-0">
            <AdminFormMessage
              tone={messageState?.status === "success" ? "success" : "error"}
              message={messageState?.message ?? null}
            />

            <AdminFormSection
              title="Variantes"
              description="Gestion des variantes, du statut métier, de l’ordre et de l’image principale."
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  {variants.length} variante{variants.length > 1 ? "s" : ""}
                </div>

                <Button type="button" variant="outline" onClick={openCreateSheet}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une variante
                </Button>
              </div>

              <ProductVariantList
                productId={productId}
                productSlug={productSlug}
                variants={variants}
                onEdit={handleEdit}
                {...(setDefaultAction ? { onSetDefault: handleSetDefault } : {})}
                {...(deleteAction ? { onDelete: handleDelete } : {})}
              />
            </AdminFormSection>
          </div>
        </div>
      </div>

      <ProductVariantEditorSheet
        key={sheetInstanceKey}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        productId={productId}
        variant={selectedVariant}
        priceLists={priceLists}
        images={images}
        {...(createAction ? { createAction } : {})}
        {...(updateAction ? { updateAction } : {})}
      />
    </>
  );
}
