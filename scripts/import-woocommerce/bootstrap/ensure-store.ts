import { type PrismaClient, StoreStatus } from "../../../src/generated/prisma/client";

export async function ensureStore(prisma: PrismaClient) {
  return prisma.store.upsert({
    where: {
      code: "default",
    },
    update: {},
    create: {
      code: "default",
      slug: "default",
      name: "Boutique principale",
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
