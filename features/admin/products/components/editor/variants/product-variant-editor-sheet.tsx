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
} from "@/features/admin/products/editor/public";
import { ProductVariantImagePicker } from "./product-variant-image-picker";

type ProductVariantEditorSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  variant: AdminProductVariantListItem | null;
  priceLists: readonly AdminPriceListOption[];
  images: AdminProductImageItem[];
  createAction?: ProductVariantFormAction;
  updateAction?: ProductVariantFormAction;
};

const noopVariantAction: ProductVariantFormAction = async () => {
  return {
    status: "error",
    message: "Action indisponible.",
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

  const productImages = useMemo(
    () => images.filter((image) => image.subjectType === "product"),
    [images]
  );

  const initialValues = useMemo(() => {
    const primaryImageId =
      variant?.primaryImageId ??
      productImages.find((image) => image.isPrimary)?.mediaAssetId ??
      productImages[0]?.mediaAssetId ??
      "";

    return {
      id: variant?.id ?? "",
      productId,
      name: variant?.name ?? "",
      slug: variant?.slug ?? "",
      sku: variant?.sku ?? "",
      status: variant?.status ?? "draft",
      isDefault: variant?.isDefault ? "true" : "false",
      sortOrder: String(variant?.sortOrder ?? 0),
      priceListId: defaultPriceListId,
      primaryImageId,
      barcode: variant?.barcode ?? "",
      externalReference: variant?.externalReference ?? "",
      weightGrams: variant?.weightGrams ?? "",
      widthMm: variant?.widthMm ?? "",
      heightMm: variant?.heightMm ?? "",
      depthMm: variant?.depthMm ?? "",
    };
  }, [variant, productId, defaultPriceListId, productImages]);

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
                ? "Mise à jour des informations principales de la variante."
                : "Création d’une nouvelle variante pour ce produit."}
            </SheetDescription>
          </div>
        </SheetHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <input type="hidden" name="variantId" value={initialValues.id} />
          <input type="hidden" name="productId" value={initialValues.productId} />

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-8 px-6 py-6">
              <AdminFormMessage
                tone={state.status === "success" ? "success" : "error"}
                message={state.status !== "idle" ? state.message : null}
              />

              <AdminFormSection
                title="Informations générales"
                description="Définition de l’identité et du statut de la variante."
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
                  description="Génération automatique depuis le nom. Valeur modifiable."
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
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="archived">Archivé</SelectItem>
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
                    <SelectTrigger id="variant-is-default" className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Non</SelectItem>
                      <SelectItem value="true">Oui</SelectItem>
                    </SelectContent>
                  </Select>
                </AdminFormField>
              </AdminFormSection>

              <AdminFormSection
                title="Média principal"
                description="Choix de l’image principale de la variante."
              >
                <ProductVariantImagePicker
                  images={productImages}
                  currentSelectedMediaAssetId={initialValues.primaryImageId}
                />
              </AdminFormSection>

              <AdminFormSection
                title="Données techniques"
                description="Informations complémentaires de la variante."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminFormField label="Code-barres" htmlFor="variant-barcode">
                    <Input id="variant-barcode" name="barcode" defaultValue={initialValues.barcode} />
                  </AdminFormField>

                  <AdminFormField label="Référence externe" htmlFor="variant-external-reference">
                    <Input
                      id="variant-external-reference"
                      name="externalReference"
                      defaultValue={initialValues.externalReference}
                    />
                  </AdminFormField>

                  <AdminFormField label="Poids (g)" htmlFor="variant-weight-grams">
                    <Input
                      id="variant-weight-grams"
                      name="weightGrams"
                      defaultValue={initialValues.weightGrams}
                    />
                  </AdminFormField>

                  <AdminFormField label="Largeur (mm)" htmlFor="variant-width-mm">
                    <Input id="variant-width-mm" name="widthMm" defaultValue={initialValues.widthMm} />
                  </AdminFormField>

                  <AdminFormField label="Hauteur (mm)" htmlFor="variant-height-mm">
                    <Input id="variant-height-mm" name="heightMm" defaultValue={initialValues.heightMm} />
                  </AdminFormField>

                  <AdminFormField label="Profondeur (mm)" htmlFor="variant-depth-mm">
                    <Input id="variant-depth-mm" name="depthMm" defaultValue={initialValues.depthMm} />
                  </AdminFormField>
                </div>
              </AdminFormSection>
            </div>
          </div>

          <AdminFormFooter className="border-t px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer"}
            </Button>
          </AdminFormFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
