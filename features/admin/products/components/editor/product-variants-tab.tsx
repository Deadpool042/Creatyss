"use client";

import { Plus } from "lucide-react";
import { useMemo, useState, type JSX } from "react";

import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared";
import type {
  AdminProductImageItem,
  AdminProductOptionItem,
  AdminProductVariantListItem,
  DeleteProductVariantInput,
  DeleteProductVariantResult,
  SetDefaultProductVariantInput,
  SetDefaultProductVariantResult,
  ProductVariantFormAction,
} from "@/features/admin/products/editor/types";
import type { AdminProductActionResult } from "@/features/admin/products/types";
import { ProductVariantColorValuesAccordion } from "./variants/product-variant-color-values-accordion";
import { ProductVariantEditorSheet } from "./variants/product-variant-editor-sheet";
import { ProductVariantItem } from "./variants/product-variant-item";
import { PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME } from "@/features/admin/products/components/shared/product-module-page-shell";

type SetDefaultProductVariantAction = (
  input: SetDefaultProductVariantInput
) => Promise<SetDefaultProductVariantResult>;
type DeleteProductVariantAction = (input: DeleteProductVariantInput) => Promise<DeleteProductVariantResult>;
type CreateProductOptionColorValueAction = (
  input: { productId: string; optionId: string; label: string; colorHex: string | null }
) => Promise<AdminProductActionResult>;
type UpdateProductOptionColorValueAction = (
  input: { productId: string; optionValueId: string; label: string; colorHex: string | null }
) => Promise<AdminProductActionResult>;
type ArchiveProductOptionColorValueAction = (
  input: { productId: string; optionValueId: string }
) => Promise<AdminProductActionResult>;

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

type ProductVariantsSectionIntroProps = Readonly<{
  eyebrow: string;
  title: string;
  description?: string;
}>;

type ProductVariantsContextItemProps = Readonly<{
  label: string;
  value: string;
  description: string;
}>;

function ProductVariantsSectionIntro({
  eyebrow,
  title,
  description,
}: ProductVariantsSectionIntroProps): JSX.Element {
  return (
    <div className="grid gap-1.5">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function ProductVariantsContextItem({
  label,
  value,
  description,
}: ProductVariantsContextItemProps): JSX.Element {
  return (
    <div className="grid gap-1.5 py-3 first:pt-0 last:pb-0">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

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
  const colorAxesCount = useMemo(
    () => productOptions.filter((option) => option.isVariantAxis).length,
    [productOptions]
  );
  const variantsCountLabel = `${variants.length} variante${variants.length > 1 ? "s" : ""}`;

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
        <div className={PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME}>
          <div className="min-w-0 space-y-5 md:space-y-6">
            <AdminFormMessage
              tone="error"
              message={messageState?.status === "error" ? messageState.message : null}
            />

            <div className="divide-y divide-surface-border/40">
              <section className="grid gap-6 py-6 first:pt-0">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <ProductVariantsSectionIntro
                    eyebrow="Variantes"
                    title="Déclinaisons du produit"
                    description="Organisez les combinaisons vendues, leur variante par défaut et les repères qui permettent de les distinguer clairement."
                  />

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
              </section>

              <section className="grid gap-6 py-6">
                <ProductVariantsSectionIntro
                  eyebrow="Liste"
                  title="Variantes actives"
                  description="Chaque ligne regroupe les attributs, l’image, les repères techniques et les actions de gestion de la variante."
                />

                <ProductVariantList
                  variants={variants}
                  onEdit={handleEdit}
                  {...(setDefaultAction ? { onSetDefault: handleSetDefault } : {})}
                  {...(deleteAction ? { onDelete: handleDelete } : {})}
                />
              </section>
            </div>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-6">
            <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/80">
              <section className="grid gap-5 px-5 py-5">
                <ProductVariantsSectionIntro
                  eyebrow="Repères"
                  title="Lecture rapide"
                />

                <div className="divide-y divide-surface-border">
                  <ProductVariantsContextItem
                    label="Couverture"
                    value={variantsCountLabel}
                    description="Le produit peut rester simple ou devenir multi-variantes selon la structure activée."
                  />
                  <ProductVariantsContextItem
                    label="Variante par défaut"
                    value={defaultVariantLabel ?? "Non définie"}
                    description="Cette variante sert de point d’entrée quand aucun choix explicite n’est encore fait."
                  />
                  <ProductVariantsContextItem
                    label="Axes couleur"
                    value={
                      colorAxesCount > 0
                        ? `${colorAxesCount} axe${colorAxesCount > 1 ? "s" : ""} disponible${colorAxesCount > 1 ? "s" : ""}`
                        : "Aucun axe couleur"
                    }
                    description="Les valeurs couleur sont partagées entre variantes pour garder une nomenclature cohérente."
                  />
                  <ProductVariantsContextItem
                    label="Image"
                    value="Bibliothèque produit"
                    description="Chaque variante réutilise une image déjà rattachée au produit principal."
                  />
                </div>
              </section>
            </div>
          </aside>
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
