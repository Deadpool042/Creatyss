import { CategoryStatus, type PrismaClient } from "@/prisma-generated/client";

const CATEGORY_CODE_MAPPING = new Map<string, string>([
  ["woo_cat_sacs-creatyss", "sacs-a-main"],
  ["woo_cat_les-sacs-a-bandouliere", "sacs-bandouliere"],
  ["woo_cat_mini-sacs", "mini-sacs"],
  ["woo_cat_cabas", "cabas"],
  ["woo_cat_sacs-a-dos", "sacs-a-dos"],
  ["woo_cat_pochettes", "pochettes"],
]);

const CATEGORY_CODES_TO_ARCHIVE = [
  "woo_cat_sacs-creatyss",
  "woo_cat_les-sacs-a-bandouliere",
  "woo_cat_mini-sacs",
  "woo_cat_cabas",
  "woo_cat_sacs-a-dos",
  "woo_cat_pochettes",
  "woo_cat_tout",
] as const;

export async function relinkProductCategories(prisma: PrismaClient): Promise<void> {
  const store = await prisma.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, code: true },
  });

  if (!store) {
    throw new Error("Aucune boutique trouvée.");
  }

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    select: {
      id: true,
      code: true,
      status: true,
    },
  });

  const categoryIdByCode = new Map(categories.map((category) => [category.code, category.id]));

  const links = await prisma.productCategory.findMany({
    where: {
      category: {
        code: {
          in: Array.from(CATEGORY_CODE_MAPPING.keys()),
        },
      },
    },
    select: {
      productId: true,
      categoryId: true,
      isPrimary: true,
      sortOrder: true,
      category: {
        select: {
          code: true,
        },
      },
    },
  });

  await prisma.$transaction(async (tx) => {
    for (const link of links) {
      const targetCode = CATEGORY_CODE_MAPPING.get(link.category.code);

      if (!targetCode) {
        continue;
      }

      const targetCategoryId = categoryIdByCode.get(targetCode);

      if (!targetCategoryId) {
        throw new Error(`Catégorie cible introuvable pour ${link.category.code} -> ${targetCode}`);
      }

      const existingTargetLink = await tx.productCategory.findFirst({
        where: {
          productId: link.productId,
          categoryId: targetCategoryId,
        },
        select: {
          productId: true,
          categoryId: true,
          isPrimary: true,
          sortOrder: true,
        },
      });

      if (!existingTargetLink) {
        await tx.productCategory.create({
          data: {
            productId: link.productId,
            categoryId: targetCategoryId,
            isPrimary: link.isPrimary,
            sortOrder: link.sortOrder,
          },
        });
      } else {
        await tx.productCategory.update({
          where: {
            productId_categoryId: {
              productId: link.productId,
              categoryId: targetCategoryId,
            },
          },
          data: {
            isPrimary: existingTargetLink.isPrimary || link.isPrimary,
            sortOrder: Math.min(existingTargetLink.sortOrder, link.sortOrder),
          },
        });
      }

      await tx.productCategory.delete({
        where: {
          productId_categoryId: {
            productId: link.productId,
            categoryId: link.categoryId,
          },
        },
      });
    }

    const categoryIdsToArchive = CATEGORY_CODES_TO_ARCHIVE.map(
      (code) => categoryIdByCode.get(code) ?? null
    ).filter((value): value is string => value !== null);

    await tx.category.updateMany({
      where: {
        id: {
          in: categoryIdsToArchive,
        },
      },
      data: {
        status: CategoryStatus.ARCHIVED,
        archivedAt: new Date(),
      },
    });
  });

  process.stdout.write(`Product categories relinked for store ${store.code}.\n`);
}
