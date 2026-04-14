import type { PrismaClient } from "../../../src/generated/prisma/client";

export async function ensureCanonicalProductTypes(prisma: PrismaClient, storeId: string): Promise<{
  simple: { id: string; code: "simple" };
  variable: { id: string; code: "variable" };
}> {
  const [simple, variable] = await Promise.all([
    prisma.productType.upsert({
      where: {
        storeId_code: {
          storeId,
          code: "simple",
        },
      },
      update: {
        name: "Produit simple",
        slug: "simple",
        description: "Produit vendu seul, sans déclinaison obligatoire.",
        isActive: true,
        archivedAt: null,
      },
      create: {
        storeId,
        code: "simple",
        slug: "simple",
        name: "Produit simple",
        description: "Produit vendu seul, sans déclinaison obligatoire.",
        isActive: true,
      },
      select: {
        id: true,
        code: true,
      },
    }),
    prisma.productType.upsert({
      where: {
        storeId_code: {
          storeId,
          code: "variable",
        },
      },
      update: {
        name: "Produit à variantes",
        slug: "variable",
        description: "Produit avec déclinaisons (taille, couleur, etc.).",
        isActive: true,
        archivedAt: null,
      },
      create: {
        storeId,
        code: "variable",
        slug: "variable",
        name: "Produit à variantes",
        description: "Produit avec déclinaisons (taille, couleur, etc.).",
        isActive: true,
      },
      select: {
        id: true,
        code: true,
      },
    }),
  ]);

  return {
    simple: { id: simple.id, code: "simple" },
    variable: { id: variable.id, code: "variable" },
  };
}
