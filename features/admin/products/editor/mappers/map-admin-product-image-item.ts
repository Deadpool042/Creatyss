import { MediaReferenceRole, type MediaReferenceSubjectType } from "@/prisma-generated/client";
import type { AdminProductImageItem } from "@/features/admin/products/editor/types/product-images.types";

type ProductImageSource = {
  id: string;
  assetId: string;
  subjectType: MediaReferenceSubjectType;
  subjectId: string;
  role: MediaReferenceRole;
  sortOrder: number;
  isPrimary: boolean;
  asset: {
    publicUrl: string | null;
    storageKey: string;
    altText: string | null;
    originalFilename: string | null;
    mimeType: string | null;
  };
};

function mapRole(role: MediaReferenceRole): AdminProductImageItem["role"] {
  switch (role) {
    case MediaReferenceRole.PRIMARY:
      return "primary";
    case MediaReferenceRole.COVER:
      return "cover";
    case MediaReferenceRole.THUMBNAIL:
      return "thumbnail";
    case MediaReferenceRole.OTHER:
      return "other";
    default:
      return "gallery";
  }
}

export function mapAdminProductImageItem(image: ProductImageSource): AdminProductImageItem {
  return {
    id: image.id,
    mediaAssetId: image.assetId,
    subjectType: image.subjectType === "PRODUCT_VARIANT" ? "product_variant" : "product",
    subjectId: image.subjectId,
    role: mapRole(image.role),
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
    publicUrl: image.asset.publicUrl,
    storageKey: image.asset.storageKey,
    altText: image.asset.altText,
    originalName: image.asset.originalFilename,
    mimeType: image.asset.mimeType,
  };
}
