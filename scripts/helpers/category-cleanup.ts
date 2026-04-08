import { CategoryStatus, type PrismaClient } from "@/prisma-generated/client";

const CATEGORY_CODES_TO_ARCHIVE = ["tout"] as const;

const CATEGORY_SLUGS_TO_ARCHIVE = [
  "tout",
  "cabas",
  "mini-sacs",
  "pochettes",
  "sacs-creatyss",
] as const;

const CATEGORY_NAMES_TO_ARCHIVE = [
  "tout",
  "Cabas",
  "Mini sacs",
  "Pochettes de Creatyss",
  "Les sacs à Main",
] as const;

const CATEGORY_CODES_TO_KEEP = new Set([
  "sacs",
  "accessoires",
  "sacs-a-main",
  "sacs-bandouliere",
  "mini-sacs",
  "cabas",
  "sacs-a-dos",
  "pochettes",
  "trousses",
  "porte-cartes",
]);

type CategoryRecord = {
  id: string;
  code: string;
  slug: string;
  name: string;
  parentId: string | null;
};

function shouldArchiveCategory(category: CategoryRecord): boolean {
  if (CATEGORY_CODES_TO_KEEP.has(category.code)) {
    return false;
  }

  if (
    CATEGORY_CODES_TO_ARCHIVE.includes(category.code as (typeof CATEGORY_CODES_TO_ARCHIVE)[number])
  ) {
    return true;
  }

  if (category.parentId === null) {
    if (
      CATEGORY_SLUGS_TO_ARCHIVE.includes(
        category.slug as (typeof CATEGORY_SLUGS_TO_ARCHIVE)[number]
      )
    ) {
      return true;
    }

    if (
      CATEGORY_NAMES_TO_ARCHIVE.includes(
        category.name as (typeof CATEGORY_NAMES_TO_ARCHIVE)[number]
      )
    ) {
      return true;
    }
  }

  return false;
}

export async function cleanupCreatyssCategories(prisma: PrismaClient): Promise<void> {
  const store = await prisma.store.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      code: true,
    },
  });

  if (!store) {
    throw new Error("Aucune boutique trouvée. Exécuter d’abord le bootstrap du store.");
  }

  const categories = await prisma.category.findMany({
    where: {
      storeId: store.id,
    },
    select: {
      id: true,
      code: true,
      slug: true,
      name: true,
      parentId: true,
    },
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  const categoriesToArchive = categories.filter(shouldArchiveCategory);

  if (categoriesToArchive.length === 0) {
    process.stdout.write(`No category cleanup needed for store ${store.code}.\n`);
    return;
  }

  const categoryIdsToArchive = categoriesToArchive.map((category) => category.id);

  await prisma.$transaction(async (tx) => {
    await tx.productCategory.deleteMany({
      where: {
        categoryId: {
          in: categoryIdsToArchive,
        },
      },
    });

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

  process.stdout.write(
    `Archived categories for store ${store.code}: ${categoriesToArchive
      .map((category) => `${category.name} [${category.slug}]`)
      .join(", ")}\n`
  );
}
