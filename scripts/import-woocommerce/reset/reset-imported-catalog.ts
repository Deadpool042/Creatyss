import type { PrismaClient } from "../../../src/generated/prisma/client";
import { WOOCOMMERCE_MEDIA_ROOT } from "../constants";

export async function resetImportedCatalog(prisma: PrismaClient, storeId: string): Promise<void> {
  const importedMedia = await prisma.mediaAsset.findMany({
    where: {
      storeId,
      OR: [
        {
          storageKey: {
            startsWith: WOOCOMMERCE_MEDIA_ROOT,
          },
        },
        {
          storageKey: {
            startsWith: "imports/wordpress/blog",
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const importedMediaIds = importedMedia.map((item: { id: any }) => item.id);

  const importedProductType = await prisma.productType.findFirst({
    where: {
      storeId,
      code: "woo-imported",
    },
    select: {
      id: true,
    },
  });

  if (importedProductType) {
    await prisma.product.deleteMany({
      where: {
        storeId,
        productTypeId: importedProductType.id,
      },
    });
  }

  await prisma.category.deleteMany({
    where: {
      storeId,
      code: {
        startsWith: "woo_cat_",
      },
    },
  });

  await prisma.blogPost.deleteMany({
    where: {
      storeId,
      slug: {
        startsWith: "wp-",
      },
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
