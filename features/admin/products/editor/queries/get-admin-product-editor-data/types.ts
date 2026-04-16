import type { Prisma } from "@/prisma-generated/client";
import type {
  PRODUCT_EDITOR_CORE_SELECT,
  PRODUCT_EDITOR_MEDIA_REFERENCE_SELECT,
  PRODUCT_EDITOR_SEO_METADATA_SELECT,
} from "./selects";

export type ProductEditorCoreRecord = Prisma.ProductGetPayload<{
  select: typeof PRODUCT_EDITOR_CORE_SELECT;
}>;

export type ProductEditorMediaReferenceRecord = Prisma.MediaReferenceGetPayload<{
  select: typeof PRODUCT_EDITOR_MEDIA_REFERENCE_SELECT;
}>;

export type ProductEditorSeoMetadataRecord = Prisma.SeoMetadataGetPayload<{
  select: typeof PRODUCT_EDITOR_SEO_METADATA_SELECT;
}> | null;
