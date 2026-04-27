import type { Prisma } from "@/prisma-generated/client";
import type {
  PUBLISHED_PRODUCT_CORE_SELECT,
  PUBLISHED_PRODUCT_SEO_SELECT,
  PUBLISHED_PRODUCT_GALLERY_SELECT,
} from "./selects";

export type PublishedProductCoreRecord = Prisma.ProductGetPayload<{
  select: typeof PUBLISHED_PRODUCT_CORE_SELECT;
}>;

export type PublishedProductSeoRecord = Prisma.SeoMetadataGetPayload<{
  select: typeof PUBLISHED_PRODUCT_SEO_SELECT;
}> | null;

export type PublishedProductGalleryItem = Prisma.MediaReferenceGetPayload<{
  select: typeof PUBLISHED_PRODUCT_GALLERY_SELECT;
}>;
