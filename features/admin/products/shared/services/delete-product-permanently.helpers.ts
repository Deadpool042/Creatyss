import type { withTransaction } from "@/core/db";

type TransactionClient = Parameters<Parameters<typeof withTransaction>[0]>[0];

export async function deleteProductCatalogByIdInTx(
  tx: TransactionClient,
  productId: string
): Promise<void> {
  await tx.relatedProduct.deleteMany({
    where: {
      OR: [{ sourceProductId: productId }, { targetProductId: productId }],
    },
  });

  await tx.productCategory.deleteMany({
    where: {
      productId,
    },
  });

  const variants = await tx.productVariant.findMany({
    where: {
      productId,
    },
    select: {
      id: true,
    },
  });

  const variantIds = variants.map((variant) => variant.id);

  if (variantIds.length > 0) {
    await tx.inventoryItem.deleteMany({
      where: {
        variantId: {
          in: variantIds,
        },
      },
    });

    await tx.productVariantPrice.deleteMany({
      where: {
        variantId: {
          in: variantIds,
        },
      },
    });

    await tx.productVariant.deleteMany({
      where: {
        id: {
          in: variantIds,
        },
      },
    });
  }

  await tx.productPrice.deleteMany({
    where: {
      productId,
    },
  });

  await tx.product.update({
    where: {
      id: productId,
    },
    data: {
      primaryImageId: null,
    },
  });

  await tx.product.delete({
    where: {
      id: productId,
    },
  });
}
