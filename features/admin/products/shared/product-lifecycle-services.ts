import { withTransaction } from "@/core/db";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ArchiveProductInput = {
  productSlug: string;
};

export type ArchiveProductResult = {
  id: string;
};

export type RestoreProductInput = {
  productSlug: string;
};

export type RestoreProductResult = {
  id: string;
};

type DeleteProductPermanentlyInput = {
  productSlug: string;
};

type DeleteProductPermanentlyServiceResult = {
  id: string;
};

// ---------------------------------------------------------------------------
// archiveProduct
// ---------------------------------------------------------------------------

export async function archiveProduct(
  input: ArchiveProductInput
): Promise<ArchiveProductResult> {
  return withTransaction(async (tx) => {
    const product = await tx.product.findFirst({
      where: {
        slug: input.productSlug,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (product === null) {
      throw new Error("product_not_found");
    }

    return tx.product.update({
      where: {
        id: product.id,
      },
      data: {
        archivedAt: new Date(),
      },
      select: {
        id: true,
      },
    });
  });
}

// ---------------------------------------------------------------------------
// restoreProduct
// ---------------------------------------------------------------------------

export async function restoreProduct(
  input: RestoreProductInput
): Promise<RestoreProductResult> {
  return withTransaction(async (tx) => {
    const product = await tx.product.findFirst({
      where: {
        slug: input.productSlug,
        archivedAt: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (product === null) {
      throw new Error("product_not_found");
    }

    return tx.product.update({
      where: {
        id: product.id,
      },
      data: {
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });
  });
}

// ---------------------------------------------------------------------------
// deleteProductCatalogByIdInTx (helper)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// deleteProductPermanently
// ---------------------------------------------------------------------------

export async function deleteProductPermanently(
  input: DeleteProductPermanentlyInput
): Promise<DeleteProductPermanentlyServiceResult> {
  return withTransaction(async (tx) => {
    const product = await tx.product.findFirst({
      where: {
        slug: input.productSlug,
        archivedAt: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (product === null) {
      throw new Error("product_not_found");
    }

    await deleteProductCatalogByIdInTx(tx, product.id);

    return {
      id: product.id,
    };
  });
}
