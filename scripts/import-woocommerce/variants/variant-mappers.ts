import { ProductStatus } from "../../../src/generated/prisma/client";
import type { WooProduct, WooVariation } from "../schemas";
import { buildVariationDisplayName, buildVariationSlug } from "../normalizers/attributes";
import { normalizeMoneyToDecimalString, resolveCompareAtAmount } from "../normalizers/money";
import { slugify } from "../normalizers/slug";
import { toNullableText } from "../normalizers/text";
import { normalizeProductStatus, normalizeVariantStatus } from "../normalizers/status";
import type { ImportedVariantInput, ImportedVariantOptionSelectionInput } from "./variant.types";

function buildFallbackVariantSku(input: { product: WooProduct; variation?: WooVariation }): string {
  if (input.variation) {
    return `WOO-VARIATION-${input.variation.id}`;
  }

  return `WOO-PRODUCT-${input.product.id}`;
}

function resolveRequiredVariantSku(input: {
  product: WooProduct;
  variation?: WooVariation;
}): string {
  const sourceSku = input.variation ? input.variation.sku : input.product.sku;
  const normalizedSku = toNullableText(sourceSku);

  if (normalizedSku !== null) {
    return normalizedSku;
  }

  return buildFallbackVariantSku(input);
}

function mapVariationOptionSelections(
  variation: WooVariation
): ImportedVariantOptionSelectionInput[] {
  return (variation.attributes ?? [])
    .map((attribute) => {
      const optionName = attribute.name.trim();
      const valueName = attribute.option.trim();

      if (optionName.length === 0 || valueName.length === 0) {
        return null;
      }

      return {
        optionName,
        optionCode: slugify(optionName),
        valueName,
        valueCode: slugify(valueName),
      };
    })
    .filter((value): value is ImportedVariantOptionSelectionInput => value !== null);
}

export function mapSimpleProductToSingleVariant(product: WooProduct): ImportedVariantInput {
  const productStatus = normalizeProductStatus(product.status);
  const amount =
    normalizeMoneyToDecimalString(product.price) ??
    normalizeMoneyToDecimalString(product.regular_price);

  return {
    externalId: `woo_product:${product.id}`,
    sku: resolveRequiredVariantSku({ product }),
    slug: null,
    name: product.name.trim(),
    status:
      productStatus === ProductStatus.ACTIVE
        ? "ACTIVE"
        : productStatus === ProductStatus.DRAFT
          ? "DRAFT"
          : "ARCHIVED",
    isDefault: true,
    sortOrder: 0,
    amount,
    compareAtAmount: resolveCompareAtAmount(
      amount,
      normalizeMoneyToDecimalString(product.regular_price)
    ),
    image: product.images[0] ?? null,
    externalReference: `woo_product:${product.id}`,
    optionSelections: [],
  };
}

export function mapWooVariationToImportedVariant(input: {
  product: WooProduct;
  variation: WooVariation;
  index: number;
}): ImportedVariantInput {
  const productStatus = normalizeProductStatus(input.product.status);
  const amount =
    normalizeMoneyToDecimalString(input.variation.price) ??
    normalizeMoneyToDecimalString(input.variation.regular_price);

  return {
    externalId: `woo_variation:${input.variation.id}`,
    sku: resolveRequiredVariantSku({
      product: input.product,
      variation: input.variation,
    }),
    slug: buildVariationSlug(input.variation),
    name: buildVariationDisplayName(input.product.name, input.variation, input.index),
    status: normalizeVariantStatus(productStatus, input.variation.status),
    isDefault: input.index === 0,
    sortOrder: input.index,
    amount,
    compareAtAmount: resolveCompareAtAmount(
      amount,
      normalizeMoneyToDecimalString(input.variation.regular_price)
    ),
    image: input.variation.image?.src ? input.variation.image : null,
    externalReference: `woo_variation:${input.variation.id}`,
    optionSelections: mapVariationOptionSelections(input.variation),
  };
}

export function mapPreparedProductToImportedVariants(input: {
  product: WooProduct;
  variations: readonly WooVariation[];
}): ImportedVariantInput[] {
  if (input.product.type !== "variable" || input.variations.length === 0) {
    return [mapSimpleProductToSingleVariant(input.product)];
  }

  return input.variations.map((variation, index) =>
    mapWooVariationToImportedVariant({
      product: input.product,
      variation,
      index,
    })
  );
}
