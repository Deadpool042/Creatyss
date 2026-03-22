import { prisma } from "@/db/prisma-client";
import { mediaAssetSelect } from "../types/rows";

export async function findMediaAssetRowById(id: string) {
  return prisma.mediaAsset.findUnique({
    where: { id },
    select: mediaAssetSelect,
  });
}

export async function findMediaAssetRowByStorageKey(storageKey: string) {
  return prisma.mediaAsset.findFirst({
    where: { storageKey },
    select: mediaAssetSelect,
  });
}

export async function listMediaAssetRows() {
  return prisma.mediaAsset.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: mediaAssetSelect,
  });
}
