import "server-only";

import { getUploadsPublicPath } from "@/core/uploads";
import { resolveLocalizedProductCopy } from "@/features/storefront/catalog/queries/resolve-localized-product-copy";
import { resolveLocalizedProductSeoCopy } from "@/features/storefront/catalog/queries/resolve-localized-product-seo-copy";
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

  const [localizedProduct] = await resolveLocalizedProductCopy([product]);

  const { seoMetadata, galleryReferences } = await readPublishedProductSideData({
    storeId: product.storeId,
    productId: product.id,
  });

  const localizedSeoMetadata = await resolveLocalizedProductSeoCopy(
    product.storeId,
    product.id,
    seoMetadata
  );

  return mapPublishedProductDetail({
    product: localizedProduct ?? product,
    seoMetadata: localizedSeoMetadata,
    galleryReferences,
    uploadsPublicPath: getUploadsPublicPath(),
  });
}
