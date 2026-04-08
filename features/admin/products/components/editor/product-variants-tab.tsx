"use client";

import { Plus } from "lucide-react";
import { useMemo, useState, type JSX } from "react";

import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import type {
  deleteProductVariantAction,
  setDefaultProductVariantAction,
} from "@/features/admin/products/editor";
import type {
  AdminPriceListOption,
  AdminProductImageItem,
  AdminProductVariantListItem,
  ProductVariantFormAction,
} from "@/features/admin/products/editor/types";
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
  priceLists: AdminPriceListOption[];
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
      return {
        status: "error",
        message: "Action indisponible.",
      };
    }

    const result = await setDefaultAction({
      productId,
      variantId,
    });

    setMessageState(result);
    return result;
  }

  async function handleDelete(
    variantId: string
  ): Promise<{ status: "success" | "error"; message: string }> {
    if (!deleteAction) {
      return {
        status: "error",
        message: "Action indisponible.",
      };
    }

    const result = await deleteAction({
      productId,
      variantId,
    });

    setMessageState(result);
    return result;
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto pt-[7.0625rem] pb-[calc(3.5rem_+_env(safe-area-inset-bottom))] sm:pt-[7.3125rem] md:pt-[7.5625rem] [@media(max-height:480px)]:pt-[6.3125rem] [@media(max-height:480px)]:pb-[calc(3rem_+_env(safe-area-inset-bottom))] lg:pt-17.25 lg:pb-0">
          <div className="w-full space-y-5 px-4 pt-4 pb-3 md:space-y-8 md:px-6 md:pt-6 md:pb-6 lg:mx-auto lg:max-w-5xl lg:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:pt-3 [@media(max-height:480px)]:pb-2.5">
            <AdminFormMessage
              tone={messageState?.status === "success" ? "success" : "error"}
              message={messageState?.message ?? null}
            />

            <AdminFormSection
              title="Variantes"
              description="Gère les variantes du produit, leur statut, leur SKU, leur prix actif et leur image principale propre."
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {variants.length} variante{variants.length > 1 ? "s" : ""}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    className="hidden lg:inline-flex"
                    onClick={openCreateSheet}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une variante
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  L’image affichée pour chaque ligne correspond à l’image principale de la variante,
                  indépendante de la galerie du produit.
                </p>
              </div>

              <ProductVariantList
                variants={variants}
                onEdit={handleEdit}
                {...(setDefaultAction ? { onSetDefault: handleSetDefault } : {})}
                {...(deleteAction ? { onDelete: handleDelete } : {})}
              />
            </AdminFormSection>

            <AdminFormSection
              title="Informations techniques"
              description="Vue de contrôle rapide des données variantes, indépendantes de la galerie produit."
            >
              <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                <div className="rounded-lg border border-border/60 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide">Produit</p>
                  <p className="mt-1 font-medium text-foreground">{productSlug}</p>
                </div>

                <div className="rounded-lg border border-border/60 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide">Identifiant produit</p>
                  <p className="mt-1 truncate font-medium text-foreground">{productId}</p>
                </div>

                <div className="rounded-lg border border-border/60 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide">Listes de prix actives</p>
                  <p className="mt-1 font-medium text-foreground">{priceLists.length}</p>
                </div>
              </div>
            </AdminFormSection>
          </div>
        </div>
      </div>

      <ProductVariantEditorSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        productId={productId}
        variant={selectedVariant}
        images={images}
        priceLists={priceLists}
        {...(createAction ? { createAction } : {})}
        {...(updateAction ? { updateAction } : {})}
        key={sheetInstanceKey}
      />
    </>
  );
}
