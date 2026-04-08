import { MediaReferenceRole } from "@/prisma-generated/client";

import type { AdminProductImageItem } from "@/features/admin/products/editor/types/product-images.types";

type ProductImageSource = {
  id: string;
  role: MediaReferenceRole;
  sortOrder: number;
  isPrimary: boolean;
  asset: {
    id: string;
    publicUrl: string | null;
    altText: string | null;
  };
};

function mapRole(role: MediaReferenceRole): AdminProductImageItem["role"] {
  if (role === MediaReferenceRole.PRIMARY) {
    return "primary";
  }

  return "gallery";
}

export function mapAdminProductImageItem(image: ProductImageSource): AdminProductImageItem | null {
  if (!image.asset.publicUrl) {
    return null;
  }

  return {
    assetId: image.asset.id,
    referenceId: image.id,
    publicUrl: image.asset.publicUrl,
    altText: image.asset.altText,
    role: mapRole(image.role),
    isPrimary: image.isPrimary,
    sortOrder: image.sortOrder,
  };
}
