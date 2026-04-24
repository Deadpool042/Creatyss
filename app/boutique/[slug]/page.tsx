import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice } from "@/components/shared/notice";
import { clientEnv } from "@/core/config/env";
import { getPublishedProductBySlug } from "@/features/storefront/catalog";
import { type OfferVariant } from "@/features/storefront/catalog/product-offers-section";
import { ProductPageTemplate } from "@/features/storefront/catalog/product-page-template";
import { addToCartAction } from "@/features/cart";
import { getOfferAvailabilityMessage } from "@/entities/product/product-public-presentation";
import { buildSeoDescription, pickSeoText } from "@/entities/product/seo-text";

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
  return buildSeoDescription({
    candidates: [product.seoDescription, product.shortDescription, product.description],
    defaultValue: "Produit Creatyss.",
    maxLength: 170,
  });
}

function getProductJsonLdDescription(product: ProductMetadataSource): string {
  // JSON-LD can be longer than the meta description; we keep the same source/normalization,
  // with a higher cap to avoid overly long rich-text bodies.
  return buildSeoDescription({
    candidates: [product.seoDescription, product.shortDescription, product.description],
    defaultValue: "Produit Creatyss.",
    maxLength: 500,
  });
}

function toAbsoluteUrl(input: string, base: string): string {
  // Base must be absolute (`https://...`). We accept relative paths ("/uploads/...") as input.
  try {
    return new URL(input, base).toString();
  } catch {
    return input;
  }
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

  const canonicalPath = pickSeoText(product.seoCanonicalPath) ?? `/boutique/${product.slug}`;
  const canonical = `${clientEnv.appUrl}${canonicalPath}`;

  const metaDescription = getProductMetadataDescription(product);

  const metaTitle = pickSeoText(product.seoTitle, product.name) ?? product.name;

  const ogTitle = pickSeoText(product.seoOpenGraphTitle, product.seoTitle, product.name) ?? metaTitle;
  const ogDescription = buildSeoDescription({
    candidates: [product.seoOpenGraphDescription, metaDescription],
    defaultValue: metaDescription,
    maxLength: 200,
  });
  const ogImageUrl = product.seoOpenGraphImageUrl ?? product.images[0]?.src;

  const twitterTitle =
    pickSeoText(product.seoTwitterTitle, product.seoOpenGraphTitle, product.seoTitle, product.name) ??
    metaTitle;
  const twitterDescription = buildSeoDescription({
    candidates: [product.seoTwitterDescription, product.seoOpenGraphDescription, metaDescription],
    defaultValue: metaDescription,
    maxLength: 200,
  });
  const twitterImageUrl = product.seoTwitterImageUrl ?? product.seoOpenGraphImageUrl ?? ogImageUrl;

  return {
    title: metaTitle,
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

function formatWeight(weightGrams: number): string {
  if (!Number.isFinite(weightGrams) || weightGrams <= 0) {
    return "";
  }

  if (weightGrams >= 1000) {
    const kg = weightGrams / 1000;
    const formatted = kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(2);
    return `${formatted} kg`;
  }

  return `${Math.round(weightGrams)} g`;
}

function formatDimensions(input: {
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
}): string {
  const { widthMm, heightMm, depthMm } = input;
  const hasAll = widthMm !== null && heightMm !== null && depthMm !== null;

  if (hasAll) {
    return `${widthMm} × ${heightMm} × ${depthMm} mm`;
  }

  const parts: string[] = [];
  if (widthMm !== null) parts.push(`L ${widthMm} mm`);
  if (heightMm !== null) parts.push(`H ${heightMm} mm`);
  if (depthMm !== null) parts.push(`P ${depthMm} mm`);

  return parts.join(" · ");
}

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
  const baseProductImages = product.images.map((image) => ({
    src: image.src,
    alt: image.alt ?? null,
  }));

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

  const defaultVariant = !isSimpleProduct
    ? (product.variants.find((variant) => variant.isDefault) ?? product.variants[0] ?? null)
    : null;
  const heroVariantImage = defaultVariant?.images[0] ?? null;
  const productImages = (() => {
    if (heroVariantImage === null) {
      return baseProductImages;
    }

    const prepended = [{ src: heroVariantImage.src, alt: heroVariantImage.alt ?? null }];
    const merged = [...prepended, ...baseProductImages];
    const seen = new Set<string>();

    return merged.filter((image) => {
      const key = image.src.trim();
      if (key.length === 0) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  const variantSummary = !isSimpleProduct
    ? {
        total: product.variants.length,
        available: product.variants.filter((variant) => variant.isAvailable).length,
      }
    : null;

  const referenceVariant = (() => {
    if (product.variants.length === 0) {
      return null;
    }

    if (isSimpleProduct) {
      return product.variants[0] ?? null;
    }

    return product.variants.find((variant) => variant.isDefault) ?? product.variants[0] ?? null;
  })();

  const technicalSpecs = (() => {
    if (!referenceVariant) {
      return [];
    }

    const specs: Array<{ label: string; value: string }> = [];

    if (referenceVariant.sku.trim().length > 0) {
      specs.push({ label: "Référence (SKU)", value: referenceVariant.sku });
    }

    if (referenceVariant.barcode && referenceVariant.barcode.trim().length > 0) {
      specs.push({ label: "Code-barres", value: referenceVariant.barcode });
    }

    if (referenceVariant.externalReference && referenceVariant.externalReference.trim().length > 0) {
      specs.push({ label: "Référence externe", value: referenceVariant.externalReference });
    }

    if (referenceVariant.weightGrams !== null) {
      const weight = formatWeight(referenceVariant.weightGrams);
      if (weight.length > 0) {
        specs.push({ label: "Poids", value: weight });
      }
    }

    const dims = formatDimensions({
      widthMm: referenceVariant.widthMm,
      heightMm: referenceVariant.heightMm,
      depthMm: referenceVariant.depthMm,
    });
    if (dims.length > 0) {
      specs.push({ label: "Dimensions", value: dims });
    }

    return specs;
  })();

  const jsonLdCanonicalPath = pickSeoText(product.seoCanonicalPath) ?? `/boutique/${product.slug}`;
  const jsonLdUrl = toAbsoluteUrl(jsonLdCanonicalPath, clientEnv.appUrl);
  const jsonLdImageUrl = productImages[0]?.src ?? null;

  const productJsonLd: ProductJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pickSeoText(product.name) ?? product.name,
    description: getProductJsonLdDescription(product),
    url: jsonLdUrl,
    ...(jsonLdImageUrl !== null && { image: toAbsoluteUrl(jsonLdImageUrl, clientEnv.appUrl) }),
  };

  const statusBanner =
    cartStatusMessage !== null || cartErrorMessage !== null ? (
      <>
        {cartStatusMessage !== null ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-feedback-success-border bg-feedback-success-surface px-4 py-3 text-sm text-feedback-success-foreground">
            <span>{cartStatusMessage}</span>
            <Link
              className="font-medium underline-offset-4 transition-opacity hover:opacity-80 hover:underline"
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
        images={productImages}
        variants={variantsNormalized}
        characteristics={product.characteristics}
        technicalSpecs={technicalSpecs}
        relatedProductGroups={product.relatedProductGroups}
        statusBanner={statusBanner}
        heroVariantSummary={variantSummary}
        heroCta={
          !isSimpleProduct ? (
            <CustomButton asChild fullWidth>
              <a href="#offers">Choisir une déclinaison</a>
            </CustomButton>
          ) : isSimpleProduct && singleOffer != null && singleOffer.isAvailable ? (
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
                <CustomButton type="submit" loading={false}>
                  Ajouter au panier
                </CustomButton>
              </div>
            </form>
          ) : undefined
        }
        renderVariantCta={(variant) => (
          <>
            <div className="grid gap-2">
              <p
                className={
                  variant.isAvailable
                    ? "text-micro-copy reading-compact text-text-muted-strong"
                    : "text-micro-copy reading-compact text-text-muted-soft"
                }
              >
                {getOfferAvailabilityMessage({
                  productType: product.productType,
                  isAvailable: variant.isAvailable,
                })}
              </p>

              {variant.isAvailable ? (
                <form action={addToCartAction} className="flex flex-wrap items-end gap-2">
                  <input name="productSlug" type="hidden" value={product.slug} />
                  <input name="variantId" type="hidden" value={variant.id} />
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor={`quantity-${variant.id}`}>
                      Quantité
                    </Label>
                    <Input
                      className="h-9 w-20 px-2 text-sm"
                      defaultValue="1"
                      id={`quantity-${variant.id}`}
                      min="1"
                      name="quantity"
                      required
                      step="1"
                      type="number"
                    />
                  </div>
                  <CustomButton size="sm" type="submit">
                    Ajouter au panier
                  </CustomButton>
                </form>
              ) : null}
            </div>
          </>
        )}
      />
    </>
  );
}
