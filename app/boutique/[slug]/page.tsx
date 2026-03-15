import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice } from "@/components/notice";
import { getPublishedProductBySlug } from "@/db/catalog";
import { addToCartAction } from "@/features/cart/actions/add-to-cart-action";
import {
  getOfferAvailabilityMessage,
  getProductAvailabilityLabel,
  getProductOfferSectionPresentation,
  getProductPageStatusSummary,
  getSimpleOfferCardTitle,
  getVariantAvailabilityLabel,
  getVariantDefaultBadgeLabel
} from "@/entities/product/product-public-presentation";
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
      return "Article ajouté au panier.";
    default:
      return null;
  }
}

function getCartErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_variant":
      return "La déclinaison demandée est introuvable.";
    case "missing_quantity":
    case "invalid_quantity":
      return "Renseignez une quantité entière supérieure ou égale à 1.";
    case "variant_unavailable":
      return "Cette déclinaison n'est pas disponible actuellement.";
    case "insufficient_stock":
      return "Le stock disponible est insuffisant pour cette quantité.";
    case "save_failed":
      return "Le panier n'a pas pu être mis à jour.";
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

function getImageUrl(
  uploadsPublicPath: string,
  filePath: string
): string {
  return `${uploadsPublicPath}/${filePath.replace(/^\/+/, "")}`;
}

function getDisplayImage<TImage extends { isPrimary: boolean }>(
  images: readonly TImage[]
): TImage | null {
  return images.find((image) => image.isPrimary) ?? images[0] ?? null;
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
    productType: product.productType,
    totalVariantCount: product.variants.length,
    availableVariantCount
  });
  const offerSectionPresentation = getProductOfferSectionPresentation(
    product.productType
  );
  const isSimpleProduct = product.productType === "simple";
  const singleOffer =
    isSimpleProduct && product.variants.length === 1 ? product.variants[0] : null;
  const productDisplayImage = getDisplayImage(product.images);
  const singleOfferDisplayImage = singleOffer
    ? getDisplayImage(singleOffer.images)
    : null;

  return (
    <div className="page">
      <section className="section">
        <div className="mb-6 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
            Produit
          </p>
          <h1 className="m-0">{product.name}</h1>
          {product.shortDescription ? (
            <p className="mt-1 leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>
          ) : null}
        </div>

        {cartStatusMessage ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-600/20 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800">
            <span>{cartStatusMessage}</span>
            <Link
              className="font-medium underline-offset-4 transition-colors hover:underline"
              href="/panier">
              Voir le panier
            </Link>
          </div>
        ) : null}
        {cartErrorMessage ? (
          <Notice tone="alert">{cartErrorMessage}</Notice>
        ) : null}

        <div className="product-layout">
          <div className="product-gallery">
            {productDisplayImage ? (
              <figure className="product-media">
                <img
                  alt={productDisplayImage.altText ?? product.name}
                  loading="lazy"
                  src={getImageUrl(uploadsPublicPath, productDisplayImage.filePath)}
                />
              </figure>
            ) : (
              <div className="media-placeholder">Aucun visuel principal.</div>
            )}
          </div>

          <aside className="product-panel">
            <div className="product-summary">
              <div className="product-summary-header">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Disponibilité du produit</p>
                <Badge variant="outline">
                  <span
                    className={
                      product.isAvailable ? "text-emerald-700" : "text-destructive"
                    }>
                    {getProductAvailabilityLabel(product.isAvailable)}
                  </span>
                </Badge>
              </div>

              <h2>{productStatusSummary.title}</h2>
              <p className="card-copy">{productStatusSummary.description}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {productStatusSummary.nextStep}
              </p>

              {isSimpleProduct ? (
                <div className="product-summary-stats">
                  <div className="product-summary-stat">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Type de produit</p>
                    <p className="card-copy">Produit simple</p>
                  </div>

                  <div className="product-summary-stat">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Informations de vente</p>
                    <p className="card-copy">
                      {singleOffer ? singleOffer.name : "Indisponible"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="product-summary-stats">
                  <div className="product-summary-stat">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Déclinaisons disponibles</p>
                    <p className="card-copy">{availableVariantCount}</p>
                  </div>

                  <div className="product-summary-stat">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Déclinaisons publiées</p>
                    <p className="card-copy">{product.variants.length}</p>
                  </div>
                </div>
              )}
            </div>

            {product.description ? (
              <div className="grid gap-1">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Description</p>
                <p className="product-copy">{product.description}</p>
              </div>
            ) : null}

            <div className="grid gap-1">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Référence de page</p>
              <p className="card-copy">{product.slug}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="mb-6 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
            {offerSectionPresentation.eyebrow}
          </p>
          <h2 className="m-0">{offerSectionPresentation.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {offerSectionPresentation.description}
          </p>
        </div>

        {isSimpleProduct ? (
          singleOffer ? (
            <article className="variant-card">
              <div className="variant-header">
                <div className="grid gap-1">
                  <h3>{getSimpleOfferCardTitle()}</h3>
                  <p className="text-[0.95rem] text-foreground/68">
                    {singleOffer.name}
                    {singleOffer.colorName ? ` · ${singleOffer.colorName}` : ""}
                    {singleOffer.colorHex ? ` · ${singleOffer.colorHex}` : ""}
                  </p>
                </div>

                <div className="variant-badges">
                  <Badge variant="outline">
                    <span
                      className={
                        singleOffer.isAvailable
                          ? "text-emerald-700"
                          : "text-destructive"
                      }>
                      {getProductAvailabilityLabel(singleOffer.isAvailable)}
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="variant-purchase">
                <div className="grid gap-1">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Prix</p>
                  <p className="product-price">{singleOffer.price}</p>
                  {singleOffer.compareAtPrice ? (
                    <p className="text-[0.95rem] text-foreground/68">
                      Prix barré : {singleOffer.compareAtPrice}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-1">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Ajout au panier</p>
                  <p
                    className={
                      singleOffer.isAvailable ? "card-copy" : "text-[0.95rem] text-foreground/68"
                    }>
                    {getOfferAvailabilityMessage({
                      productType: product.productType,
                      isAvailable: singleOffer.isAvailable
                    })}
                  </p>
                </div>

                {singleOffer.isAvailable ? (
                  <form
                    action={addToCartAction}
                    className="cart-add-form">
                    <input
                      name="productSlug"
                      type="hidden"
                      value={product.slug}
                    />
                    <input
                      name="variantId"
                      type="hidden"
                      value={singleOffer.id}
                    />

                    <div className="grid gap-2 max-w-[10rem]">
                      <Label htmlFor={`quantity-${singleOffer.id}`}>Quantité</Label>
                      <Input
                        defaultValue="1"
                        id={`quantity-${singleOffer.id}`}
                        min="1"
                        name="quantity"
                        required
                        step="1"
                        type="number"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button type="submit">Ajouter au panier</Button>
                    </div>
                  </form>
                ) : null}
              </div>

              <div className="variant-details">
                <div className="variant-detail">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">SKU</p>
                  <p className="card-copy">{singleOffer.sku}</p>
                </div>

                <div className="variant-detail">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Couleur</p>
                  <p className="card-copy">
                    {singleOffer.colorName}
                    {singleOffer.colorHex ? ` · ${singleOffer.colorHex}` : ""}
                  </p>
                </div>
              </div>

              {singleOfferDisplayImage ? (
                <div className="variant-images">
                  <figure
                    className="variant-media"
                    key={singleOfferDisplayImage.id}>
                    <img
                      alt={singleOfferDisplayImage.altText ?? singleOffer.name}
                      loading="lazy"
                      src={getImageUrl(
                        uploadsPublicPath,
                        singleOfferDisplayImage.filePath
                      )}
                    />
                  </figure>
                </div>
              ) : (
                <div className="media-placeholder">
                  Aucun visuel pour ce produit.
                </div>
              )}
            </article>
          ) : (
            <div className="empty-state">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
              {offerSectionPresentation.emptyEyebrow}
            </p>
              <h2>{offerSectionPresentation.emptyTitle}</h2>
              <p className="card-copy">
                {offerSectionPresentation.emptyDescription}
              </p>
            </div>
          )
        ) : product.variants.length > 0 ? (
          <div className="variant-list">
            {product.variants.map((variant) => {
              const variantDisplayImage = getDisplayImage(variant.images);

              return (
                <article
                  className="variant-card"
                  key={variant.id}>
                  <div className="variant-header">
                    <div className="grid gap-1">
                      <h3>{variant.name}</h3>
                      <p className="text-[0.95rem] text-foreground/68">
                        {variant.colorName}
                        {variant.colorHex ? ` · ${variant.colorHex}` : ""}
                      </p>
                    </div>

                    <div className="variant-badges">
                      {getVariantDefaultBadgeLabel(variant.isDefault) ? (
                        <Badge variant="secondary">
                          {getVariantDefaultBadgeLabel(variant.isDefault)}
                        </Badge>
                      ) : null}
                      <Badge variant="outline">
                        <span
                          className={
                            variant.isAvailable
                              ? "text-emerald-700"
                              : "text-destructive"
                          }>
                          {getVariantAvailabilityLabel(variant.isAvailable)}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div className="variant-purchase">
                    <div className="grid gap-1">
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Prix</p>
                      <p className="product-price">{variant.price}</p>
                      {variant.compareAtPrice ? (
                        <p className="text-[0.95rem] text-foreground/68">
                          Prix barré : {variant.compareAtPrice}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-1">
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Ajout au panier</p>
                      <p
                        className={variant.isAvailable ? "card-copy" : "text-[0.95rem] text-foreground/68"}>
                        {getOfferAvailabilityMessage({
                          productType: product.productType,
                          isAvailable: variant.isAvailable
                        })}
                      </p>
                    </div>

                    {variant.isAvailable ? (
                      <form
                        action={addToCartAction}
                        className="cart-add-form">
                        <input
                          name="productSlug"
                          type="hidden"
                          value={product.slug}
                        />
                        <input
                          name="variantId"
                          type="hidden"
                          value={variant.id}
                        />

                        <div className="grid gap-2 max-w-[10rem]">
                          <Label htmlFor={`quantity-${variant.id}`}>Quantité</Label>
                          <Input
                            defaultValue="1"
                            id={`quantity-${variant.id}`}
                            min="1"
                            name="quantity"
                            required
                            step="1"
                            type="number"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button type="submit">Ajouter au panier</Button>
                        </div>
                      </form>
                    ) : null}
                  </div>

                  <div className="variant-details">
                    <div className="variant-detail">
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">SKU</p>
                      <p className="card-copy">{variant.sku}</p>
                    </div>

                    <div className="variant-detail">
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Couleur</p>
                      <p className="card-copy">
                        {variant.colorName}
                        {variant.colorHex ? ` · ${variant.colorHex}` : ""}
                      </p>
                    </div>
                  </div>

                  {variantDisplayImage ? (
                    <div className="variant-images">
                      <figure
                        className="variant-media"
                        key={variantDisplayImage.id}>
                        <img
                          alt={variantDisplayImage.altText ?? variant.name}
                          loading="lazy"
                          src={getImageUrl(
                            uploadsPublicPath,
                            variantDisplayImage.filePath
                          )}
                        />
                      </figure>
                    </div>
                  ) : (
                    <div className="media-placeholder">
                      Aucun visuel pour cette déclinaison.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
              {offerSectionPresentation.emptyEyebrow}
            </p>
            <h2>{offerSectionPresentation.emptyTitle}</h2>
            <p className="card-copy">{offerSectionPresentation.emptyDescription}</p>
          </div>
        )}
      </section>
    </div>
  );
}
