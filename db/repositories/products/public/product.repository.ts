import type { ProductDetail, ProductSummary } from "./product.types";
import { mapProductDetail, mapProductSummary } from "@db-products/helpers/mappers";
import {
  findProductRowById,
  findProductRowBySlug,
  listFeaturedProductRows,
  listPublishedProductRows,
} from "@db-products/queries/product";
import { assertValidProductId, normalizeProductSlug } from "@db-products/helpers/validation";

export async function findProductById(id: string): Promise<ProductDetail | null> {
  assertValidProductId(id);

  const row = await findProductRowById(id);

  if (!row) {
    return null;
  }

  return mapProductDetail(row);
}

export async function findProductBySlug(slug: string): Promise<ProductDetail | null> {
  const normalizedSlug = normalizeProductSlug(slug);
  const row = await findProductRowBySlug(normalizedSlug);

  if (!row) {
    return null;
  }

  return mapProductDetail(row);
}

export async function listPublishedProducts(): Promise<ProductSummary[]> {
  const rows = await listPublishedProductRows();
  return rows.map(mapProductSummary);
}

export async function listFeaturedProducts(): Promise<ProductSummary[]> {
  const rows = await listFeaturedProductRows();
  return rows.map(mapProductSummary);
}
