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
  const resolvedProduct = localizedProduct ?? product;

  const localizedRelatedTargets = await resolveLocalizedProductCopy(
    resolvedProduct.relatedFrom.map((rel) => rel.targetProduct)
  );
  const localizedRelatedTargetsById = new Map(
    localizedRelatedTargets.map((target) => [target.id, target])
  );
  const productWithLocalizedRelated = {
    ...resolvedProduct,
    relatedFrom: resolvedProduct.relatedFrom.map((rel) => ({
      ...rel,
      targetProduct: localizedRelatedTargetsById.get(rel.targetProduct.id) ?? rel.targetProduct,
    })),
  };

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
    product: productWithLocalizedRelated,
    seoMetadata: localizedSeoMetadata,
    galleryReferences,
    uploadsPublicPath: getUploadsPublicPath(),
  });
}
