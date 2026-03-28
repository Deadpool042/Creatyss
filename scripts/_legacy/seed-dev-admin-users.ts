import { fileURLToPath } from "node:url";
import { seedDevAdminUsers } from "../helpers/admin-bootstrap.js";
import { createScriptPrismaClient } from "../helpers/prisma-client.js";
import { ensureDefaultAdminRole, ensureDefaultStore } from "../bootstrap-store-and-admin.js";

export async function runSeedDevAdminUsers(): Promise<void> {
  const prisma = createScriptPrismaClient();

  try {
    const store = await ensureDefaultStore(prisma);
    const role = await ensureDefaultAdminRole(prisma, store.id);

    await seedDevAdminUsers(prisma, store.id, role.id);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await runSeedDevAdminUsers();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown dev admin seed error.";

    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
