import {
  DEV_ADMINS,
  ensureAdminRole,
  ensureDefaultStore,
  upsertAdminUser,
} from "../scripts/helpers/admin-bootstrap";
import { createScriptPrismaClient } from "../scripts/helpers/prisma-client";
import { seedAdminNavigationAccess } from "./seed/admin-navigation-access.seed";

const prisma = createScriptPrismaClient();

async function main(): Promise<void> {
  const store = await ensureDefaultStore(prisma);
  const role = await ensureAdminRole(prisma);

  for (const admin of DEV_ADMINS) {
    await upsertAdminUser(prisma, admin, store.id, role.id);
  }

  await seedAdminNavigationAccess(prisma);
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
