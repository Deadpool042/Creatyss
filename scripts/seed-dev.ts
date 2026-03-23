import { fileURLToPath } from "node:url";
import { runImportWooCommerceCatalog } from "./import-woocommerce.ts";
import { createScriptPrismaClient } from "./helpers/prisma-client.ts";
import { runSeedDevAdminUsers } from "./seed-dev-admin-users.ts";
import { ensureDefaultPriceList, ensureDefaultStore } from "./helpers/store-bootstrap.ts";

type CliOptions = {
  skipImages: boolean;
  skipWooCommerce: boolean;
};

function parseCliOptions(argv: readonly string[]): CliOptions {
  return {
    skipImages: argv.includes("--skip-images"),
    skipWooCommerce: argv.includes("--skip-woocommerce"),
  };
}

export async function runSeedDev(options: CliOptions): Promise<void> {
  const prisma = createScriptPrismaClient();

  try {
    const store = await ensureDefaultStore(prisma);
    await ensureDefaultPriceList(prisma, store.id);
  } finally {
    await prisma.$disconnect();
  }

  await runSeedDevAdminUsers();

  if (options.skipWooCommerce) {
    process.stdout.write("WooCommerce import skipped.\n");
    return;
  }

  await runImportWooCommerceCatalog({
    skipImages: options.skipImages,
  });
}

async function main() {
  await runSeedDev(parseCliOptions(process.argv.slice(2)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown seed-dev error.";

    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
