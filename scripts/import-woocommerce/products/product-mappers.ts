import { ProductStatus } from "../../../src/generated/prisma/client";
import type { WooProduct } from "../schemas";
import { slugify } from "../normalizers/slug";
import { normalizeProductStatus } from "../normalizers/status";
import { toNullableText } from "../normalizers/text";
import type { ImportedProductInput } from "./product.types";

type CanonicalProductTypeIds = {
  simple: string;
  variable: string;
};

export function mapWooProductToImportedProduct(
  product: WooProduct,
  productTypeIds: CanonicalProductTypeIds
): ImportedProductInput {
  const status = normalizeProductStatus(product.status);
  const isVariableProduct = product.type === "variable";

  return {
    externalId: `woo_product:${product.id}`,
    productTypeId: isVariableProduct ? productTypeIds.variable : productTypeIds.simple,
    slug: slugify(product.slug || product.name),
    name: product.name.trim(),
    skuRoot: toNullableText(product.sku),
    shortDescription: toNullableText(product.short_description),
    description: toNullableText(product.description),
    status,
    isFeatured: product.featured,
    isStandalone: !isVariableProduct,
    publishedAt: status === ProductStatus.ACTIVE ? new Date() : null,
    categoryExternalIds: product.categories.map((category) => `woo_category:${category.id}`),
    images: product.images,
  };
}
