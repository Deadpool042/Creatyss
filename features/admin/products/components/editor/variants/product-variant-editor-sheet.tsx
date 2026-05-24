"use client";

import Image from "next/image";
import { useActionState, useEffect, useMemo, useState, type JSX } from "react";
import { Check } from "lucide-react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { AdminFormField, AdminFormFooter, AdminFormMessage } from "@/components/admin/forms";
import { toast } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared";
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

const noopVariantAction: ProductVariantFormAction = async () => {
  return {
    status: "error",
    message: "Action indisponible.",
    fieldErrors: {},
  };
};

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

              <div className="relative aspect-square overflow-hidden border-b border-surface-border bg-muted">
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
            <div className="space-y-7 px-4 py-4 sm:px-6 sm:py-6">
              <AdminFormMessage
                tone="error"
                message={state.status === "error" ? state.message : null}
              />

              {/* Identité */}
              <Card className="rounded-[1.35rem] border border-surface-border-strong bg-surface-panel shadow-raised py-0">
                <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-surface-panel-soft px-5 py-4">
                  <div className="space-y-1.5">
                    <ProductSectionEyebrow>Identité</ProductSectionEyebrow>
                    <CardTitle>Identité de la variante</CardTitle>
                    <CardDescription className="leading-6 text-foreground/70">
                      Définissez la référence visible dans le catalogue et les repères utilisés par
                      l&apos;administration.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-5 px-5 py-5">
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
                </CardContent>
              </Card>

              {/* Attributs */}
              <Card className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0">
                <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/30 px-5 py-4">
                  <div className="space-y-1.5">
                    <ProductSectionEyebrow>Attributs</ProductSectionEyebrow>
                    <CardTitle>Attributs de la variante</CardTitle>
                    <CardDescription className="leading-6">
                      Associez cette variante aux valeurs d&apos;options qui la différencient (couleur, taille…).
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-5">
                  {state.fieldErrors.optionValues && (
                    <p className="mb-4 text-sm text-destructive">
                      {state.fieldErrors.optionValues}
                    </p>
                  )}
                  {variantAxisOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Ce produit ne possède pas d&apos;axes d&apos;option configurés.
                    </p>
                  ) : (
                    <div className="space-y-5">
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
                            Les codes couleur des valeurs partagées se gèrent dans le bloc{" "}
                            <span className="font-medium text-foreground">Valeurs couleur</span> de
                            l&apos;onglet Variantes.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Publication */}
              <Card className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0">
                <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/30 px-5 py-4">
                  <div className="space-y-1.5">
                    <ProductSectionEyebrow>Publication</ProductSectionEyebrow>
                    <CardTitle>Publication et ordre</CardTitle>
                    <CardDescription className="leading-6">
                      Choisissez le statut de la variante, son ordre d&apos;apparition et son éventuel
                      statut par défaut.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-3">
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
                </CardContent>
              </Card>

              {/* Image */}
              <Card className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0">
                <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/30 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <ProductSectionEyebrow>Image</ProductSectionEyebrow>
                      <CardTitle>Image principale</CardTitle>
                      <CardDescription className="leading-6">
                        La variante choisit son image principale parmi les médias déjà rattachés au
                        produit.
                      </CardDescription>
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
                </CardHeader>
                {isImageSectionOpen ? (
                  <CardContent className="px-5 py-5">
                    {state.fieldErrors.primaryImageId ? (
                      <p className="mb-4 text-sm text-destructive">
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
                  </CardContent>
                ) : (
                  <CardContent className="px-5 py-4">
                    <p className="text-sm text-muted-foreground">
                      {initialValues.primaryImageId
                        ? "Une image principale est déjà définie. Ouvrez ce bloc pour la modifier."
                        : "Aucune image principale n’est encore définie. Ouvrez ce bloc pour en choisir une."}
                    </p>
                  </CardContent>
                )}
              </Card>

              {/* Repères */}
              <Card className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0">
                <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/30 px-5 py-4">
                  <div className="space-y-1.5">
                    <ProductSectionEyebrow>Repères</ProductSectionEyebrow>
                    <CardTitle>Repères techniques</CardTitle>
                    <CardDescription className="leading-6">
                      Conservez ici les identifiants utiles à l&apos;exploitation et aux rapprochements
                      externes.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-2">
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
                </CardContent>
              </Card>

              {/* Dimensions */}
              <Card className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0">
                <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/30 px-5 py-4">
                  <div className="space-y-1.5">
                    <ProductSectionEyebrow>Dimensions</ProductSectionEyebrow>
                    <CardTitle>Dimensions et poids</CardTitle>
                    <CardDescription className="leading-6">
                      Renseignez les mesures de la variante lorsqu&apos;elles sont utiles au pilotage.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-2">
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
                </CardContent>
              </Card>
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
