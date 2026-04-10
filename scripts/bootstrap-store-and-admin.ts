//scripts/bootstrap-store-and-admin.ts
import {
  DEV_ADMINS,
  ensureAdminRole,
  ensureDefaultStore,
  upsertAdminUser,
} from "./helpers/admin-bootstrap";
import { createScriptPrismaClient } from "./helpers/prisma-client";
import { seedAdminNavigationAccess } from "../prisma/seed/admin-navigation-access.seed";

const prisma = createScriptPrismaClient();

async function main() {
  const store = await ensureDefaultStore(prisma);
  const role = await ensureAdminRole(prisma);

  process.stdout.write(`Store ready: ${store.code} (${store.id})\n`);
  process.stdout.write(`Role ready: ${role.code} (${role.id})\n`);

  for (const admin of DEV_ADMINS) {
    const user = await upsertAdminUser(prisma, admin, store.id, role.id);
    process.stdout.write(`Admin ready: ${user.email}\n`);
  }

  await seedAdminNavigationAccess(prisma);
  process.stdout.write("Admin navigation access ready.\n");

  process.stdout.write("\nBootstrap completed.\n");
  process.stdout.write("Login:\n");
  process.stdout.write("  email: admin@creatyss.local\n");
  process.stdout.write("  password: AdminDev123!\n");
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
