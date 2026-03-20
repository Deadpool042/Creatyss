import type { PublishedProductImage, PublishedProductSummary } from "../types/outputs";
import type { PublishedProductSummaryRecord } from "../queries/recent-products.queries";

function toDbId(id: bigint): string {
  return id.toString();
}

function toPublishedProductType(value: string): PublishedProductSummary["productType"] {
  return value as PublishedProductSummary["productType"];
}

export function mapPublishedProductSummaryRecord(
  product: PublishedProductSummaryRecord,
  primaryImage: PublishedProductImage | null
): PublishedProductSummary {
  return {
    id: toDbId(product.id),
    name: product.name,
    slug: product.slug,
    shortDescription: product.short_description,
    description: product.description,
    productType: toPublishedProductType(product.product_type),
    isFeatured: product.is_featured,
    seoTitle: product.seo_title,
    seoDescription: product.seo_description,
    createdAt: product.created_at.toISOString(),
    updatedAt: product.updated_at.toISOString(),
    primaryImage,
  };
}
