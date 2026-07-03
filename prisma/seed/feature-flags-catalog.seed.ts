import type { PrismaClient } from "@/prisma-generated/client";

type CatalogProductFlagDef = {
  code: string;
  name: string;
  description: string;
  isEnabledByDefault: boolean;
  allowedLevels?: readonly string[];
  defaultLevel?: string;
};

const CATALOG_PRODUCT_FLAGS: readonly CatalogProductFlagDef[] = [
  {
    code: "catalog.products.media",
    name: "Médias produit",
    description: "Gestion des images, vidéos et contenus médias des produits.",
    isEnabledByDefault: true,
    allowedLevels: ["basic", "optimization", "generation", "automation"],
    defaultLevel: "basic",
  },
  {
    code: "catalog.products.categories",
    name: "Catégories produit",
    description: "Organisation des produits en catégories et sous-catégories.",
    isEnabledByDefault: true,
  },
  {
    code: "catalog.products.seo",
    name: "SEO produit",
    description:
      "Gestion des métadonnées SEO et de l'optimisation pour les moteurs de recherche.",
    isEnabledByDefault: true,
  },
  {
    code: "catalog.products.variants",
    name: "Variantes produit",
    description: "Gestion des déclinaisons (taille, couleur, etc.).",
    isEnabledByDefault: true,
    allowedLevels: ["read", "manage", "options"],
    defaultLevel: "options",
  },
  {
    code: "catalog.products.pricing",
    name: "Tarification produit",
    description: "Gestion des prix, des taxes et des règles tarifaires.",
    isEnabledByDefault: true,
    allowedLevels: ["base-price", "price-lists", "scheduled-pricing"],
    defaultLevel: "scheduled-pricing",
  },
  {
    code: "catalog.products.availability",
    name: "Disponibilité produit",
    description: "Gestion de la disponibilité et de la visibilité des produits.",
    isEnabledByDefault: true,
    allowedLevels: ["sellability", "scheduling", "preorder"],
    defaultLevel: "preorder",
  },
  {
    code: "catalog.products.inventory",
    name: "Inventaire produit",
    description: "Gestion du stock, des alertes et des prévisions d'inventaire.",
    isEnabledByDefault: true,
    allowedLevels: ["manual", "alerts", "forecasting"],
    defaultLevel: "manual",
  },
  {
    code: "catalog.products.related",
    name: "Produits associés",
    description: "Gestion des suggestions de produits similaires ou complémentaires.",
    isEnabledByDefault: true,
    allowedLevels: ["storefront", "manage"],
    defaultLevel: "manage",
  },
] as const;

export async function seedFeatureFlagsCatalog(db: PrismaClient): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  for (const flag of CATALOG_PRODUCT_FLAGS) {
    const allowedLevels = flag.allowedLevels ? [...flag.allowedLevels] : [];
    const defaultLevel = flag.defaultLevel ?? null;

    await db.featureFlag.upsert({
      where: {
        storeId_code: {
          storeId: store.id,
          code: flag.code,
        },
      },
      update: {
        name: flag.name,
        description: flag.description,
        status: "ACTIVE",
        isEnabledByDefault: flag.isEnabledByDefault,
        allowedLevels,
        defaultLevel,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        code: flag.code,
        name: flag.name,
        description: flag.description,
        status: "ACTIVE",
        scopeType: "STORE",
        isEnabledByDefault: flag.isEnabledByDefault,
        allowedLevels,
        defaultLevel,
      },
    });
  }
}
