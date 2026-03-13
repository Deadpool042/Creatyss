import { Notice } from "@/components/notice";
import { SectionIntro } from "@/components/section-intro";
import { AdminFormField } from "@/components/admin/admin-form-field";
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
} from "./product-detail-helpers";
import { ProductMediaLibraryNotice } from "./product-media-library-notice";

type PrimaryImageFormAction = (formData: FormData) => Promise<void>;

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
      <div className="admin-image-preview admin-image-placeholder">
        Chemin d&apos;image indisponible
      </div>
    );
  }

  return (
    <div className="admin-image-preview">
      <img
        alt={image.altText ?? "Image produit"}
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
    <div className="admin-product-subsection grid gap-4 rounded-lg border border-border/60 bg-muted/10 p-4">
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
        <div className="admin-image-preview admin-image-placeholder">
          {getPrimaryImageEmptyMessage(scope)}
        </div>
      )}

      {state.usesFallbackImage ? (
        <Notice tone="note">
          {getPrimaryImageFallbackMessage(scope)}
        </Notice>
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
              className="admin-input"
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

          <div className="admin-inline-actions">
            <button
              className="button"
              type="submit">
              {getPrimaryImageSubmitLabel(state.primaryImage !== null)}
            </button>
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

          <button
            className="button link-subtle"
            type="submit">
            Supprimer l&apos;image principale
          </button>
        </form>
      ) : null}
    </div>
  );
}
