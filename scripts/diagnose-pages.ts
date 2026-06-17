/**
 * Diagnostic lecture seule — état des Pages en base.
 * Usage : pnpm tsx scripts/diagnose-pages.ts
 * N'écrit rien. Affiche la base ciblée, les stores et toutes les pages.
 */
import { createScriptPrismaClient } from "./helpers/prisma-client";

const prisma = createScriptPrismaClient();

function maskedDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "(absent)";
  return raw.replace(/:\/\/[^@]+@/, "://***@");
}

async function main(): Promise<void> {
  console.info(`DATABASE_URL : ${maskedDatabaseUrl()}`);

  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, code: true, name: true, createdAt: true },
  });
  console.info(`Stores (${stores.length}) :`);
  for (const store of stores) {
    console.info(`  - ${store.id} | ${store.code} | ${store.name}`);
  }

  const pages = await prisma.page.findMany({
    orderBy: [{ storeId: "asc" }, { code: "asc" }],
    select: {
      storeId: true,
      code: true,
      slug: true,
      status: true,
      isSystemPage: true,
      body: true,
      updatedAt: true,
    },
  });

  console.info(`Pages (${pages.length}) :`);
  for (const page of pages) {
    const bodyState = (page.body?.trim() ?? "") === "" ? "body vide" : `${page.body?.length} car.`;
    console.info(
      `  - store ${page.storeId} | ${page.code} | ${page.status} | system=${page.isSystemPage} | ${bodyState}`
    );
  }

  if (pages.length === 0) {
    console.info(
      "Aucune page en base : le seed n'a pas écrit ici (échec en amont ou autre DATABASE_URL)."
    );
  }
}

main()
  .catch((error: unknown) => {
    console.error("Diagnostic failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
