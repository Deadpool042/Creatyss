import { Notice } from "@/components/shared/notice";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type AdminMediaAsset } from "@/db/admin-media";
import { type AdminProductImage } from "@/db/repositories/admin-product-image.repository";
import { type AdminProductVariant } from "@/db/repositories/admin-product-variant.repository";
import { type ProductAdminPresentation } from "@/entities/product/product-admin-presentation";
import {
  createProductImageAction,
  deleteProductVariantAction,
  deleteVariantPrimaryImageAction,
  setVariantPrimaryImageAction,
  updateProductVariantAction
} from "@/features/admin/products/actions";

import {
  findMediaAssetByFilePath,
  getAvailabilityLabel,
  getPrimaryImageState,
  getProductStatusLabel
} from "@/features/admin/products/lib";
import { ProductImageCard } from "./product-image-card";
import { ProductMediaLibraryNotice } from "./product-media-library-notice";
import { ProductPrimaryImageManager } from "./product-primary-image-manager";

const nativeSelectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

const fieldsetClassName =
  "grid gap-4 rounded-xl border border-border/60 bg-muted/10 p-4";

const legendClassName =
  "px-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground";

const checkboxInputClassName =
  "mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

const subtleDestructiveButtonClassName =
  "w-fit px-0 text-destructive hover:bg-transparent hover:text-destructive";

type ProductVariantCardProps = Readonly<{
  isSimpleProduct: boolean;
  mediaAssets: AdminMediaAsset[];
  productId: string;
  productPresentation: ProductAdminPresentation;
  uploadsPublicPath: string;
  variant: AdminProductVariant;
  variantImages: AdminProductImage[];
}>;

export function ProductVariantCard({
  isSimpleProduct,
  mediaAssets,
  productId,
  productPresentation,
  uploadsPublicPath,
  variant,
  variantImages
}: ProductVariantCardProps) {
  const hasMediaAssets = mediaAssets.length > 0;
  const variantPrimaryImageState = getPrimaryImageState(variantImages);
  const currentVariantPrimaryMediaAsset = findMediaAssetByFilePath(
    mediaAssets,
    variantPrimaryImageState.displayImage?.filePath ?? null
  );
  const skuId = `variant-sku-${variant.id}`;
  const priceId = `variant-price-${variant.id}`;
  const compareAtPriceId = `variant-compare-at-price-${variant.id}`;
  const statusId = `variant-status-${variant.id}`;
  const stockQuantityId = `variant-stock-quantity-${variant.id}`;
  const nameId = `variant-name-${variant.id}`;
  const colorNameId = `variant-color-name-${variant.id}`;
  const colorHexId = `variant-color-hex-${variant.id}`;
  const mediaAssetId = `variant-image-media-asset-${variant.id}`;
  const altTextId = `variant-image-alt-text-${variant.id}`;
  const sortOrderId = `variant-image-sort-order-${variant.id}`;

  return (
    <article className="admin-variant-card grid gap-6 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      <div className="grid gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {isSimpleProduct
            ? "Déclinaison existante"
            : productPresentation.itemKicker}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{variant.colorName}</Badge>
          <Badge variant="outline">
            {variant.isDefault
              ? "Déclinaison par défaut"
              : "Déclinaison secondaire"}
          </Badge>
          <Badge variant="outline">
            {getProductStatusLabel(variant.status)}
          </Badge>
        </div>
        <h3>{variant.name}</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          SKU {variant.sku}
          {variant.colorHex ? ` · ${variant.colorHex}` : ""}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Disponibilité actuelle : {getAvailabilityLabel(variant.isAvailable)}
        </p>
      </div>

      <form
        action={updateProductVariantAction}
        className="space-y-4">
        <input
          name="productId"
          type="hidden"
          value={productId}
        />
        <input
          name="variantId"
          type="hidden"
          value={variant.id}
        />

        <fieldset className={fieldsetClassName}>
          <legend className={legendClassName}>
            {isSimpleProduct
              ? "Informations commerciales existantes"
              : productPresentation.saleFieldsetLegend}
          </legend>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminFormField
              htmlFor={skuId}
              label="SKU">
              <Input
                defaultValue={variant.sku}
                id={skuId}
                name="sku"
                required
                type="text"
              />
            </AdminFormField>

            <AdminFormField
              htmlFor={priceId}
              label="Prix">
              <Input
                defaultValue={variant.price}
                id={priceId}
                inputMode="decimal"
                name="price"
                required
                type="text"
              />
            </AdminFormField>

            <AdminFormField
              htmlFor={compareAtPriceId}
              label="Prix barré">
              <Input
                defaultValue={variant.compareAtPrice ?? ""}
                id={compareAtPriceId}
                inputMode="decimal"
                name="compareAtPrice"
                type="text"
              />
            </AdminFormField>

            <AdminFormField
              htmlFor={statusId}
              label="Statut">
              <select
                className={nativeSelectClassName}
                defaultValue={variant.status}
                id={statusId}
                name="status">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </AdminFormField>

            <AdminFormField
              htmlFor={stockQuantityId}
              label="Stock disponible">
              <Input
                defaultValue={variant.stockQuantity}
                id={stockQuantityId}
                min="0"
                name="stockQuantity"
                required
                step="1"
                type="number"
              />
            </AdminFormField>
          </div>
        </fieldset>

        <fieldset className={fieldsetClassName}>
          <legend className={legendClassName}>
            Informations de la déclinaison
          </legend>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminFormField
              htmlFor={nameId}
              label="Nom de la déclinaison">
              <Input
                defaultValue={variant.name}
                id={nameId}
                name="name"
                required
                type="text"
              />
            </AdminFormField>

            <AdminFormField
              htmlFor={colorNameId}
              label="Nom de couleur">
              <Input
                defaultValue={variant.colorName}
                id={colorNameId}
                name="colorName"
                required
                type="text"
              />
            </AdminFormField>

            <AdminFormField
              htmlFor={colorHexId}
              label="Code couleur">
              <Input
                defaultValue={variant.colorHex ?? ""}
                id={colorHexId}
                name="colorHex"
                placeholder="#C19A6B"
                type="text"
              />
            </AdminFormField>
          </div>

          <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
            <input
              className={checkboxInputClassName}
              defaultChecked={variant.isDefault}
              name="isDefault"
              type="checkbox"
              value="on"
            />
            <span>
              {isSimpleProduct
                ? "Déclinaison par défaut"
                : "Définir comme déclinaison par défaut"}
            </span>
          </label>
        </fieldset>

        <AdminFormActions>
          <Button
            className="w-full sm:w-fit"
            type="submit">
            {isSimpleProduct
              ? "Enregistrer la déclinaison existante"
              : productPresentation.saveActionLabel}
          </Button>
        </AdminFormActions>
      </form>

      <form action={deleteProductVariantAction}>
        <input
          name="productId"
          type="hidden"
          value={productId}
        />
        <input
          name="variantId"
          type="hidden"
          value={variant.id}
        />

        <Button
          className={subtleDestructiveButtonClassName}
          size="sm"
          variant="ghost"
          type="submit">
          {isSimpleProduct
            ? "Supprimer la déclinaison existante"
            : productPresentation.deleteActionLabel}
        </Button>
      </form>

      <div className="grid gap-2">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
          {isSimpleProduct
            ? "Images existantes"
            : productPresentation.imagesEyebrow}
        </p>
        <h3>
          {isSimpleProduct
            ? "Images de la déclinaison existante"
            : `Images pour ${variant.colorName}`}
        </h3>
        <p className="card-copy text-sm leading-6 text-muted-foreground">
          Commencez par l&apos;image principale de cette déclinaison. Les autres
          réglages d&apos;images restent disponibles plus bas si nécessaire.
        </p>
      </div>

      <ProductPrimaryImageManager
        currentMediaAssetId={currentVariantPrimaryMediaAsset?.id ?? ""}
        deleteAction={deleteVariantPrimaryImageAction}
        description="Choisissez ici le visuel principal affiché pour cette déclinaison."
        formClassName="grid gap-4"
        mediaAssets={mediaAssets}
        productId={productId}
        scope="variant"
        setAction={setVariantPrimaryImageAction}
        state={variantPrimaryImageState}
        title={
          isSimpleProduct
            ? "Image principale de la déclinaison existante"
            : "Image principale de la déclinaison"
        }
        uploadsPublicPath={uploadsPublicPath}
        variantId={variant.id}
      />

      <div className="grid gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Réglages complémentaires
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Les autres images associées et leurs réglages restent disponibles ici
          si vous devez intervenir plus finement.
        </p>
      </div>

      {hasMediaAssets ? (
        <form
          action={createProductImageAction}
          className="space-y-4">
          <input
            name="productId"
            type="hidden"
            value={productId}
          />
          <input
            name="variantId"
            type="hidden"
            value={variant.id}
          />
          <input
            name="imageScope"
            type="hidden"
            value="variant"
          />

          <AdminFormField
            htmlFor={mediaAssetId}
            label="Média existant">
            <select
              className={nativeSelectClassName}
              defaultValue=""
              id={mediaAssetId}
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
            htmlFor={altTextId}
            label="Texte alternatif">
            <Input
              id={altTextId}
              name="altText"
              type="text"
            />
          </AdminFormField>

          <AdminFormField
            htmlFor={sortOrderId}
            label="Ordre">
            <Input
              defaultValue="0"
              id={sortOrderId}
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
            <span>Image principale de la déclinaison</span>
          </label>

          <AdminFormActions>
            <Button
              className="w-full sm:w-fit"
              type="submit">
              Ajouter une image à la déclinaison
            </Button>
          </AdminFormActions>
        </form>
      ) : (
        <ProductMediaLibraryNotice />
      )}

      {variantImages.length > 0 ? (
        <div className="grid gap-4">
          {variantImages.map(image => (
            <ProductImageCard
              image={image}
              imageScope="variant"
              key={image.id}
              productId={productId}
              uploadsPublicPath={uploadsPublicPath}
            />
          ))}
        </div>
      ) : (
        <Notice tone="note">
          {isSimpleProduct
            ? "Cette déclinaison existante n'a pas encore d'image associée."
            : "Cette déclinaison n'a pas encore d'image associée."}
        </Notice>
      )}
    </article>
  );
}
