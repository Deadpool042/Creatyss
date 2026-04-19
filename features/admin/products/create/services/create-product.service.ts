import { ProductStatus } from "@/prisma-generated/client";

import { db } from "@/core/db";

type CreateProductServiceInput = {
  slug: string;
  name: string;
  storeId: string;
  productTypeId: string;
  isStandalone: boolean;
};

export async function createProduct(input: CreateProductServiceInput): Promise<{ id: string }> {
  return db.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        slug: input.slug,
        name: input.name,
        status: ProductStatus.DRAFT,
        isFeatured: false,
        isStandalone: input.isStandalone,
        productType: { connect: { id: input.productTypeId } },
        store: { connect: { id: input.storeId } },
      },
      select: { id: true },
    });

    if (input.isStandalone) {
      await tx.productVariant.create({
        data: {
          productId: product.id,
          sku: input.slug,
          isDefault: true,
          sortOrder: 0,
        },
      });
    }

    return { id: product.id };
  });
}
