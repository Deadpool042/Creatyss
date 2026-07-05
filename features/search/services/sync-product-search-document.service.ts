import type { withTransaction } from "@/core/db";

type TransactionClient = Parameters<Parameters<typeof withTransaction>[0]>[0];

export const PRODUCT_SEARCH_SUBJECT_TYPE = "product";

type ProductSearchSource = {
  name: string;
  marketingHook: string | null;
  shortDescription: string | null;
  description: string | null;
};

// Le nom est doublé : ts_rank compte les occurrences, un produit dont le
// mot-clé est dans le nom doit remonter devant un produit qui ne le mentionne
// que dans sa description.
export function buildProductIndexedText(source: ProductSearchSource): string {
  return [
    source.name,
    source.name,
    source.marketingHook,
    source.shortDescription,
    source.description,
  ]
    .filter((part): part is string => part !== null && part.trim().length > 0)
    .join("\n");
}

/**
 * Synchronise le SearchDocument d'un produit dans la transaction courante.
 * À appeler après la mutation produit ; l'appelant doit isoler les erreurs
 * (try/catch non bloquant) pour ne jamais faire échouer la mutation métier.
 */
export async function syncProductSearchDocumentInTx(
  tx: TransactionClient,
  productId: string
): Promise<void> {
  const product = await tx.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      storeId: true,
      name: true,
      marketingHook: true,
      shortDescription: true,
      description: true,
      status: true,
      publishedAt: true,
      archivedAt: true,
    },
  });

  if (product === null) {
    await removeProductSearchDocumentInTx(tx, productId);
    return;
  }

  const status =
    product.archivedAt !== null ? "ARCHIVED" : product.status === "ACTIVE" ? "ACTIVE" : "INACTIVE";

  // deleteMany + create plutôt qu'upsert : l'unique Prisma contient
  // localeCode nullable, et NULL ≠ NULL côté Postgres rend l'upsert piégeux.
  await tx.searchDocument.deleteMany({
    where: {
      storeId: product.storeId,
      subjectType: PRODUCT_SEARCH_SUBJECT_TYPE,
      subjectId: product.id,
    },
  });

  await tx.searchDocument.create({
    data: {
      storeId: product.storeId,
      subjectType: PRODUCT_SEARCH_SUBJECT_TYPE,
      subjectId: product.id,
      status,
      indexedText: buildProductIndexedText(product),
      publishedAt: product.publishedAt,
    },
  });
}

export async function removeProductSearchDocumentInTx(
  tx: TransactionClient,
  productId: string
): Promise<void> {
  await tx.searchDocument.deleteMany({
    where: {
      subjectType: PRODUCT_SEARCH_SUBJECT_TYPE,
      subjectId: productId,
    },
  });
}
