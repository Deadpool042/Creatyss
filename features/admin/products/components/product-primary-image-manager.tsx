import { Notice } from "@/components/notice";
import { SectionIntro } from "@/components/section-intro";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { Button } from "@/components/ui/button";
import { type AdminMediaAsset } from "@/db/admin-media";
import { type AdminProductImage } from "@/db/repositories/admin-product-image.repository";
import {
  getImageUrl,
  getPrimaryImageEmptyMessage,
  getPrimaryImageExtraImagesMessage,
  getPrimaryImageFallbackMessage,
  getPrimaryImageSubmitLabel,
  type PrimaryImageScope,
  type PrimaryImageState
} from "@/features/admin/products/lib";
import { ProductMediaLibraryNotice } from "./product-media-library-notice";

type PrimaryImageFormAction = (formData: FormData) => Promise<void>;

const nativeSelectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

const subtleDestructiveButtonClassName =
  "w-fit px-0 text-destructive hover:bg-transparent hover:text-destructive";

type ProductPrimaryImageManagerProps = Readonly<{
  currentMediaAssetId: string;
  deleteAction: PrimaryImageFormAction;
  description: string;
  formClassName: string;
  mediaAssets: AdminMediaAsset[];
  productId: string;
  scope: PrimaryImageScope;
  setAction: PrimaryImageFormAction;
  state: PrimaryImageState;
  title: string;
  uploadsPublicPath: string;
  variantId?: string;
}>;

function renderImagePreview(
  uploadsPublicPath: string,
  image: AdminProductImage
) {
  const imageUrl = getImageUrl(uploadsPublicPath, image.filePath);

  if (imageUrl === null) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center text-sm leading-6 text-muted-foreground">
        Chemin d&apos;image indisponible
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-xs">
      <img
        alt={image.altText ?? "Image produit"}
        className="aspect-16/10 w-full object-cover"
        src={imageUrl}
      />
    </div>
  );
}

export function ProductPrimaryImageManager({
  currentMediaAssetId,
  deleteAction,
  description,
  formClassName,
  mediaAssets,
  productId,
  scope,
  setAction,
  state,
  title,
  uploadsPublicPath,
  variantId
}: ProductPrimaryImageManagerProps) {
  const selectId = `${scope}-primary-media-asset-${variantId ?? productId}`;

  return (
    <div className="admin-product-subsection space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4">
      <SectionIntro
        className="grid gap-2"
        description={description}
        eyebrow="Image principale"
        title={title}
        titleAs="h3"
      />

      {state.displayImage ? (
        renderImagePreview(uploadsPublicPath, state.displayImage)
      ) : (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center text-sm leading-6 text-muted-foreground">
          {getPrimaryImageEmptyMessage(scope)}
        </div>
      )}

      {state.usesFallbackImage ? (
        <Notice tone="note">{getPrimaryImageFallbackMessage(scope)}</Notice>
      ) : null}

      {state.extraImageCount > 0 ? (
        <Notice tone="note">
          {getPrimaryImageExtraImagesMessage(scope, state.extraImageCount)}
        </Notice>
      ) : null}

      {mediaAssets.length > 0 ? (
        <form
          action={setAction}
          className={formClassName}>
          <input
            name="productId"
            type="hidden"
            value={productId}
          />
          {variantId ? (
            <input
              name="variantId"
              type="hidden"
              value={variantId}
            />
          ) : null}

          <AdminFormField
            htmlFor={selectId}
            label="Média existant">
            <select
              className={nativeSelectClassName}
              defaultValue={currentMediaAssetId}
              id={selectId}
              name="mediaAssetId">
              <option
                disabled
                value="">
                Sélectionnez un média
              </option>
              {mediaAssets.map(mediaAsset => (
                <option
                  key={mediaAsset.id}
                  value={mediaAsset.id}>
                  {mediaAsset.originalName} · {mediaAsset.mimeType}
                </option>
              ))}
            </select>
          </AdminFormField>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="w-full sm:w-fit"
              type="submit">
              {getPrimaryImageSubmitLabel(state.primaryImage !== null)}
            </Button>
          </div>
        </form>
      ) : (
        <ProductMediaLibraryNotice />
      )}

      {state.primaryImage ? (
        <form action={deleteAction}>
          <input
            name="productId"
            type="hidden"
            value={productId}
          />
          {variantId ? (
            <input
              name="variantId"
              type="hidden"
              value={variantId}
            />
          ) : null}

          <Button
            className={subtleDestructiveButtonClassName}
            size="sm"
            variant="ghost"
            type="submit">
            Supprimer l&apos;image principale
          </Button>
        </form>
      ) : null}
    </div>
  );
}
