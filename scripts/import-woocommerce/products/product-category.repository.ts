import type { DbClient } from "../shared/db";
import type { ImportedProductCategoryLinkInput } from "./product.types";

export async function replaceProductCategoryLinks(
  prisma: DbClient,
  productId: string,
  links: readonly ImportedProductCategoryLinkInput[]
) {
  await prisma.productCategory.deleteMany({
    where: {
      productId,
    },
  });

  if (links.length === 0) {
    return;
  }

  await prisma.productCategory.createMany({
    data: links.map((link) => ({
      productId,
      categoryId: link.categoryId,
      sortOrder: link.sortOrder,
      isPrimary: link.isPrimary,
    })),
  });
}
