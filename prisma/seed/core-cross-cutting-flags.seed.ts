import type { PrismaClient } from "@/prisma-generated/client";

type ReadonlyFlagDef = {
  code: string;
  name: string;
  description: string;
  scopeType: "STORE" | "GLOBAL";
};

/**
 * Flags core / cross_cutting sans niveaux et en lecture seule.
 * Ces flags existent toujours — ils ne peuvent pas être désactivés.
 * Seeder séparé pour ne pas alourdir feature-flags-catalog.seed.ts
 * qui cible uniquement les flags catalogue produit.
 */
const CORE_CROSS_CUTTING_FLAGS: readonly ReadonlyFlagDef[] = [
  // Content — cross_cutting
  {
    code: "content.blog",
    name: "Blog",
    description: "Gestion des articles de blog et de la structure éditoriale.",
    scopeType: "STORE",
  },
  {
    code: "content.homepage",
    name: "Page d'accueil",
    description:
      "Gestion du contenu et de la mise en page de la page d'accueil.",
    scopeType: "STORE",
  },
  {
    code: "content.seo",
    name: "SEO global",
    description:
      "Gestion des métadonnées SEO et de l'optimisation transverse pour les moteurs de recherche.",
    scopeType: "STORE",
  },
  // Settings — core pilotage
  {
    code: "settings.advanced",
    name: "Réglages avancés",
    description:
      "Pilotage des fonctionnalités, mutabilité et gouvernance des modules depuis l'admin.",
    scopeType: "STORE",
  },
  // Maintenance — cross_cutting observability
  {
    code: "maintenance.observability",
    name: "Observabilité",
    description:
      "Supervision transverse de l'état du système, des alertes et des indicateurs de santé.",
    scopeType: "GLOBAL",
  },
  {
    code: "maintenance.logs",
    name: "Journaux système",
    description: "Accès aux journaux d'exploitation et aux traces d'audit.",
    scopeType: "GLOBAL",
  },
  // Insights — capability de lecture analytics (distinct de engagement.analytics)
  {
    code: "insights.analyticsRead",
    name: "Lecture Analytics",
    description:
      "Capacité de lecture des données analytics dans l'interface d'administration.",
    scopeType: "STORE",
  },
] as const;

export async function seedCoreCrossCuttingFlags(
  db: PrismaClient
): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  for (const flag of CORE_CROSS_CUTTING_FLAGS) {
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
        isEnabledByDefault: true,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        code: flag.code,
        name: flag.name,
        description: flag.description,
        status: "ACTIVE",
        scopeType: flag.scopeType,
        isEnabledByDefault: true,
        allowedLevels: [],
        defaultLevel: null,
      },
    });
  }
}
