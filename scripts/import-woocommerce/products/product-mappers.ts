import { ProductStatus } from "../../../src/generated/prisma/client";
import type { WooProduct } from "../schemas";
import { slugify } from "../normalizers/slug";
import { normalizeProductStatus } from "../normalizers/status";
import { toNullableText } from "../normalizers/text";
import type { ImportedProductInput } from "./product.types";

export function mapWooProductToImportedProduct(
  product: WooProduct,
  productTypeId: string | null
): ImportedProductInput {
  const status = normalizeProductStatus(product.status);

  return {
    externalId: `woo_product:${product.id}`,
    productTypeId,
    slug: slugify(product.slug || product.name),
    name: product.name.trim(),
    skuRoot: toNullableText(product.sku),
    shortDescription: toNullableText(product.short_description),
    description: toNullableText(product.description),
    status,
    isFeatured: product.featured,
    isStandalone: true,
    publishedAt: status === ProductStatus.ACTIVE ? new Date() : null,
    categoryExternalIds: product.categories.map((category) => `woo_category:${category.id}`),
    images: product.images,
  };
}
