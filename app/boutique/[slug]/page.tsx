import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice } from "@/components/shared/notice";
import { clientEnv } from "@/core/config/env";
import { getPublishedProductBySlug } from "@/features/storefront/catalog";
import { type OfferVariant } from "@/features/storefront/catalog/product-offers-section";
import { ProductPageTemplate } from "@/features/storefront/catalog/product-page-template";
import { addToCartAction } from "@/features/cart";
import { getOfferAvailabilityMessage } from "@/entities/product/product-public-presentation";

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

type ProductMetadataSource = NonNullable<Awaited<ReturnType<typeof getPublishedProductBySlug>>>;

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
    product.seoDescription ?? product.shortDescription ?? product.description ?? "Produit Creatyss."
  );
}

type RobotsMetadata = {
  index: boolean;
  follow: boolean;
};

function getRobotsFromIndexingMode(
  mode: "INDEX_FOLLOW" | "INDEX_NOFOLLOW" | "NOINDEX_FOLLOW" | "NOINDEX_NOFOLLOW" | null
): RobotsMetadata | undefined {
  if (mode === null || mode === "INDEX_FOLLOW") {
    return undefined; // Next.js default: index + follow
  }

  const map: Record<
    "INDEX_FOLLOW" | "INDEX_NOFOLLOW" | "NOINDEX_FOLLOW" | "NOINDEX_NOFOLLOW",
    RobotsMetadata
  > = {
    INDEX_FOLLOW: { index: true, follow: true },
    INDEX_NOFOLLOW: { index: true, follow: false },
    NOINDEX_FOLLOW: { index: false, follow: true },
    NOINDEX_NOFOLLOW: { index: false, follow: false },
  };

  return map[mode];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (product === null) {
    return {
      title: "Produit Creatyss",
      description: "Produit Creatyss.",
    };
  }

  const robots = getRobotsFromIndexingMode(product.seoIndexingMode);

  const canonicalPath = product.seoCanonicalPath ?? `/boutique/${product.slug}`;
  const canonical = `${clientEnv.appUrl}${canonicalPath}`;

  const metaDescription = getProductMetadataDescription(product);

  const ogTitle = product.seoOpenGraphTitle ?? product.seoTitle ?? product.name;
  const ogDescription = product.seoOpenGraphDescription ?? metaDescription;
  const ogImageUrl = product.seoOpenGraphImageUrl ?? product.images[0]?.src;

  const twitterTitle =
    product.seoTwitterTitle ?? product.seoOpenGraphTitle ?? product.seoTitle ?? product.name;
  const twitterDescription =
    product.seoTwitterDescription ?? product.seoOpenGraphDescription ?? metaDescription;
  const twitterImageUrl = product.seoTwitterImageUrl ?? product.seoOpenGraphImageUrl ?? ogImageUrl;

  return {
    title: product.seoTitle ?? product.name,
    description: metaDescription,
    ...(robots !== undefined && { robots }),
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImageUrl !== undefined && { images: [{ url: ogImageUrl }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImageUrl !== undefined && { images: [twitterImageUrl] }),
    },
  };
}

type ProductJsonLd = {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  url: string;
  image?: string;
};

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
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

  const isSimpleProduct = product.productType === "simple";
  const singleOffer = isSimpleProduct && product.variants.length === 1 ? product.variants[0] : null;
  // Images déjà résolues (src, alt) dans la query — pas de résolution URL ici.
  const primaryImage = product.images[0] ?? null;

  const jsonLdCanonicalPath = product.seoCanonicalPath ?? `/boutique/${product.slug}`;
  const jsonLdUrl = `${clientEnv.appUrl}${jsonLdCanonicalPath}`;
  const jsonLdImageUrl = primaryImage?.src ?? null;

  const productJsonLd: ProductJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: getProductMetadataDescription(product),
    url: jsonLdUrl,
    ...(jsonLdImageUrl !== null && { image: jsonLdImageUrl }),
  };

  const variantsNormalized: OfferVariant[] = product.variants.map((variant) => {
    const variantDisplayImage = variant.images[0] ?? null;
    return {
      id: variant.id,
      name: variant.name,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      isAvailable: variant.isAvailable,
      isDefault: variant.isDefault,
      sku: variant.sku,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      displayImage: variantDisplayImage
        ? {
            src: variantDisplayImage.src,
            alt: variantDisplayImage.alt ?? variant.name,
          }
        : null,
    };
  });

  const statusBanner =
    cartStatusMessage !== null || cartErrorMessage !== null ? (
      <>
        {cartStatusMessage !== null ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-600/20 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800">
            <span>{cartStatusMessage}</span>
            <Link
              className="font-medium underline-offset-4 transition-colors hover:underline"
              href="/panier"
            >
              Voir le panier
            </Link>
          </div>
        ) : null}
        {cartErrorMessage !== null ? <Notice tone="alert">{cartErrorMessage}</Notice> : null}
      </>
    ) : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductPageTemplate
        productName={product.name}
        marketingHook={product.marketingHook}
        shortDescription={product.shortDescription}
        description={product.description}
        productType={product.productType}
        isAvailable={product.isAvailable}
        primaryImage={primaryImage}
        variants={variantsNormalized}
        characteristics={product.characteristics}
        relatedProductGroups={product.relatedProductGroups}
        statusBanner={statusBanner}
        heroCta={
          isSimpleProduct && singleOffer != null && singleOffer.isAvailable ? (
            <form action={addToCartAction} className="grid gap-4">
              <input name="productSlug" type="hidden" value={product.slug} />
              <input name="variantId" type="hidden" value={singleOffer.id} />
              <div className="grid max-w-40 gap-2">
                <Label htmlFor={`qty-hero-${singleOffer.id}`}>Quantité</Label>
                <Input
                  defaultValue="1"
                  id={`qty-hero-${singleOffer.id}`}
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
          ) : undefined
        }
        renderVariantCta={(variant) => (
          <>
            <div className="grid gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Ajout au panier
              </p>
              <p
                className={
                  variant.isAvailable ? "leading-relaxed" : "text-sm text-muted-foreground"
                }
              >
                {getOfferAvailabilityMessage({
                  productType: product.productType,
                  isAvailable: variant.isAvailable,
                })}
              </p>
            </div>
            {variant.isAvailable ? (
              <form action={addToCartAction} className="grid gap-4">
                <input name="productSlug" type="hidden" value={product.slug} />
                <input name="variantId" type="hidden" value={variant.id} />
                <div className="grid max-w-40 gap-2">
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
          </>
        )}
      />
    </>
  );
}
