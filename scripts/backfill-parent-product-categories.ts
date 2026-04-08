import { createScriptPrismaClient } from "./helpers/prisma-client";

const prisma = createScriptPrismaClient();

async function main() {
  const links = await prisma.productCategory.findMany({
    select: {
      productId: true,
      categoryId: true,
      isPrimary: true,
      sortOrder: true,
      category: {
        select: {
          id: true,
          parentId: true,
        },
      },
    },
  });

  let createdCount = 0;

  for (const link of links) {
    const parentCategoryId = link.category.parentId;

    if (!parentCategoryId) {
      continue;
    }

    const existingParentLink = await prisma.productCategory.findUnique({
      where: {
        productId_categoryId: {
          productId: link.productId,
          categoryId: parentCategoryId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingParentLink) {
      continue;
    }

    await prisma.productCategory.create({
      data: {
        productId: link.productId,
        categoryId: parentCategoryId,
        isPrimary: false,
        sortOrder: 999,
      },
    });

    createdCount += 1;
  }

  process.stdout.write(`Parent category links created: ${createdCount}\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
