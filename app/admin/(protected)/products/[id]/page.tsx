import Link from "next/link";
import { notFound } from "next/navigation";
import { listAdminMediaAssets } from "@/db/admin-media";
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
import { deleteProductVariantAction } from "@/features/admin/products/actions/delete-product-variant-action";
import { createProductImageAction } from "@/features/admin/products/actions/create-product-image-action";
import { createProductVariantAction } from "@/features/admin/products/actions/create-product-variant-action";
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
  return status === "published" ? "Publie" : "Brouillon";
}

function getProductStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Produit cree avec succes.";
    case "updated":
      return "Produit mis a jour avec succes.";
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
      return "Une ou plusieurs categories selectionnees sont invalides.";
    case "slug_taken":
      return "Ce slug est deja utilise par un autre produit.";
    case "simple_product_requires_single_variant":
      return "Un produit simple ne peut avoir qu'une seule declinaison vendable.";
    case "save_failed":
      return "Le produit n'a pas pu etre enregistre.";
    default:
      return null;
  }
}

function getVariantStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Variante creee avec succes.";
    case "updated":
      return "Variante mise a jour avec succes.";
    case "deleted":
      return "Variante supprimee avec succes.";
    default:
      return null;
  }
}

function getSimpleOfferStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "L'offre simple a ete mise a jour avec succes.";
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
      return "Renseignez un prix compare valide.";
    case "compare_at_price_below_price":
      return "Le prix compare doit etre superieur ou egal au prix.";
    case "missing_stock_quantity":
      return "Le stock disponible est obligatoire.";
    case "invalid_stock_quantity":
      return "Renseignez un stock disponible entier positif ou nul.";
    case "sku_taken":
      return "Ce SKU est deja utilise par une autre variante.";
    case "simple_product_offer_requires_simple_product":
      return "Cette edition native est reservee aux produits simples.";
    case "simple_product_multiple_legacy_variants":
      return "Ce produit simple est incoherent car plusieurs variantes legacy existent. Corrigez d'abord cet etat dans le bloc legacy.";
    case "save_failed":
      return "L'offre simple n'a pas pu etre enregistree.";
    default:
      return null;
  }
}

function getVariantErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_variant":
      return "La variante demandee est introuvable.";
    case "missing_variant_name":
      return "Le nom de la variante est obligatoire.";
    case "missing_color_name":
      return "Le nom de couleur est obligatoire.";
    case "invalid_color_hex":
      return "Renseignez un code couleur hexadecimal valide.";
    case "missing_sku":
      return "Le SKU est obligatoire.";
    case "missing_price":
      return "Le prix est obligatoire.";
    case "invalid_price":
      return "Renseignez un prix valide.";
    case "invalid_compare_at_price":
      return "Renseignez un prix compare valide.";
    case "compare_at_price_below_price":
      return "Le prix compare doit etre superieur ou egal au prix.";
    case "missing_stock_quantity":
      return "Le stock disponible est obligatoire.";
    case "invalid_stock_quantity":
      return "Renseignez un stock disponible entier positif ou nul.";
    case "invalid_variant_status":
      return "Le statut de la variante est invalide.";
    case "sku_taken":
      return "Ce SKU est deja utilise par une autre variante.";
    case "simple_product_single_variant_only":
      return "Un produit simple ne peut avoir qu'une seule declinaison vendable.";
    case "simple_product_requires_sellable_variant":
      return "Un produit simple doit conserver son offre vendable unique.";
    case "save_failed":
      return "La variante n'a pas pu etre enregistree.";
    case "delete_failed":
      return "La variante n'a pas pu etre supprimee.";
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
    return `${input.variantCount} variantes legacy`;
  }

  if (input.simpleOffer !== null) {
    return "Offre simple configuree";
  }

  return input.variantCount === 0
    ? "Offre simple a completer"
    : "Offre simple a verifier";
}

function getImageStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Image enregistree avec succes.";
    case "updated":
      return "Image mise a jour avec succes.";
    case "deleted":
      return "Image supprimee avec succes.";
    default:
      return null;
  }
}

function getImageErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_media_asset":
      return "Selectionnez un media existant.";
    case "invalid_media_asset":
      return "Le media selectionne est invalide.";
    case "invalid_variant":
      return "La variante selectionnee est invalide.";
    case "invalid_sort_order":
      return "Le tri d'image doit etre un entier positif ou nul.";
    case "media_missing":
      return "Le media selectionne est introuvable.";
    case "variant_missing":
      return "La variante selectionnee n'appartient pas a ce produit.";
    case "missing_image":
      return "L'image demandee est introuvable.";
    case "save_failed":
      return "L'image n'a pas pu etre enregistree.";
    case "delete_failed":
      return "L'image n'a pas pu etre supprimee.";
    default:
      return null;
  }
}

function getDeleteErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "referenced":
      return "Ce produit ne peut pas etre supprime car il est encore reference ailleurs.";
    case "delete_failed":
      return "Le produit n'a pas pu etre supprime.";
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
        <div className="page-header">
          <div>
            <p className="eyebrow">Produits</p>
            <h1>Modifier le produit</h1>
            <p className="lead">
              Mettez a jour le produit, son type, son offre vendable et ses
              images depuis le meme ecran.
            </p>
          </div>

          <Link className="link-subtle button" href="/admin/products">
            Retour a la liste
          </Link>
        </div>

        <div className="admin-product-tags">
          <span className="admin-chip">{getProductStatusLabel(product.status)}</span>
          <span className="admin-chip">{productPresentation.typeLabel}</span>
          <span className="admin-chip">
            {product.isFeatured ? "Mis en avant" : "Standard"}
          </span>
          <span className="admin-chip">
            {product.categories.length} categorie
            {product.categories.length > 1 ? "s" : ""}
          </span>
          <span className="admin-chip">{detailSellableCountLabel}</span>
        </div>
      </section>

      <section className="section admin-product-section">
        <div className="stack">
          <p className="eyebrow">Produit parent</p>
          <h2>Informations produit</h2>
          <p className="card-copy">
            Ajustez les champs catalogue et le SEO de base depuis le meme
            formulaire.
          </p>
        </div>

        {productStatusMessage ? (
          <p className="admin-success">{productStatusMessage}</p>
        ) : null}
        {productErrorMessage ? (
          <p className="admin-alert" role="alert">
            {productErrorMessage}
          </p>
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
            <span className="meta-label">SEO title</span>
            <input
              className="admin-input"
              defaultValue={product.seoTitle ?? ""}
              name="seoTitle"
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">SEO description</span>
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
              <option value="published">Publie</option>
            </select>
          </label>

          <label className="admin-field">
            <span className="meta-label">Type de produit</span>
            <select
              className="admin-input"
              defaultValue={product.productType}
              name="productType"
            >
              <option value="simple">Simple</option>
              <option value="variable">Variable</option>
            </select>
          </label>

          <fieldset className="admin-fieldset">
            <legend className="meta-label">Categories associees</legend>

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
                Aucune categorie n&apos;est encore disponible pour ce produit.
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
            <button className="button" type="submit">
              Enregistrer le produit
            </button>
          </div>
        </form>
      </section>

      <section className="section admin-product-section">
        <div className="stack">
          <p className="eyebrow">Images produit</p>
          <h2>Images du produit parent</h2>
          <p className="card-copy">
            Associez des medias existants pour construire la galerie principale
            du produit.
          </p>
        </div>

        {productImageMessage.status ? (
          <p className="admin-success">{productImageMessage.status}</p>
        ) : null}
        {productImageMessage.error ? (
          <p className="admin-alert" role="alert">
            {productImageMessage.error}
          </p>
        ) : null}

        {hasMediaAssets ? (
          <form action={createProductImageAction} className="admin-form admin-product-form">
            <input name="productId" type="hidden" value={product.id} />
            <input name="variantId" type="hidden" value="" />
            <input name="imageScope" type="hidden" value="product" />

            <label className="admin-field">
              <span className="meta-label">Media existant</span>
              <select className="admin-input" defaultValue="" name="mediaAssetId">
                <option disabled value="">
                  Selectionnez un media
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
              <span>Definir comme image principale produit</span>
            </label>

            <div className="admin-actions">
              <button className="button" type="submit">
                Ajouter une image produit
              </button>
            </div>
          </form>
        ) : (
          <p className="admin-muted-note">
            Aucun media n&apos;est disponible. Ajoutez d&apos;abord une image dans{" "}
            <Link className="link" href="/admin/media">
              la bibliotheque media
            </Link>
            .
          </p>
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
                      Mettre a jour l&apos;image
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
            <h2>Le produit parent n&apos;a pas encore d&apos;image</h2>
            <p className="card-copy">
              Associez un media existant pour afficher une image principale ou
              secondaire.
            </p>
          </div>
        )}
      </section>

      <section className="section admin-product-section">
        <div className="stack">
          <p className="eyebrow">
            {isSimpleProduct ? "Produit simple" : productPresentation.sectionEyebrow}
          </p>
          <h2>{isSimpleProduct ? "Offre simple" : productPresentation.sectionTitle}</h2>
          <p className="card-copy">
            {isSimpleProduct
              ? "Modifiez directement le SKU, le prix, le prix compare et le stock natifs du produit simple."
              : productPresentation.sectionDescription}
          </p>
        </div>

        {isSimpleProduct ? (
          <>
            {simpleOfferStatusMessage ? (
              <p className="admin-success">{simpleOfferStatusMessage}</p>
            ) : null}
            {simpleOfferErrorMessage ? (
              <p className="admin-alert" role="alert">
                {simpleOfferErrorMessage}
              </p>
            ) : null}
            {simpleProductHasInconsistentVariantCount ? (
              <p className="admin-alert" role="alert">
                Ce produit simple est incoherent car plusieurs variantes legacy
                existent. Aucune resolution native n&apos;est appliquee tant que
                vous n&apos;avez pas conserve une seule variante vendable.
              </p>
            ) : null}
            {showSimpleOfferForm && simpleOfferFormDefaults ? (
              <>
                {product.simpleOffer ? (
                  <p className="card-meta">
                    Disponibilite actuelle :{" "}
                    {getAvailabilityLabel(product.simpleOffer.isAvailable)}
                  </p>
                ) : null}
                {simpleProductHasNoLegacyVariant ? (
                  <p className="admin-muted-note">
                    L&apos;edition native admin est disponible, mais la
                    compatibilite publique actuelle reste limitee tant
                    qu&apos;aucune variante legacy n&apos;existe. Ce lot ne cree
                    aucune variante automatiquement.
                  </p>
                ) : null}
                {simpleProductHasSingleLegacyVariant ? (
                  <p className="admin-muted-note">
                    Les champs commerciaux saisis ici restent synchronises avec
                    l&apos;unique variante legacy. Son statut de publication
                    continue a se gerer dans le bloc legacy ci-dessous.
                  </p>
                ) : null}

                <form
                  action={updateSimpleProductOfferAction}
                  className="admin-form admin-product-form"
                >
                  <input name="productId" type="hidden" value={product.id} />

                  <fieldset className="admin-fieldset">
                    <legend className="meta-label">
                      Informations de l&apos;offre simple
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
                      <span className="meta-label">Prix compare</span>
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
                    <button className="button" type="submit">
                      Enregistrer l&apos;offre simple
                    </button>
                  </div>
                </form>
              </>
            ) : null}
            {showLegacyVariantCompatibilityBlock ? (
              <div className="admin-product-subsection">
                <div className="stack">
                  <p className="eyebrow">Compatibilite legacy</p>
                  <h3>
                    {variants.length > 1
                      ? "Variantes legacy existantes"
                      : "Variante legacy existante"}
                  </h3>
                  <p className="card-copy">
                    Ce bloc reste disponible pour les informations techniques et
                    les ajustements manuels encore utilises par l&apos;existant.
                  </p>
                </div>

                {variantStatusMessage ? (
                  <p className="admin-success">{variantStatusMessage}</p>
                ) : null}
                {variantErrorMessage ? (
                  <p className="admin-alert" role="alert">
                    {variantErrorMessage}
                  </p>
                ) : null}
                {variantImageMessage.status ? (
                  <p className="admin-success">{variantImageMessage.status}</p>
                ) : null}
                {variantImageMessage.error ? (
                  <p className="admin-alert" role="alert">
                    {variantImageMessage.error}
                  </p>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <>
            {variantStatusMessage ? (
              <p className="admin-success">{variantStatusMessage}</p>
            ) : null}
            {variantErrorMessage ? (
              <p className="admin-alert" role="alert">
                {variantErrorMessage}
              </p>
            ) : null}
            {variantImageMessage.status ? (
              <p className="admin-success">{variantImageMessage.status}</p>
            ) : null}
            {variantImageMessage.error ? (
              <p className="admin-alert" role="alert">
                {variantImageMessage.error}
              </p>
            ) : null}
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
              <span className="meta-label">Prix compare</span>
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
                <option value="published">Publie</option>
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
            <legend className="meta-label">Informations variante</legend>

            <label className="admin-field">
              <span className="meta-label">Nom de la variante</span>
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
              <span>Definir comme variante par defaut</span>
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

              return (
                <article className="variant-card admin-variant-card" key={variant.id}>
                  <div className="stack">
                    <p className="meta-label">
                      {isSimpleProduct
                        ? "Variante legacy"
                        : productPresentation.itemKicker}
                    </p>
                    <div className="admin-product-tags">
                      <span className="admin-chip">{variant.colorName}</span>
                      <span className="admin-chip">
                        {variant.isDefault ? "Variante par defaut" : "Variante secondaire"}
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
                      Disponibilite actuelle :{" "}
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
                          ? "Champs commerciaux legacy"
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
                        <span className="meta-label">Prix compare</span>
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
                          <option value="published">Publie</option>
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
                      <legend className="meta-label">Informations variante</legend>

                      <label className="admin-field">
                        <span className="meta-label">Nom de la variante</span>
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
                        <span>Variante par defaut</span>
                      </label>
                    </fieldset>

                    <div className="admin-inline-actions">
                      <button className="button" type="submit">
                        {isSimpleProduct
                          ? "Enregistrer la variante legacy"
                          : productPresentation.saveActionLabel}
                      </button>
                    </div>
                  </form>

                  <form action={deleteProductVariantAction}>
                    <input name="productId" type="hidden" value={product.id} />
                    <input name="variantId" type="hidden" value={variant.id} />

                    <button className="button link-subtle" type="submit">
                      {isSimpleProduct
                        ? "Supprimer la variante legacy"
                        : productPresentation.deleteActionLabel}
                    </button>
                  </form>

                  <div className="admin-product-subsection">
                    <div className="stack">
                      <p className="eyebrow">
                        {isSimpleProduct
                          ? "Images legacy"
                          : productPresentation.imagesEyebrow}
                      </p>
                      <h3>
                        {isSimpleProduct
                          ? "Images de l'offre vendable"
                          : `Images pour ${variant.colorName}`}
                      </h3>
                      <p className="card-copy">
                        Ajoutez des medias existants pour cette declinaison.
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
                          <span className="meta-label">Media existant</span>
                          <select
                            className="admin-input"
                            defaultValue=""
                            name="mediaAssetId"
                          >
                            <option disabled value="">
                              Selectionnez un media
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
                          <span>Image principale de la variante</span>
                        </label>

                        <div className="admin-actions">
                          <button className="button" type="submit">
                            Ajouter une image variante
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="admin-muted-note">
                        Aucun media n&apos;est disponible. Ajoutez d&apos;abord une
                        image dans{" "}
                        <Link className="link" href="/admin/media">
                          la bibliotheque media
                        </Link>
                        .
                      </p>
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
                                <span>Image principale variante</span>
                              </label>

                              <div className="admin-inline-actions">
                                <button className="button" type="submit">
                                  Mettre a jour l&apos;image
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
                      <p className="admin-muted-note">
                        {isSimpleProduct
                          ? "Cette variante legacy n'a pas encore d'image associee."
                          : "Cette variante n'a pas encore d'image associee."}
                      </p>
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
        <div className="stack">
          <p className="eyebrow">Suppression</p>
          <h2>Supprimer ce produit</h2>
          <p className="card-copy">
            La suppression retire aussi les categories associees, les variantes
            et les images rattachees par cascade SQL.
          </p>
        </div>

        {deleteErrorMessage ? (
          <p className="admin-alert" role="alert">
            {deleteErrorMessage}
          </p>
        ) : null}

        <form action={deleteProductAction}>
          <input name="productId" type="hidden" value={product.id} />

          <button className="button admin-danger-button" type="submit">
            Supprimer le produit
          </button>
        </form>
      </section>
    </div>
  );
}
