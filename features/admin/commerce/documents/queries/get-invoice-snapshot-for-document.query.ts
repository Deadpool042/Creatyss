import "server-only";

import { db } from "@/core/db";
import type { InvoiceSnapshot } from "@/features/admin/commerce/documents/types/invoice-snapshot.types";

type InvoiceSnapshotForDocument = {
  snapshot: InvoiceSnapshot;
  documentNumber: string;
};

/**
 * Lit le snapshot légal figé d'une facture émise, tel que persisté par
 * `issue-invoice.service.ts` (pas de validation runtime du JSON — même
 * confiance qu'à l'écriture). `null` si le document n'est pas une facture,
 * ou si le snapshot/numéro n'est pas encore renseigné.
 */
export async function getInvoiceSnapshotForDocument(
  storeId: string,
  documentId: string
): Promise<InvoiceSnapshotForDocument | null> {
  const document = await db.document.findFirst({
    where: { id: documentId, storeId, typeCode: "INVOICE" },
    select: { snapshot: true, documentNumber: true },
  });

  if (document === null || document.snapshot === null || document.documentNumber === null) {
    return null;
  }

  return {
    snapshot: document.snapshot as unknown as InvoiceSnapshot,
    documentNumber: document.documentNumber,
  };
}
