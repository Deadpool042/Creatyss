import { getUploadsPublicPath } from "@/core/uploads";
import type { CatalogProductDetail } from "@/features/storefront/catalog/types";
import { readPublishedProductBySlug, readPublishedProductSideData } from "./readers";
import { mapPublishedProductDetail } from "./mappers";

export async function getPublishedProductBySlug(
  slug: string
): Promise<CatalogProductDetail | null> {
  const product = await readPublishedProductBySlug(slug);
  if (product === null) {
    return null;
  }

  const { seoMetadata, galleryReferences } = await readPublishedProductSideData({
    storeId: product.storeId,
    productId: product.id,
  });

  return mapPublishedProductDetail({
    product,
    seoMetadata,
    galleryReferences,
    uploadsPublicPath: getUploadsPublicPath(),
  });
}
