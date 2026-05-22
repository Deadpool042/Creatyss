import { MediaReferenceRole, type MediaReferenceSubjectType } from "@/prisma-generated/client";
import type { AdminPriceListOption } from "@/features/admin/products/editor/types";
import type {
  AdminProductImageItem,
  AttachableMediaAssetItem,
} from "@/features/admin/products/editor/types/product-image.types";

// ---------------------------------------------------------------------------
// mapAdminPriceListOption
// ---------------------------------------------------------------------------

type PriceListOptionSource = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  currencyCode: string;
};

export function mapAdminPriceListOption(priceList: PriceListOptionSource): AdminPriceListOption {
  return {
    id: priceList.id,
    code: priceList.code,
    name: priceList.name,
    isDefault: priceList.isDefault,
    currencyCode: priceList.currencyCode,
  };
}

// ---------------------------------------------------------------------------
// mapAdminProductImageItem
// ---------------------------------------------------------------------------

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
    widthPx?: number | null;
    heightPx?: number | null;
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
    widthPx: image.asset.widthPx ?? null,
    heightPx: image.asset.heightPx ?? null,
  };
}

// ---------------------------------------------------------------------------
// mapAttachableMediaAsset
// ---------------------------------------------------------------------------

type ReadAttachableMediaAssetRow = {
  id: string;
  publicUrl: string | null;
  altText: string | null;
  originalFilename: string | null;
  createdAt: Date;
};

export function mapAttachableMediaAsset(
  input: ReadAttachableMediaAssetRow
): AttachableMediaAssetItem | null {
  if (!input.publicUrl || input.publicUrl.trim().length === 0) {
    return null;
  }

  return {
    id: input.id,
    publicUrl: input.publicUrl,
    altText: input.altText,
    originalFilename: input.originalFilename,
    createdAt: input.createdAt.toISOString(),
  };
}
