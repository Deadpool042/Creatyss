import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CustomButton } from "@/components/shared";
import { Notice } from "@/components/shared/notice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientEnv } from "@/core/config/env";
import { addToCartAction } from "@/features/cart";
import { getPublishedProductBySlug } from "@/features/storefront/catalog";
import { ProductPageTemplate } from "@/features/storefront/catalog/product-page-template";
import { type OfferVariant } from "@/features/storefront/catalog/product-offers-section";
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
  return buildSeoDescription({
    candidates: [product.seoDescription, product.shortDescription, product.description],
    defaultValue: "Produit Creatyss.",
    maxLength: 500,
  });
}

function toAbsoluteUrl(input: string, base: string): string {
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
    return undefined;
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

  const ogTitle =
    pickSeoText(product.seoOpenGraphTitle, product.seoTitle, product.name) ?? metaTitle;
  const ogDescription = buildSeoDescription({
    candidates: [product.seoOpenGraphDescription, metaDescription],
    defaultValue: metaDescription,
    maxLength: 200,
  });
  const ogImageUrl = product.seoOpenGraphImageUrl ?? product.images[0]?.src;

  const twitterTitle =
    pickSeoText(
      product.seoTwitterTitle,
      product.seoOpenGraphTitle,
      product.seoTitle,
      product.name
    ) ?? metaTitle;
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
      images: variant.images.map((image) => ({
        src: image.src,
        alt: image.alt ?? null,
      })),
      barcode: variant.barcode,
      externalReference: variant.externalReference,
      weightGrams: variant.weightGrams,
      widthMm: variant.widthMm,
      heightMm: variant.heightMm,
      depthMm: variant.depthMm,
      optionValues: variant.optionValues.map((item) => ({
        optionId: item.optionId,
        optionName: item.optionName,
        valueId: item.valueId,
        valueLabel: item.valueLabel,
      })),
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

    if (
      referenceVariant.externalReference &&
      referenceVariant.externalReference.trim().length > 0
    ) {
      specs.push({ label: "Référence externe", value: referenceVariant.externalReference });
    }

    if (referenceVariant.weightGrams !== null) {
      const weight = formatWeight(referenceVariant.weightGrams);
      if (weight.length > 0) {
        specs.push({ label: "Poids", value: weight });
      }
    }

    const dimensions = formatDimensions(referenceVariant);
    if (dimensions.length > 0) {
      specs.push({ label: "Dimensions", value: dimensions });
    }

    return specs;
  })();

  const statusBanner =
    cartStatusMessage || cartErrorMessage ? (
      <div className="mb-4 min-[700px]:mb-5">
        {cartStatusMessage ? <Notice tone="success">{cartStatusMessage}</Notice> : null}
        {cartErrorMessage ? <Notice tone="alert">{cartErrorMessage}</Notice> : null}
      </div>
    ) : undefined;

  const heroCta =
    singleOffer && singleOffer.isAvailable ? (
      <form action={addToCartAction} className="grid gap-3">
        <input type="hidden" name="productSlug" value={product.slug} />
        <input type="hidden" name="variantId" value={singleOffer.id} />

        <div className="grid gap-2">
          <Label htmlFor="hero-quantity">Quantité</Label>
          <Input
            id="hero-quantity"
            name="quantity"
            type="number"
            min={1}
            step={1}
            defaultValue={1}
          />
        </div>

        <CustomButton type="submit">Ajouter au panier</CustomButton>
      </form>
    ) : !isSimpleProduct ? (
      <CustomButton asChild>
        <Link href="#offers">Choisir une déclinaison</Link>
      </CustomButton>
    ) : null;

  const offersSummaryContent =
    !isSimpleProduct && variantSummary ? (
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-control-border bg-control-surface px-2.5 py-1 text-micro-copy font-medium text-text-muted-strong">
          {variantSummary.total} déclinaison{variantSummary.total > 1 ? "s" : ""}
        </span>
        <span className="rounded-full border border-control-border bg-control-surface px-2.5 py-1 text-micro-copy font-medium text-text-muted-strong">
          {variantSummary.available} disponible{variantSummary.available > 1 ? "s" : ""}
        </span>
      </div>
    ) : undefined;

  const renderVariantCta = (variant: OfferVariant) => {
    if (!variant.isAvailable) {
      return (
        <p className="text-micro-copy reading-compact font-medium text-feedback-error-foreground">
          Indisponible actuellement.
        </p>
      );
    }

    return (
      <div className="grid gap-2">
        <p className="text-micro-copy reading-compact text-text-muted-strong">Ajout au panier</p>
        <form action={addToCartAction} className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="productSlug" value={product.slug} />
          <input type="hidden" name="variantId" value={variant.id} />

          <div className="grid gap-1">
            <Label htmlFor={`quantity-${variant.id}`} className="sr-only">
              Quantité
            </Label>
            <Input
              id={`quantity-${variant.id}`}
              name="quantity"
              type="number"
              min={1}
              step={1}
              defaultValue={1}
              className="h-9 w-20"
            />
          </div>

          <CustomButton type="submit" size="sm">
            Ajouter au panier
          </CustomButton>
        </form>
      </div>
    );
  };

  const productJsonLd: ProductJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pickSeoText(product.name) ?? product.name,
    description: getProductJsonLdDescription(product),
    url: `${clientEnv.appUrl}/boutique/${product.slug}`,
    ...(product.images[0] && {
      image: toAbsoluteUrl(product.images[0].src, clientEnv.appUrl),
    }),
  };

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
        heroCta={heroCta}
        heroVariantSummary={variantSummary}
        offersSummaryContent={offersSummaryContent}
        renderVariantCta={renderVariantCta}
      />
    </>
  );
}
