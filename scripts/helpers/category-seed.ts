import { CategoryStatus, type PrismaClient } from "@/prisma-generated/client";

export type SeedCategoryDefinition = {
  code: string;
  slug: string;
  name: string;
  parentCode: string | null;
  shortDescription: string | null;
  description: string | null;
  sortOrder: number;
  isFeatured: boolean;
};

export const CREATYSS_CATEGORY_SEED: readonly SeedCategoryDefinition[] = [
  {
    code: "sacs",
    slug: "sacs",
    name: "Sacs",
    parentCode: null,
    shortDescription: "Sacs artisanaux Creatyss.",
    description: "Sélection de sacs artisanaux confectionnés dans l’univers Creatyss.",
    sortOrder: 0,
    isFeatured: true,
  },
  {
    code: "accessoires",
    slug: "accessoires",
    name: "Accessoires",
    parentCode: null,
    shortDescription: "Accessoires artisanaux assortis.",
    description: "Accessoires textiles et maroquiniers assortis à l’univers Creatyss.",
    sortOrder: 1,
    isFeatured: true,
  },

  {
    code: "sacs-a-main",
    slug: "sacs-a-main",
    name: "Sacs à main",
    parentCode: "sacs",
    shortDescription: "Sacs à main artisanaux.",
    description: "Sacs à main artisanaux conçus pour un usage quotidien.",
    sortOrder: 0,
    isFeatured: false,
  },
  {
    code: "sacs-bandouliere",
    slug: "sacs-bandouliere",
    name: "Sacs à bandoulière",
    parentCode: "sacs",
    shortDescription: "Sacs portés à l’épaule ou en bandoulière.",
    description: "Sacs artisanaux portés à l’épaule ou en bandoulière selon les modèles.",
    sortOrder: 1,
    isFeatured: false,
  },
  {
    code: "mini-sacs",
    slug: "mini-sacs",
    name: "Mini sacs",
    parentCode: "sacs",
    shortDescription: "Formats compacts et légers.",
    description: "Mini sacs artisanaux au format compact pour l’essentiel.",
    sortOrder: 2,
    isFeatured: false,
  },
  {
    code: "cabas",
    slug: "cabas",
    name: "Cabas",
    parentCode: "sacs",
    shortDescription: "Formats souples et spacieux.",
    description: "Cabas artisanaux conçus pour transporter davantage au quotidien.",
    sortOrder: 3,
    isFeatured: false,
  },
  {
    code: "sacs-a-dos",
    slug: "sacs-a-dos",
    name: "Sacs à dos",
    parentCode: "sacs",
    shortDescription: "Sacs à dos artisanaux.",
    description: "Sacs à dos artisanaux alliant praticité et identité visuelle.",
    sortOrder: 4,
    isFeatured: false,
  },

  {
    code: "pochettes",
    slug: "pochettes",
    name: "Pochettes",
    parentCode: "accessoires",
    shortDescription: "Pochettes artisanales.",
    description: "Pochettes textiles et accessoires assortis à l’univers de la boutique.",
    sortOrder: 0,
    isFeatured: false,
  },
  {
    code: "trousses",
    slug: "trousses",
    name: "Trousses",
    parentCode: "accessoires",
    shortDescription: "Trousses artisanales.",
    description: "Trousses artisanales pratiques pour le quotidien ou le voyage.",
    sortOrder: 1,
    isFeatured: false,
  },
  {
    code: "porte-cartes",
    slug: "porte-cartes",
    name: "Porte-cartes",
    parentCode: "accessoires",
    shortDescription: "Petite maroquinerie compacte.",
    description: "Porte-cartes et petite maroquinerie artisanale au format compact.",
    sortOrder: 2,
    isFeatured: false,
  },
];

export async function seedCreatyssCategories(prisma: PrismaClient): Promise<void> {
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

  const createdByCode = new Map<string, { id: string; code: string; name: string }>();

  for (const category of CREATYSS_CATEGORY_SEED) {
    const record = await prisma.category.upsert({
      where: {
        storeId_code: {
          storeId: store.id,
          code: category.code,
        },
      },
      update: {
        slug: category.slug,
        name: category.name,
        shortDescription: category.shortDescription,
        description: category.description,
        status: CategoryStatus.ACTIVE,
        isFeatured: category.isFeatured,
        sortOrder: category.sortOrder,
        archivedAt: null,
        publishedAt: new Date(),
      },
      create: {
        storeId: store.id,
        code: category.code,
        slug: category.slug,
        name: category.name,
        shortDescription: category.shortDescription,
        description: category.description,
        status: CategoryStatus.ACTIVE,
        isFeatured: category.isFeatured,
        sortOrder: category.sortOrder,
        publishedAt: new Date(),
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    createdByCode.set(category.code, record);
  }

  for (const category of CREATYSS_CATEGORY_SEED) {
    const parentId =
      category.parentCode !== null ? (createdByCode.get(category.parentCode)?.id ?? null) : null;

    await prisma.category.update({
      where: {
        storeId_code: {
          storeId: store.id,
          code: category.code,
        },
      },
      data: {
        parentId,
      },
    });
  }

  process.stdout.write(
    `Categories seeded for store ${store.code}: ${CREATYSS_CATEGORY_SEED.length}\n`
  );
}
