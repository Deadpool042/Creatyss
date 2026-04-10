"use client";

import { useMemo, useState, type JSX } from "react";

import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import type {
  attachProductImagesAction,
  deleteProductImageAction,
  reorderProductImageAction,
  setProductPrimaryImageAction,
  updateProductImageAltTextAction,
  uploadProductImagesAction,
} from "@/features/admin/products/editor/public";
import type {
  AdminProductImageItem,
  AttachableMediaAssetItem,
} from "@/features/admin/products/editor/types";
import { ProductImageGallery } from "./images/product-image-gallery";
import { ProductImageLibrarySheet } from "./images/product-image-library-sheet";
import { ProductImageUploadForm } from "./images/product-image-upload-form";

type SetProductPrimaryImageAction = typeof setProductPrimaryImageAction;
type UploadProductImagesAction = typeof uploadProductImagesAction;
type DeleteProductImageAction = typeof deleteProductImageAction;
type UpdateProductImageAltTextAction = typeof updateProductImageAltTextAction;
type ReorderProductImageAction = typeof reorderProductImageAction;
type AttachProductImagesAction = typeof attachProductImagesAction;

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
        isPrimary: false,
      })),
    });

    setMessageState(result);
    return result;
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-28.25 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pt-29.25 md:pt-30.25 [@media(max-height:480px)]:pt-25.25 [@media(max-height:480px)]:pb-[calc(2.75rem+env(safe-area-inset-bottom))] lg:pt-17.25 lg:pb-4">
          <div className="w-full space-y-5 px-4 pt-4 pb-4 md:space-y-8 md:px-6 md:pt-6 md:pb-6 lg:mx-auto lg:max-w-6xl lg:px-4 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:pt-3 [@media(max-height:480px)]:pb-2.5">
            <AdminFormMessage
              tone={messageState?.status === "success" ? "success" : "error"}
              message={messageState?.message ?? null}
            />

            <AdminFormSection
              title="Galerie produit"
              description="Gère les médias affichés sur la fiche produit, leur ordre et l'image principale du produit."
            >
              <div className="text-sm text-muted-foreground">
                {productImages.length} image{productImages.length > 1 ? "s" : ""}
              </div>

              {effectiveUploadFormOpen && uploadImagesAction ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">Importer des images</span>
                    <button
                      type="button"
                      onClick={() => setEffectiveUploadFormOpen(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Fermer
                    </button>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                    <ProductImageUploadForm productId={productId} action={uploadImagesAction} />
                  </div>
                </div>
              ) : null}

              {primaryImage ? (
                <div className="rounded-xl border border-border/60 px-4 py-3 text-sm">
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

              <ProductImageGallery
                productId={productId}
                images={productImages}
                {...(setPrimaryImageAction ? { onSetPrimary: handleSetPrimary } : {})}
                {...(deleteImageAction ? { onDelete: handleDelete } : {})}
                {...(updateAltTextAction ? { onUpdateAltText: handleUpdateAltText } : {})}
                {...(reorderImageAction ? { onReorder: handleReorder } : {})}
              />

              <ProductImageLibrarySheet
                open={effectiveLibraryOpen}
                onOpenChange={setEffectiveLibraryOpen}
                items={attachableMediaItems}
                {...(attachImagesAction ? { onAttach: handleAttach } : {})}
              />
            </AdminFormSection>

            <AdminFormSection
              title="Informations techniques"
              description="Vue de contrôle rapide de la galerie produit et de son affichage."
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
                  <p className="text-[11px] uppercase tracking-wide">Image principale</p>
                  <p className="mt-1 font-medium text-foreground">
                    {primaryImage ? "Définie" : "Aucune"}
                  </p>
                </div>
              </div>
            </AdminFormSection>
          </div>
        </div>
      </div>

      <ProductImageLibrarySheet
        open={effectiveLibraryOpen}
        onOpenChange={setEffectiveLibraryOpen}
        items={attachableMediaItems}
        {...(attachImagesAction ? { onAttach: handleAttach } : {})}
      />
    </>
  );
}
