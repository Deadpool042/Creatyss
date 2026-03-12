import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { PageHeader } from "@/components/ui/page-header";
import { SectionIntro } from "@/components/ui/section-intro";
import { listAdminMediaAssets, type AdminMediaAsset } from "@/db/admin-media";
import { listAdminCategories } from "@/db/repositories/admin-category.repository";
import {
  findAdminProductById,
  type AdminProductCategoryAssignment
} from "@/db/repositories/admin-product.repository";
import {
  listAdminProductImages,
  type AdminProductImage
} from "@/db/repositories/admin-product-image.repository";
import {
  listAdminProductVariants,
} from "@/db/repositories/admin-product-variant.repository";
import { getAdminProductPresentation } from "@/entities/product/product-admin-presentation";
import { deleteProductAction } from "@/features/admin/products/actions/delete-product-action";
import { deleteProductImageAction } from "@/features/admin/products/actions/delete-product-image-action";
import { deleteProductPrimaryImageAction } from "@/features/admin/products/actions/delete-product-primary-image-action";
import { deleteProductVariantAction } from "@/features/admin/products/actions/delete-product-variant-action";
import { createProductImageAction } from "@/features/admin/products/actions/create-product-image-action";
import { createProductVariantAction } from "@/features/admin/products/actions/create-product-variant-action";
import { deleteVariantPrimaryImageAction } from "@/features/admin/products/actions/delete-variant-primary-image-action";
import { setProductPrimaryImageAction } from "@/features/admin/products/actions/set-product-primary-image-action";
import { setVariantPrimaryImageAction } from "@/features/admin/products/actions/set-variant-primary-image-action";
import { updateProductAction } from "@/features/admin/products/actions/update-product-action";
import { updateProductImageAction } from "@/features/admin/products/actions/update-product-image-action";
import { updateSimpleProductOfferAction } from "@/features/admin/products/actions/update-simple-product-offer-action";
import { updateProductVariantAction } from "@/features/admin/products/actions/update-product-variant-action";
import { getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getProductStatusLabel(status: "draft" | "published"): string {
  return status === "published" ? "Publié" : "Brouillon";
}

function getProductStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Produit créé avec succès.";
    case "updated":
      return "Produit mis à jour avec succès.";
    default:
      return null;
  }
}

function getProductErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_name":
      return "Le nom du produit est obligatoire.";
    case "missing_slug":
      return "Le slug du produit est obligatoire.";
    case "invalid_slug":
      return "Renseignez un slug produit valide.";
    case "invalid_status":
      return "Le statut du produit est invalide.";
    case "invalid_product_type":
      return "Le type de produit est invalide.";
    case "invalid_category_ids":
      return "Une ou plusieurs catégories sélectionnées sont invalides.";
    case "slug_taken":
      return "Ce slug est déjà utilisé par un autre produit.";
    case "simple_product_requires_single_variant":
      return "Un produit simple ne peut avoir qu'une seule déclinaison.";
    case "save_failed":
      return "Le produit n'a pas pu être enregistré.";
    default:
      return null;
  }
}

function getVariantStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Déclinaison créée avec succès.";
    case "updated":
      return "Déclinaison mise à jour avec succès.";
    case "deleted":
      return "Déclinaison supprimée avec succès.";
    default:
      return null;
  }
}

function getSimpleOfferStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "Les informations de vente ont été mises à jour avec succès.";
    default:
      return null;
  }
}

function getSimpleOfferErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_sku":
      return "Le SKU est obligatoire.";
    case "missing_price":
      return "Le prix est obligatoire.";
    case "invalid_price":
      return "Renseignez un prix valide.";
    case "invalid_compare_at_price":
      return "Renseignez un prix barré valide.";
    case "compare_at_price_below_price":
      return "Le prix barré doit être supérieur ou égal au prix.";
    case "missing_stock_quantity":
      return "Le stock disponible est obligatoire.";
    case "invalid_stock_quantity":
      return "Renseignez un stock disponible entier positif ou nul.";
    case "sku_taken":
      return "Cette référence est déjà utilisée par une autre déclinaison.";
    case "simple_product_offer_requires_simple_product":
      return "Cette édition est réservée aux produits simples.";
    case "simple_product_multiple_legacy_variants":
      return "Ce produit simple est incohérent car plusieurs déclinaisons sont encore associées. Corrigez d'abord cet état dans les données existantes avant de modifier les informations de vente.";
    case "save_failed":
      return "Les informations de vente n'ont pas pu être enregistrées.";
    default:
      return null;
  }
}

function getVariantErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_variant":
      return "La déclinaison demandée est introuvable.";
    case "missing_variant_name":
      return "Le nom de la déclinaison est obligatoire.";
    case "missing_color_name":
      return "Le nom de couleur est obligatoire.";
    case "invalid_color_hex":
      return "Renseignez un code couleur hexadécimal valide.";
    case "missing_sku":
      return "Le SKU est obligatoire.";
    case "missing_price":
      return "Le prix est obligatoire.";
    case "invalid_price":
      return "Renseignez un prix valide.";
    case "invalid_compare_at_price":
      return "Renseignez un prix barré valide.";
    case "compare_at_price_below_price":
      return "Le prix barré doit être supérieur ou égal au prix.";
    case "missing_stock_quantity":
      return "Le stock disponible est obligatoire.";
    case "invalid_stock_quantity":
      return "Renseignez un stock disponible entier positif ou nul.";
    case "invalid_variant_status":
      return "Le statut de la déclinaison est invalide.";
    case "sku_taken":
      return "Cette référence est déjà utilisée par une autre déclinaison.";
    case "simple_product_single_variant_only":
      return "Un produit simple ne peut avoir qu'une seule déclinaison.";
    case "simple_product_requires_sellable_variant":
      return "Un produit simple doit conserver sa déclinaison existante unique.";
    case "save_failed":
      return "La déclinaison n'a pas pu être enregistrée.";
    case "delete_failed":
      return "La déclinaison n'a pas pu être supprimée.";
    default:
      return null;
  }
}

function getAvailabilityLabel(isAvailable: boolean): string {
  return isAvailable ? "Disponible" : "Temporairement indisponible";
}

function getDetailSellableCountLabel(input: {
  productType: "simple" | "variable";
  variantCount: number;
  simpleOffer: {
    sku: string;
    price: string;
    compareAtPrice: string | null;
    stockQuantity: number;
    isAvailable: boolean;
  } | null;
  fallbackLabel: string;
}): string {
  if (input.productType !== "simple") {
    return input.fallbackLabel;
  }

  if (input.variantCount > 1) {
    return "État à vérifier";
  }

  if (input.simpleOffer !== null) {
    return "Informations de vente prêtes";
  }

  return input.variantCount === 0
    ? "Informations de vente à compléter"
    : "Informations de vente à vérifier";
}

function getImageStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Image enregistrée avec succès.";
    case "updated":
      return "Image mise à jour avec succès.";
    case "deleted":
      return "Image supprimée avec succès.";
    case "primary_updated":
      return "Image principale enregistrée avec succès.";
    case "primary_deleted":
      return "Image principale supprimée avec succès.";
    default:
      return null;
  }
}

function getImageErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_media_asset":
      return "Sélectionnez un média existant.";
    case "invalid_media_asset":
      return "Le média sélectionné est invalide.";
    case "invalid_variant":
      return "La déclinaison sélectionnée est invalide.";
    case "invalid_sort_order":
      return "Le tri d'image doit être un entier positif ou nul.";
    case "media_missing":
      return "Le média sélectionné est introuvable.";
    case "variant_missing":
      return "La déclinaison sélectionnée n'appartient pas à ce produit.";
    case "missing_image":
      return "L'image demandée est introuvable.";
    case "save_failed":
      return "L'image n'a pas pu être enregistrée.";
    case "delete_failed":
      return "L'image n'a pas pu être supprimée.";
    default:
      return null;
  }
}

function getDeleteErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "referenced":
      return "Ce produit ne peut pas être supprimé car il est encore référencé ailleurs.";
    case "delete_failed":
      return "Le produit n'a pas pu être supprimé.";
    default:
      return null;
  }
}

function getImageUrl(
  uploadsPublicPath: string,
  filePath: string | null
): string | null {
  if (typeof filePath !== "string") {
    return null;
  }

  const normalizedFilePath = filePath.trim().replace(/^\/+/, "");

  if (normalizedFilePath.length === 0) {
    return null;
  }

  return `${uploadsPublicPath}/${normalizedFilePath}`;
}

function groupVariantImages(
  images: AdminProductImage[]
): Map<string, AdminProductImage[]> {
  const groupedImages = new Map<string, AdminProductImage[]>();

  for (const image of images) {
    if (image.variantId === null) {
      continue;
    }

    const existingImages = groupedImages.get(image.variantId) ?? [];
    existingImages.push(image);
    groupedImages.set(image.variantId, existingImages);
  }

  return groupedImages;
}

function getPrimaryImageState(images: AdminProductImage[]): {
  primaryImage: AdminProductImage | null;
  displayImage: AdminProductImage | null;
  extraImageCount: number;
  usesFallbackImage: boolean;
} {
  const primaryImage = images.find((image) => image.isPrimary) ?? null;
  const displayImage = primaryImage ?? images[0] ?? null;

  return {
    primaryImage,
    displayImage,
    extraImageCount: displayImage === null ? 0 : Math.max(images.length - 1, 0),
    usesFallbackImage: primaryImage === null && displayImage !== null
  };
}

function findMediaAssetByFilePath(
  mediaAssets: AdminMediaAsset[],
  filePath: string | null
): AdminMediaAsset | null {
  if (typeof filePath !== "string") {
    return null;
  }

  return mediaAssets.find((mediaAsset) => mediaAsset.filePath === filePath) ?? null;
}

function isCategoryAssigned(
  assignedCategories: AdminProductCategoryAssignment[],
  categoryId: string
): boolean {
  return assignedCategories.some((category) => category.id === categoryId);
}

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
      <img alt={image.altText ?? "Image produit"} src={imageUrl} />
    </div>
  );
}

function getSimpleOfferFormDefaults(product: {
  simpleOfferFields: {
    sku: string | null;
    price: string | null;
    compareAtPrice: string | null;
    stockQuantity: number | null;
  };
  simpleOffer: {
    sku: string;
    price: string;
    compareAtPrice: string | null;
    stockQuantity: number;
    isAvailable: boolean;
  } | null;
}) {
  return {
    sku: product.simpleOfferFields.sku ?? product.simpleOffer?.sku ?? "",
    price: product.simpleOfferFields.price ?? product.simpleOffer?.price ?? "",
    compareAtPrice:
      product.simpleOfferFields.compareAtPrice ??
      product.simpleOffer?.compareAtPrice ??
      "",
    stockQuantity: String(
      product.simpleOfferFields.stockQuantity ?? product.simpleOffer?.stockQuantity ?? 0
    )
  };
}

export default async function ProductDetailPage({
  params,
  searchParams
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await findAdminProductById(id);

  if (product === null) {
    notFound();
  }

  const [categories, variants, images, mediaAssets, resolvedSearchParams] =
    await Promise.all([
      listAdminCategories(),
      listAdminProductVariants(product.id),
      listAdminProductImages(product.id),
      listAdminMediaAssets(),
      searchParams
    ]);

  const uploadsPublicPath = getUploadsPublicPath();
  const parentImages = images.filter((image) => image.variantId === null);
  const variantImagesById = groupVariantImages(images);
  const productPrimaryImageState = getPrimaryImageState(parentImages);
  const currentProductPrimaryMediaAsset = findMediaAssetByFilePath(
    mediaAssets,
    productPrimaryImageState.displayImage?.filePath ?? null
  );
  const imageScope = readSearchParam(resolvedSearchParams, "image_scope");
  const productStatusMessage = getProductStatusMessage(
    readSearchParam(resolvedSearchParams, "product_status")
  );
  const productErrorMessage = getProductErrorMessage(
    readSearchParam(resolvedSearchParams, "product_error")
  );
  const variantStatusMessage = getVariantStatusMessage(
    readSearchParam(resolvedSearchParams, "variant_status")
  );
  const variantErrorMessage = getVariantErrorMessage(
    readSearchParam(resolvedSearchParams, "variant_error")
  );
  const simpleOfferStatusMessage = getSimpleOfferStatusMessage(
    readSearchParam(resolvedSearchParams, "simple_offer_status")
  );
  const simpleOfferErrorMessage = getSimpleOfferErrorMessage(
    readSearchParam(resolvedSearchParams, "simple_offer_error")
  );
  const imageStatusMessage = getImageStatusMessage(
    readSearchParam(resolvedSearchParams, "image_status")
  );
  const imageErrorMessage = getImageErrorMessage(
    readSearchParam(resolvedSearchParams, "image_error")
  );
  const deleteErrorMessage = getDeleteErrorMessage(
    readSearchParam(resolvedSearchParams, "delete_error")
  );
  const hasMediaAssets = mediaAssets.length > 0;
  const productImageMessage =
    imageScope !== "variant"
      ? {
          status: imageStatusMessage,
          error: imageErrorMessage
        }
      : {
          status: null,
          error: null
        };
  const variantImageMessage =
    imageScope === "variant"
      ? {
          status: imageStatusMessage,
          error: imageErrorMessage
        }
      : {
          status: null,
          error: null
        };
  const productPresentation = getAdminProductPresentation(
    product.productType,
    variants.length
  );
  const isSimpleProduct = product.productType === "simple";
  const detailSellableCountLabel = getDetailSellableCountLabel({
    productType: product.productType,
    variantCount: variants.length,
    simpleOffer: product.simpleOffer,
    fallbackLabel: productPresentation.sellableCountLabel
  });
  const simpleProductHasNoLegacyVariant = isSimpleProduct && variants.length === 0;
  const simpleProductHasSingleLegacyVariant = isSimpleProduct && variants.length === 1;
  const simpleProductHasInconsistentVariantCount =
    isSimpleProduct && variants.length > 1;
  const showSimpleOfferForm =
    isSimpleProduct && !simpleProductHasInconsistentVariantCount;
  const showLegacyVariantCompatibilityBlock =
    isSimpleProduct && variants.length > 0;
  const showVariantCreateForm = !isSimpleProduct;
  const simpleOfferFormDefaults = isSimpleProduct
    ? getSimpleOfferFormDefaults(product)
    : null;

  return (
    <div className="admin-product-detail">
      <section className="section admin-product-section">
        <PageHeader
          actions={
            <Link className="link-subtle button" href="/admin/products">
              Retour à la liste
            </Link>
          }
          description={
            <>
              Commencez par les informations générales, puis complétez les
              informations de vente ou les déclinaisons selon le type du
              produit.
            </>
          }
          eyebrow="Produits"
          title="Modifier le produit"
        />

        <div className="admin-product-tags">
          <span className="admin-chip">{getProductStatusLabel(product.status)}</span>
          <span className="admin-chip">{productPresentation.typeLabel}</span>
          <span className="admin-chip">
            {product.isFeatured ? "Mis en avant" : "Standard"}
          </span>
          <span className="admin-chip">
            {product.categories.length} catégorie
            {product.categories.length > 1 ? "s" : ""}
          </span>
          <span className="admin-chip">{detailSellableCountLabel}</span>
        </div>
      </section>

      <section className="section admin-product-section">
        <SectionIntro
          className="stack"
          description="Modifiez ici le catalogue, le texte public et la publication du produit."
          eyebrow="Informations générales"
          title="Informations produit"
        />

        {productStatusMessage ? (
          <Notice tone="success">{productStatusMessage}</Notice>
        ) : null}
        {productErrorMessage ? (
          <Notice tone="alert">{productErrorMessage}</Notice>
        ) : null}

        <form action={updateProductAction} className="admin-form admin-product-form">
          <input name="productId" type="hidden" value={product.id} />

          <label className="admin-field">
            <span className="meta-label">Nom</span>
            <input
              className="admin-input"
              defaultValue={product.name}
              name="name"
              required
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Slug</span>
            <input
              className="admin-input"
              defaultValue={product.slug}
              name="slug"
              required
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Description courte</span>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={product.shortDescription ?? ""}
              name="shortDescription"
              rows={3}
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Description</span>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={product.description ?? ""}
              name="description"
              rows={6}
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Titre SEO</span>
            <input
              className="admin-input"
              defaultValue={product.seoTitle ?? ""}
              name="seoTitle"
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Description SEO</span>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={product.seoDescription ?? ""}
              name="seoDescription"
              rows={3}
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Statut</span>
            <select className="admin-input" defaultValue={product.status} name="status">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </label>

          <label className="admin-field">
            <span className="meta-label">Type de produit</span>
            <select
              className="admin-input"
              defaultValue={product.productType}
              name="productType"
            >
              <option value="simple">Produit simple</option>
              <option value="variable">Produit avec déclinaisons</option>
            </select>
          </label>

          <fieldset className="admin-fieldset">
            <legend className="meta-label">Catégories associées</legend>

            {categories.length > 0 ? (
              <div className="admin-checkbox-grid">
                {categories.map((category) => (
                  <label className="admin-checkbox" key={category.id}>
                    <input
                      defaultChecked={isCategoryAssigned(product.categories, category.id)}
                      name="categoryIds"
                      type="checkbox"
                      value={category.id}
                    />
                    <span>
                      {category.name}
                      <span className="card-meta"> · {category.slug}</span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="card-copy">
                Aucune catégorie n&apos;est encore disponible pour ce produit.
              </p>
            )}
          </fieldset>

          <label className="admin-checkbox">
            <input
              defaultChecked={product.isFeatured}
              name="isFeatured"
              type="checkbox"
              value="on"
            />
            <span>Mettre ce produit en avant</span>
          </label>

          <div className="admin-actions">
            <Button className="button" type="submit">
              Enregistrer le produit
            </Button>
          </div>
        </form>
      </section>

      <section className="section admin-product-section">
        <SectionIntro
          className="stack"
          description="Commencez par l'image principale du produit. Les réglages d'images plus détaillés restent disponibles plus bas si nécessaire."
          eyebrow="Images produit"
          title="Images du produit"
        />

        {productImageMessage.status ? (
          <Notice tone="success">{productImageMessage.status}</Notice>
        ) : null}
        {productImageMessage.error ? (
          <Notice tone="alert">{productImageMessage.error}</Notice>
        ) : null}

        <div className="admin-product-subsection">
          <SectionIntro
            className="stack"
            description="Choisissez ici le visuel principal affiché pour ce produit."
            eyebrow="Image principale"
            title="Image principale du produit"
            titleAs="h3"
          />

          {productPrimaryImageState.displayImage ? (
            renderImagePreview(
              uploadsPublicPath,
              productPrimaryImageState.displayImage
            )
          ) : (
            <div className="admin-image-preview admin-image-placeholder">
              Aucune image principale définie pour ce produit.
            </div>
          )}

          {productPrimaryImageState.usesFallbackImage ? (
            <Notice tone="note">
              Aucune image principale du produit n&apos;est encore définie. Une
              image existante reste associée au produit, mais elle n&apos;est
              pas encore marquée comme principale.
            </Notice>
          ) : null}

          {productPrimaryImageState.extraImageCount > 0 ? (
            <Notice tone="note">
              {productPrimaryImageState.extraImageCount} image
              {productPrimaryImageState.extraImageCount > 1 ? "s" : ""}{" "}
              supplémentaire
              {productPrimaryImageState.extraImageCount > 1 ? "s restent" : " reste"}{" "}
              associée
              {productPrimaryImageState.extraImageCount > 1 ? "s" : ""} à ce
              produit. Ce lot reste centré sur l&apos;image principale.
            </Notice>
          ) : null}

          {hasMediaAssets ? (
            <form
              action={setProductPrimaryImageAction}
              className="admin-form admin-product-form"
            >
              <input name="productId" type="hidden" value={product.id} />

              <label className="admin-field">
                <span className="meta-label">Média existant</span>
                <select
                  className="admin-input"
                  defaultValue={currentProductPrimaryMediaAsset?.id ?? ""}
                  name="mediaAssetId"
                >
                  <option disabled value="">
                    Sélectionnez un média
                  </option>
                  {mediaAssets.map((mediaAsset) => (
                    <option key={mediaAsset.id} value={mediaAsset.id}>
                      {mediaAsset.originalName} · {mediaAsset.mimeType}
                    </option>
                  ))}
                </select>
              </label>

              <div className="admin-inline-actions">
                <button className="button" type="submit">
                  {productPrimaryImageState.primaryImage
                    ? "Remplacer l'image principale"
                    : "Définir l'image principale"}
                </button>
              </div>
            </form>
          ) : (
            <Notice tone="note">
              Aucun média n&apos;est disponible. Ajoutez d&apos;abord une image dans{" "}
              <Link className="link" href="/admin/media">
                la bibliothèque médias
              </Link>
              .
            </Notice>
          )}

          {productPrimaryImageState.primaryImage ? (
            <form action={deleteProductPrimaryImageAction}>
              <input name="productId" type="hidden" value={product.id} />

              <button className="button link-subtle" type="submit">
                Supprimer l&apos;image principale
              </button>
            </form>
          ) : null}
        </div>

        <div className="admin-product-subsection">
          <SectionIntro
            className="stack"
            description="Les autres images associées et leurs réglages restent disponibles ici si vous devez intervenir plus finement."
            eyebrow="Réglages complémentaires"
            title="Images associées"
            titleAs="h3"
          />

        {hasMediaAssets ? (
          <form action={createProductImageAction} className="admin-form admin-product-form">
            <input name="productId" type="hidden" value={product.id} />
            <input name="variantId" type="hidden" value="" />
            <input name="imageScope" type="hidden" value="product" />

            <label className="admin-field">
              <span className="meta-label">Média existant</span>
              <select className="admin-input" defaultValue="" name="mediaAssetId">
                <option disabled value="">
                  Sélectionnez un média
                </option>
                {mediaAssets.map((mediaAsset) => (
                  <option key={mediaAsset.id} value={mediaAsset.id}>
                    {mediaAsset.originalName} · {mediaAsset.mimeType}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-field">
              <span className="meta-label">Texte alternatif</span>
              <input className="admin-input" name="altText" type="text" />
            </label>

            <label className="admin-field">
              <span className="meta-label">Ordre</span>
              <input className="admin-input" defaultValue="0" name="sortOrder" type="number" />
            </label>

            <label className="admin-checkbox">
              <input name="isPrimary" type="checkbox" value="on" />
              <span>Définir comme image principale du produit</span>
            </label>

            <div className="admin-actions">
              <button className="button" type="submit">
                Ajouter une image produit
              </button>
            </div>
          </form>
        ) : (
          <Notice tone="note">
            Aucun média n&apos;est disponible. Ajoutez d&apos;abord une image dans{" "}
            <Link className="link" href="/admin/media">
              la bibliothèque médias
            </Link>
            .
          </Notice>
        )}

        {parentImages.length > 0 ? (
          <div className="admin-record-list">
            {parentImages.map((image) => (
              <article className="store-card admin-image-card" key={image.id}>
                {renderImagePreview(uploadsPublicPath, image)}

                <div className="stack">
                  <div className="admin-product-tags">
                    <span className="admin-chip">
                      {image.isPrimary ? "Image principale" : "Image secondaire"}
                    </span>
                    <span className="admin-chip">Ordre {image.sortOrder}</span>
                  </div>
                  <p className="card-meta">{image.filePath}</p>
                </div>

                <form
                  action={updateProductImageAction}
                  className="admin-form admin-record-form"
                >
                  <input name="productId" type="hidden" value={product.id} />
                  <input name="imageId" type="hidden" value={image.id} />
                  <input name="imageScope" type="hidden" value="product" />

                  <label className="admin-field">
                    <span className="meta-label">Texte alternatif</span>
                    <input
                      className="admin-input"
                      defaultValue={image.altText ?? ""}
                      name="altText"
                      type="text"
                    />
                  </label>

                  <label className="admin-field">
                    <span className="meta-label">Ordre</span>
                    <input
                      className="admin-input"
                      defaultValue={String(image.sortOrder)}
                      name="sortOrder"
                      type="number"
                    />
                  </label>

                  <label className="admin-checkbox">
                    <input
                      defaultChecked={image.isPrimary}
                      name="isPrimary"
                      type="checkbox"
                      value="on"
                    />
                    <span>Image principale produit</span>
                  </label>

                  <div className="admin-inline-actions">
                    <button className="button" type="submit">
                      Mettre à jour l&apos;image
                    </button>
                  </div>
                </form>

                <form action={deleteProductImageAction}>
                  <input name="productId" type="hidden" value={product.id} />
                  <input name="imageId" type="hidden" value={image.id} />
                  <input name="imageScope" type="hidden" value="product" />

                  <button className="button link-subtle" type="submit">
                    Supprimer l&apos;image
                  </button>
                </form>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Aucune image</p>
            <h2>Le produit n&apos;a pas encore d&apos;image</h2>
            <p className="card-copy">
              Associez un média existant pour afficher une image principale ou
              secondaire.
            </p>
          </div>
        )}
        </div>
      </section>

      <section className="section admin-product-section">
        <SectionIntro
          className="stack"
          description={
            isSimpleProduct
              ? "Complétez ici la référence, le prix, le prix barré et le stock du produit simple."
              : productPresentation.sectionDescription
          }
          eyebrow={
            isSimpleProduct ? "Produit simple" : productPresentation.sectionEyebrow
          }
          title={
            isSimpleProduct ? "Informations de vente" : productPresentation.sectionTitle
          }
        />

        {isSimpleProduct ? (
          <>
            {simpleOfferStatusMessage ? (
              <Notice tone="success">{simpleOfferStatusMessage}</Notice>
            ) : null}
            {simpleOfferErrorMessage ? (
              <Notice tone="alert">{simpleOfferErrorMessage}</Notice>
            ) : null}
            {simpleProductHasInconsistentVariantCount ? (
              <Notice tone="alert">
                Plusieurs déclinaisons sont encore associées à ce produit
                simple. Corrigez d&apos;abord cet état dans les données
                existantes avant de modifier les informations de vente.
              </Notice>
            ) : null}
            {showSimpleOfferForm && simpleOfferFormDefaults ? (
              <>
                {product.simpleOffer ? (
                  <Notice tone="note">
                    Disponibilité actuelle :{" "}
                    {getAvailabilityLabel(product.simpleOffer.isAvailable)}
                  </Notice>
                ) : null}
                {simpleProductHasNoLegacyVariant ? (
                  <Notice tone="note">
                    Vous pouvez enregistrer les informations de vente ici. Pour
                    le moment, l&apos;affichage public de ce produit reste
                    limité tant qu&apos;aucune déclinaison existante n&apos;est
                    associée.
                  </Notice>
                ) : null}
                {simpleProductHasSingleLegacyVariant ? (
                  <Notice tone="note">
                    Les informations commerciales saisies ici restent
                    synchronisées avec l&apos;unique déclinaison déjà
                    enregistrée. Les autres réglages de cette déclinaison
                    restent disponibles plus bas sur la page.
                  </Notice>
                ) : null}

                <form
                  action={updateSimpleProductOfferAction}
                  className="admin-form admin-product-form"
                >
                  <input name="productId" type="hidden" value={product.id} />

                  <fieldset className="admin-fieldset">
                    <legend className="meta-label">
                      Informations de vente
                    </legend>

                    <label className="admin-field">
                      <span className="meta-label">SKU</span>
                      <input
                        className="admin-input"
                        defaultValue={simpleOfferFormDefaults.sku}
                        name="sku"
                        required
                        type="text"
                      />
                    </label>

                    <label className="admin-field">
                      <span className="meta-label">Prix</span>
                      <input
                        className="admin-input"
                        defaultValue={simpleOfferFormDefaults.price}
                        inputMode="decimal"
                        name="price"
                        required
                        type="text"
                      />
                    </label>

                    <label className="admin-field">
                      <span className="meta-label">Prix barré</span>
                      <input
                        className="admin-input"
                        defaultValue={simpleOfferFormDefaults.compareAtPrice}
                        inputMode="decimal"
                        name="compareAtPrice"
                        type="text"
                      />
                    </label>

                    <label className="admin-field">
                      <span className="meta-label">Stock disponible</span>
                      <input
                        className="admin-input"
                        defaultValue={simpleOfferFormDefaults.stockQuantity}
                        min="0"
                        name="stockQuantity"
                        required
                        step="1"
                        type="number"
                      />
                    </label>
                  </fieldset>

                  <div className="admin-actions">
                    <Button className="button" type="submit">
                      Enregistrer les informations de vente
                    </Button>
                  </div>
                </form>
              </>
            ) : null}
            {showLegacyVariantCompatibilityBlock ? (
              <div className="admin-product-subsection">
                <SectionIntro
                  className="stack"
                  description="Ce bloc rassemble les données déjà enregistrées. Utilisez-le seulement pour vérifier l'existant ou terminer une correction manuelle."
                  eyebrow="Données existantes"
                  title={
                    variants.length > 1
                      ? "Déclinaisons existantes"
                      : "Déclinaison existante"
                  }
                  titleAs="h3"
                />

                {variantStatusMessage ? (
                  <Notice tone="success">{variantStatusMessage}</Notice>
                ) : null}
                {variantErrorMessage ? (
                  <Notice tone="alert">{variantErrorMessage}</Notice>
                ) : null}
                {variantImageMessage.status ? (
                  <Notice tone="success">{variantImageMessage.status}</Notice>
                ) : null}
                {variantImageMessage.error ? (
                  <Notice tone="alert">{variantImageMessage.error}</Notice>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <>
            {variantStatusMessage ? (
              <Notice tone="success">{variantStatusMessage}</Notice>
            ) : null}
            {variantErrorMessage ? (
              <Notice tone="alert">{variantErrorMessage}</Notice>
            ) : null}
            {variantImageMessage.status ? (
              <Notice tone="success">{variantImageMessage.status}</Notice>
            ) : null}
            {variantImageMessage.error ? (
              <Notice tone="alert">{variantImageMessage.error}</Notice>
            ) : null}
            <Notice tone="note">
              Gérez ici les déclinaisons et leurs informations de vente.
            </Notice>
          </>
        )}

        {showVariantCreateForm ? (
          <form
            action={createProductVariantAction}
            className="admin-form admin-product-form"
          >
          <input name="productId" type="hidden" value={product.id} />

          <fieldset className="admin-fieldset">
            <legend className="meta-label">
              {productPresentation.saleFieldsetLegend}
            </legend>

            <label className="admin-field">
              <span className="meta-label">SKU</span>
              <input className="admin-input" name="sku" required type="text" />
            </label>

            <label className="admin-field">
              <span className="meta-label">Prix</span>
              <input
                className="admin-input"
                inputMode="decimal"
                name="price"
                required
                type="text"
              />
            </label>

            <label className="admin-field">
              <span className="meta-label">Prix barré</span>
              <input
                className="admin-input"
                inputMode="decimal"
                name="compareAtPrice"
                type="text"
              />
            </label>

            <label className="admin-field">
              <span className="meta-label">Statut</span>
              <select className="admin-input" defaultValue="draft" name="status">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </label>

            <label className="admin-field">
              <span className="meta-label">Stock disponible</span>
              <input
                className="admin-input"
                defaultValue="0"
                min="0"
                name="stockQuantity"
                required
                step="1"
                type="number"
              />
            </label>
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend className="meta-label">Informations de la déclinaison</legend>

              <label className="admin-field">
                <span className="meta-label">Nom de la déclinaison</span>
                <input className="admin-input" name="name" required type="text" />
              </label>

            <label className="admin-field">
              <span className="meta-label">Nom de couleur</span>
              <input className="admin-input" name="colorName" required type="text" />
            </label>

            <label className="admin-field">
              <span className="meta-label">Code couleur</span>
              <input className="admin-input" name="colorHex" placeholder="#C19A6B" type="text" />
            </label>

            <label className="admin-checkbox">
              <input name="isDefault" type="checkbox" value="on" />
              <span>Définir comme déclinaison par défaut</span>
            </label>
          </fieldset>

          <div className="admin-actions">
            <button className="button" type="submit">
              {productPresentation.createActionLabel}
            </button>
          </div>
          </form>
        ) : null}

        {variants.length > 0 ? (
          <div className="variant-list admin-record-list">
            {variants.map((variant) => {
              const variantImages = variantImagesById.get(variant.id) ?? [];
              const variantPrimaryImageState = getPrimaryImageState(variantImages);
              const currentVariantPrimaryMediaAsset = findMediaAssetByFilePath(
                mediaAssets,
                variantPrimaryImageState.displayImage?.filePath ?? null
              );

              return (
                <article className="variant-card admin-variant-card" key={variant.id}>
                  <div className="stack">
                    <p className="meta-label">
                      {isSimpleProduct
                        ? "Déclinaison existante"
                        : productPresentation.itemKicker}
                    </p>
                    <div className="admin-product-tags">
                      <span className="admin-chip">{variant.colorName}</span>
                      <span className="admin-chip">
                        {variant.isDefault ? "Déclinaison par défaut" : "Déclinaison secondaire"}
                      </span>
                      <span className="admin-chip">
                        {getProductStatusLabel(variant.status)}
                      </span>
                    </div>
                    <h3>{variant.name}</h3>
                    <p className="variant-meta">
                      SKU {variant.sku}
                      {variant.colorHex ? ` · ${variant.colorHex}` : ""}
                    </p>
                    <p className="card-meta">
                      Disponibilité actuelle :{" "}
                      {getAvailabilityLabel(variant.isAvailable)}
                    </p>
                  </div>

                  <form
                    action={updateProductVariantAction}
                    className="admin-form admin-record-form"
                  >
                    <input name="productId" type="hidden" value={product.id} />
                    <input name="variantId" type="hidden" value={variant.id} />

                    <fieldset className="admin-fieldset">
                      <legend className="meta-label">
                        {isSimpleProduct
                          ? "Informations commerciales existantes"
                          : productPresentation.saleFieldsetLegend}
                      </legend>

                      <label className="admin-field">
                        <span className="meta-label">SKU</span>
                        <input
                          className="admin-input"
                          defaultValue={variant.sku}
                          name="sku"
                          required
                          type="text"
                        />
                      </label>

                      <label className="admin-field">
                        <span className="meta-label">Prix</span>
                        <input
                          className="admin-input"
                          defaultValue={variant.price}
                          inputMode="decimal"
                          name="price"
                          required
                          type="text"
                        />
                      </label>

                      <label className="admin-field">
                        <span className="meta-label">Prix barré</span>
                        <input
                          className="admin-input"
                          defaultValue={variant.compareAtPrice ?? ""}
                          inputMode="decimal"
                          name="compareAtPrice"
                          type="text"
                        />
                      </label>

                      <label className="admin-field">
                        <span className="meta-label">Statut</span>
                        <select
                          className="admin-input"
                          defaultValue={variant.status}
                          name="status"
                        >
                          <option value="draft">Brouillon</option>
                          <option value="published">Publié</option>
                        </select>
                      </label>

                      <label className="admin-field">
                        <span className="meta-label">Stock disponible</span>
                        <input
                          className="admin-input"
                          defaultValue={variant.stockQuantity}
                          min="0"
                          name="stockQuantity"
                          required
                          step="1"
                          type="number"
                        />
                      </label>
                    </fieldset>

                    <fieldset className="admin-fieldset">
                      <legend className="meta-label">Informations de la déclinaison</legend>

                      <label className="admin-field">
                        <span className="meta-label">Nom de la déclinaison</span>
                        <input
                          className="admin-input"
                          defaultValue={variant.name}
                          name="name"
                          required
                          type="text"
                        />
                      </label>

                      <label className="admin-field">
                        <span className="meta-label">Nom de couleur</span>
                        <input
                          className="admin-input"
                          defaultValue={variant.colorName}
                          name="colorName"
                          required
                          type="text"
                        />
                      </label>

                      <label className="admin-field">
                        <span className="meta-label">Code couleur</span>
                        <input
                          className="admin-input"
                          defaultValue={variant.colorHex ?? ""}
                          name="colorHex"
                          placeholder="#C19A6B"
                          type="text"
                        />
                      </label>

                      <label className="admin-checkbox">
                        <input
                          defaultChecked={variant.isDefault}
                          name="isDefault"
                          type="checkbox"
                          value="on"
                        />
                        <span>Déclinaison par défaut</span>
                      </label>
                    </fieldset>

                    <div className="admin-inline-actions">
                      <button className="button" type="submit">
                        {isSimpleProduct
                          ? "Enregistrer la déclinaison existante"
                          : productPresentation.saveActionLabel}
                      </button>
                    </div>
                  </form>

                  <form action={deleteProductVariantAction}>
                    <input name="productId" type="hidden" value={product.id} />
                    <input name="variantId" type="hidden" value={variant.id} />

                    <button className="button link-subtle" type="submit">
                      {isSimpleProduct
                        ? "Supprimer la déclinaison existante"
                        : productPresentation.deleteActionLabel}
                    </button>
                  </form>

                  <div className="admin-product-subsection">
                    <div className="stack">
                      <p className="eyebrow">
                        {isSimpleProduct
                          ? "Images existantes"
                          : productPresentation.imagesEyebrow}
                      </p>
                      <h3>
                        {isSimpleProduct
                          ? "Images de la déclinaison existante"
                          : `Images pour ${variant.colorName}`}
                      </h3>
                      <p className="card-copy">
                        Commencez par l&apos;image principale de cette
                        déclinaison. Les autres réglages d&apos;images restent
                        disponibles plus bas si nécessaire.
                      </p>
                    </div>

                    <div className="admin-product-subsection">
                      <SectionIntro
                        className="stack"
                        description="Choisissez ici le visuel principal affiché pour cette déclinaison."
                        eyebrow="Image principale"
                        title={
                          isSimpleProduct
                            ? "Image principale de la déclinaison existante"
                            : "Image principale de la déclinaison"
                        }
                        titleAs="h3"
                      />

                      {variantPrimaryImageState.displayImage ? (
                        renderImagePreview(
                          uploadsPublicPath,
                          variantPrimaryImageState.displayImage
                        )
                      ) : (
                        <div className="admin-image-preview admin-image-placeholder">
                          Aucune image principale définie pour cette déclinaison.
                        </div>
                      )}

                      {variantPrimaryImageState.usesFallbackImage ? (
                        <Notice tone="note">
                          Aucune image principale n&apos;est encore définie pour
                          cette déclinaison. Une image existante reste associée,
                          sans être marquée comme principale.
                        </Notice>
                      ) : null}

                      {variantPrimaryImageState.extraImageCount > 0 ? (
                        <Notice tone="note">
                          {variantPrimaryImageState.extraImageCount} image
                          {variantPrimaryImageState.extraImageCount > 1 ? "s" : ""}{" "}
                          supplémentaire
                          {variantPrimaryImageState.extraImageCount > 1
                            ? "s restent"
                            : " reste"}{" "}
                          associée
                          {variantPrimaryImageState.extraImageCount > 1 ? "s" : ""} à
                          cette déclinaison. Ce lot reste centré sur l&apos;image
                          principale.
                        </Notice>
                      ) : null}

                      {hasMediaAssets ? (
                        <form
                          action={setVariantPrimaryImageAction}
                          className="admin-form admin-record-form"
                        >
                          <input name="productId" type="hidden" value={product.id} />
                          <input name="variantId" type="hidden" value={variant.id} />

                          <label className="admin-field">
                            <span className="meta-label">Média existant</span>
                            <select
                              className="admin-input"
                              defaultValue={currentVariantPrimaryMediaAsset?.id ?? ""}
                              name="mediaAssetId"
                            >
                              <option disabled value="">
                                Sélectionnez un média
                              </option>
                              {mediaAssets.map((mediaAsset) => (
                                <option key={mediaAsset.id} value={mediaAsset.id}>
                                  {mediaAsset.originalName} · {mediaAsset.mimeType}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="admin-inline-actions">
                            <button className="button" type="submit">
                              {variantPrimaryImageState.primaryImage
                                ? "Remplacer l'image principale"
                                : "Définir l'image principale"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <Notice tone="note">
                          Aucun média n&apos;est disponible. Ajoutez d&apos;abord une
                          image dans{" "}
                          <Link className="link" href="/admin/media">
                            la bibliothèque médias
                          </Link>
                          .
                        </Notice>
                      )}

                      {variantPrimaryImageState.primaryImage ? (
                        <form action={deleteVariantPrimaryImageAction}>
                          <input name="productId" type="hidden" value={product.id} />
                          <input name="variantId" type="hidden" value={variant.id} />

                          <button className="button link-subtle" type="submit">
                            Supprimer l&apos;image principale
                          </button>
                        </form>
                      ) : null}
                    </div>

                    <div className="stack">
                      <p className="meta-label">Réglages complémentaires</p>
                      <p className="card-copy">
                        Les autres images associées et leurs réglages restent
                        disponibles ici si vous devez intervenir plus finement.
                      </p>
                    </div>

                    {hasMediaAssets ? (
                      <form
                        action={createProductImageAction}
                        className="admin-form admin-record-form"
                      >
                        <input name="productId" type="hidden" value={product.id} />
                        <input name="variantId" type="hidden" value={variant.id} />
                        <input name="imageScope" type="hidden" value="variant" />

                        <label className="admin-field">
                          <span className="meta-label">Média existant</span>
                          <select
                            className="admin-input"
                            defaultValue=""
                            name="mediaAssetId"
                          >
                            <option disabled value="">
                              Sélectionnez un média
                            </option>
                            {mediaAssets.map((mediaAsset) => (
                              <option key={mediaAsset.id} value={mediaAsset.id}>
                                {mediaAsset.originalName} · {mediaAsset.mimeType}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="admin-field">
                          <span className="meta-label">Texte alternatif</span>
                          <input className="admin-input" name="altText" type="text" />
                        </label>

                        <label className="admin-field">
                          <span className="meta-label">Ordre</span>
                          <input
                            className="admin-input"
                            defaultValue="0"
                            name="sortOrder"
                            type="number"
                          />
                        </label>

                        <label className="admin-checkbox">
                          <input name="isPrimary" type="checkbox" value="on" />
                          <span>Image principale de la déclinaison</span>
                        </label>

                        <div className="admin-actions">
                          <button className="button" type="submit">
                            Ajouter une image à la déclinaison
                          </button>
                        </div>
                      </form>
                    ) : (
                      <Notice tone="note">
                        Aucun média n&apos;est disponible. Ajoutez d&apos;abord une
                        image dans{" "}
                        <Link className="link" href="/admin/media">
                          la bibliothèque médias
                        </Link>
                        .
                      </Notice>
                    )}

                    {variantImages.length > 0 ? (
                      <div className="admin-record-list">
                        {variantImages.map((image) => (
                          <article className="store-card admin-image-card" key={image.id}>
                            {renderImagePreview(uploadsPublicPath, image)}

                            <div className="stack">
                              <div className="admin-product-tags">
                                <span className="admin-chip">
                                  {image.isPrimary
                                    ? "Image principale"
                                    : "Image secondaire"}
                                </span>
                                <span className="admin-chip">
                                  Ordre {image.sortOrder}
                                </span>
                              </div>
                              <p className="card-meta">{image.filePath}</p>
                            </div>

                            <form
                              action={updateProductImageAction}
                              className="admin-form admin-record-form"
                            >
                              <input name="productId" type="hidden" value={product.id} />
                              <input name="imageId" type="hidden" value={image.id} />
                              <input name="imageScope" type="hidden" value="variant" />

                              <label className="admin-field">
                                <span className="meta-label">Texte alternatif</span>
                                <input
                                  className="admin-input"
                                  defaultValue={image.altText ?? ""}
                                  name="altText"
                                  type="text"
                                />
                              </label>

                              <label className="admin-field">
                                <span className="meta-label">Ordre</span>
                                <input
                                  className="admin-input"
                                  defaultValue={String(image.sortOrder)}
                                  name="sortOrder"
                                  type="number"
                                />
                              </label>

                              <label className="admin-checkbox">
                                <input
                                  defaultChecked={image.isPrimary}
                                  name="isPrimary"
                                  type="checkbox"
                                  value="on"
                                />
                                <span>Image principale de la déclinaison</span>
                              </label>

                              <div className="admin-inline-actions">
                                <button className="button" type="submit">
                                  Mettre à jour l&apos;image
                                </button>
                              </div>
                            </form>

                            <form action={deleteProductImageAction}>
                              <input name="productId" type="hidden" value={product.id} />
                              <input name="imageId" type="hidden" value={image.id} />
                              <input name="imageScope" type="hidden" value="variant" />

                              <button className="button link-subtle" type="submit">
                                Supprimer l&apos;image
                              </button>
                            </form>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <Notice tone="note">
                        {isSimpleProduct
                          ? "Cette déclinaison existante n'a pas encore d'image associée."
                          : "Cette déclinaison n'a pas encore d'image associée."}
                      </Notice>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : !isSimpleProduct ? (
          <div className="empty-state">
            <p className="eyebrow">{productPresentation.emptyEyebrow}</p>
            <h2>{productPresentation.emptyTitle}</h2>
            <p className="card-copy">{productPresentation.emptyDescription}</p>
          </div>
        ) : null}
      </section>

      <section className="section admin-danger-zone">
        <SectionIntro
          className="stack"
          description="La suppression retire aussi les catégories associées, les déclinaisons et les images rattachées."
          eyebrow="Suppression"
          title="Supprimer ce produit"
        />

        {deleteErrorMessage ? (
          <Notice tone="alert">{deleteErrorMessage}</Notice>
        ) : null}

        <form action={deleteProductAction}>
          <input name="productId" type="hidden" value={product.id} />

          <Button className="button admin-danger-button" type="submit">
            Supprimer le produit
          </Button>
        </form>
      </section>
    </div>
  );
}
