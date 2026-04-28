import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { clientEnv } from "@/core/config/env";
import { getPublishedProductBySlug } from "@/features/storefront/catalog";
import { ProductPageCartFeedbackToast } from "@/features/storefront/catalog/product-page/components/product-page-cart-feedback-toast";
import { ProductPageTemplate } from "@/features/storefront/catalog/product-page/components/product-page-template";
import { buildProductPageViewModel } from "@/features/storefront/catalog/product-page/composition/build-product-page-view-model";
import { buildStorefrontProductPageRendering } from "@/features/storefront/catalog/product-page/composition/build-storefront-product-page-rendering";
import { buildProductJsonLd } from "@/features/storefront/catalog/product-page/model/build-product-json-ld";
import { buildSeoDescription, pickSeoText } from "@/entities/product/seo-text";

export const dynamic = "force-dynamic";

type ProductPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

type ProductMetadataSource = NonNullable<Awaited<ReturnType<typeof getPublishedProductBySlug>>>;

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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (product === null) {
    notFound();
  }

  const viewModel = buildProductPageViewModel(product);
  const rendering = buildStorefrontProductPageRendering({
    productSlug: product.slug,
    isSimpleProduct: viewModel.isSimpleProduct,
    singleOffer: viewModel.singleOffer,
  });

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
      <ProductPageCartFeedbackToast />

      <ProductPageTemplate
        productName={product.name}
        productSlug={product.slug}
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
        heroCta={rendering.heroCta}
        heroVariantSummary={viewModel.variantSummary}
      />
    </>
  );
}
