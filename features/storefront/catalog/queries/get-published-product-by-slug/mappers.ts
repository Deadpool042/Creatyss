import { localUploadExists } from "@/core/uploads/check-local-upload";
import { toSeoPlainTextOrNull } from "@/entities/product/seo-text";
import {
  buildCatalogImageUrl,
  dedupeCatalogImages,
  mapCatalogImage,
  type CatalogImage,
} from "@/features/storefront/catalog/helpers/catalog-images";
import {
  formatCatalogMoney,
  formatCatalogMoneyFromCents,
} from "@/features/storefront/catalog/helpers/catalog-pricing";
import {
  getCatalogProductAvailabilityStatus,
  getCatalogVariantAvailability,
  getCatalogVariantAvailabilityStatus,
} from "@/features/storefront/catalog/helpers/catalog-availability";
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

function isValidColorHex(value: string | null): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim();
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized);
}

function resolveVariantColorPresentation(
  optionValues: PublishedProductCoreRecord["variants"][number]["optionValues"]
): { colorName: string | null; colorHex: string | null } {
  const colorCandidate = optionValues.find((item) => {
    const optionCode = item.optionValue.option.name.trim().toLowerCase();
    return optionCode.includes("color") || optionCode.includes("couleur");
  });

  if (!colorCandidate) {
    return { colorName: null, colorHex: null };
  }

  const colorName = (colorCandidate.optionValue.label ?? colorCandidate.optionValue.value).trim();
  const normalizedHex = colorCandidate.optionValue.colorHex?.trim() ?? null;

  return {
    colorName: colorName.length > 0 ? colorName : null,
    colorHex: isValidColorHex(normalizedHex) ? normalizedHex.toUpperCase() : null,
  };
}

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

    const colorPresentation = resolveVariantColorPresentation(variant.optionValues);

    return {
      id: variant.id,
      sku: variant.sku,
      name: variant.name ?? productName,
      colorName: colorPresentation.colorName,
      colorHex: colorPresentation.colorHex,
      isDefault: variant.isDefault,
      availabilityStatus: getCatalogVariantAvailabilityStatus(variant),
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
  type RelatedAvailabilityLabel = "En stock" | "Sur commande" | "Indisponible";

  const getAvailabilityLabel = (
    availabilityStatus: "in-stock" | "made-to-order" | "unavailable"
  ): RelatedAvailabilityLabel => {
    if (availabilityStatus === "in-stock") {
      return "En stock";
    }

    if (availabilityStatus === "made-to-order") {
      return "Sur commande";
    }

    return "Indisponible";
  };

  for (const rel of relatedFrom) {
    const config = CATALOG_RELATED_TYPE_CONFIG[rel.type];
    if (!config) continue;
    if (!groupsMap.has(rel.type)) {
      groupsMap.set(rel.type, []);
    }

    const availabilityStatus = getCatalogProductAvailabilityStatus(rel.targetProduct.variants);
    const isAvailable = rel.targetProduct.variants.some(getCatalogVariantAvailability);

    groupsMap.get(rel.type)!.push({
      id: rel.targetProduct.id,
      slug: rel.targetProduct.slug,
      name: rel.targetProduct.name,
      catalogPriceCents: rel.targetProduct.catalogPriceCents,
      catalogPriceCurrencyCode: rel.targetProduct.catalogPriceCurrencyCode,
      catalogPriceSource: rel.targetProduct.catalogPriceSource,
      price:
        formatCatalogMoneyFromCents(
          rel.targetProduct.catalogPriceCents,
          rel.targetProduct.catalogPriceCurrencyCode
        ) || null,
      availabilityStatus,
      availabilityLabel: getAvailabilityLabel(availabilityStatus),
      isAvailable,
      shortDescription: rel.targetProduct.shortDescription,
      imageFilePath: (() => {
        const key = rel.targetProduct.primaryImage?.storageKey ?? null;
        return key !== null && localUploadExists(key) ? key : null;
      })(),
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

  const catalogPriceLabel = formatCatalogMoneyFromCents(
    product.catalogPriceCents,
    product.catalogPriceCurrencyCode
  );
  const productLevelPrice = product.prices[0] ?? null;
  const variantsFromRelations = mapVariants(
    product.variants,
    productLevelPrice,
    product.name,
    uploadsPublicPath
  );
  const variants =
    product.isStandalone && catalogPriceLabel.length > 0 && variantsFromRelations.length > 0
      ? variantsFromRelations.map((variant, index) =>
          index === 0 ? { ...variant, price: catalogPriceLabel } : variant
        )
      : variantsFromRelations;
  const images = mapImages(product.primaryImage, galleryReferences, uploadsPublicPath);
  const availabilityStatus = variants.some((variant) => variant.availabilityStatus === "in-stock")
    ? "in-stock"
    : variants.some((variant) => variant.availabilityStatus === "made-to-order")
      ? "made-to-order"
      : "unavailable";
  const isAvailable = variants.some((v) => v.isAvailable);
  const relatedProductGroups = mapRelatedGroups(product.relatedFrom);

  const ogImageStorageKey = seoMetadata?.openGraphImage?.storageKey ?? null;
  const twitterImageStorageKey = seoMetadata?.twitterImage?.storageKey ?? null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    catalogPriceCents: product.catalogPriceCents,
    catalogPriceCurrencyCode: product.catalogPriceCurrencyCode,
    catalogPriceSource: product.catalogPriceSource,
    catalogPrice: catalogPriceLabel.length > 0 ? catalogPriceLabel : null,
    marketingHook: product.marketingHook,
    shortDescription: product.shortDescription,
    description: product.description,
    careInstructions: product.careInstructions,
    shippingReturnsPolicy: product.store.shippingReturnsPolicy,
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
    availabilityStatus,
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
