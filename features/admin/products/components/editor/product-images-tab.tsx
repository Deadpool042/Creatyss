"use client";

import Image from "next/image";
import { useActionState, useMemo, useState, useTransition, type ChangeEvent, type JSX } from "react";
import { Images, Upload } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { CustomButton } from "@/components/shared";
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
  uploadProductImagesFormInitialState,
  type AdminProductImageItem,
  type AttachableMediaAssetItem,
  type AttachProductImagesInput,
  type AttachProductImagesResult,
  type DeleteProductImageInput,
  type DeleteProductImageResult,
  type ReorderProductImageInput,
  type ReorderProductImageResult,
  type SetProductPrimaryImageInput,
  type SetProductPrimaryImageResult,
  type UpdateProductImageAltTextInput,
  type UpdateProductImageAltTextResult,
  type UploadProductImagesFormState,
} from "@/features/admin/products/editor/types";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";
import { ProductImageItem } from "./images/product-image-item";

type SetProductPrimaryImageAction = (
  input: SetProductPrimaryImageInput
) => Promise<SetProductPrimaryImageResult>;
type UploadProductImagesAction = (
  prevState: UploadProductImagesFormState,
  formData: FormData
) => Promise<UploadProductImagesFormState>;
type DeleteProductImageAction = (input: DeleteProductImageInput) => Promise<DeleteProductImageResult>;
type UpdateProductImageAltTextAction = (
  input: UpdateProductImageAltTextInput
) => Promise<UpdateProductImageAltTextResult>;
type ReorderProductImageAction = (input: ReorderProductImageInput) => Promise<ReorderProductImageResult>;
type AttachProductImagesAction = (input: AttachProductImagesInput) => Promise<AttachProductImagesResult>;

type MessageState = {
  status: "success" | "error";
  message: string;
} | null;

type ProductImagesTabProps = {
  productId: string;
  productSlug: string;
  images: AdminProductImageItem[];
  attachableMediaItems: AttachableMediaAssetItem[];
  setPrimaryImageAction?: SetProductPrimaryImageAction;
  uploadImagesAction?: UploadProductImagesAction;
  deleteImageAction?: DeleteProductImageAction;
  updateAltTextAction?: UpdateProductImageAltTextAction;
  reorderImageAction?: ReorderProductImageAction;
  attachImagesAction?: AttachProductImagesAction;
  attachLibraryOpen?: boolean;
  onAttachLibraryOpenChange?: (open: boolean) => void;
  uploadFormOpen?: boolean;
  onUploadFormOpenChange?: (open: boolean) => void;
};

type ProductImageGallerySectionProps = {
  productId: string;
  images: AdminProductImageItem[];
  onSetPrimary?: (mediaAssetId: string) => Promise<ReorderProductImageResult>;
  onDelete?: (imageId: string) => Promise<ReorderProductImageResult>;
  onUpdateAltText?: (imageId: string, altText: string) => Promise<ReorderProductImageResult>;
  onReorder?: (imageId: string, sortOrder: number) => Promise<ReorderProductImageResult>;
};

type ProductImagesSectionIntroProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>;

function ProductImagesSectionIntro({
  eyebrow,
  title,
  description,
}: ProductImagesSectionIntroProps): JSX.Element {
  return (
    <div className="grid gap-1.5">
      <ProductSectionEyebrow>{eyebrow}</ProductSectionEyebrow>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function ProductImageGallerySection({
  productId,
  images,
  onSetPrimary,
  onDelete,
  onUpdateAltText,
  onReorder,
}: ProductImageGallerySectionProps): JSX.Element {
  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-surface-panel px-4 py-10 text-center text-sm text-muted-foreground">
        Aucun média associé.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((image, index) => {
        const previous = images[index - 1] ?? null;
        const next = images[index + 1] ?? null;

        return (
          <ProductImageItem
            key={image.id}
            productId={productId}
            image={image}
            canMoveUp={previous !== null}
            canMoveDown={next !== null}
            previousSortOrder={previous?.sortOrder ?? null}
            nextSortOrder={next?.sortOrder ?? null}
            {...(onSetPrimary ? { onSetPrimary } : {})}
            {...(onDelete ? { onDelete } : {})}
            {...(onUpdateAltText ? { onUpdateAltText } : {})}
            {...(onReorder ? { onReorder } : {})}
          />
        );
      })}
    </div>
  );
}

function ProductImageUploadSection({
  productId,
  action,
}: Readonly<{
  productId: string;
  action: UploadProductImagesAction;
}>): JSX.Element {
  const [state, formAction, pending] = useActionState<UploadProductImagesFormState, FormData>(
    action,
    uploadProductImagesFormInitialState
  );
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const [makePrimaryChecked, setMakePrimaryChecked] = useState(false);

  const canSetPrimary = selectedFilesCount === 1;

  const checkboxHint = useMemo(() => {
    if (selectedFilesCount <= 0) {
      return "Sélectionnez une image unique pour pouvoir la définir explicitement comme image principale.";
    }

    if (selectedFilesCount === 1) {
      return "Cette image sera définie comme image principale du produit. Si une image principale est déjà définie, elle sera remplacée.";
    }

    return "Avec plusieurs images sélectionnées, cette option est désactivée. Si le produit n’a pas encore d’image principale, la première importée sera utilisée automatiquement.";
  }, [selectedFilesCount]);

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextCount = event.target.files?.length ?? 0;
    setSelectedFilesCount(nextCount);

    if (nextCount !== 1) {
      setMakePrimaryChecked(false);
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="productId" value={productId} />

      <AdminFormMessage
        tone={state.status === "success" ? "success" : "error"}
        message={state.status !== "idle" ? state.message : null}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <AdminFormField
          label="Images à importer"
          htmlFor="product-image-files"
          required
          description="Formats acceptés : JPEG, PNG, WebP, AVIF. La sélection multiple est autorisée."
          {...(state.fieldErrors.files ? { error: state.fieldErrors.files } : {})}
        >
          <Input
            id="product-image-files"
            name="files"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="text-sm"
            onChange={handleFilesChange}
          />
        </AdminFormField>

        <AdminFormField
          label="Définir comme image principale"
          htmlFor="product-image-make-primary"
          description={checkboxHint}
          {...(state.fieldErrors.makePrimary ? { error: state.fieldErrors.makePrimary } : {})}
        >
          <label className="flex min-h-10 items-center gap-3 rounded-md border px-3 py-2 text-sm">
            <input
              id="product-image-make-primary"
              name="makePrimary"
              type="checkbox"
              value="true"
              className="h-4 w-4"
              checked={makePrimaryChecked}
              disabled={!canSetPrimary}
              onChange={(event) => setMakePrimaryChecked(event.target.checked)}
            />
            <span>Utiliser comme image principale</span>
          </label>
        </AdminFormField>
      </div>

      <AdminFormField
        label="Texte alternatif"
        htmlFor="product-image-alt-text"
        description="Champ optionnel appliqué aux images importées."
        {...(state.fieldErrors.altText ? { error: state.fieldErrors.altText } : {})}
      >
        <Input
          id="product-image-alt-text"
          name="altText"
          placeholder="Décris brièvement l’image"
          className="text-sm"
        />
      </AdminFormField>

      <div className="flex justify-end">
        <CustomButton type="submit" loading={pending} leadingIcon={<Upload className="h-4 w-4" />}>
          {pending ? "Import…" : "Importer les images"}
        </CustomButton>
      </div>
    </form>
  );
}

function ProductImageLibraryDialog({
  open,
  onOpenChange,
  items,
  onAttach,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: AttachableMediaAssetItem[];
  onAttach?: (mediaAssetIds: string[]) => Promise<{ status: "success" | "error"; message: string }>;
}>): JSX.Element {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch.length === 0) {
      return items;
    }

    return items.filter((item) => {
      const haystack = [item.originalFilename ?? "", item.altText ?? "", item.publicUrl]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [items, search]);

  function toggleItem(id: string): void {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }

  function handleAttach(): void {
    if (!onAttach || selectedIds.length === 0) {
      return;
    }

    startTransition(async () => {
      const result = await onAttach(selectedIds);
      setMessage(result.message);

      if (result.status === "success") {
        setSelectedIds([]);
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-4xl">
        <div className="flex max-h-[85dvh] flex-col">
          <DialogHeader className="border-b px-6 py-4 text-left">
            <DialogTitle>Médiathèque</DialogTitle>
            <DialogDescription>
              Sélectionne un ou plusieurs médias déjà présents dans ta médiathèque pour les ajouter
              à la galerie du produit.
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un média…"
                className="sm:max-w-sm"
              />

              <div className="text-sm text-muted-foreground">
                {selectedIds.length} sélection{selectedIds.length > 1 ? "s" : ""}
              </div>
            </div>

            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-surface-border bg-surface-panel px-4 py-10 text-center text-sm text-muted-foreground">
                  Aucun media disponible.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredItems.map((item) => {
                    const checked = selectedIds.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className={[
                          "overflow-hidden rounded-2xl border bg-surface-panel text-left shadow-sm transition",
                          checked
                            ? "border-foreground ring-1 ring-foreground/20"
                            : "border-surface-border hover:border-foreground/30",
                        ].join(" ")}
                      >
                        <div className="relative aspect-4/3 overflow-hidden bg-surface-subtle">
                          <Image
                            src={item.publicUrl}
                            alt={item.altText ?? item.originalFilename ?? "Media"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="space-y-1 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="line-clamp-1 text-sm font-medium text-foreground">
                              {item.originalFilename ?? "Media"}
                            </p>
                            <span
                              className={[
                                "mt-0.5 inline-flex h-4 w-4 shrink-0 rounded-full border",
                                checked
                                  ? "border-foreground bg-foreground"
                                  : "border-surface-border bg-background",
                              ].join(" ")}
                              aria-hidden="true"
                            />
                          </div>

                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {item.altText && item.altText.trim().length > 0
                              ? item.altText
                              : "Sans texte alternatif"}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>

            <Button
              type="button"
              disabled={!onAttach || selectedIds.length === 0 || isPending}
              onClick={handleAttach}
            >
              {isPending ? "Ajout en cours…" : "Ajouter à la galerie"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProductImagesTab({
  productId,
  productSlug,
  images,
  attachableMediaItems,
  setPrimaryImageAction,
  uploadImagesAction,
  deleteImageAction,
  updateAltTextAction,
  reorderImageAction,
  attachImagesAction,
  attachLibraryOpen,
  onAttachLibraryOpenChange,
  uploadFormOpen,
  onUploadFormOpenChange,
}: ProductImagesTabProps): JSX.Element {
  const [messageState, setMessageState] = useState<MessageState>(null);
  const [internalLibraryOpen, setInternalLibraryOpen] = useState(false);
  const [internalUploadFormOpen, setInternalUploadFormOpen] = useState(false);

  const effectiveLibraryOpen =
    typeof attachLibraryOpen === "boolean" ? attachLibraryOpen : internalLibraryOpen;
  const setEffectiveLibraryOpen = onAttachLibraryOpenChange ?? setInternalLibraryOpen;

  const effectiveUploadFormOpen =
    typeof uploadFormOpen === "boolean" ? uploadFormOpen : internalUploadFormOpen;
  const setEffectiveUploadFormOpen = onUploadFormOpenChange ?? setInternalUploadFormOpen;

  const productImages = useMemo(
    () => images.filter((image) => image.subjectType === "product"),
    [images]
  );

  const primaryImage = useMemo(
    () => productImages.find((image) => image.isPrimary) ?? null,
    [productImages]
  );

  const ratioStats = useMemo(() => {
    let conformCount = 0;
    let nonConformCount = 0;
    let unknownCount = 0;

    for (const image of productImages) {
      if (
        image.widthPx === null ||
        image.heightPx === null ||
        image.widthPx <= 0 ||
        image.heightPx <= 0
      ) {
        unknownCount += 1;
        continue;
      }

      const ratio = image.widthPx / image.heightPx;
      if (Math.abs(ratio - 4 / 5) <= 0.02) {
        conformCount += 1;
      } else {
        nonConformCount += 1;
      }
    }

    return {
      conformCount,
      nonConformCount,
      unknownCount,
    };
  }, [productImages]);

  async function handleSetPrimary(
    mediaAssetId: string
  ): Promise<{ status: "success" | "error"; message: string }> {
    if (!setPrimaryImageAction) {
      return {
        status: "error",
        message: "Action indisponible.",
      };
    }

    const result = await setPrimaryImageAction({ productId, mediaAssetId });
    setMessageState(result);
    return result;
  }

  async function handleDelete(
    imageId: string
  ): Promise<{ status: "success" | "error"; message: string }> {
    if (!deleteImageAction) {
      return {
        status: "error",
        message: "Action indisponible.",
      };
    }

    const result = await deleteImageAction({ productId, imageId });
    setMessageState(result);
    return result;
  }

  async function handleUpdateAltText(
    imageId: string,
    altText: string
  ): Promise<{ status: "success" | "error"; message: string }> {
    if (!updateAltTextAction) {
      return {
        status: "error",
        message: "Action indisponible.",
      };
    }

    const result = await updateAltTextAction({ productId, imageId, altText });
    setMessageState(result);
    return result;
  }

  async function handleReorder(
    imageId: string,
    sortOrder: number
  ): Promise<{ status: "success" | "error"; message: string }> {
    if (!reorderImageAction) {
      return {
        status: "error",
        message: "Action indisponible.",
      };
    }

    const result = await reorderImageAction({ productId, imageId, sortOrder });
    setMessageState(result);
    return result;
  }

  async function handleAttach(
    mediaAssetIds: string[]
  ): Promise<{ status: "success" | "error"; message: string }> {
    if (!attachImagesAction) {
      return {
        status: "error",
        message: "Action indisponible.",
      };
    }

    const highestSortOrder = productImages.reduce(
      (max, image) => Math.max(max, image.sortOrder),
      -1
    );

    const result = await attachImagesAction({
      images: mediaAssetIds.map((mediaAssetId, index) => ({
        productId,
        mediaAssetId,
        subjectType: "product",
        subjectId: productId,
        role: "gallery",
        sortOrder: highestSortOrder + index + 1,
      })),
    });

    setMessageState(result);
    return result;
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(3.5rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(2.75rem+env(safe-area-inset-bottom))] lg:pb-4">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-4 md:px-6 md:py-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start xl:px-0 [@media(max-height:480px)]:gap-4 [@media(max-height:480px)]:py-3">
            <div className="min-w-0 space-y-5 md:space-y-6">
              <AdminFormMessage
                tone={messageState?.status === "success" ? "success" : "error"}
                message={messageState?.message ?? null}
              />

              <div className="divide-y divide-surface-border/40">
                <section className="grid gap-6 py-6 first:pt-0">
                  <ProductImagesSectionIntro
                    eyebrow="Galerie"
                    title="Médias du produit"
                    description="Gérez l’ordre, l’image principale et la cohérence éditoriale de la galerie sans mélanger cette étape avec le reste de la fiche."
                  />

                  <div className="rounded-xl border border-surface-border/60 bg-surface-subtle/10 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-foreground">
                      Convention média — galerie produit
                    </p>
                    <div className="mt-2 space-y-2 text-xs text-muted-foreground">
                      <p>
                        Pour garantir un rendu storefront premium, stable et cohérent, toutes les
                        images de galerie produit doivent respecter les règles suivantes.
                      </p>
                      <div>
                        <p className="font-medium text-foreground">Ratio</p>
                        <ul className="list-disc pl-4">
                          <li>Image galerie source : 4:5</li>
                          <li>Miniatures UI : 1:1 dérivées de l&apos;image galerie</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Ordre recommandé</p>
                        <ol className="list-decimal pl-4">
                          <li>Vue principale hero</li>
                          <li>Vue portée ou vue d&apos;échelle</li>
                          <li>Détail matière ou finition</li>
                          <li>Détail fonctionnel</li>
                          <li>Vue complémentaire</li>
                        </ol>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Règles éditoriales</p>
                        <ul className="list-disc pl-4">
                          <li>Le produit doit rester clairement lisible</li>
                          <li>La première image doit montrer le produit entier</li>
                          <li>Les détails serrés ne doivent jamais être en première position</li>
                          <li>Le cadrage doit rester cohérent d&apos;une image à l&apos;autre</li>
                          <li>
                            La lumière et la distance de prise de vue doivent rester homogènes
                          </li>
                          <li>
                            Une image non conforme au ratio 4:5 n&apos;est pas considérée comme
                            hero-ready
                          </li>
                        </ul>
                      </div>
                      <p>
                        Cette convention évite les compensations CSS en front et permet un hero
                        produit plus stable, plus lisible et plus premium sur desktop comme sur
                        mobile.
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {productImages.length} image{productImages.length > 1 ? "s" : ""}
                  </div>

                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                    <div className="rounded-lg border border-surface-border/60 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide">Conformes 4:5</p>
                      <p className="mt-1 text-sm font-semibold text-feedback-success-foreground">
                        {ratioStats.conformCount}
                      </p>
                    </div>
                    <div className="rounded-lg border border-surface-border/60 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide">À recadrer</p>
                      <p className="mt-1 text-sm font-semibold text-feedback-warning-foreground">
                        {ratioStats.nonConformCount}
                      </p>
                    </div>
                    <div className="rounded-lg border border-surface-border/60 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide">Dimensions inconnues</p>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        {ratioStats.unknownCount}
                      </p>
                    </div>
                  </div>

                  {uploadImagesAction || attachImagesAction ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {uploadImagesAction ? (
                        <button
                          type="button"
                          onClick={() => setEffectiveUploadFormOpen(true)}
                          className="flex flex-col gap-1.5 rounded-xl border border-surface-border/60 bg-surface-panel px-4 py-4 text-left transition-colors hover:bg-surface-subtle/40"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Upload className="h-4 w-4 shrink-0" />
                            Importer depuis l&apos;appareil
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Charge de nouveaux fichiers images depuis votre ordinateur.
                          </p>
                        </button>
                      ) : null}

                      {attachImagesAction ? (
                        <button
                          type="button"
                          onClick={() => setEffectiveLibraryOpen(true)}
                          className="flex flex-col gap-1.5 rounded-xl border border-surface-border/60 bg-surface-panel px-4 py-4 text-left transition-colors hover:bg-surface-subtle/40"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Images className="h-4 w-4 shrink-0" />
                            Choisir depuis la médiathèque
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Réutilise des médias déjà présents dans votre bibliothèque.
                          </p>
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {effectiveUploadFormOpen && uploadImagesAction ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-foreground">
                          Importer des images
                        </span>
                        <button
                          type="button"
                          onClick={() => setEffectiveUploadFormOpen(false)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Fermer
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Charge des fichiers depuis votre appareil pour les ajouter à la galerie du
                        produit.
                      </p>

                      <div className="rounded-2xl border border-surface-border/60 bg-surface-subtle/10 p-4">
                        <ProductImageUploadSection
                          productId={productId}
                          action={uploadImagesAction}
                        />
                      </div>
                    </div>
                  ) : null}

                  {primaryImage ? (
                    <div className="rounded-xl border border-surface-border/60 px-4 py-3 text-sm">
                      <span className="font-medium">Image principale du produit : </span>
                      <span className="text-muted-foreground">
                        {primaryImage.altText ?? primaryImage.mediaAssetId}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
                      Aucune image principale du produit n&apos;est définie.
                    </div>
                  )}

                  <ProductImageGallerySection
                    productId={productId}
                    images={productImages}
                    {...(setPrimaryImageAction ? { onSetPrimary: handleSetPrimary } : {})}
                    {...(deleteImageAction ? { onDelete: handleDelete } : {})}
                    {...(updateAltTextAction ? { onUpdateAltText: handleUpdateAltText } : {})}
                    {...(reorderImageAction ? { onReorder: handleReorder } : {})}
                  />
                </section>
              </div>
            </div>

            <aside className="min-w-0 xl:sticky xl:top-6">
              <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/80">
                <section className="grid gap-4 px-5 py-5">
                  <ProductImagesSectionIntro
                    eyebrow="Repères"
                    title="Lecture galerie"
                    description="Gardez les signaux essentiels visibles pendant le tri et le choix de l’image principale."
                  />

                  <div className="divide-y divide-surface-border">
                    <div className="grid gap-1.5 py-3 first:pt-0">
                      <ProductSectionEyebrow className="tracking-[0.14em]">Lien produit</ProductSectionEyebrow>
                      <p className="text-sm font-medium text-foreground">{productSlug}</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Le slug aide à vérifier rapidement que vous êtes bien sur la bonne fiche.
                      </p>
                    </div>

                    <div className="grid gap-1.5 py-3">
                      <ProductSectionEyebrow className="tracking-[0.14em]">Image principale</ProductSectionEyebrow>
                      <p className="text-sm font-medium text-foreground">
                        {primaryImage ? "Définie" : "Aucune"}
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        La première image storefront doit montrer le produit entier et rester hero-ready.
                      </p>
                    </div>

                    <div className="grid gap-1.5 py-3">
                      <ProductSectionEyebrow className="tracking-[0.14em]">Conformité 4:5</ProductSectionEyebrow>
                      <p className="text-sm font-medium text-foreground">
                        {ratioStats.conformCount} conforme{ratioStats.conformCount > 1 ? "s" : ""} · {ratioStats.nonConformCount} à recadrer
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Gardez un ratio source cohérent pour éviter les compensations de mise en page côté boutique.
                      </p>
                    </div>

                    <div className="grid gap-1.5 py-3 last:pb-0">
                      <ProductSectionEyebrow className="tracking-[0.14em]">Identifiant</ProductSectionEyebrow>
                      <p className="truncate text-sm font-medium text-foreground">{productId}</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Utile pour les rapprochements internes ou les vérifications côté médiathèque.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <ProductImageLibraryDialog
        open={effectiveLibraryOpen}
        onOpenChange={setEffectiveLibraryOpen}
        items={attachableMediaItems}
        {...(attachImagesAction ? { onAttach: handleAttach } : {})}
      />
    </>
  );
}
