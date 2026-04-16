import { withTransaction } from "@/core/db";

export type ArchiveProductInput = {
  productSlug: string;
};

export type ArchiveProductResult = {
  id: string;
};

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
