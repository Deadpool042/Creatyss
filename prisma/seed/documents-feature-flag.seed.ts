import type { PrismaClient } from "@/prisma-generated/client";

export const DOCUMENTS_FEATURE_CODE = "commerce.documents";

export const DOCUMENTS_ALLOWED_LEVELS = ["basic", "fiscal"] as const;

export const DOCUMENTS_DEFAULT_LEVEL: string = DOCUMENTS_ALLOWED_LEVELS[0];

export async function seedDocumentsFeatureFlag(db: PrismaClient): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  await db.featureFlag.upsert({
    where: {
      storeId_code: {
        storeId: store.id,
        code: DOCUMENTS_FEATURE_CODE,
      },
    },
    update: {
      name: "Documents",
      description: "Documents de commande (confirmation, bons, etc.).",
      allowedLevels: [...DOCUMENTS_ALLOWED_LEVELS],
      defaultLevel: DOCUMENTS_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: DOCUMENTS_FEATURE_CODE,
      name: "Documents",
      description: "Documents de commande (confirmation, bons, etc.).",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...DOCUMENTS_ALLOWED_LEVELS],
      defaultLevel: DOCUMENTS_DEFAULT_LEVEL,
    },
  });
}
