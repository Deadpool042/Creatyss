// Backfill des SearchDocument produits existants (lot H4 search-storefront).
// À exécuter une fois avant d'activer satellite.search : les produits créés
// avant le hook d'indexation n'ont pas de document.
// Usage : pnpm exec tsx scripts/backfill-search-documents.ts

import { syncProductSearchDocumentInTx } from "@/features/search/services/sync-product-search-document.service";
import { createScriptPrismaClient } from "./helpers/prisma-client";

const prisma = createScriptPrismaClient();

async function main(): Promise<void> {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true },
    orderBy: { createdAt: "asc" },
  });

  let synced = 0;

  for (const product of products) {
    await prisma.$transaction(async (tx) => {
      await syncProductSearchDocumentInTx(tx, product.id);
    });
    synced += 1;
  }

  console.log(`[backfill-search-documents] ${synced}/${products.length} produits indexés`);
}

main()
  .catch((error) => {
    console.error("[backfill-search-documents] échec", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
