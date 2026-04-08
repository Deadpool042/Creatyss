// features/admin/products/components/editor/variants/product-variant-editor-sheet.tsx
"use client";

import { useActionState, useEffect, useMemo, type JSX } from "react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  productVariantFormInitialState,
  type AdminPriceListOption,
  type AdminProductImageItem,
  type AdminProductVariantListItem,
  type ProductVariantFormAction,
} from "@/features/admin/products/editor/types";
import { ProductVariantImagePicker } from "./product-variant-image-picker";

type ProductVariantEditorSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  variant: AdminProductVariantListItem | null;
  priceLists: AdminPriceListOption[];
  images: AdminProductImageItem[];
  createAction?: ProductVariantFormAction;
  updateAction?: ProductVariantFormAction;
};

function formatInputPrice(value: string | null): string {
  return value ?? "";
}

const noopVariantAction: ProductVariantFormAction = async () => {
  return {
    status: "error",
    message: "Aucune action disponible.",
    fieldErrors: {},
  };
};

export function ProductVariantEditorSheet({
  open,
  onOpenChange,
  productId,
  variant,
  priceLists,
  images,
  createAction,
  updateAction,
}: ProductVariantEditorSheetProps): JSX.Element {
  const isEdit = variant !== null;
  const resolvedAction = isEdit
    ? (updateAction ?? noopVariantAction)
    : (createAction ?? noopVariantAction);

  const [state, formAction, pending] = useActionState(
    resolvedAction,
    productVariantFormInitialState
  );

  const defaultPriceListId = useMemo(() => {
    return priceLists.find((entry) => entry.isDefault)?.id ?? priceLists[0]?.id ?? "";
  }, [priceLists]);

  const initialValues = useMemo(() => {
    const primaryImageId =
      variant?.primaryImageId ??
      images.find((image) => image.isPrimary)?.assetId ??
      images[0]?.assetId ??
      "";

    return {
      id: variant?.id ?? "",
      productId,
      name: variant?.name ?? "",
      slug: variant?.slug ?? "",
      sku: variant?.sku ?? "",
      status: variant?.status === "published" ? "published" : "draft",
      isDefault: variant?.isDefault ? "true" : "false",
      sortOrder: String(variant?.sortOrder ?? 0),
      priceListId: defaultPriceListId,
      amount: formatInputPrice(variant?.amount ?? null),
      compareAtAmount: formatInputPrice(variant?.compareAtAmount ?? null),
      primaryImageId,
    };
  }, [variant, productId, defaultPriceListId, images]);

  const {
    sourceValue: nameValue,
    slugValue,
    setSourceValue: setNameValue,
    setSlugValue,
    resetAutoSlug,
  } = useAutoSlug({
    initialSourceValue: initialValues.name,
    initialSlugValue: initialValues.slug,
  });

  const hasMultiplePriceLists = priceLists.length > 1;

  useEffect(() => {
    if (state.status === "success" && open) {
      onOpenChange(false);
    }
  }, [state.status, open, onOpenChange]);

  useEffect(() => {
    resetAutoSlug({
      initialSourceValue: initialValues.name,
      initialSlugValue: initialValues.slug,
    });
  }, [initialValues.name, initialValues.slug, resetAutoSlug]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-2xl">
        <SheetHeader className="shrink-0 border-b px-6 py-4 text-left">
          <div className="space-y-1">
            <SheetTitle>{isEdit ? "Modifier la variante" : "Ajouter une variante"}</SheetTitle>
            <SheetDescription>
              {isEdit
                ? "Mets à jour les informations principales de la variante."
                : "Crée une nouvelle variante pour ce produit."}
            </SheetDescription>
          </div>
        </SheetHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <input type="hidden" name="id" value={initialValues.id} />
          <input type="hidden" name="productId" value={initialValues.productId} />

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-8 px-6 py-6">
              <AdminFormMessage
                tone={state.status === "success" ? "success" : "error"}
                message={state.status !== "idle" ? state.message : null}
              />

              <AdminFormSection
                title="Informations générales"
                description="Définis l’identité et le statut de la variante."
              >
                <AdminFormField
                  label="Nom"
                  htmlFor="variant-name"
                  {...(state.fieldErrors.name ? { error: state.fieldErrors.name } : {})}
                >
                  <Input
                    id="variant-name"
                    name="name"
                    value={nameValue}
                    onChange={(event) => setNameValue(event.target.value)}
                    className="text-sm"
                  />
                </AdminFormField>

                <AdminFormField
                  label="Slug"
                  htmlFor="variant-slug"
                  description="Généré automatiquement depuis le nom. Modifiable."
                  {...(state.fieldErrors.slug ? { error: state.fieldErrors.slug } : {})}
                >
                  <Input
                    id="variant-slug"
                    name="slug"
                    value={slugValue}
                    onChange={(event) => setSlugValue(event.target.value)}
                    className="font-mono text-sm"
                  />
                </AdminFormField>

                <div className="grid gap-4 md:grid-cols-3">
                  <AdminFormField
                    label="SKU"
                    htmlFor="variant-sku"
                    required
                    {...(state.fieldErrors.sku ? { error: state.fieldErrors.sku } : {})}
                  >
                    <Input
                      id="variant-sku"
                      name="sku"
                      defaultValue={initialValues.sku}
                      className="font-mono text-sm"
                    />
                  </AdminFormField>

                  <AdminFormField
                    label="Statut"
                    htmlFor="variant-status"
                    {...(state.fieldErrors.status ? { error: state.fieldErrors.status } : {})}
                  >
                    <Select name="status" defaultValue={initialValues.status}>
                      <SelectTrigger id="variant-status" className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="published">Publié</SelectItem>
                      </SelectContent>
                    </Select>
                  </AdminFormField>

                  <AdminFormField
                    label="Ordre"
                    htmlFor="variant-sort-order"
                    {...(state.fieldErrors.sortOrder ? { error: state.fieldErrors.sortOrder } : {})}
                  >
                    <Input
                      id="variant-sort-order"
                      name="sortOrder"
                      type="number"
                      min={0}
                      step={1}
                      defaultValue={initialValues.sortOrder}
                      className="text-sm"
                    />
                  </AdminFormField>
                </div>

                <AdminFormField
                  label="Variante par défaut"
                  htmlFor="variant-is-default"
                  {...(state.fieldErrors.isDefault ? { error: state.fieldErrors.isDefault } : {})}
                >
                  <Select name="isDefault" defaultValue={initialValues.isDefault}>
                    <SelectTrigger id="variant-is-default" className="text-sm md:w-56">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Non</SelectItem>
                      <SelectItem value="true">Oui</SelectItem>
                    </SelectContent>
                  </Select>
                </AdminFormField>
              </AdminFormSection>

              <AdminFormSection title="Prix" description="Renseigne le prix actif de la variante.">
                {hasMultiplePriceLists ? (
                  <AdminFormField
                    label="Tarification"
                    htmlFor="variant-price-list"
                    {...(state.fieldErrors.priceListId
                      ? { error: state.fieldErrors.priceListId }
                      : {})}
                  >
                    <Select name="priceListId" defaultValue={initialValues.priceListId}>
                      <SelectTrigger id="variant-price-list" className="text-sm md:w-72">
                        <SelectValue placeholder="Choisir une tarification" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceLists.map((priceList) => (
                          <SelectItem key={priceList.id} value={priceList.id}>
                            {priceList.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AdminFormField>
                ) : (
                  <input type="hidden" name="priceListId" value={initialValues.priceListId} />
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <AdminFormField
                    label="Prix"
                    htmlFor="variant-amount"
                    {...(state.fieldErrors.amount ? { error: state.fieldErrors.amount } : {})}
                  >
                    <Input
                      id="variant-amount"
                      name="amount"
                      defaultValue={initialValues.amount}
                      inputMode="decimal"
                      className="text-sm"
                    />
                  </AdminFormField>

                  <AdminFormField
                    label="Prix avant réduction"
                    htmlFor="variant-compare-at-amount"
                    {...(state.fieldErrors.compareAtAmount
                      ? { error: state.fieldErrors.compareAtAmount }
                      : {})}
                  >
                    <Input
                      id="variant-compare-at-amount"
                      name="compareAtAmount"
                      defaultValue={initialValues.compareAtAmount}
                      inputMode="decimal"
                      className="text-sm"
                    />
                  </AdminFormField>
                </div>

                <p className="text-sm text-muted-foreground">
                  Optionnel. Ce montant est affiché barré sur la boutique pour mettre en avant une
                  réduction.
                </p>
              </AdminFormSection>

              <AdminFormSection
                title="Image de couverture"
                description="Choisis le visuel principal utilisé lorsque cette variante est sélectionnée sur la boutique. Cette sélection n’affecte pas l’ordre de la galerie produit."
              >
                <ProductVariantImagePicker
                  name="primaryImageId"
                  images={images}
                  selectedAssetId={initialValues.primaryImageId}
                />
              </AdminFormSection>
            </div>
          </div>

          <AdminFormFooter>
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={pending || (!createAction && !updateAction)}>
              {isEdit
                ? pending
                  ? "Enregistrement…"
                  : "Enregistrer la variante"
                : pending
                  ? "Création…"
                  : "Créer la variante"}
            </Button>
          </AdminFormFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
