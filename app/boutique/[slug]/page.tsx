import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProductBySlug } from "@/db/catalog";
import { addToCartAction } from "@/features/cart/actions/add-to-cart-action";
import {
  getProductAvailabilityLabel,
  getProductPageStatusSummary,
  getVariantAvailabilityLabel,
  getVariantAvailabilityMessage,
  getVariantDefaultBadgeLabel
} from "@/entities/product/product-page-presentation";
import { getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

type ProductPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    cart_error?: string | string[];
    cart_status?: string | string[];
  }>;
}>;

type ProductMetadataSource = NonNullable<
  Awaited<ReturnType<typeof getPublishedProductBySlug>>
>;

function getCartStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "added":
      return "Article ajoute au panier.";
    default:
      return null;
  }
}

function getCartErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_variant":
      return "La variante demandee est introuvable.";
    case "missing_quantity":
    case "invalid_quantity":
      return "Renseignez une quantite entiere superieure ou egale a 1.";
    case "variant_unavailable":
      return "Cette variante n'est pas disponible actuellement.";
    case "insufficient_stock":
      return "Le stock disponible est insuffisant pour cette quantite.";
    case "save_failed":
      return "Le panier n'a pas pu etre mis a jour.";
    default:
      return null;
  }
}

function getProductMetadataDescription(product: ProductMetadataSource): string {
  return (
    product.seoDescription ??
    product.shortDescription ??
    product.description ??
    "Produit Creatyss."
  );
}

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (product === null) {
    return {
      title: "Produit Creatyss",
      description: "Produit Creatyss."
    };
  }

  return {
    title: product.seoTitle ?? product.name,
    description: getProductMetadataDescription(product)
  };
}

export default async function ProductPage({
  params,
  searchParams
}: ProductPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const cartStatusParam = Array.isArray(resolvedSearchParams.cart_status)
    ? resolvedSearchParams.cart_status[0]
    : resolvedSearchParams.cart_status;
  const cartErrorParam = Array.isArray(resolvedSearchParams.cart_error)
    ? resolvedSearchParams.cart_error[0]
    : resolvedSearchParams.cart_error;
  const cartStatusMessage = getCartStatusMessage(cartStatusParam);
  const cartErrorMessage = getCartErrorMessage(cartErrorParam);
  const product = await getPublishedProductBySlug(slug);

  if (product === null) {
    notFound();
  }

  const uploadsPublicPath = getUploadsPublicPath();
  const availableVariantCount = product.variants.filter(
    (variant) => variant.isAvailable
  ).length;
  const productStatusSummary = getProductPageStatusSummary({
    totalVariantCount: product.variants.length,
    availableVariantCount
  });

  return (
    <div className="page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Produit</p>
            <h1>{product.name}</h1>
            {product.shortDescription ? (
              <p className="lead">{product.shortDescription}</p>
            ) : null}
          </div>
        </div>

        {cartStatusMessage ? (
          <div className="admin-success cart-feedback">
            <p>{cartStatusMessage}</p>
            <Link className="link" href="/panier">
              Voir le panier
            </Link>
          </div>
        ) : null}
        {cartErrorMessage ? (
          <p className="admin-alert" role="alert">
            {cartErrorMessage}
          </p>
        ) : null}

        <div className="product-layout">
          <div className="product-gallery">
            <h2>Galerie principale</h2>

            {product.images.length > 0 ? (
              <div className="image-grid">
                {product.images.map((image) => (
                  <figure className="product-media" key={image.id}>
                    <img
                      alt={image.altText ?? product.name}
                      loading="lazy"
                      src={`${uploadsPublicPath}/${image.filePath.replace(/^\/+/, "")}`}
                    />
                  </figure>
                ))}
              </div>
            ) : (
              <div className="media-placeholder">Aucun visuel principal.</div>
            )}
          </div>

          <aside className="product-panel">
            <div className="product-summary">
              <div className="product-summary-header">
                <p className="meta-label">Disponibilite produit</p>
                <span
                  className={`status-pill ${
                    product.isAvailable
                      ? "status-pill--available"
                      : "status-pill--unavailable"
                  }`}
                >
                  {getProductAvailabilityLabel(product.isAvailable)}
                </span>
              </div>

              <h2>{productStatusSummary.title}</h2>
              <p className="card-copy">{productStatusSummary.description}</p>
              <p className="card-meta">{productStatusSummary.nextStep}</p>

              <div className="product-summary-stats">
                <div className="product-summary-stat">
                  <p className="meta-label">Declinaisons disponibles</p>
                  <p className="card-copy">{availableVariantCount}</p>
                </div>

                <div className="product-summary-stat">
                  <p className="meta-label">Declinaisons publiees</p>
                  <p className="card-copy">{product.variants.length}</p>
                </div>
              </div>
            </div>

            <div className="stack">
              <p className="meta-label">Slug</p>
              <p className="card-copy">{product.slug}</p>
            </div>

            {product.description ? (
              <div className="stack">
                <p className="meta-label">Description</p>
                <p className="product-copy">{product.description}</p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Declinaisons</p>
            <h2>Choisir une declinaison</h2>
            <p className="card-meta">
              Verifiez le prix, la disponibilite et les visuels de chaque
              declinaison avant l'ajout au panier.
            </p>
          </div>
        </div>

        {product.variants.length > 0 ? (
          <div className="variant-list">
            {product.variants.map((variant) => (
              <article className="variant-card" key={variant.id}>
                <div className="variant-header">
                  <div className="stack">
                    <h3>{variant.name}</h3>
                    <p className="variant-meta">
                      {variant.colorName}
                      {variant.colorHex ? ` · ${variant.colorHex}` : ""}
                    </p>
                  </div>

                  <div className="variant-badges">
                    {getVariantDefaultBadgeLabel(variant.isDefault) ? (
                      <span className="status-pill status-pill--neutral">
                        {getVariantDefaultBadgeLabel(variant.isDefault)}
                      </span>
                    ) : null}
                    <span
                      className={`status-pill ${
                        variant.isAvailable
                          ? "status-pill--available"
                          : "status-pill--unavailable"
                      }`}
                    >
                      {getVariantAvailabilityLabel(variant.isAvailable)}
                    </span>
                  </div>
                </div>

                <div className="variant-purchase">
                  <div className="stack">
                    <p className="meta-label">Prix</p>
                    <p className="product-price">{variant.price}</p>
                    {variant.compareAtPrice ? (
                      <p className="card-meta">
                        Compare a {variant.compareAtPrice}
                      </p>
                    ) : null}
                  </div>

                  <div className="stack">
                    <p className="meta-label">Ajout au panier</p>
                    <p
                      className={variant.isAvailable ? "card-copy" : "card-meta"}
                    >
                      {getVariantAvailabilityMessage(variant.isAvailable)}
                    </p>
                  </div>

                  {variant.isAvailable ? (
                    <form action={addToCartAction} className="cart-add-form">
                      <input
                        name="productSlug"
                        type="hidden"
                        value={product.slug}
                      />
                      <input name="variantId" type="hidden" value={variant.id} />

                      <label className="admin-field cart-quantity-field">
                        <span className="meta-label">Quantite</span>
                        <input
                          className="admin-input"
                          defaultValue="1"
                          min="1"
                          name="quantity"
                          required
                          step="1"
                          type="number"
                        />
                      </label>

                      <div className="admin-inline-actions">
                        <button className="button" type="submit">
                          Ajouter au panier
                        </button>
                      </div>
                    </form>
                  ) : null}
                </div>

                <div className="variant-details">
                  <div className="variant-detail">
                    <p className="meta-label">SKU</p>
                    <p className="card-copy">{variant.sku}</p>
                  </div>

                  <div className="variant-detail">
                    <p className="meta-label">Couleur</p>
                    <p className="card-copy">
                      {variant.colorName}
                      {variant.colorHex ? ` · ${variant.colorHex}` : ""}
                    </p>
                  </div>
                </div>

                {variant.images.length > 0 ? (
                  <div className="variant-images">
                    {variant.images.map((image) => (
                      <figure className="variant-media" key={image.id}>
                        <img
                          alt={image.altText ?? variant.name}
                          loading="lazy"
                          src={`${uploadsPublicPath}/${image.filePath.replace(/^\/+/, "")}`}
                        />
                      </figure>
                    ))}
                  </div>
                ) : (
                  <div className="media-placeholder">
                    Aucun visuel pour cette declinaison.
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Aucune declinaison</p>
            <h2>Ce produit n&apos;a pas encore de declinaison publique</h2>
            <p className="card-copy">
              Les declinaisons vendables apparaitront ici lorsqu&apos;elles
              seront disponibles.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
