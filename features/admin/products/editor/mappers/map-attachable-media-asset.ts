import type { AttachableMediaAssetItem } from "@/features/admin/products/editor/types/product-image-library.types";

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
