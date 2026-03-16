import { Notice } from "@/components/notice";
import { SectionIntro } from "@/components/section-intro";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type AdminMediaAsset } from "@/db/admin-media";
import { type AdminProductImage } from "@/db/repositories/admin-product-image.repository";
import {
  createProductImageAction,
  deleteProductPrimaryImageAction,
  setProductPrimaryImageAction
} from "@/features/admin/products/actions";

import { type PrimaryImageState } from "../lib/product-detail-helpers";
import { ProductImageCard } from "./product-image-card";
import { ProductMediaLibraryNotice } from "./product-media-library-notice";
import { ProductPrimaryImageManager } from "./product-primary-image-manager";

const nativeSelectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

const checkboxInputClassName =
  "mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

type ProductImagesSectionProps = Readonly<{
  currentProductPrimaryMediaAssetId: string;
  mediaAssets: AdminMediaAsset[];
  parentImages: AdminProductImage[];
  productId: string;
  productImageMessage: {
    error: string | null;
    status: string | null;
  };
  productPrimaryImageState: PrimaryImageState;
  uploadsPublicPath: string;
}>;

export function ProductImagesSection({
  currentProductPrimaryMediaAssetId,
  mediaAssets,
  parentImages,
  productId,
  productImageMessage,
  productPrimaryImageState,
  uploadsPublicPath
}: ProductImagesSectionProps) {
  const hasMediaAssets = mediaAssets.length > 0;
  const imageMediaAssetId = `product-image-media-asset-${productId}`;
  const imageAltTextId = `product-image-alt-text-${productId}`;
  const imageSortOrderId = `product-image-sort-order-${productId}`;

  return (
    <section className="space-y-4">
      {productImageMessage.status ? (
        <Notice tone="success">{productImageMessage.status}</Notice>
      ) : null}
      {productImageMessage.error ? (
        <Notice tone="alert">{productImageMessage.error}</Notice>
      ) : null}

      <AdminFormSection
        contentClassName="gap-6"
        description="Commencez par l'image principale du produit. Les réglages d'images plus détaillés restent disponibles plus bas si nécessaire."
        eyebrow="Images produit"
        title="Images du produit">
        <ProductPrimaryImageManager
          currentMediaAssetId={currentProductPrimaryMediaAssetId}
          deleteAction={deleteProductPrimaryImageAction}
          description="Choisissez ici le visuel principal affiché pour ce produit."
          formClassName="grid gap-4"
          mediaAssets={mediaAssets}
          productId={productId}
          scope="product"
          setAction={setProductPrimaryImageAction}
          state={productPrimaryImageState}
          title="Image principale du produit"
          uploadsPublicPath={uploadsPublicPath}
        />

        <div className="admin-product-subsection space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4">
          <SectionIntro
            className="grid gap-2"
            description="Les autres images associées et leurs réglages restent disponibles ici si vous devez intervenir plus finement."
            eyebrow="Réglages complémentaires"
            title="Images associées"
            titleAs="h3"
          />

          {hasMediaAssets ? (
            <form
              action={createProductImageAction}
              className="grid gap-4">
              <input
                name="productId"
                type="hidden"
                value={productId}
              />
              <input
                name="variantId"
                type="hidden"
                value=""
              />
              <input
                name="imageScope"
                type="hidden"
                value="product"
              />

              <AdminFormField
                htmlFor={imageMediaAssetId}
                label="Média existant">
                <select
                  className={nativeSelectClassName}
                  defaultValue=""
                  id={imageMediaAssetId}
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

              <AdminFormField
                htmlFor={imageAltTextId}
                label="Texte alternatif">
                <Input
                  id={imageAltTextId}
                  name="altText"
                  type="text"
                />
              </AdminFormField>

              <AdminFormField
                htmlFor={imageSortOrderId}
                label="Ordre">
                <Input
                  defaultValue="0"
                  id={imageSortOrderId}
                  name="sortOrder"
                  type="number"
                />
              </AdminFormField>

              <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
                <input
                  className={checkboxInputClassName}
                  name="isPrimary"
                  type="checkbox"
                  value="on"
                />
                <span>Définir comme image principale du produit</span>
              </label>

              <AdminFormActions>
                <Button
                  className="w-full sm:w-fit"
                  type="submit">
                  Ajouter une image produit
                </Button>
              </AdminFormActions>
            </form>
          ) : (
            <ProductMediaLibraryNotice />
          )}

          {parentImages.length > 0 ? (
            <div className="grid gap-4 w-fit grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
              {parentImages.map(image => (
                <ProductImageCard
                  image={image}
                  imageScope="product"
                  key={image.id}
                  productId={productId}
                  uploadsPublicPath={uploadsPublicPath}
                />
              ))}
            </div>
          ) : (
            <AdminEmptyState
              description="Associez un média existant pour afficher une image principale ou secondaire."
              eyebrow="Aucune image"
              title="Le produit n'a pas encore d'image"
            />
          )}
        </div>
      </AdminFormSection>
    </section>
  );
}
