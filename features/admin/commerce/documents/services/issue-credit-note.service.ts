import "server-only";

import type { Prisma } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db/transactions/with-transaction";
import { allocateDocumentNumber } from "@/features/admin/commerce/documents/services/allocate-document-number.service";

export class IssueCreditNoteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IssueCreditNoteError";
  }
}

type IssueCreditNoteInput = {
  orderId: string;
  storeId: string;
};

/**
 * Émet un avoir (`CREDIT_NOTE`) rattaché à la facture active de la commande :
 * reprend le snapshot figé de la facture, alloue un numéro `AV-…`, référence la
 * facture d'origine via `parentDocumentId`. Une seule facture/avoir actif requis.
 */
export async function issueCreditNote(input: IssueCreditNoteInput) {
  return withTransaction(async (tx) => {
    const invoice = await tx.document.findFirst({
      where: {
        orderId: input.orderId,
        typeCode: "INVOICE",
        status: { notIn: ["CANCELLED", "ARCHIVED"] },
      },
      select: { id: true, snapshot: true, currencyCode: true },
    });

    if (invoice === null) {
      throw new IssueCreditNoteError("Aucune facture à corriger. Émettez d'abord la facture.");
    }

    const existing = await tx.document.findFirst({
      where: {
        parentDocumentId: invoice.id,
        typeCode: "CREDIT_NOTE",
        status: { notIn: ["CANCELLED", "ARCHIVED"] },
      },
      select: { id: true },
    });

    if (existing !== null) {
      throw new IssueCreditNoteError("Un avoir existe déjà pour cette facture.");
    }

    const issuedAt = new Date();
    const { documentNumber } = await allocateDocumentNumber(tx, {
      storeId: input.storeId,
      typeCode: "CREDIT_NOTE",
      year: issuedAt.getFullYear(),
    });

    return tx.document.create({
      data: {
        storeId: input.storeId,
        orderId: input.orderId,
        typeCode: "CREDIT_NOTE",
        status: "ISSUED",
        documentNumber,
        title: `Avoir ${documentNumber}`,
        currencyCode: invoice.currencyCode,
        issuedAt,
        parentDocumentId: invoice.id,
        ...(invoice.snapshot === null
          ? {}
          : { snapshot: invoice.snapshot as Prisma.InputJsonValue }),
      },
    });
  });
}
