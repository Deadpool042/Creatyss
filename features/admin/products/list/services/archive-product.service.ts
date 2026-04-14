import { withTransaction } from "@/core/db";

type ArchiveProductServiceInput = {
  productSlug: string;
};

type ArchiveProductServiceResult = {
  id: string;
};

export async function archiveProduct(
  input: ArchiveProductServiceInput
): Promise<ArchiveProductServiceResult> {
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
