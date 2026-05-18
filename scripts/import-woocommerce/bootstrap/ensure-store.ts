import { type PrismaClient, StoreStatus } from "../../../src/generated/prisma/client";

const CANONICAL_STORE_CODE = "creatyss";

export async function ensureStore(prisma: PrismaClient) {
  return prisma.store.upsert({
    where: {
      code: CANONICAL_STORE_CODE,
    },
    update: {},
    create: {
      code: CANONICAL_STORE_CODE,
      slug: CANONICAL_STORE_CODE,
      name: "Creatyss",
      status: StoreStatus.ACTIVE,
      defaultLocaleCode: "fr-FR",
      timezone: "Europe/Paris",
      isProduction: false,
      activatedAt: new Date(),
    },
    select: {
      id: true,
      code: true,
      slug: true,
      name: true,
    },
  });
}
