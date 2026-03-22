import { prisma } from "@/db/prisma-client";
import { mediaAssetSelect } from "../types/rows";

export async function findAdminMediaAssetRowById(id: string) {
  return prisma.mediaAsset.findUnique({
    where: { id },
    select: mediaAssetSelect,
  });
}

export async function findAdminMediaAssetRowByStorageKey(storageKey: string) {
  return prisma.mediaAsset.findFirst({
    where: { storageKey },
    select: mediaAssetSelect,
  });
}

export async function listAdminMediaAssetRows() {
  return prisma.mediaAsset.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: mediaAssetSelect,
  });
}
