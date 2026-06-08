"use client";

import Image from "next/image";
import { useActionState, useEffect, useMemo, useState, type JSX } from "react";
import { Check } from "lucide-react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { toast } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  productVariantFormInitialState,
  type AdminProductImageItem,
  type AdminProductOptionItem,
  type AdminProductVariantListItem,
  type ProductVariantFormAction,
} from "@/features/admin/products/editor/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";
import { isColorAxisOption } from "./color-utils";

type ProductVariantEditorSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  variant: AdminProductVariantListItem | null;
  images: AdminProductImageItem[];
  productOptions?: AdminProductOptionItem[];
  createAction?: ProductVariantFormAction;
  updateAction?: ProductVariantFormAction;
};

type ProductVariantSectionIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

const noopVariantAction: ProductVariantFormAction = async () => {
  return {
    status: "error",
    message: "Action indisponible.",
    fieldErrors: {},
  };
};

function ProductVariantSectionIntro({
  eyebrow,
  title,
  description,
}: ProductVariantSectionIntroProps): JSX.Element {
  return (
    <div className="grid gap-1.5">
      <ProductSectionEyebrow>{eyebrow}</ProductSectionEyebrow>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function ProductVariantImagePicker({
  images,
  currentSelectedMediaAssetId,
}: Readonly<{
  images: AdminProductImageItem[];
  currentSelectedMediaAssetId: string;
}>): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => {
        const checked = image.mediaAssetId === currentSelectedMediaAssetId;
        const displayName = image.originalName ?? "Media";
        const displayAltText =
          image.altText && image.altText.trim().length > 0 ? image.altText.trim() : null;

        return (
          <label key={image.id} className="block cursor-pointer">
            <input
              type="radio"
              name="primaryImageId"
              value={image.mediaAssetId}
              defaultChecked={checked}
              className="peer sr-only"
            />

            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel-soft shadow-sm transition-all",
                "hover:border-surface-border-strong hover:shadow-card",
                "peer-checked:border-primary peer-checked:bg-background peer-checked:shadow-card peer-checked:ring-2 peer-checked:ring-primary/20"
              )}
            >
              <Badge
                variant="secondary"
                className="absolute right-2 top-2 z-10 gap-1 opacity-0 shadow-sm transition-opacity peer-checked:opacity-100"
              >
                <Check className="size-3" />
                Selectionnee
              </Badge>

              <div className="relative aspect-square overflow-hidden border-b border-surface-border bg-surface-subtle">
                {image.publicUrl ? (
                  <Image
                    src={image.publicUrl}
                    alt={image.altText ?? "Image produit"}
                    fill
                    className="object-cover transition-transform duration-200 peer-checked:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
                    Media indisponible
                  </div>
                )}
              </div>

              <div className="flex min-h-16 flex-col gap-1 px-3 py-3">
                <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                {displayAltText ? (
                  <p className="truncate text-xs text-muted-foreground">{displayAltText}</p>
                ) : null}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}

export function ProductVariantEditorSheet({
  open,
  onOpenChange,
  productId,
  variant,
  images,
  productOptions = [],
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
  const [isImageSectionOpen, setIsImageSectionOpen] = useState(false);

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
      primaryImageId,
      barcode: variant?.barcode ?? "",
      externalReference: variant?.externalReference ?? "",
      weightGrams: variant?.weightGrams ?? "",
      widthMm: variant?.widthMm ?? "",
      heightMm: variant?.heightMm ?? "",
      depthMm: variant?.depthMm ?? "",
    };
  }, [variant, productId, productImages]);

  const optionValuesByOptionId = useMemo<Record<string, string>>(
    () =>
      Object.fromEntries(
        (variant?.optionValues ?? []).map((ov) => [ov.optionId, ov.optionValueId])
      ),
    [variant]
  );

  const variantAxisOptions = useMemo(
    () => productOptions.filter((o) => o.isVariantAxis),
    [productOptions]
  );
  const colorAxisOptions = useMemo(
    () => variantAxisOptions.filter((option) => isColorAxisOption(option)),
    [variantAxisOptions]
  );
  const variantModeSummary = isEdit ? "Variante existante" : "Nouvelle variante";
  const imageSummary = initialValues.primaryImageId
    ? "Une image principale est déjà définie."
    : "Aucune image principale n’est définie.";

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
      toast.success(state.message ?? (isEdit ? "Mise à jour effectuée." : "Création effectuée."));
      onOpenChange(false);
    }
  }, [state.status, state.message, open, onOpenChange, isEdit]);

  useEffect(() => {
    resetAutoSlug({
      initialSourceValue: initialValues.name,
      initialSlugValue: initialValues.slug,
    });
  }, [initialValues.name, initialValues.slug, resetAutoSlug]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          "flex h-svh w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none p-0",
          "supports-[height:100dvh]:h-dvh",
          "inset-0 top-0 left-0 translate-x-0 translate-y-0",
          "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[90svh]",
          "sm:supports-[height:100dvh]:max-h-[90dvh]",
          "sm:w-[min(calc(100vw-2.5rem),72rem)] sm:max-w-5xl",
          "sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.5rem]",
        ].join(" ")}
      >
        <DialogHeader className="shrink-0 border-b border-surface-border px-5 py-4 text-left sm:px-6 sm:py-5">
          <div className="space-y-1">
            <DialogTitle>{isEdit ? "Modifier la variante" : "Ajouter une variante"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Mise à jour des informations principales de la variante."
                : "Création d'une nouvelle variante pour ce produit."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <input type="hidden" name="variantId" value={initialValues.id} />
          <input type="hidden" name="productId" value={initialValues.productId} />

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
              <AdminFormMessage
                tone="error"
                message={state.status === "error" ? state.message : null}
              />

              <div className="min-w-0 lg:col-span-1">
                <div className="overflow-hidden rounded-[1.85rem] border border-surface-border-strong bg-surface-panel shadow-card">
                  <section className="grid gap-6 px-5 py-5 sm:px-6 sm:py-6">
                    <ProductVariantSectionIntro
                      eyebrow="Identité"
                      title="Identité de la variante"
                      description="Définissez la référence visible dans le catalogue et les repères utilisés par l’administration."
                    />

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

                    <div className="grid gap-4 md:grid-cols-2">
                      <AdminFormField
                        label="Référence interne"
                        htmlFor="variant-sku"
                        required
                        description="Optionnelle si déjà fournie automatiquement, utile pour retrouver une variante."
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
                        label="Adresse de la variante"
                        htmlFor="variant-slug"
                        description="Visible dans l'URL de la variante. Générée automatiquement depuis le nom, valeur modifiable."
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
                    </div>
                  </section>

                  <section className="grid gap-6 border-t border-surface-border px-5 py-5 sm:px-6 sm:py-6">
                    <ProductVariantSectionIntro
                      eyebrow="Attributs"
                      title="Différenciation"
                      description="Associez la variante aux valeurs d’options qui la distinguent réellement."
                    />

                    {state.fieldErrors.optionValues && (
                      <p className="text-sm text-destructive">{state.fieldErrors.optionValues}</p>
                    )}
                    {variantAxisOptions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Ce produit ne possède pas d&apos;axes d&apos;option configurés.
                      </p>
                    ) : (
                      <div className="grid gap-5">
                        <div className="grid gap-4 md:grid-cols-2">
                          {variantAxisOptions.map((option) => (
                            <AdminFormField
                              key={option.id}
                              label={option.name}
                              htmlFor={`variant-option-${option.id}`}
                            >
                              <Select
                                name={`optionValue:${option.id}`}
                                defaultValue={optionValuesByOptionId[option.id] ?? "__none__"}
                              >
                                <SelectTrigger
                                  id={`variant-option-${option.id}`}
                                  className="text-sm"
                                >
                                  <SelectValue placeholder="— Aucune —" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__">— Aucune —</SelectItem>
                                  {option.values.map((v) => (
                                    <SelectItem key={v.id} value={v.id}>
                                      {v.label ?? v.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </AdminFormField>
                          ))}
                        </div>

                        {colorAxisOptions.length > 0 ? (
                          <div className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-3">
                            <p className="text-sm text-muted-foreground">
                              Les codes couleur partagés se gèrent dans le bloc{" "}
                              <span className="font-medium text-foreground">Valeurs couleur</span> de
                              l&apos;onglet Variantes.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </section>

                  <section className="grid gap-6 border-t border-surface-border px-5 py-5 sm:px-6 sm:py-6">
                    <ProductVariantSectionIntro
                      eyebrow="Publication"
                      title="Statut et ordre"
                      description="Choisissez la place de cette variante dans le catalogue et son rôle éventuel par défaut."
                    />

                    <div className="grid gap-4 md:grid-cols-3">
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
                  </section>

                  <section className="grid gap-6 border-t border-surface-border px-5 py-5 sm:px-6 sm:py-6">
                    <ProductVariantSectionIntro
                      eyebrow="Repères"
                      title="Repères techniques"
                      description="Conservez ici les identifiants utiles à l’exploitation et aux rapprochements externes."
                    />

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
                    </div>
                  </section>

                  <section className="grid gap-6 border-t border-surface-border px-5 py-5 sm:px-6 sm:py-6">
                    <ProductVariantSectionIntro
                      eyebrow="Dimensions"
                      title="Dimensions et poids"
                      description="Renseignez les mesures seulement lorsqu’elles sont utiles au pilotage ou à la logistique."
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <AdminFormField
                        label="Poids (g)"
                        htmlFor="variant-weight-grams"
                        {...(state.fieldErrors.weightGrams ? { error: state.fieldErrors.weightGrams } : {})}
                      >
                        <Input
                          id="variant-weight-grams"
                          name="weightGrams"
                          defaultValue={initialValues.weightGrams}
                        />
                      </AdminFormField>

                      <AdminFormField
                        label="Largeur (mm)"
                        htmlFor="variant-width-mm"
                        {...(state.fieldErrors.widthMm ? { error: state.fieldErrors.widthMm } : {})}
                      >
                        <Input id="variant-width-mm" name="widthMm" defaultValue={initialValues.widthMm} />
                      </AdminFormField>

                      <AdminFormField
                        label="Hauteur (mm)"
                        htmlFor="variant-height-mm"
                        {...(state.fieldErrors.heightMm ? { error: state.fieldErrors.heightMm } : {})}
                      >
                        <Input id="variant-height-mm" name="heightMm" defaultValue={initialValues.heightMm} />
                      </AdminFormField>

                      <AdminFormField
                        label="Profondeur (mm)"
                        htmlFor="variant-depth-mm"
                        {...(state.fieldErrors.depthMm ? { error: state.fieldErrors.depthMm } : {})}
                      >
                        <Input id="variant-depth-mm" name="depthMm" defaultValue={initialValues.depthMm} />
                      </AdminFormField>
                    </div>
                  </section>
                </div>
              </div>

              <aside className="min-w-0 lg:sticky lg:top-0">
                <div className="overflow-hidden rounded-[1.5rem] border border-surface-border bg-surface-panel shadow-soft">
                  <section className="grid gap-4 px-5 py-5">
                    <ProductVariantSectionIntro
                      eyebrow="Contexte"
                      title="Lecture rapide"
                    />

                    <div className="divide-y divide-surface-border">
                      <div className="grid gap-1.5 py-3 first:pt-0">
                        <ProductSectionEyebrow className="tracking-[0.14em]">Mode</ProductSectionEyebrow>
                        <p className="text-sm font-medium text-foreground">{variantModeSummary}</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {isEdit
                            ? "Mettez à jour les repères sans casser la différenciation existante."
                            : "Commencez par l’identité, puis rattachez la variante à ses attributs."}
                        </p>
                      </div>

                      <div className="grid gap-1.5 py-3">
                        <ProductSectionEyebrow className="tracking-[0.14em]">Image</ProductSectionEyebrow>
                        <p className="text-sm font-medium text-foreground">{imageSummary}</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          L’image principale reste choisie parmi les médias déjà rattachés au produit.
                        </p>
                      </div>

                      <div className="grid gap-3 py-3 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="grid gap-1">
                            <ProductSectionEyebrow className="tracking-[0.14em]">Média</ProductSectionEyebrow>
                            <p className="text-sm text-muted-foreground">
                              Ouvrez ce bloc seulement si vous devez revoir l’image principale.
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            className="h-7 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => setIsImageSectionOpen((current) => !current)}
                          >
                            {isImageSectionOpen ? "Masquer" : "Afficher"}
                          </Button>
                        </div>

                        {isImageSectionOpen ? (
                          <div className="grid gap-4">
                            {state.fieldErrors.primaryImageId ? (
                              <p className="text-sm text-destructive">
                                {state.fieldErrors.primaryImageId}
                              </p>
                            ) : null}
                            {productImages.length > 0 ? (
                              <ProductVariantImagePicker
                                images={productImages}
                                currentSelectedMediaAssetId={initialValues.primaryImageId}
                              />
                            ) : (
                              <div className="rounded-2xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-8 text-sm text-muted-foreground">
                                Aucune image produit n&apos;est encore disponible pour cette variante.
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </section>
                </div>
              </aside>
            </div>
          </div>

          <AdminFormFooter className="border-t border-surface-border px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:px-6 sm:py-4 sm:pb-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer"}
            </Button>
          </AdminFormFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
