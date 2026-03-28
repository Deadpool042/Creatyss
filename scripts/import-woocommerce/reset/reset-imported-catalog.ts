import type { PrismaClient } from "../../../src/generated/prisma/client";
import { WOOCOMMERCE_MEDIA_ROOT } from "../constants";

export async function resetImportedCatalog(prisma: PrismaClient, storeId: string): Promise<void> {
  const importedMedia = await prisma.mediaAsset.findMany({
    where: {
      storeId,
      storageKey: {
        startsWith: WOOCOMMERCE_MEDIA_ROOT,
      },
    },
    select: {
      id: true,
    },
  });

  const importedMediaIds = importedMedia.map((item) => item.id);

  await prisma.product.deleteMany({
    where: {
      storeId,
    },
  });

  await prisma.category.deleteMany({
    where: {
      storeId,
    },
  });

  if (importedMediaIds.length > 0) {
    await prisma.mediaReference.deleteMany({
      where: {
        assetId: {
          in: importedMediaIds,
        },
      },
    });

    await prisma.mediaAsset.deleteMany({
      where: {
        id: {
          in: importedMediaIds,
        },
      },
    });
  }
}
