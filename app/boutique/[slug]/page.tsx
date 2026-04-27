import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Notice } from "@/components/shared/notice";
import { clientEnv } from "@/core/config/env";
import { getPublishedProductBySlug } from "@/features/storefront/catalog";
import { buildProductJsonLd } from "@/features/storefront/catalog/model/build-product-json-ld";
import { ProductPageTemplate } from "@/features/storefront/catalog/product-page/components/product-page-template";
import { buildProductPageViewModel } from "@/features/storefront/catalog/product-page/composition/build-product-page-view-model";
import { buildStorefrontProductPageRendering } from "@/features/storefront/catalog/product-page/composition/build-storefront-product-page-rendering";
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
  const twitterImageUrl =
    product.seoTwitterImageUrl ?? product.seoOpenGraphImageUrl ?? ogImageUrl;

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

  const viewModel = buildProductPageViewModel(product);
  const rendering = buildStorefrontProductPageRendering({
    productSlug: product.slug,
    isSimpleProduct: viewModel.isSimpleProduct,
    singleOffer: viewModel.singleOffer,
    variantSummary: viewModel.variantSummary,
  });

  const statusBanner =
    cartStatusMessage || cartErrorMessage ? (
      <div className="mb-4 min-[700px]:mb-5">
        {cartStatusMessage ? <Notice tone="success">{cartStatusMessage}</Notice> : null}
        {cartErrorMessage ? <Notice tone="alert">{cartErrorMessage}</Notice> : null}
      </div>
    ) : undefined;

  const productJsonLd = buildProductJsonLd({
    product,
    appUrl: clientEnv.appUrl,
  });

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
        images={viewModel.productImages}
        variants={viewModel.variantsNormalized}
        characteristics={product.characteristics}
        technicalSpecs={viewModel.technicalSpecs}
        relatedProductGroups={product.relatedProductGroups}
        statusBanner={statusBanner}
        heroCta={rendering.heroCta}
        heroVariantSummary={viewModel.variantSummary}
        offersSummaryContent={rendering.offersSummaryContent}
        renderVariantCta={rendering.renderVariantCta}
      />
    </>
  );
}
