import { toSeoPlainTextOrNull } from "@/entities/product/seo-text";
import {
  buildCatalogImageUrl,
  dedupeCatalogImages,
  mapCatalogImage,
  type CatalogImage,
} from "@/features/storefront/catalog/helpers/catalog-images";
import { formatCatalogMoney } from "@/features/storefront/catalog/helpers/catalog-pricing";
import { getCatalogVariantAvailability } from "@/features/storefront/catalog/helpers/catalog-availability";
import {
  CATALOG_RELATED_TYPE_CONFIG,
  CATALOG_RELATED_TYPE_ORDER,
} from "@/features/storefront/catalog/helpers/related-product-groups";
import type {
  CatalogVariant,
  CatalogProductDetail,
  CatalogRelatedProduct,
  CatalogRelatedProductGroup,
} from "@/features/storefront/catalog/types";
import type {
  PublishedProductCoreRecord,
  PublishedProductSeoRecord,
  PublishedProductGalleryItem,
} from "./types";

function mapVariants(
  variants: PublishedProductCoreRecord["variants"],
  productLevelPrice: PublishedProductCoreRecord["prices"][number] | null,
  productName: string,
  uploadsPublicPath: string
): CatalogVariant[] {
  return variants.map((variant) => {
    const variantPrice = variant.prices[0] ?? null;
    const activePrice = variantPrice ?? productLevelPrice;
    const compareAtAmount =
      variantPrice?.compareAtAmount ?? productLevelPrice?.compareAtAmount ?? null;
    const image = variant.primaryImage
      ? [mapCatalogImage(variant.primaryImage, uploadsPublicPath)]
      : [];

    return {
      id: variant.id,
      sku: variant.sku,
      name: variant.name ?? productName,
      colorName: null,
      colorHex: null,
      isDefault: variant.isDefault,
      isAvailable: getCatalogVariantAvailability(variant),
      price: formatCatalogMoney(activePrice?.amount ?? null),
      compareAtPrice: formatCatalogMoney(compareAtAmount) || null,
      images: image,
      barcode: variant.barcode ?? null,
      externalReference: variant.externalReference ?? null,
      weightGrams: variant.weightGrams ?? null,
      widthMm: variant.widthMm ?? null,
      heightMm: variant.heightMm ?? null,
      depthMm: variant.depthMm ?? null,
      optionValues: [...variant.optionValues]
        .sort((left, right) => {
          const optionOrder =
            left.optionValue.option.sortOrder - right.optionValue.option.sortOrder;

          if (optionOrder !== 0) {
            return optionOrder;
          }

          const valueOrder = left.optionValue.sortOrder - right.optionValue.sortOrder;

          if (valueOrder !== 0) {
            return valueOrder;
          }

          return left.optionValue.option.name.localeCompare(right.optionValue.option.name, "fr");
        })
        .map((item) => ({
          optionId: item.optionValue.option.id,
          optionName: item.optionValue.option.name,
          valueId: item.optionValue.id,
          valueLabel: item.optionValue.label ?? item.optionValue.value,
        })),
    };
  });
}

function mapImages(
  primaryImage: PublishedProductCoreRecord["primaryImage"],
  galleryReferences: PublishedProductGalleryItem[],
  uploadsPublicPath: string
): CatalogImage[] {
  const primary = primaryImage
    ? [mapCatalogImage(primaryImage, uploadsPublicPath)]
    : [];
  const gallery = galleryReferences.map((ref) =>
    mapCatalogImage(ref.asset, uploadsPublicPath)
  );
  return dedupeCatalogImages([...primary, ...gallery]);
}

function mapRelatedGroups(
  relatedFrom: PublishedProductCoreRecord["relatedFrom"]
): CatalogRelatedProductGroup[] {
  const groupsMap = new Map<string, CatalogRelatedProduct[]>();

  for (const rel of relatedFrom) {
    const config = CATALOG_RELATED_TYPE_CONFIG[rel.type];
    if (!config) continue;
    if (!groupsMap.has(rel.type)) {
      groupsMap.set(rel.type, []);
    }
    groupsMap.get(rel.type)!.push({
      id: rel.targetProduct.id,
      slug: rel.targetProduct.slug,
      name: rel.targetProduct.name,
      shortDescription: rel.targetProduct.shortDescription,
      imageFilePath: rel.targetProduct.primaryImage?.storageKey ?? null,
      imageAltText: rel.targetProduct.primaryImage?.altText ?? null,
    });
  }

  return CATALOG_RELATED_TYPE_ORDER
    .filter((t) => groupsMap.has(t))
    .map((t) => ({
      type: CATALOG_RELATED_TYPE_CONFIG[t]!.type,
      label: CATALOG_RELATED_TYPE_CONFIG[t]!.label,
      products: groupsMap.get(t)!,
    }));
}

export function mapPublishedProductDetail(input: {
  product: PublishedProductCoreRecord;
  seoMetadata: PublishedProductSeoRecord;
  galleryReferences: PublishedProductGalleryItem[];
  uploadsPublicPath: string;
}): CatalogProductDetail {
  const { product, seoMetadata, galleryReferences, uploadsPublicPath } = input;

  const productLevelPrice = product.prices[0] ?? null;
  const variants = mapVariants(product.variants, productLevelPrice, product.name, uploadsPublicPath);
  const images = mapImages(product.primaryImage, galleryReferences, uploadsPublicPath);
  const isAvailable = variants.some((v) => v.isAvailable);
  const relatedProductGroups = mapRelatedGroups(product.relatedFrom);

  const ogImageStorageKey = seoMetadata?.openGraphImage?.storageKey ?? null;
  const twitterImageStorageKey = seoMetadata?.twitterImage?.storageKey ?? null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    marketingHook: product.marketingHook,
    shortDescription: product.shortDescription,
    description: product.description,
    seoTitle: toSeoPlainTextOrNull(seoMetadata?.metaTitle ?? null),
    seoDescription: toSeoPlainTextOrNull(seoMetadata?.metaDescription ?? null),
    seoIndexingMode: seoMetadata?.indexingMode ?? null,
    seoCanonicalPath: toSeoPlainTextOrNull(seoMetadata?.canonicalPath ?? null),
    seoOpenGraphTitle: toSeoPlainTextOrNull(seoMetadata?.openGraphTitle ?? null),
    seoOpenGraphDescription: toSeoPlainTextOrNull(seoMetadata?.openGraphDescription ?? null),
    seoOpenGraphImageUrl: ogImageStorageKey
      ? buildCatalogImageUrl(ogImageStorageKey, uploadsPublicPath)
      : null,
    seoTwitterTitle: toSeoPlainTextOrNull(seoMetadata?.twitterTitle ?? null),
    seoTwitterDescription: toSeoPlainTextOrNull(seoMetadata?.twitterDescription ?? null),
    seoTwitterImageUrl: twitterImageStorageKey
      ? buildCatalogImageUrl(twitterImageStorageKey, uploadsPublicPath)
      : null,
    productType: product.isStandalone ? "simple" : "variable",
    isAvailable,
    images,
    variants,
    relatedProductGroups,
    characteristics: product.characteristics.map((c) => ({
      id: c.id,
      label: c.label,
      value: c.value,
    })),
  };
}
