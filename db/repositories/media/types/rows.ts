import type { Prisma } from "@prisma/client";

export const mediaAssetSelect = {
  id: true,
  storageKey: true,
  originalName: true,
  mimeType: true,
  byteSize: true,
  width: true,
  height: true,
  altText: true,
  checksumSha256: true,
  uploadedByUserId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.MediaAssetSelect;

export type MediaAssetRow = Prisma.MediaAssetGetPayload<{
  select: typeof mediaAssetSelect;
}>;
