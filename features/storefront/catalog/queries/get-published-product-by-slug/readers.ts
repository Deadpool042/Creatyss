import { db } from "@/core/db";
import {
  PUBLISHED_PRODUCT_CORE_SELECT,
  PUBLISHED_PRODUCT_SEO_SELECT,
  PUBLISHED_PRODUCT_GALLERY_SELECT,
} from "./selects";
import type {
  PublishedProductCoreRecord,
  PublishedProductSeoRecord,
  PublishedProductGalleryItem,
} from "./types";

export async function readPublishedProductBySlug(
  slug: string
): Promise<PublishedProductCoreRecord | null> {
  return db.product.findFirst({
    where: {
      slug,
      status: "ACTIVE",
      archivedAt: null,
    },
    select: PUBLISHED_PRODUCT_CORE_SELECT,
  });
}

export async function readPublishedProductSideData(input: {
  storeId: string;
  productId: string;
}): Promise<{
  seoMetadata: PublishedProductSeoRecord;
  galleryReferences: PublishedProductGalleryItem[];
}> {
  const [seoMetadata, galleryReferences] = await Promise.all([
    db.seoMetadata.findFirst({
      where: {
        storeId: input.storeId,
        subjectType: "PRODUCT",
        subjectId: input.productId,
        archivedAt: null,
      },
      select: PUBLISHED_PRODUCT_SEO_SELECT,
    }),
    db.mediaReference.findMany({
      where: {
        subjectType: "PRODUCT",
        subjectId: input.productId,
        role: "GALLERY",
        isActive: true,
        archivedAt: null,
        asset: {
          archivedAt: null,
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: PUBLISHED_PRODUCT_GALLERY_SELECT,
    }),
  ]);

  return { seoMetadata, galleryReferences };
}
